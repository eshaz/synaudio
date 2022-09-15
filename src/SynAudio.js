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
const simdWasm = String.raw`dynEncode0064dÅ×ÑedddereÄnããããããããããdfsegÉÒÚjÑÉÑÓÖÝfdfgfedjleãd¥äìhokfmÇÓÖÖÉÐÅØÉddoÃÃÌÉÅÔÃÆÅ×Égdnbe_huãmágàlßf¤e¥d°qdf¥f¬qdf¥eÏ|¥deÏ{e¥eÕze¥àÕode¥fØyÎxe¥hÏu¥fÚ¥eÎf¥bccckÕqf¥eÕte¥h­wg¤e~Ð}¥dff¤f¤wqde}Î¥fØdÎd¯x}¥fØdÎ¯Õqd¥dnu¥h³h¤qpdfg¤ffrÎvadfdfadfdaHeaofdfvadftfadftaHeaoftf¥Îfn¥lÎnp¥fÏpqdooth¤n¥fØdÎfn}Î¥fØdÎadfdfadfdaHeaofdoeofªqeof¥ã×nzhãf¥fØdÎpf}Î¥fØdÎfdpfdöfdf¥eÖifofn{ªqdefÏprf¥fØ}Îvdfg¤f}ÎnfvÎsfdnfdöfdnsfhnfhöfhf¥lÎfp¥fÏpqdooryÎr~¥eÎ~|«qdoof¤h¥d°qdi¥f¬qdi¥eÏ}¥dr¥dhÏ|h¥eÕ{h¥àÕigh¥fØzÎyh¥hÏx¥fÚ¥eÎf¥bccckÕof¥eÕuh¥h­t¥d~g¤h~Ðq¥dff¤f¤tqdhqÎ¥fØgÎg¯yq¥fØgÎ¯Õqd¥dnx¥h³h¤opgfg¤ffrÎwadfdfadfdaHeaofdfwadftfadftaHeaoftf¥Îfn¥lÎnp¥fÏpqdoouh¤n¥fØgÎfnqÎ¥fØgÎadfdfadfdaHeaofdoifhªqeof¥ã×n{hãf¥fØgÎpfqÎ¥fØgÎfdpfdöfdf¥eÖifofn|ªqdhfÏprf¥fØqÎwgfg¤fqÎnfwÎvfdnfdöfdnvfhnfhöfhf¥lÎfp¥fÏpqdoorzÎr~¥eÎ~}«qdoom¥dfdl¥dfdj¥tÏoj¥u²hã¥dndfg¤fadddaHefaddtaHefaddaHefaddaHef¥¤Ïfn¥tÎno¬qdoj¥eÏ¥ÔÕi¥dohagafadaeöööf¤hj²qdjh¥ã×Îpj¥gÕihãh¥fØdÎfing¤ffdöf¥hÎfn¥eÏnqdohiÖihohp¥g­qdjhÏnh¥fØdÎfg¤ffdöffhöfflöffpöf¥tÎfn¥hÏnqdoofãj¥u¬h¤apdddddddddddddddd¥dpeoapdddddddddddddddd¥dngfg¤fadddaHefaddtaHefaddaHefaddaHef¥¤Ïfn¥tÎno¬qdoj¥eÏ¥ÔÕohagafadaeöööf¤hj²qdjh¥ã×Îpj¥gÕihãh¥fØgÎfing¤ffdöf¥hÎfn¥eÏnqdohiÖihohp¥g­qdjhÏnh¥fØgÎfg¤ffdöffhöfflöffpöf¥tÎfn¥hÏnqdoojùawfãj¥u¬h¤apdddddddddddddddd¥dpeo¥dnapddddddddddddddddgfg¤fadddaIeaJeaHefaddtaIeaJeaHefaddaIeaJeaHefaddaIeaJeaHef¥¤Ïfn¥tÎno¬qdoj¥eÏ¥ÔÕofejÏqagafadaeöööf¤jfe°qdje¥ã×Îij¥gÕhhãe¥fØgÎfhng¤ffd÷øöf¥hÎfn¥eÏnqdoehÖieoei¥g­qdjeÏne¥fØgÎfg¤ffp÷øffl÷øffh÷øffd÷øööööf¥tÎfn¥hÏnqdoo§ddä#öùõf¤q¥d°h¤¥dh§ddddpeok¥fØ}¥dh¥djÏ|j¥eÕ{j¥eÏ¥ÔÕpj§ddddj¥u¬zde¥drg¤r¥fØdÎyfdjrÎ¥fØdÎxfãzh¤apddddddddddddddddapdddddddddddddddd¥dpeoaw¥df¥d~apddddddddddddddddapddddddddddddddddg¤efÎiadddaIefgÎnadddaIeaJeaHeiaddtaIenaddtaIeaJeaHeiaddaIenaddaIeaJeaHeiaddaIenaddaIeaJeaHeaJeaHeaJeaHeaJeaHeaJeaHef¥¤Ïf~¥tÎ~o¬qdopofxfdagafadaeöööagafadaeöööf¤fj²qdf¥ã×n{hãyf¥fØiÎfd÷giÎfd÷øööf¥eÖifoin|ªqdi¥fØfjiÏng¤efÎifh÷fgÎ~fh÷øifd÷~fd÷øööf¥lÎföön¥fÏnqdooùùÁhãmrfdlfdrihohe}ÎekrÎrq¬qdoof¤k¥e°qdqhkkÐeÎi®k¥dpheÏe¥de¥d®rf¤j¥u¬h¤apddddddddddddddddpeor¥fØdÎfapdddddddddddddddd¥dng¤fadddaHefaddtaHefaddaHefaddaHef¥¤Ïfn¥tÎno¬qdoj¥eÏ¥ÔÕpoiqkkagafadaeöööf¤jp°qdjp¥ã×Îhj¥gÕehãprÎ¥fØdÎfeng¤ffdöf¥hÎfn¥eÏnqdoepÖipoph¥g­qdjpÏnprÎ¥fØdÎfg¤ffdöffhöfflöffpöf¥tÎfn¥hÏnqdookr°qd¥djÏqj¥eÕ~r¥fØdÎej¥eÏ¥ÔÕijj¥u¬}g¤r¥fØdÎhfdjrÎ¥fØdÎ|fã}h¤apddddddddddddddddapdddddddddddddddd¥dpeoaw¥dpefgnapddddddddddddddddapddddddddddddddddg¤fadddaIenadddaIeaJeaHefaddtaIenaddtaIeaJeaHefaddaIenaddaIeaJeaHefaddaIenaddaIeaJeaHeaJeaHeaJeaHeaJeaHeaJeaHef¥¤Ïfn¥¤Ïnp¥tÎpo¬qdoiof|fdagafadaeöööagafadaeöööf¤fj²qdf¥ã×n~hãhf¥fØhÎfd÷ghÎfd÷øööf¥eÖifohnqªqdh¥fØfjhÏng¤efÎhfh÷fgÎpfh÷øhfd÷pfd÷øööf¥lÎföön¥fÏnqdooùùÁhámrfdlfdioe¥hÎer¥eÎrk«qdoood~sØÅÖËÉØÃÊÉÅØÙÖÉ×ek×ÍÑÈ`;
const scalarWasm = String.raw`dynEncode000eo{&nns|{s{}O)q}szosmmvso~mpos¼N.0OVO.Oy/N..x08.¡0..x08.¡¢.8.¡0.8.¡¢.8.¡0.8.¡¢.8.¡0.8.¡¢.    /..¢..¢..¢..¢.    /.Ox/.Ox0.V.OyO0.\.O/.O..O0x8.¡..x8.¡¢. /.. /.O./O.y.T..y/..O0x/..x/N.8.¡.8.¡¢.8.¡.8.¡¢.  /.Ox/.Ox/.. . /.Oy0..ÀQÍ 0£É..£É­.É°±Ä®Q/%NN.OZ.OV.Oy/.O/.O/.O/NO/.OUN./N...x08.8 F..8.8 F.Ox/.Ox0.U.N.O.x0..z.xO.x8.8 F..x/.Ox0.UN.OZ.OV.Oy/.O/.O/.O/O/O/NO/.OUN./N...x08.8 F..8.8 F.Ox/.Ox0.U.N.O.x0..z.xO.x8.8 F..x/.Ox0.U.OD.OD.Oy/N.O\O/./N. .8 .8 .8 .8 / .Ox/.Ox0.V.OyOO0.\..Ox/.O0.O.x/./N. .8 / .Ox/.Oy0.../.OW..y/.O.x/N. .8 .8 .8 .8 / .Ox/.Oy0N.OVOO/./N.!.8 .8 .8 .8 /!.Ox/.Ox0.V.OyO0.\..Ox/.O0.O.x/./N.!.8 /!.Ox/.Oy0.../.OW..y/.O.x/N.!.8 .8 .8 .8 /!.Ox/.Oy0.!.À0"£/#..y/N..OVN.%/!OO/.%/!./N.8.#¡0$.$¢.8.#¡0$.$¢.8.#¡0$.$¢.8.#¡0$.$¢.!    /!.Ox/.Ox0.V.OyO0Z..Ox/.O0.O.x/./N.8.#¡0$.$¢.! /!.Ox/.Oy0.../.OW..y/.O.x/N.8.#¡0$.$¢.8.#¡0$.$¢.8.#¡0$.$¢.8.#¡0$.$¢.!    /!.Ox/.Oy0.!."QÍ £/"N.OZNO/.%/ . É/).O/.O/.Å/(.%/ O/./O/N.).8É¯/'..x8É/&. ...).(±Ä.#.".0!k..D..!F./.!. / .'.&®/)..x/..x0.VN.OZ...z0x/..y0O.OX)/.%/!....V)/N.O\.O.x/O/N.!.8 .8 .8 .8 /!.Ox/.Ox0.V.OyOO0.\..Ox/.O0..xO.x/./N.!.8 /!.Ox/.Oy0.../.OW..y/..xO.x/N.!.8 .8 .8 .8 /!.Ox/.Oy0..Z.O.x/..xO.x/.Å/(.!É/)N.).8É¯/'.8É/&. ...).(±Ä.#.".0!k..D..!F.!. / .'.&®/).Ox/.Ox/.Ox0.U`;

