import { decode } from "simple-yenc";
import Worker from "web-worker";

// prettier-ignore
const simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]))

const wasmModule = new WeakMap();

/* WASM strings are embeded during the build */
const simdWasm = String.raw`dynEncode000eo{'nns|{s{}O)q}szosmmvso~mposÂ.O\N.Oy/.!/.!/N...x0.ó..x0.óôò..ó..óôò...ó...óôò.>.ó.>.óôò.ONy.ó.ONy.óôò.^.ó.^.óôò.n.ó.n.óôò.~.ó.~.óôò..ó..óôò..ó..óôò.®.ó.®.óôò.¾.ó.¾.óôò.Î.ó.Î.óôò.Þ.ó.Þ.óôò.î.ó.î.óôò.þ.ó.þ.óôò..ó..óôò..ó..óôò.®.ó.®.óôò.¾.ó.¾.óôò.Î.ó.Î.óôò.Þ.ó.Þ.óôò.î.ó.î.óôò.þ.ó.þ.óôò..ó..óôò..ó..óôò.®.ó.®.óôò.¾.ó.¾.óôò.Î.ó.Î.óôò.Þ.ó.Þ.óôò.î.ó.î.óôò.þ.ó.þ.óôò/.Ox/.Ox0.V.¼O/.OD.OD..y/(N.OZ.O/.Oy0O]N./.O0'/N..8É®.8É®.8É®.8É®/.Ox/.Oy0.N..'Ox/./N..8É®/.Ox/.Oy0N.OWNO/'./.O0'/N..8É®.8É®.8É®.8É®/.Ox/.Oy0.S..'Ox/N..8É®/.Ox/.Oy0..À0!É±Ä/%.(OXN.O/.O/.!QÍ /$.Å/./O/N..8É¯/..x8É/....±Ä0".%.0-.-.-.-   .$£0 .#lN..D.. F. /#."/&./..®/..x/.(..x0X.O0).x/'..)y/N.OZNR/.Oy/(.O0SNR/...x/..Ox/R/N..8É®/.Ox/.Oy0..)y/.(OW..Ox/..x.y.)y/N..8É®.8É®.8É®.8É®/.Ox/.Oy0..'VN.O/.!QÍ /$..Ox/...x.)yOx/.Å/N..8É¯/.8É/....±Ä0".%.0-.-.-.-   .$£0 .#lN..D.. F. /#."/&./..®/.Ox/.Ox/.Ox/.Oy0.OXN.!QÍ / O/N.8É/..Ox..&..!É±Ä.0-.-.-.-   . £0".#nN..D.."F."/#.6/.!QÍ /!..¯/.Ox/.Ox/.Ox/.Oy0(ousmtsos9w{r?@F`;
const scalarWasm = String.raw`dynEncode000eo{'nns|{s{}O)q}szosmmvso~mposü.O/\N.O.y/N..x08.¡..x08.¡¢.8.¡.8.¡¢.8.¡.8.¡¢.8~.¡.8~.¡¢.8z.¡.8z.¡¢.8v.¡.8v.¡¢.8r.¡.8r.¡¢.8n.¡.8n.¡¢.8j.¡.8j.¡¢.8f.¡.8f.¡¢.8b.¡.8b.¡¢.8^.¡.8^.¡¢.8Z.¡.8Z.¡¢.8V.¡.8V.¡¢.8R.¡.8R.¡¢.ONy8.¡.ONy8.¡¢.8J.¡.8J.¡¢.8F.¡.8F.¡¢.8B.¡.8B.¡¢.8>.¡.8>.¡¢.8:.¡.8:.¡¢.86.¡.86.¡¢.82.¡.82.¡¢.8..¡.8..¡¢.8*.¡.8*.¡¢.8&.¡.8&.¡¢.8".¡.8".¡¢.8.¡.8.¡¢.8.¡.8.¡¢.8.¡.8.¡¢.8.¡.8.¡¢.8.¡.8.¡¢.                                /.Ox/.O.x0.V.õO/.OD.OD..y/'N.OZ.O/.Oy0O]N./.O0&/N..8É®.8É®.8É®.8É®/.Ox/.Oy0.N..&Ox/./N..8É®/.Ox/.Oy0N.OWNO/&./.O0&/N..8É®.8É®.8É®.8É®/.Ox/.Oy0.S..&Ox/N..8É®/.Ox/.Oy0..À0 É±Ä/$.'OXN.O/.O/. QÍ /#.Å/./O/N..8É¯/..x8É/....±Ä0!.$..#£0."lN..D..F./".!/%./..®/..x/.'..x0X.O0(.x/&..(y/N.OZNR/.Oy/'.O0SNR/...x/..Ox/R/N..8É®/.Ox/.Oy0..(y/.'OW..Ox/..x.y.(y/N..8É®.8É®.8É®.8É®/.Ox/.Oy0..&VN.O/. QÍ /#..Ox/...x.(yOx/.Å/N..8É¯/.8É/....±Ä0!.$..#£0."lN..D..F./".!/%./..®/.Ox/.Ox/.Ox/.Oy0.OXN. QÍ /O/N.8É/..Ox..%.. É±Ä..£0!."nN..D..!F.!/".6/. QÍ / ..¯/.Ox/.Ox/.Ox/.Oy0`;

