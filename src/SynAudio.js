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
const simdWasm = String.raw`dynEncode0065eÆØÒfeeeftfÅpäääääääääääegtfhÊÓÛkÒÊÒÔ×Þgeghgfekmfäe¦åíiplgnÈÔ××ÊÑÆÙÊeepÄÄÍÊÆÕÄÇÆØÊheofiwämâhàgáfikik­fi­u¦iÔvg¥f¦e±reg¦g­reg¦fÐx¦efÐyf¦fÖ{f¦áÖqef¦gÙ|Ï}f¦iÐ~¦gÛ¦fÏg¦cdddlÖrg¦fÖf¦i®h¥fwÑt¦ekg¥g¥reftÏ¦gÙeÏe°}t¦gÙeÏ°Öre¦eg~¦i´i¥rpekh¥kksÏzbegekbegebIfbpgekzbegukbegubIfbpguk¦Ïkg¦mÏgp¦gÐpreppi¥g¦gÙeÏkgtÏ¦gÙeÏbegekbegebIfbpgepfqk«rfpk¦äØg{iäk¦gÙeÏpktÏ¦gÙeÏgepge÷gek¦f×jkpkgy«refkÐpsk¦gÙtÏzekh¥ktÏgkzÏgegge÷geggiggi÷gik¦mÏkp¦gÐprepps|Ïsw¦fÏwx¬reppuvÐrg¥i¦e±rej¦g­rej¦fÐx¦es¦eiÐyi¦fÖ{i¦áÖjhi¦gÙ|Ï}i¦iÐ~¦gÛ¦fÏg¦cdddlÖqg¦fÖi¦i®¦ewh¥iwÑt¦ekg¥g¥reitÏ¦gÙhÏh°}t¦gÙhÏ°Öre¦eg~¦i´i¥qphkh¥kksÏzbegekbegebIfbpgekzbegukbegubIfbpguk¦Ïkg¦mÏgp¦gÐpreppi¥g¦gÙhÏkgtÏ¦gÙhÏbegekbegebIfbpgepijk«rfpk¦äØg{iäk¦gÙhÏpktÏ¦gÙhÏgepge÷gek¦f×jkpkgy«reikÐpsk¦gÙtÏzhkh¥ktÏgkzÏgegge÷geggiggi÷gik¦mÏkp¦gÐprepps|Ïsw¦fÏwx¬reppn¦egem¦eger¦uÐqr¦v³iä¦egekh¥kbeeebIfkbeeubIfkbeebIfkbeebIfk¦¥Ðkg¦uÏgq­repr¦fÐ¦ÕÖj¦epibhbgbebf÷÷÷g¥ir³rei¦äØuÏvÐpr¦hÖjiäi¦gÙeÏkjgh¥kge÷k¦iÏkg¦fÐgrepij×jipip¦h®rei¦gÙeÏkivÏuÐgh¥kge÷kgi÷kgm÷kgq÷k¦uÏkg¦iÏgrepprúgär¦v­i¥bqeeeeeeeeeeeeeeee¦eqfpbxbqeeeeeeeeeeeeeeee¦egekh¥kbeeebJfbKfbIfkbeeubJfbKfbIfkbeebJfbKfbIfkbeebJfbKfbIfk¦¥Ðkg¦uÏgq­repr¦fÐ¦ÕÖpgobhbgbebf÷÷÷geg¥gr³reg¦äØuÏvÐir¦hÖpi¥g¦gÙeÏkh¥okgeøù÷gek¦iÏkg¦fÏgp¦fÐpreppi¦h®reg¦gÙeÏkgvÏuÐgh¥okgeøù÷geokgiøù÷geokgmøù÷geokgqøù÷gek¦uÏkg¦iÏgreppfrÐw¨eeå$÷g¥r¦fÏf³i¥¦ekqfpfvÏu¦äØÏgu¦gÙv¦gÙÐie¦iÏkoph¥p¦iÏfgefkgeøùøgeikÏgekgepúögefø÷úøù÷gek¦iÏkfpg¦fÐgrepw¦fÐk¦gÙoÏgepk¦gÙoÏúögebqeeeeeeeeeeeeeeeer¦v³iä¦eghkh¥kbeeebIfkbeeubIfkbeebIfkbeebIfk¦¥Ðkg¦uÏgq­repr¦fÐ¦ÕÖj¦epfbhbgbebf÷÷÷g¥fr³ref¦äØuÏvÐjr¦hÖiiäf¦gÙhÏkigh¥kge÷k¦iÏkg¦fÐgrepfi×jfpfj¦h®ref¦gÙhÏkfvÏuÐgh¥kge÷kgi÷kgm÷kgq÷k¦uÏkg¦iÏgreppúbxgär¦v­i¥bqeeeeeeeeeeeeeeee¦eqfpbqeeeeeeeeeeeeeeee¦eghkh¥kbeeebJfbKfbIfkbeeubJfbKfbIfkbeebJfbKfbIfkbeebJfbKfbIfk¦¥Ðkg¦uÏgq­repr¦fÐ¦ÕÖpfbhbgbebf÷÷÷g¥fr³ref¦äØuÏvÐjr¦hÖiiäf¦gÙhÏkigh¥kgeøù÷k¦iÏkg¦fÐgrepfi×jfpfj¦h®ref¦gÙhÏkfvÏuÐgh¥kgqøùkgmøùkgiøùkgeøù÷÷÷÷k¦uÏkg¦iÏgreppúög¥w¦e±i¥¦eiqfp vuÐxl¦gÙyr¦fÖ{v¦äØuÏ|r¦fÐ¦ÕÖpr¦eir¦v­}ef¦esh¥es¦gÙgÏ~gersÏ¦gÙeÏgoÏgä}i¥bqeeeeeeeeeeeeeeee¦eqfpbxbqeeeeeeeeeeeeeeee¦ek¦egh¥fkÏjbeeebJfhkÏtbeeebJfbKfbIfjbeeubJftbeeubJfbKfbIfjbeebJftbeebJfbKfbIfjbeebJftbeebJfbKfbIfk¦¥Ðkg¦uÏgq­repppggegebhbgbebf÷÷÷g¥gr³re{iä~g¦gÙjÏgeøhjÏgeøù÷g¦f×jgpjg|«rej¦gÙkjxÏgh¥fkÏjgiøhkÏtgiøùjgeøtgeøù÷÷k¦mÏkg¦gÏgreppúùúmgeÃiänsgemgesjipi  fyÏflsÏsw­reppg¥l¦f±rewillÑfÏj¯l¦epifÐf¦ef¦e¯sg¥r¦v­i¥bqeeeeeeeeeeeeeeeeqfps¦gÙeÏkbqeeeeeeeeeeeeeeee¦egh¥kbeeebIfkbeeubIfkbeebIfkbeebIfk¦¥Ðkg¦uÏgq­repr¦fÐ¦ÕÖppjwllbhbgbebf÷÷÷g¥pr³rep¦äØuÏvÐir¦hÖfiäpsÏ¦gÙeÏkfgh¥kge÷k¦iÏkg¦fÐgrepfp×jpppi¦h®repvÏuÐgpsÏ¦gÙeÏkh¥kge÷kgi÷kgm÷kgq÷k¦uÏkg¦iÏgreppls±revuÐwr¦fÖts¦gÙeÏfv¦äØuÏur¦fÐ¦ÕÖjr r¦v­vh¥es¦gÙgÏigersÏ¦gÙeÏxgoÏygävi¥bqeeeeeeeeeeeeeeee¦eqfpbxbqeeeeeeeeeeeeeeee¦epfkhgh¥kbeeebJfgbeeebJfbKfbIfkbeeubJfgbeeubJfbKfbIfkbeebJfgbeebJfbKfbIfkbeebJfgbeebJfbKfbIfk¦¥Ðkg¦¥Ðgp¦uÏpq­repjpgxgeygebhbgbebf÷÷÷g¥gr³retiäig¦gÙiÏgeøhiÏgeøù÷g¦f×jgpigu«rei¦gÙkiwÏgh¥fkÏigiøhkÏpgiøùigeøpgeøù÷÷k¦mÏkg¦gÏgreppúùúmgeÃi¥nsgemgep  f¦iÏfs¦fÏsl¬repppetÙÆ×ÌÊÙÄËÊÆÙÚ×ÊØflØÎÒÉ`;
const scalarWasm = String.raw`dynEncode000eo{%nns|{s{}OO)q}szosmmvso~mpos¬$Ë..À0£/.OVO.Oy/./N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Ox0.V.OyO/..FN..Z..Ox/.O0N.O.x/N..8.¡0.¢. 0F.Ox/.Ox/.Oy0.OW..y/.O.x/N..8.¡0.¢. 0F..8.¡0.¢. 0F..8.¡0.¢. 0F..8.¡0.¢. 0F.Ox/.Oy0.QÍ /O/.Ox.V.Ox/.O/..y0Oy/./N.Ox0.F...8.¡0.¢¡0F..x8/.8/...£F.....¡ 0.£0¡0.¢. 0F.Ox/./.Oy0.Oy0O.x8./.O.x..£FêQ/"N1Oy0%2....V)/'..V/-N.OZ.OV.Oy/,.O/+.O/*.O/)NO/.OUN./N...$x0#8.8 F..#8.8 F.Ox/.Ox0.*U.)N.O.x0..(z.xO.x8.8 F.$.+x/$.(Ox0(.,U..'.-)/#N.OZ.OV.Oy/,.O/+.O/*.O/)O/$NO/.OUN./N...$x08.8 F..8.8 F.Ox/.Ox0.*U.)N.O.x0...z.xO.x8.8 F.$.+x/$..Ox0..,U.OD.OD.#Oy/&N.#0O\O/./N..8 .8 .8 .8 /.Ox/.Ox0.&V.OyOO0.\.O.x/$.O0#.O.x/.#/N..8 /.Ox/.Oy0..#./.$OW..y/.O.x/N..8 .8 .8 .8 /.Ox/.Oy0.......y/(N.OVOO/./N..8 .8 .8 .8 /.Ox/.Ox0.&V.OyO0.\.O.x/#.O0.O.x/./N..8 /.Ox/.Oy0.../.#OW..y/.O.x/N..8 .8 .8 .8 /.Ox/.Oy0..%Ox.....À0£/ .(OXN.É/0.O/,.O/+.QÍ /.OyO/#.Å//O/..%8/.OV/*./$N...O0x0)8/...xO.x/.0./±Ä/..x/."/!.*OO/O/./N..$x0'8.¡..x0-8. ¡¢.'8.¡.-8. ¡¢.'8.¡.-8. ¡¢..¡.-8. ¡¢.!    /!..&VN.Ox/.Ox/.'8/.#/.8/.8/N..\.O/.+.).O0x8.¡..x8. ¡¢.! /!../..T.O/..y/N..$x08.¡..x08. ¡¢.8.¡.8. ¡¢.!  /!.Ox/.Oy0.!.£..¢£0.8lN...D..F.0.É¯.É®/0.$.,x/$...x0..(VN.OZ.60..z0x/..y0O.OX)/.."/..(..(V)/+N.0O\..O.x/O/N..8 .8 .8 .8 /.Ox/.Ox0.&V.OyOO0.\.O.x/.O0...xO.x/./N..8 /.Ox/.Oy0.../.OW..y/...xO.x/N..8 .8 .8 .8 /.Ox/.Oy0.+..Z.O/*.QÍ /..O.x/$.OyO/.Å//.É/0.%8/.OV/)N...O0x0#8/...xO.x/.0./±Ä/..x/.)N."/!O."/!O/O/./N..$x0-8.¡..x0,8. ¡¢.-8.¡.,8. ¡¢.-8.¡.,8. ¡¢..¡.,8. ¡¢.!    /!..&VN.Ox/.Ox/.-8/./.8/.8/N..\.O/.*.#.O0x8.¡..x8. ¡¢.! /!../..T.O/..y/N..$x08.¡..x08. ¡¢.8.¡.8. ¡¢.!  /!.Ox/.Oy0.!.£..¢£0.8lN...D..F.0.É¯.É®/0.$Ox/$..Ox0..+U.%Ox2`;

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
          ["initial"]:
            ((a.samplesDecoded * a.channelData.length * 2 +
              b.samplesDecoded * b.channelData.length) *
              floatByteLength) /
              pageSize +
            4,
        });

        return this._module
          .then((module) =>
            WebAssembly.instantiate(module, {
              ["env"]: { memory },
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
            const aStdDevArrPtr = bestSampleOffsetPtr + floatByteLength;

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
              bestSampleOffsetPtr,
              aStdDevArrPtr
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
        const lengths = [0];

        // |-----------|       |-----------|     "end"
        // "start"   |-|---------|       |-----------|
        //           | |
        //           | |correlationSampleSize

        // split a buffer into equal chunks for threads
        // overlap at the start of the buffer by correlation sample size
        // overlap at the end of the buffer by correlation sample size

        // correlation sample size overlap imposes a maximum thread count for small datasets
        const minProcessingRatio = 4 / 2; // 4 processing / 2 overlap
        const maxThreads = Math.ceil(
          a.samplesDecoded / this._correlationSampleSize / minProcessingRatio
        );
        threads = Math.min(threads, maxThreads);

        const aLength = Math.ceil(a.samplesDecoded / threads);

        let offset = 0;
        for (let i = 1; i <= threads; i++) {
          const aSplit = {
            channelData: [],
          };

          for (let i = 0; i < a.channelData.length; i++) {
            const cutChannel = a.channelData[i].subarray(
              offset,
              offset + aLength + this._correlationSampleSize
            );
            aSplit.channelData.push(cutChannel);
            aSplit.samplesDecoded = cutChannel.length;
          }

          offset += aLength - this._correlationSampleSize;
          lengths.push(offset);

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
              results[bestResultIdx].sampleOffset + lengths[bestResultIdx],
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
