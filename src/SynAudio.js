export default class SynAudio {
  constructor(options = {}) {
    this._covarianceSampleSize = options.covarianceSampleSize || 11025;
    this._initialGranularity = options.initialGranularity || 16;
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

  async syncWASM(a, b, sampleRate, wasmData) {
    // need build for SIMD and non-SIMD (Safari)

    const pageSize = 64 * 1024;
    const floatByteLength = Float32Array.BYTES_PER_ELEMENT;

    const memory = new WebAssembly.Memory({
      initial:
        ((a.samplesDecoded * a.channelData.length +
          b.samplesDecoded * b.channelData.length) *
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
    const bPtr = this._setAudioDataOnHeap(a.channelData, dataArray, aPtr);
    const bestCovariancePtr = this._setAudioDataOnHeap(
      b.channelData,
      dataArray,
      bPtr
    );
    const bestSampleOffsetPtr = bestCovariancePtr + floatByteLength;
    const sampleTrimPtr = bestSampleOffsetPtr + floatByteLength;

    correlate(
      aPtr,
      a.samplesDecoded,
      a.channelData.length,
      bPtr,
      b.samplesDecoded,
      b.channelData.length,
      sampleRate,
      this._covarianceSampleSize,
      this._initialGranularity,
      bestCovariancePtr,
      bestSampleOffsetPtr,
      sampleTrimPtr
    );

    const bestCovariance = heapView.getFloat32(bestCovariancePtr, true);
    const bestSampleOffset = heapView.getInt32(bestSampleOffsetPtr, true);
    const sampleTrim = heapView.getInt32(sampleTrimPtr, true);

    console.log({
      sampleOffset: bestSampleOffset,
      covariance: bestCovariance,
      trim: sampleTrim,
    });

    return {
      sampleOffset: bestSampleOffset,
      covariance: bestCovariance,
      trim: sampleTrim,
    };
  }
}