export default class SynAudio {
  constructor(options = {}) {
    this._covarianceSampleSize = options.covarianceSampleSize || 11025;
    this._initialGranularity = options.initialGranularity || 16;

    this._module = wasmModule.get(SynAudio);

    if (!this._module) {
      this._module = simd().then((simdSupported) =>
        simdSupported
          ? WebAssembly.compile(decode(simdWasm))
          : WebAssembly.compile(decode(scalarWasm))
      );
      wasmModule.set(this._module);
    }

    this.SynAudioWorker = function (
      module,
      covarianceSampleSize,
      initialGranularity
    ) {
      this._setAudioDataOnHeap = (i, o, heapPos) => {
        const bytesPerElement = o.BYTES_PER_ELEMENT;

        let floatPos = heapPos / bytesPerElement;

        for (const channel of i) {
          heapPos += channel.length * bytesPerElement;
          o.set(channel, floatPos);
          floatPos += channel.length;
        }

        return heapPos;
      };

      this.sync = (a, b, sampleRate) => {
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

        return this._module
          .then((module) =>
            WebAssembly.instantiate(module, {
              env: { memory },
            })
          )
          .then((wasm) => {
            const instanceExports = new Map(Object.entries(wasm.exports));

            const correlate = instanceExports.get("correlate");
            const dataArray = new Float32Array(memory.buffer);
            const heapView = new DataView(memory.buffer);

            const aPtr = instanceExports.get("__heap_base").value;
            const bPtr = this._setAudioDataOnHeap(
              a.channelData,
              dataArray,
              aPtr
            );
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
            const bestSampleOffset = heapView.getInt32(
              bestSampleOffsetPtr,
              true
            );
            const sampleTrim = heapView.getInt32(sampleTrimPtr, true);

            /*console.log({
              sampleOffset: bestSampleOffset,
              covariance: bestCovariance,
              trim: sampleTrim,
            });*/

            return {
              sampleOffset: bestSampleOffset,
              covariance: bestCovariance,
              trim: sampleTrim,
            };
          });
      };

      this._module = module;
      this._covarianceSampleSize = covarianceSampleSize;
      this._initialGranularity = initialGranularity;
    };
  }

  async syncWorker(a, b, sampleRate) {
    const webworkerSourceCode =
      "'use strict';" +
      `(${((SynAudioWorker, covarianceSampleSize, initialGranularity) => {
        self.onmessage = ({ data: { module, a, b, sampleRate } }) => {
          const worker = new SynAudioWorker(
            Promise.resolve(module),
            covarianceSampleSize,
            initialGranularity
          );

          worker.sync(a, b, sampleRate).then((results) => {
            self.postMessage(results);
          });
        };
      }).toString()})(${this.SynAudioWorker.toString()}, ${
        this._covarianceSampleSize
      }, ${this._initialGranularity})`;

    let type = "text/javascript",
      source;

    try {
      // browser
      source = URL.createObjectURL(new Blob([webworkerSourceCode], { type }));
    } catch {
      // nodejs
      source = `data:${type};base64,${Buffer.from(webworkerSourceCode).toString(
        "base64"
      )}`;
    }

    const worker = new Worker(source, { name: "SynAudio" });

    const result = new Promise((resolve) => {
      worker.onmessage = (message) => {
        worker.terminate();
        resolve(message.data);
      };
    });

    this._module.then((module) => {
      worker.postMessage({
        module,
        a,
        b,
        sampleRate,
      });
    });

    return result;
  }

  async sync(a, b, sampleRate) {
    const worker = new this.SynAudioWorker(
      this._module,
      this._covarianceSampleSize,
      this._initialGranularity
    );

    return worker.sync(a, b, sampleRate);
  }
}
