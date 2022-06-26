/* Copyright 2022 Ethan Halsall
    
    This file is part of synaudio.
    
    synaudio is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    synaudio is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

import { decode } from "simple-yenc";
import Worker from "web-worker";

// prettier-ignore
const simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]))

const wasmModule = new WeakMap();

/* WASM strings are embeded during the build */
const simdWasm = String.raw`dynEncode0064dÅ×ÑedddereÄnããããããããããdfsegÉÒÚjÑÉÑÓÖÝfdfgfedjleãd¥äìhokfmÇÓÖÖÉÐÅØÉddoÃÃÌÉÅÔÃÆÅ×Égdnwewhvãgàkßjáejej¬v¥hÓwf¤e¥d°qdf¥f¬qdf¥eÏx¥deÏye¥eÕze¥àÕoe¥fØ{dÎ|e¥hÏ}¥fÚ¥eÎf¥bccckÕpf¥eÕ~e¥h­tg¤esÐq¥djf¤f¤tqdddeqÎ¥fØÎ­dq¥fØÎ|­Õqd¥df}¥h³h¤pndjg¤jjrÎuadfdjadfdaHeaofdjuadftjadftaHeaoftj¥Îjf¥lÎfn¥fÏnqdoo~h¤df¥fØÎjdfqÎ¥fØÎadfdjadfdaHeaofdoojeªqeoj¥ã×fzh¤dj¥fØÎndjqÎ¥fØÎfdnfdöfdj¥eÖjofyªqdejÏnj¥fØqrÎudjg¤jqÎfjuÎfdffdöfdffhffhöfhj¥lÎjn¥fÏnqdoor{Îrxs¥eÎs«qdoovwÏof¤i¥f¬qdhoho¬p¥d°qdi¥eÏxp¥eÕyp¥àÕhp¥fØzgÎ{p¥hÏ|¥fÚ¥eÎf¥bccckÕif¥eÕ}¥drp¥h­~¥dsg¤psÐq¥djf¤f¤~qdggpqÎ¥fØÎ­gq¥fØÎ{­Õqd¥df|¥h³h¤ingjg¤jjrÎtadfdjadfdaHeaofdjtadftjadftaHeaoftj¥Îjf¥lÎfn¥fÏnqdoo}h¤gf¥fØÎjgfqÎ¥fØÎadfdjadfdaHeaofdophjªqeoj¥eÖfyh¤gj¥fØÎngjqÎ¥fØÎfdnfdöfdfjofpªqdpjÏnj¥fØqrÎtgjg¤jqÎfjtÎufdffdöfdfufhffhöfhj¥lÎjn¥fÏnqdoorzÎrxs¥eÎs«qdoo¥dim¥dfdl¥dfdeoÏpf¤o¥d°qdo¥gÕff¤vw¥ã×Îe¥g­h¤¥dhpeodjo¥àÕhng¤jfdjfhjfljfpj¥tÎjn¥hÏnqdoofh¤dh¥fØÎjfng¤jfdj¥hÎjn¥eÏnqdoof¤e¥g­h¤¥depeogjo¥àÕeng¤jfdjfhjfljfpj¥tÎjn¥hÏnqdoof©qdge¥fØÎjg¤jfdj¥hÎjf¥eÏfqdooop¥d®h¤k¥fØr§ddä#öo¥hÏsawoo¥i¬qde¥dhg¤dh¥fØÎfddhoÎ¥fØÎfdf¤qh¤apddddddddddddddddapddddddddddddddddapddddddddddddddddpeoaw¥dnejgfapddddddddddddddddapddddddddddddddddapddddddddddddddddg¤jadddaIefadddaIeaJeaHej¥tÎjf¥tÎfaJeaHeaJeaHesn¥hÎn®qdooagafadaeöööùagafadaeöööùagafadaeöööùÂh¤mhfdlfdhioerÎephkÎh®qdoof¤k¥e°qdk¥eØeiÎfpfp¬kieÏe¥de¥d®hf¤o¥d°h¤¨ddddddddpeovw¥ã×Îifão¥gÕe©h¤¨ddddddddhpeodh¥fØÎj¨ddddddddefg¤jfdj¥hÎjf¥eÏfqdoehÎoei¥g­qdde¥fØÎjhvÎeÏwÏfg¤jfdjfhjfljfpj¥tÎjf¥hÏfqdoohk²qd§ddä#öo¥hÏidh¥fØÎeawoo¥i¬pg¤dh¥fØÎfddhoÎ¥fØÎfdf¤ph¤apddddddddddddddddapddddddddddddddddapddddddddddddddddpeoaw¥dnejgfapddddddddddddddddapddddddddddddddddapddddddddddddddddg¤jadddaIefadddaIeaJeaHej¥tÎjf¥tÎfaJeaHeaJeaHein¥hÎn®qdooagafadaeöööùagafadaeöööùagafadaeöööùÂh¤mhfdlfdoe¥hÎekh¥eÎh«qdoood~sØÅÖËÉØÃÊÉÅØÙÖÉ×ek×ÍÑÈ`;
const scalarWasm = String.raw`dynEncode000eo{ns|{s{}O)q}szosmmvso~mpos§¤..V/N.OZ.OV.Oy/.O/.O/.O/NO/.OUN./N...x0 8.8 F.. 8.8 F.Ox/..Ox0U.N..Ox0....zxOx8.8 F..x/..Ox0U...)/N.OV....V)0OZ.Oy/.O/.O/.O/O/O/NO/.OUN./N...x08.8 F..8.8 F.Ox/..Ox0U.N..Ox0....zxOx8.8 F..x/..Ox0UO/.OD.OD..y/N.OZ.O/N.Oy0OWNO/./.O0/N./.8É®.8É®.8É®.8É®//.Ox/.Oy0.N..Ox/./N./.8É®//.Ox/.Oy0N.OWNO/./.O0/N.0.8É®.8É®.8É®.8É®/0.Ox/.Oy0.S..Ox/N.0.8É®/0.Ox/.Oy0.0.À0&É±Ä/'.OXN.O/.Ox/.Ox/.O/ .&QÍ /).Oy0O/.O/.Å/0O/N..Ox0!80%É/1...xOx8/.Q/"Q/#Q/$N.OV.%./.0±Ä0%¡0#.8.'¡0$¢Q /"O/.#.#¢Q /#.$.$¢Q /$NN../././N.8.%¡0(.8.'¡0*¢.Oy8.%¡0+.Oy8.'¡0,¢."  /".*.*¢.,.,¢.$  /$.(.(¢.+.+¢.#  /#.Ox/.Ox/.Oy0./. S.O0.!x8.%¡0%..x8.'¡0(¢." /".(.(¢.$ /$.%.%¢.# /#.".)£É.#.)£É­.$.)£É­°±Ä0".-lN..D.."F."/-././.1¯..É®//..x/...x0XN.OZ.O0.x0...V)/..y0O.OX)/N.OZNR//.Oy/.O0SNR//...Ox/R//./N./.8É®//.Ox/.Oy0..x/.OW..Ox/..x.y/N./.8É®.8É®.8É®.8É®//.Ox/.Oy0..\.Ox/.O/.&QÍ /).Oy0O/.O/.O.xOx/.Å/0N..Ox080%É/1...xOx8/,Q/"Q/#Q/$N.OV.%./.0±Ä0%¡0#.8.'¡0$¢Q /"O/.#.#¢Q /#.$.$¢Q /$NN../././N.8.%¡0&.8.'¡0(¢.Oy8.%¡0*.Oy8.'¡0+¢."  /".(.(¢.+.+¢.$  /$.&.&¢.*.*¢.#  /#.Ox/.Ox/.Oy0./.S.O0.x8.%¡0%..x8.'¡0&¢." /".&.&¢.$ /$.%.%¢.# /#.".)£É.#.)£É­.$.)£É­°±Ä0".-lN..D.."F."/-./.1¯.,É®//.Ox/..Ox0U`;