export default class SynAudio {
  constructor(options = {}) {
    this._correlationSampleSize =
      options.correlationSampleSize > 0 ? options.correlationSampleSize : 11025;
    this._initialGranularity =
      options.initialGranularity > 0 ? options.initialGranularity : 16;

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

      // correlation sample size must not exceed the size of each audio clip
      this._getCorrelationSampleSize = (a, b) =>
        Math.min(
          a.samplesDecoded,
          b.samplesDecoded,
          this._correlationSampleSize
        );

      // initial granularity must not exceed the size of each audio clip
      this._getInitialGranularity = (a, b) =>
        Math.min(a.samplesDecoded, b.samplesDecoded, this._initialGranularity);

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

        const correlationSampleSize = this._getCorrelationSampleSize(a, b);
        const initialGranularity = this._getInitialGranularity(a, b);

        const memory = new WebAssembly.Memory({
          ["initial"]:
            ((a.samplesDecoded * a.channelData.length +
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

            correlate(
              aPtr,
              a.samplesDecoded,
              a.channelData.length,
              bPtr,
              b.samplesDecoded,
              b.channelData.length,
              correlationSampleSize,
              initialGranularity,
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
        const correlationSampleSize = this._getCorrelationSampleSize(a, b);
        const maxThreads = Math.ceil(
          a.samplesDecoded / correlationSampleSize / minProcessingRatio
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
              offset + aLength + correlationSampleSize
            );
            aSplit.channelData.push(cutChannel);
            aSplit.samplesDecoded = cutChannel.length;
          }

          offset += aLength - correlationSampleSize;
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

      // constructor

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
