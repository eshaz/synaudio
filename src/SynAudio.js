import { MPEGDecoderWebWorker } from "mpg123-decoder";

export default class SynAudio {
  constructor(options = {}) {
    this._covarianceSampleSize = options.covarianceSampleSize || 5000;
    this._initialGranularity = options.initialGranularity || 16;
  }

  async _decode(audioData) {
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

  _setHeap(i, o, heapPos) {
    const bytesPerElement = o.BYTES_PER_ELEMENT;

    let floatPos = heapPos / bytesPerElement;

    for (const channel of i) {
      heapPos += channel.length * bytesPerElement;
      o.set(channel, floatPos);
      floatPos += channel.length;
    }

    return heapPos;
  }

  async syncWASM(a, b, wasmData) {
    const [decodedA, decodedB] = await Promise.all([
      this._decode(a),
      this._decode(b),
    ]);

    const pageSize = 64 * 1024;
    const floatByteLength = Float32Array.BYTES_PER_ELEMENT;

    const memory = new WebAssembly.Memory({
      initial:
        ((decodedA.samplesDecoded * decodedA.channelData.length +
          decodedB.samplesDecoded * decodedB.channelData.length) *
          floatByteLength) /
          pageSize +
        2,
    });
    const wasm = await WebAssembly.instantiate(wasmData, {
      env: { memory },
    });

    const instanceExports = new Map(Object.entries(wasm.instance.exports));

    const correlate = instanceExports.get("correlate");
    const dataArray = new Float32Array(memory.buffer);

    const aPtr = instanceExports.get("__heap_base").value;
    const bPtr = this._setHeap(decodedA.channelData, dataArray, aPtr);
    this._setHeap(decodedB.channelData, dataArray, bPtr);

    const bestSampleOffset = correlate(
      aPtr,
      decodedA.samplesDecoded,
      decodedA.channelData.length,
      bPtr,
      decodedB.samplesDecoded,
      decodedB.channelData.length,
      decodedA.sampleRate,
      this._covarianceSampleSize,
      this._initialGranularity
    );

    return bestSampleOffset;
  }

  async sync(a, b) {
    const [decodedA, decodedB] = await Promise.all([
      this._decode(a),
      this._decode(b),
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
