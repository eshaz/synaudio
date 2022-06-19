import { decode } from "simple-yenc";
import featureDetect from "wasm-feature-detect";

const wasmModule = new WeakMap();

/* WASM strings are embeded during the build */
const simdWasm = String.raw`dynEncode0064dÅ×Ñeddde|fÄhããããeßÄpããããããããããããdfsegÉÒÚjÑÉÑÓÖÝfdfggfdejleãd¥äìhokfmÇÓÖÖÉÐÅØÉdeoÃÃÌÉÅÔÃÆÅ×Égdnrfñhffßgãf¥åe²h¤f¥äeÏkgawapccccddddddddddddaeapddddddddddddddddaqdefgdefgdefgdefghg¤idjÎfadddejÎgadddaJehaKeaHefaddgaddaJehaKeaHef¥¤Ïadddg¥¤ÏadddaJehaKeaHefaddÄgaddÄaJehaKeaHefaddäegaddäeaJehaKeaHefaddegaddeaJehaKeaHefadd$egadd$eaJehaKeaHefaddDegaddDeaJehaKeaHefaddäfgaddäfaJehaKeaHefaddfgaddfaJehaKeaHefadd$fgadd$faJehaKeaHefaddDfgaddDfaJehaKeaHefaddäggaddägaJehaKeaHefaddggaddgaJehaKeaHefadd$ggadd$gaJehaKeaHefaddDggaddDgaJehaKeaHeij¥ähÎjl¥äeÎlk¬qdooioõnguãeßfáf¤e¥d°qdf¥f¬qdf¥eÏw¥deÏxe¥eÕye¥àÕue¥fØzdÎ{e¥hÏ|¥fÚ¥eÎf¥bccckÕ}f¥eÕ~e¥h­g¤evÐs¥dff¤f¤qdddesÎ¥fØÎ­ds¥fØÎ{­Õqd¥dp|¥h³h¤}qdfg¤fftÎradfdfadfdaHeaofdfradftfadftaHeaoftf¥Îfp¥lÎpq¥fÏqqdoo~h¤dp¥fØÎfdpsÎ¥fØÎadfdfadfdaHeaofdoufeªqeof¥ã×pyh¤df¥fØÎqdfsÎ¥fØÎfdqfdöfdf¥eÖfopxªqdefÏqf¥fØstÎrdfg¤fsÎfrÎpfdfdöfdpfhfhöfhf¥lÎfq¥fÏqqdootzÎtwv¥eÎv«qdoof¤h¥d°qdi¥f¬qdi¥eÏx¥dt¥dhÏyh¥eÕzh¥àÕ}h¥fØ{gÎ|h¥hÏ~¥fÚ¥eÎf¥bccckÕif¥eÕh¥h­s¥dvg¤hvÐr¥dff¤f¤sqdgghrÎ¥fØÎ­gr¥fØÎ|­Õqd¥dp~¥h³h¤iqgfg¤fftÎuadfdfadfdaHeaofdfuadftfadftaHeaoftf¥Îfp¥lÎpq¥fÏqqdooh¤gp¥fØÎfgprÎ¥fØÎadfdfadfdaHeaofdoh}fªqeof¥ã×uzh¤gf¥fØÎqgfrÎ¥fØÎfdqfdöfdf¥eÖfouyªqdhfÏqf¥fØrtÎpgfg¤frÎwfpÎufdwfdöfdwufhwfhöfhf¥lÎfq¥fÏqqdoot{Îtxv¥eÎv«qdoo¥dqn¥dfdm¥dfdekÏi¥d®h¤l¥fØedp¥dfg¤pgkjtdagafadaeöööÂh¤nffdmfdfqoepÎpiflÎf®qdooqlÏflqÎ¬h¤l¥eØedf¥fØÎpg¤pgkjtdagafadaeöööÂh¤nffdmfdfqop¥hÎpf¥eÎfe¥eÏeqdooh¥d®h¤¥dfg¤dq¥fØÎgkjtdagafadaeöööÄh¤offdmfdnfdqod¥hÎdg¥hÎgk¥eÏkhf¥eÎf«qdoood~sØÅÖËÉØÃÊÉÅØÙÖÉ×ek×ÍÑÈ`;
const scalarWasm = String.raw`dynEncode000eo{&nns|{s{}O)q}szosmmvso~mposüË.O/\N.O.y/.ÀQÍ /N...x08..x08¢.£ .8.8¢.£ .8.8¢.£ .8&.8&¢.£ .8..8.¢.£ .86.86¢.£ .8>.8>¢.£ .8F.8F¢.£ .ONy8.ONy8¢.£ .8V.8V¢.£ .8^.8^¢.£ .8f.8f¢.£ .8n.8n¢.£ .8v.8v¢.£ .8~.8~¢.£ .8.8¢.£ /.Ox/.O.x0.V.ºN.OZ.OV.Oy/.O/.O/.O/ NO/.OUN./N...x0!8.8 F..!8.8 F.Ox/..Ox0U. N..Ox0....zxOx8.8 F..x/..Ox0UN.OZ.OV.Oy/.O/.O/.O/O/O/NO/.OUN./N...x0 8.8 F.. 8.8 F.Ox/..Ox0U.N..Ox0....zxOx8.8 F..x/..Ox0UO/.OD.OD..y0OXN.O/./O/N....0".#lN..D.."F."/#./..x/...x0X..y0..xVN.O/..Ox/N....0".#lN..D.."F."/#./.Ox/.Ox/.Oy0.OXNO/N..Ox...0".#nN..D.."F."/#.6/.Ox/.Ox/.Oy/..Ox0U`;

export default class SynAudio {
  constructor(options = {}) {
    this._covarianceSampleSize = options.covarianceSampleSize || 11025;
    this._initialGranularity = options.initialGranularity || 16;

    this._module = wasmModule.get(SynAudio);

    if (!this._module) {
      this._module = featureDetect
        .simd()
        .then((simdSupported) =>
          simdSupported
            ? WebAssembly.compile(decode(simdWasm))
            : WebAssembly.compile(decode(scalarWasm))
        );
      wasmModule.set(this._module);
    }
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

  async syncWASM(a, b, sampleRate) {
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

    const wasm = await this._module.then((module) =>
      WebAssembly.instantiate(module, {
        env: { memory },
      })
    );

    const instanceExports = new Map(Object.entries(wasm.exports));

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