export default class SynAudio {
  constructor(options = {}) {
    this._correlationSampleSize = options.correlationSampleSize || 11025;
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

    this.SynAudioWorker = function SynAudioWorker(
      module,
      correlationSampleSize,
      initialGranularity
    ) {
      this._sourceCache = new Map();

      this._setAudioDataOnHeap = (input, output, heapPos) => {
        const bytesPerElement = output.BYTES_PER_ELEMENT;

        let floatPos = heapPos / bytesPerElement;

        for (let i = 0; i < input.length; i++) {
          heapPos += input[i].length * bytesPerElement;
          output.set(input[i], floatPos);
          floatPos += input[i].length;
        }

        return heapPos;
      };

      this._executeAsWorker = (functionName, params) => {
        let source = this._sourceCache.get(functionName);

        if (!source) {
          const webworkerSourceCode =
            "'use strict';" +
            `(${((
              SynAudioWorker,
              functionName,
              correlationSampleSize,
              initialGranularity
            ) => {
              self.onmessage = (msg) => {
                const worker = new SynAudioWorker(
                  Promise.resolve(msg.data.module),
                  correlationSampleSize,
                  initialGranularity
                );

                worker._workerMethods
                  .get(functionName)
                  .apply(null, msg.data.params)
                  .then((results) => {
                    self.postMessage(results);
                  });
              };
            }).toString()})(${SynAudioWorker.toString()}, "${functionName}", ${
              this._correlationSampleSize
            }, ${this._initialGranularity})`;

          const type = "text/javascript";

          try {
            // browser
            source = URL.createObjectURL(
              new Blob([webworkerSourceCode], { type })
            );
          } catch {
            // nodejs
            source = `data:${type};base64,${Buffer.from(
              webworkerSourceCode
            ).toString("base64")}`;
          }

          this._sourceCache.set(functionName, source);
        }

        const worker = new (globalThis.Worker || Worker)(source, {
          name: "SynAudio",
        });

        const result = new Promise((resolve) => {
          worker.onmessage = (message) => {
            worker.terminate();
            resolve(message.data);
          };
        });

        this._module.then((module) => {
          worker.postMessage({
            module,
            params,
          });
        });

        return result;
      };

      this._sync = (a, b) => {
        const pageSize = 64 * 1024;
        const floatByteLength = Float32Array.BYTES_PER_ELEMENT;

        const memory = new WebAssembly.Memory({
          initial:
            ((a.samplesDecoded * a.channelData.length +
              b.samplesDecoded * b.channelData.length) *
              floatByteLength) /
              pageSize +
            4,
        });

        return this._module
          .then((module) =>
            WebAssembly.instantiate(module, {
              env: { memory },
            })
          )
          .then(({ exports }) => {
            const instanceExports = new Map(Object.entries(exports));

            const correlate = instanceExports.get("correlate");
            const dataArray = new Float32Array(memory.buffer);
            const heapView = new DataView(memory.buffer);

            const aPtr = instanceExports.get("__heap_base").value;
            const bPtr = this._setAudioDataOnHeap(
              a.channelData,
              dataArray,
              aPtr
            );
            const bestCorrelationPtr = this._setAudioDataOnHeap(
              b.channelData,
              dataArray,
              bPtr
            );
            const bestSampleOffsetPtr = bestCorrelationPtr + floatByteLength;

            correlate(
              aPtr,
              a.samplesDecoded,
              a.channelData.length,
              bPtr,
              b.samplesDecoded,
              b.channelData.length,
              this._correlationSampleSize,
              this._initialGranularity,
              bestCorrelationPtr,
              bestSampleOffsetPtr
            );

            const bestCorrelation = heapView.getFloat32(
              bestCorrelationPtr,
              true
            );
            const bestSampleOffset = heapView.getInt32(
              bestSampleOffsetPtr,
              true
            );

            return {
              correlation: bestCorrelation,
              sampleOffset: bestSampleOffset,
            };
          });
      };

      this._syncWorkerConcurrent = (a, b, threads) => {
        const promises = [];
        const lengths = [];

        const aCorrelationOverlap = Math.ceil(
          this._correlationSampleSize / threads
        );
        const aBufferSplit = Math.ceil(a.samplesDecoded / threads);
        const aBufferLength =
          aBufferSplit + this._correlationSampleSize - aCorrelationOverlap;

        // split a buffer into equal chunks for threads
        // overlap at the end of the buffer by correlation sample size
        let offset = 0;
        for (let i = 1; i <= threads; i++) {
          const aSplit = {
            channelData: [],
          };

          for (let i = 0; i < a.channelData.length; i++) {
            const cutChannel = a.channelData[i].subarray(
              offset,
              offset + aBufferLength
            );
            aSplit.channelData.push(cutChannel);
            aSplit.samplesDecoded = cutChannel.length;
          }

          const actualLength =
            aSplit.samplesDecoded < aBufferSplit
              ? aSplit.samplesDecoded
              : aBufferSplit;
          lengths.push(actualLength);
          offset += actualLength;

          promises.push(this._syncWorker(aSplit, b));
        }

        return Promise.all(promises).then((results) => {
          // find the result with the highest correlation and calculate the offset relative to the input data
          let bestResultIdx = 0;
          let bestCorrelation = -1;
          for (let i = 0; i < results.length; i++)
            if (results[i].correlation > bestCorrelation) {
              bestResultIdx = i;
              bestCorrelation = results[i].correlation;
            }

          return {
            correlation: results[bestResultIdx].correlation,
            sampleOffset:
              results[bestResultIdx].sampleOffset +
              lengths
                .slice(0, bestResultIdx)
                .reduce((acc, len) => acc + len, 0),
          };
        });
      };

      this._syncWorker = (a, b) => {
        return this._executeAsWorker("_sync", [a, b]);
      };

      this._syncWorkerConcurrentMain = (a, b, threads) => {
        // can't serialize the webworker polyfill in nodejs
        return globalThis.Worker
          ? this._executeAsWorker("_syncWorkerConcurrent", [a, b, threads])
          : this._syncWorkerConcurrent(a, b, threads);
      };

      // needed to serialize minified code when methods are refererenced as a string
      // prettier-ignore
      this._workerMethods = new Map([
        ["_sync", this._sync],
        ["_syncWorker", this._syncWorker],
        ["_syncWorkerConcurrent", this._syncWorkerConcurrent],
      ]);

      this._module = module;
      this._correlationSampleSize = correlationSampleSize;
      this._initialGranularity = initialGranularity;
    };

    this._instance = new this.SynAudioWorker(
      this._module,
      this._correlationSampleSize,
      this._initialGranularity
    );
  }

  async syncWorkerConcurrent(a, b, threads = 1) {
    return this._instance._syncWorkerConcurrentMain(a, b, threads);
  }

  async syncWorker(a, b) {
    return this._instance._syncWorker(a, b);
  }

  async sync(a, b) {
    return this._instance._sync(a, b);
  }
}
