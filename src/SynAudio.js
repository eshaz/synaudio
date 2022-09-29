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
const simdWasm = String.raw`dynEncode0065eÆØÒfeeefsfÅoääääääääääegtfhÊÓÛkÒÊÒÔ×Þgeghgfekmfäe¦åíiplgnÈÔ××ÊÑÆÙÊeepÄÄÍÊÆÕÄÇÆØÊheofivälànâiá©eeeeeeeeg¥g¥g¦g­reg¦fÐ|f¦v³i¥f¦uÐz¦efÐ}ef¦gÙxÏ~e¦¥Ðuth¥ffwÑvÏ{tpuo¦eqh¥eqg¦gÙÏqqbeeeegvÏ¦gÙÏbeeebIfbpeeeg¦i×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeeeg¦m×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeeeg¦q×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeepr¦¥Ðpos¦¥Ðog¦uÏqz­repg¥fq±reg¥fqÐo¦i®reeqvÏ¦gÙÏ~®iäeq¦gÙÏe{¦gÙÏ®j¦epreo¦áÖ{¦iÐp¦gÛ¦fÏ¦fÖg¥pªi¥¦egqfpzgÐ¦áÖ¦iÐ¦gÛ¦fÏ¦cdddlÖp¦egh¥srbegesbegebIfbpgesrbegusbegubIfbpgur¦Ïrs¦Ïsg¦mÏgp¦gÐpreppi¥egqÏg¦gÙÏpegvÏ¦gÙÏbegepbegebIfbpgepo{«rffq{ÏqÐopq¦äØgo¦fÖiäeq¦gÙÏoeqvÏ¦gÙÏgeoge÷geq¦fÏjqpqg}«refqÐpyq¦gÙoÏregh¥goÏqgrÏsgeqge÷geqsgiqgi÷gig¦mÏgp¦gÐpreppxyÏytxÏtw¦fÏw|¬repqfpf¦e±re¦efÐtf¦fÖuef¦gÙvÏwf¦i®yf¦áÖo¦q«zh¥frÑs¦egg¥g¥yreeefsÏ¦gÙÏ®wes¦gÙÏq°ÖreeqbegeebegebIfbpgeg¥o¦i«reeqbeguebegubIfbpguo¦m«reeqbegebegbIfbpgzreeqbegebegbIfbpgpfog«rfpg¦äØquiäeg¦gÙÏxegsÏ¦gÙÏgexge÷geg¦f×jgpgqt«refgÐqpg¦gÙxÏ{egh¥gxÏsg{Ï}gesge÷ges}gisgi÷gig¦mÏgq¦gÐqrepppvÏpr¦fÏr|¬reppg¥j¦g­rej¦fÐvi¦v³i¥i¦uÐ|¦ey¦eiÐ{hi¦gÙzÏ}h¦¥Ðjt¦ewh¥iiwÑuÏxtpjo¦eqh¥hqg¦gÙÏqqbeeehguÏ¦gÙÏbeeebIfbpeehg¦i×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeehg¦m×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeehg¦q×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeepr¦¥Ðpos¦¥Ðog¦uÏq|­repg¥iq±reg¥iqÐo¦i®rehquÏ¦gÙÏ}®iähq¦gÙÏhx¦gÙÏ®j¦epreo¦áÖx¦iÐp¦gÛ¦fÏ¦fÖ~g¥pªi¥¦egqfp|gÐ¦áÖ¦iÐ¦gÛ¦fÏ¦cdddlÖp¦egh¥srbegesbegebIfbpgesrbegusbegubIfbpgur¦Ïrs¦Ïsg¦mÏgp¦gÐprepp~i¥hgqÏg¦gÙÏphguÏ¦gÙÏbegepbegebIfbpgepox«rfiqxÏqÐopq¦äØgo¦fÖiähq¦gÙÏohquÏ¦gÙÏgeoge÷geq¦fÏjqpqg{«reiqÐpyq¦gÙoÏrhgh¥goÏqgrÏsgeqge÷geqsgiqgi÷gig¦mÏgp¦gÐpreppyzÏytzÏtw¦fÏwv¬repqfpi¦e±re¦ep¦eiÐsi¦fÖthi¦gÙuÏwi¦i®yi¦áÖj¦q«|¦erh¥irÑo¦egg¥g¥yrehhioÏ¦gÙÏ®who¦gÙÏq°ÖrehqbegehbegebIfbpgeg¥j¦i«rehqbeguhbegubIfbpguj¦m«rehqbeghbegbIfbpg|rehqbeghbegbIfbpgpjgi«rfpg¦äØqtiähg¦gÙÏzhgoÏ¦gÙÏgezge÷geg¦f×jgpgqs«reigÐqpg¦gÙzÏxhgh¥gzÏogxÏ{geoge÷geo{giogi÷gig¦mÏgq¦gÐqrepppuÏpr¦fÏrv¬repp¦ein¦egem¦egeg¥k¦e¯i¥k¦hÖjg¥k¦fÐi¦h®i¥¦eoqfpegk¦áÖoqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppji¥eo¦gÙÏgjqh¥gge g¦iÏgq¦fÐqreppg¥i¦h®i¥¦eoqfphgk¦áÖoqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppji¥ho¦gÙÏgh¥gge g¦iÏgj¦fÐjreppk¦uÐskk¦v­i¥¦ei¦eqqgpbx¦ejhgh¥gbeeebJfbKfbIfgbeeubJfbKfbIfgbeebJfbKfbIfgbeebJfbKfbIfg¦¥Ðgj¦uÏjs­repi¦ÕÖq¦fiqfpk¦uÐsk¦eqpbhbgbebf÷÷÷g¥kq±req¦äØkÏpk¦hÖoiähq¦gÙÏgojh¥ggeøù÷g¦iÏgj¦fÐjrepoq×jqpqp¦h®rekqÐjhq¦gÙÏgh¥ggqøùggmøùggiøùggeøù÷÷÷÷g¦uÏgj¦iÐjrepp¦ejii¥bxhgh¥ggbeeebJfbpeeggbeeubJfbpeuggbeebJfbpeggbeebJfbpeg¦¥Ðgj¦uÏjs­reppk¨eeå$÷úfkÐtg¥jk³rekkjÐf¦h°iäf¦áÖr¦iÐg¦gÛ¦fÏo¦hÖqbx¦epg¦q´i¥o¦adddlÖohj¦gÙÏgh¥ggbegebJfbpgeggbegubJfbpguggbegbJfbpgggbegbJfbpgg¦¥Ðgp¦uÏpo¦iÐoreppqi¥hjpÏ¦gÙÏgh¥ggbegebJfbpgeg¦uÏgq¦fÐqreppfr«rfjrÏjjpjÐqhj¦gÙÏgh¥gggeøgeg¦iÏgq¦fÐqreppöt¦e¯i¥l¦gÙu¦er¦ekÐvk¦fÖwk¦fÐ¦ÕÖq eoh¥er¦gÙÏygeekrÏ¦gÙÏ|gäiªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eg¦epbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥goÏfbeeebJfghÏjbeeebKfbIffbeeubJfjbeeubKfbIffbeebJfjbeebKfbIffbeebJfjbeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgp¦uÏps­repqpf|gebhbgbebf÷÷÷bhbgbebf÷÷÷g¥fk³ref¦äØgwiäyf¦gÙjÏgeøhjÏgeù÷ù÷f¦f×jfpfgv«ref¦gÙgkfÐjh¥goÏfgiøghÏpgiùfgeøpgeù÷÷ùù÷÷g¦mÏgj¦gÐjreppú ú mgeÃi¥nrgemgep  ouÏolrÏrt­reppg¥l¦f±rengefllÑgÏjtjt­t¦epfgÐf¦ef¦e¯rg¥k¦e±i¥qfpk¦hÖjg¥k¦fÐ¦h®i¥qfper¦gÙÏgk¦áÖpqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppjªreeprÏ¦gÙÏgh¥gge g¦iÏgj¦fÐjrepprt³re¦ekÐpk¦fÖuer¦gÙÏok¦fÐ¦ÕÖl h¥er¦gÙÏvgeekrÏ¦gÙÏwgäiªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eqoghjbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥gbeeebJfjbeeebKfbIfgbeeubJfjbeeubKfbIfgbeebJfjbeebKfbIfgbeebJfjbeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgj¦¥Ðjq¦uÏqs­replpfwgebhbgbebf÷÷÷bhbgbebf÷÷÷g¥fk³ref¦äØguiävf¦gÙjÏgeøhjÏgeù÷ù÷f¦f×jfpfgp«ref¦gÙgkfÐjh¥goÏfgiøghÏqgiùfgeøqgeù÷÷ùù÷÷g¦mÏgj¦gÐjreppú ú mgeÃi¥nrgemgep  o¦iÏor¦fÏrt¬reppppetÙÆ×ÌÊÙÄËÊÆÙÚ×ÊØflØÎÒÉ`;
const scalarWasm = String.raw`dynEncode000eo{+nnns|{s{}O)q}szosmmvso~mpos  ÚN.OV.Oy/.O\N.Oy/.O/.O/N./O/N...x08.8 F..8.8 F..8.8 F..8.8 F.Ox/.Ox/.Ox/..VN..Oy0Z....x8.8 F../..T..y/..O0x/./N..x0..x08.8 F..8.8 F.Ox/.Oy0..x/..Ox0U.OZ.O/.8/.OT/.OT/./N..8. 0FN...8.8 F.OT..8.8 F...8.8 F..x/.Oy0N.0OVO.Oy/N..x08.¡0..x08¢.8.¡0.8¢.8.¡0.8¢.8.¡0.8¢.    /..¢..¢..¢..¢.    /.Ox/.Ox0.V.OyO0.\.O/.O..O0x8.¡0..x8¢. /..¢. /.O./O.y.T..y/..O0x/..x/N.8.¡0.¢.8.¡0.¢.  /..8¢..8¢.  /.Ox/.Ox/.Oy0..ÀQÍ 0£É..£É­.É°±ÄÊR/$N.......OD.ODN.OXN.O/.Oy0O]N./.O0/N. .8É®.8É®.8É®.8É®/ .Ox/.Oy0.N.O.x/./N. .8É®/ .Ox/.Oy0N.OWNO/./.O0/N.!.8É®.8É®.8É®.8É®/!.Ox/.Oy0.N.O.x/N.!.8É®/!.Ox/.Oy0.Oy/.À/.OVNO/O/.!Ä.£/O/./N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Ox0.V.O/O/.Oy/.À/O/.!.Å0!±Ä/N..\..Ox/.O0.O.x/./N.8.¡0.¢. /.Ox/.Oy0.../.OW..y/.O.x/N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Oy0O/.N./N..8.¡F..8.¡F..8.¡F..8.¡F.Ox/.Ox0.V..QÍ £/..y/N..\..Ox/..yO0N.O.x/N..8.¡F.Ox/.Ox/.Oy0.OW..y/.O.x/N..8.¡F..8.¡F..8.¡F..8.¡F.Ox/.Oy0./N.OZNO/.O/.O/O/./O/N. .8É¯/"..x8É/#.8/... .!±Ä..0.l..D..F../.".#®/ ..x/..x0.VN.OZ...z0x0...V)/O/..y0O.OX)/N.OZN.$/ .O/N.OyOWN.$/ .O.x/.$/ .O0/N. .8É®.8É®.8É®.8É®/ .Ox/.Oy0.S..xO.x/N. .8É®/ .Ox/.Oy0..\.O.x/..xO.x/N. .8É¯/".8É/#.8/... .!±Ä..0.lN..D..F.".#®/ .Ox/.Ox/.Ox0.U`;

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
        const minProcessingRatio = 4 / 1; // unique date / overlap
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

  async syncMultiple(clips) {
    // clips {"name of clip": Float32Array[]}

    const correlationThreshold = 0.5;

    const workers = [];
    const byBaseAndComparison = {};

    for (const [base, baseData] of Object.entries(clips)) {
      byBaseAndComparison[base] = {};

      for (const [comp, compData] of Object.entries(clips)) {
        if (base === comp) continue; // prevent reflective reduction

        workers.push(
          this.syncWorker(baseData, compData).then((correlationResult) => {
            if (correlationResult.correlation > correlationThreshold) {
              byBaseAndComparison[base][comp] = {
                baseSamplesDecoded: baseData.samplesDecoded,
                compSamplesDecoded: compData.samplesDecoded,
                ...correlationResult,
              };
            }
          })
        );
      }
    }

    await Promise.all(workers);

    // detect and remove cycles
    const path = new Map();
    const visited = new Set();
    const cycles = [];

    const traverseCycle = (base) => {
      for (const comp of Object.keys(byBaseAndComparison[base])) {
        if (path.has(base + comp)) return true;

        if (!visited.has(base + comp)) {
          visited.add(base + comp);

          path.set(base + comp, [base, comp]);

          const cycleDetected = traverseCycle(comp);

          if (cycleDetected) {
            const fullPath = [...path.values()];
            const cycle = fullPath.slice(
              fullPath.findIndex((val) => val[0] === comp)
            );

            const baseStart = cycle[0][0];
            const compStart = cycle[0][1];

            const start = byBaseAndComparison[baseStart][compStart];
            const end = byBaseAndComparison[base][comp];

            // weighting
            if (
              start.correlation < end.correlation ||
              start.baseSamplesDecoded < end.baseSamplesDecoded ||
              start.sampleOffset < end.sampleOffset
            ) {
              delete byBaseAndComparison[baseStart][compStart];
            } else {
              delete byBaseAndComparison[base][comp];
            }

            cycles.push(cycle);
            /*
            if (start.cycles) start.cycles.push(cycle);
            else start.cycle = [cycle];

            if (end.cycles) end.cycles.push(cycle);
            else end.cycle = [cycle];
*/
          }

          path.delete(base + comp);
        }
      }
    };

    for (const [base, comps] of Object.entries(byBaseAndComparison)) {
      traverseCycle(base);
    }

    // connect gaps (correlation that is shared among a common base)

    //console.log(JSON.stringify(byBaseAndComparison, null, 2));
    //console.log(cycles);

    // transitive reduction
    // https://stackoverflow.com/questions/1690953/transitive-reduction-algorithm-pseudocode
    // Harry Hsu. "An algorithm for finding a minimal equivalent graph of a digraph.", Journal of the ACM, 22(1):11-16, January 1975.
    for (const [base, comps] of Object.entries(byBaseAndComparison))
      for (const [comp] of Object.entries(comps))
        if (byBaseAndComparison[comp][base])
          for (const [nextBase] of Object.entries(byBaseAndComparison))
            if (
              byBaseAndComparison[comp][nextBase] &&
              byBaseAndComparison[base][nextBase]
            ) {
              const left = byBaseAndComparison[comp][nextBase];
              const right = byBaseAndComparison[base][nextBase];

              // weighting
              if (
                left.correlation < right.correlation ||
                left.baseSamplesDecoded < right.baseSamplesDecoded ||
                left.sampleOffset < right.sampleOffset
              ) {
                delete byBaseAndComparison[comp][nextBase];
              } else {
                delete byBaseAndComparison[base][nextBase];
              }
            }

    // traverse and collapse the graph into 2D
    /*const visitedNodes = new Set();
    const results = {};
    const list = {};

    const traverseList = (root, base, sampleOffsetFromRoot = 0) => {
      Object.entries(byBaseAndComparison[base]).forEach(([comp, result]) => {
        if (!visitedNodes.has(base + comp) && base !== comp) {
          const match = {
            name: base,
            correlation: result.correlation,
            sampleOffset: result.sampleOffset,
            sampleOffsetFromRoot: sampleOffsetFromRoot + result.sampleOffset,
          };

          if (!results[root][comp]) {
            results[root][comp] = {
              samplesDecoded: result.compSamplesDecoded,
              sampleOffset: sampleOffsetFromRoot + result.sampleOffset,
              //additionalMatches: [],
            };
          }

          if (root === base) {
            results[root][comp].correlation = match.correlation;
          } else {
            //results[root][comp].additionalMatches.push(match);
          }

          visitedNodes.add(base + comp);

          traverseList(root, comp, sampleOffsetFromRoot + result.sampleOffset);
        }
      });
    };

    for (const [base, comps] of Object.entries(byBaseAndComparison)) {
      list[base] = [];
      results[base] = {};

      traverseList(base, base);

      list[base] = list[base].sort(
        (a, b) =>
          a.sampleOffset - b.sampleOffset || b.samplesDecoded - a.samplesDecoded
      );

      if (list[base].length === 0) {
        delete list[base];
        //delete results[base];
      }
    }*/

    const nodes = new Map();
    const tempMark = new Set();
    const list = [];

    for (const [base, comps] of Object.entries(byBaseAndComparison))
      for (const comp of Object.keys(comps))
        nodes.set(base + comp, [base, comp]);

    const visit = ([base, comp]) => {
      if (!nodes.has(base + comp)) return;
      if (tempMark.has(base + comp)) {
        console.error("cycle detected!!!" + base + " " + comp);
        return;
      }

      tempMark.add(base + comp);

      for (const nextComp of Object.keys(byBaseAndComparison[comp]))
        visit([comp, nextComp]);

      tempMark.delete(base + comp);
      nodes.delete(base + comp);
      list.push({
        base,
        comp,
        ...byBaseAndComparison[base][comp],
      });
    };

    while (nodes.size) {
      visit(nodes.values().next().value);
    }

    list.reverse();

    const sorted = list.sort((a, b) => {
      if (a.base === b.base) return a.sampleOffset - b.sampleOffset;
      else return 0;
    });

    //console.log(JSON.stringify(byBaseAndComparison, null, 2));
    console.log(JSON.stringify(sorted, null, 2));
    //console.log(JSON.stringify(results, null, 2));
  }
}
