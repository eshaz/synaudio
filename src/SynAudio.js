import { MPEGDecoderWebWorker } from "mpg123-decoder";

export default class SynAudio {
  constructor() {
    this._covarianceSampleSize = 5000;
    this._initialGranulatiry = 16;
  }

  async decode(audioData) {
    let decoder = new MPEGDecoderWebWorker(),
      decodedAudio;

    await decoder.ready.then(() =>
      decoder
        .decode(audioData)
        .then((decoded) => (decodedAudio = decoded))
        .then(() => decoder.free())
    );

    return decodedAudio;
  }

  async syncWASM(a, b, wasmData) {
    const [decodedA, decodedB] = await Promise.all([
      this.decode(a),
      this.decode(b),
    ]);

    // sum the channels
    const audioA = [];

    for (let i = 0; i < decodedA.samplesDecoded; i++) {
      audioA[i] = 0;
      for (let j = 0; j < decodedA.channelData.length; j++)
        audioA[i] += decodedA.channelData[j][i];
    }

    const audioB = [];

    for (let i = 0; i < decodedB.samplesDecoded; i++) {
      audioB[i] = 0;
      for (let j = 0; j < decodedB.channelData.length; j++)
        audioB[i] += decodedB.channelData[j][i];
    }

    const pageSize = 64 * 1024;
    const floatByteLength = Float32Array.BYTES_PER_ELEMENT;

    const memory = new WebAssembly.Memory({
      initial:
        ((audioA.length + audioB.length) * floatByteLength) / pageSize + 2,
    });
    const wasm = await WebAssembly.instantiate(wasmData, {
      env: { memory },
    });

    const instanceExports = new Map(Object.entries(wasm.instance.exports));

    const correlate = instanceExports.get("correlate");
    const dataArray = new Float32Array(memory.buffer);

    let heapPos = instanceExports.get("__heap_base").value;
    let floatPos = heapPos / floatByteLength;

    // a data
    const aPtr = heapPos;
    heapPos += audioA.length * floatByteLength;
    dataArray.set(audioA, floatPos);
    floatPos += audioA.length;

    // b data
    const bPtr = heapPos;
    dataArray.set(audioB, floatPos);

    const bestSampleOffset = correlate(
      aPtr,
      decodedA.samplesDecoded,
      bPtr,
      decodedB.samplesDecoded,
      decodedA.sampleRate,
      this._covarianceSampleSize,
      this._initialGranulatiry
    );

    return bestSampleOffset;
  }

  async sync(a, b) {
    const [decodedA, decodedB] = await Promise.all([
      this.decode(a),
      this.decode(b),
    ]);

    // sum the channels
    const audioA = [];

    for (let i = 0; i < decodedA.samplesDecoded; i++) {
      audioA[i] = 0;
      for (let j = 0; j < decodedA.channelData.length; j++)
        audioA[i] += decodedA.channelData[j][i];
    }

    const audioB = [];

    for (let i = 0; i < decodedB.samplesDecoded; i++) {
      audioB[i] = 0;
      for (let j = 0; j < decodedB.channelData.length; j++)
        audioB[i] += decodedB.channelData[j][i];
    }

    // find highest covariance
    const sampleOffset = { covariance: 0, sample: 0 };

    for (let sample = 0; sample < audioA.length; sample++) {
      let covariance = 0,
        samplesRemaining = audioA.length - sample;

      /*for (
        let j =
          (this._covarianceSampleSize < samplesRemaining
            ? this._covarianceSampleSize
            : samplesRemaining) - 1;
        j >= 0;
        j--
      ) {*/
      for (let j = 0; j < this._covarianceSampleSize; j++) {
        covariance += audioA[sample + j] * audioB[j];
      }

      if (sampleOffset.covariance < covariance) {
        sampleOffset.covariance = covariance;
        sampleOffset.sample = sample;
      }
    }

    return sampleOffset.sample;
  }
}
