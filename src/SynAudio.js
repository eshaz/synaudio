import { MPEGDecoderWebWorker } from "mpg123-decoder";

const decoded = new WeakMap();

export default class SynAudio {
  constructor(options = {}) {
    this._covarianceSampleSize = options.covarianceSampleSize || 11025;
    this._initialGranularity = options.initialGranularity || 16;
  }

  async _decode(audioData) {
    let decodedAudio = decoded.get(audioData);

    if (!decodedAudio) {
      const decoder = new MPEGDecoderWebWorker();

      await decoder.ready.then(() =>
        decoder
          .decode(audioData)
          .then((audio) => {
            decodedAudio = audio;
            decoded.set(audioData, audio);
          })
          .then(() => decoder.free())
      );
    }

    return decodedAudio;
  }

  _setAudioDataOnHeap(i, o, heapPos) {
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
    const heapView = new DataView(memory.buffer);

    const aPtr = instanceExports.get("__heap_base").value;
    const bPtr = this._setAudioDataOnHeap(
      decodedA.channelData,
      dataArray,
      aPtr
    );
    const bestCovariancePtr = this._setAudioDataOnHeap(
      decodedB.channelData,
      dataArray,
      bPtr
    );
    const bestSampleOffsetPtr = bestCovariancePtr + floatByteLength;

    correlate(
      aPtr,
      decodedA.samplesDecoded,
      decodedA.channelData.length,
      bPtr,
      decodedB.samplesDecoded,
      decodedB.channelData.length,
      decodedA.sampleRate,
      this._covarianceSampleSize,
      this._initialGranularity,
      bestCovariancePtr,
      bestSampleOffsetPtr
    );

    const bestCovariance = heapView.getFloat32(bestCovariancePtr, true);
    const bestSampleOffset = heapView.getInt32(bestSampleOffsetPtr, true);

    return { sampleOffset: bestSampleOffset, covariance: bestCovariance };
  }
}
