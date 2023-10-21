/* Copyright 2022-2023 Ethan Halsall
    
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
import Worker from "@eshaz/web-worker";

// prettier-ignore
const simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]))

const wasmModule = new WeakMap();

/* WASM strings are embeded during the build */
const simdWasm = String.raw`dynEncode01658cce3922eÆØÒfeeefsfÅoääääääääääegtfhÊÓÛkÒÊÒÔ×Þgeghgfekmfäe¦åíiplgnÈÔ××ÊÑÆÙÊeepÄÄÍÊÆÕÄÇÆØÊheofivälànâiá©eeeeeeeeg¥g¥g¦g­reg¦fÐ|f¦v³i¥f¦uÐz¦efÐ}ef¦gÙxÏ~e¦¥Ðuth¥ffwÑvÏ{tpuo¦eqh¥eqg¦gÙÏqqbeeeegvÏ¦gÙÏbeeebIfbpeeeg¦i×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeeeg¦m×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeeeg¦q×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeepr¦¥Ðpos¦¥Ðog¦uÏqz­repg¥fq±reg¥fqÐo¦i®reeqvÏ¦gÙÏ~®iäeq¦gÙÏe{¦gÙÏ®j¦epreo¦áÖ{¦iÐp¦gÛ¦fÏ¦fÖg¥pªi¥¦egqfpzgÐ¦áÖ¦iÐ¦gÛ¦fÏ¦cdddlÖp¦egh¥srbegesbegebIfbpgesrbegusbegubIfbpgur¦Ïrs¦Ïsg¦mÏgp¦gÐpreppi¥egqÏg¦gÙÏpegvÏ¦gÙÏbegepbegebIfbpgepo{«rffq{ÏqÐopq¦äØgo¦fÖiäeq¦gÙÏoeqvÏ¦gÙÏgeoge÷geq¦fÏjqpqg}«refqÐpyq¦gÙoÏregh¥goÏqgrÏsgeqge÷geqsgiqgi÷gig¦mÏgp¦gÐpreppxyÏytxÏtw¦fÏw|¬repqfpf¦e±re¦efÐtf¦fÖuef¦gÙvÏwf¦i®yf¦áÖo¦q«zh¥frÑs¦egg¥g¥yreeefsÏ¦gÙÏ®wes¦gÙÏq°ÖreeqbegeebegebIfbpgeg¥o¦i«reeqbeguebegubIfbpguo¦m«reeqbegebegbIfbpgzreeqbegebegbIfbpgpfog«rfpg¦äØquiäeg¦gÙÏxegsÏ¦gÙÏgexge÷geg¦f×jgpgqt«refgÐqpg¦gÙxÏ{egh¥gxÏsg{Ï}gesge÷ges}gisgi÷gig¦mÏgq¦gÐqrepppvÏpr¦fÏr|¬reppg¥j¦g­rej¦fÐvi¦v³i¥i¦uÐ|¦ey¦eiÐ{hi¦gÙzÏ}h¦¥Ðjt¦ewh¥iiwÑuÏxtpjo¦eqh¥hqg¦gÙÏqqbeeehguÏ¦gÙÏbeeebIfbpeehg¦i×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeehg¦m×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeehg¦q×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeepr¦¥Ðpos¦¥Ðog¦uÏq|­repg¥iq±reg¥iqÐo¦i®rehquÏ¦gÙÏ}®iähq¦gÙÏhx¦gÙÏ®j¦epreo¦áÖx¦iÐp¦gÛ¦fÏ¦fÖ~g¥pªi¥¦egqfp|gÐ¦áÖ¦iÐ¦gÛ¦fÏ¦cdddlÖp¦egh¥srbegesbegebIfbpgesrbegusbegubIfbpgur¦Ïrs¦Ïsg¦mÏgp¦gÐprepp~i¥hgqÏg¦gÙÏphguÏ¦gÙÏbegepbegebIfbpgepox«rfiqxÏqÐopq¦äØgo¦fÖiähq¦gÙÏohquÏ¦gÙÏgeoge÷geq¦fÏjqpqg{«reiqÐpyq¦gÙoÏrhgh¥goÏqgrÏsgeqge÷geqsgiqgi÷gig¦mÏgp¦gÐpreppyzÏytzÏtw¦fÏwv¬repqfpi¦e±re¦ep¦eiÐsi¦fÖthi¦gÙuÏwi¦i®yi¦áÖj¦q«|¦erh¥irÑo¦egg¥g¥yrehhioÏ¦gÙÏ®who¦gÙÏq°ÖrehqbegehbegebIfbpgeg¥j¦i«rehqbeguhbegubIfbpguj¦m«rehqbeghbegbIfbpg|rehqbeghbegbIfbpgpjgi«rfpg¦äØqtiähg¦gÙÏzhgoÏ¦gÙÏgezge÷geg¦f×jgpgqs«reigÐqpg¦gÙzÏxhgh¥gzÏogxÏ{geoge÷geo{giogi÷gig¦mÏgq¦gÐqrepppuÏpr¦fÏrv¬repp¦ein¦egem¦egeg¥k¦e¯i¥k¦hÖjg¥k¦fÐi¦h®i¥¦eoqfpegk¦áÖoqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppji¥eo¦gÙÏgjqh¥gge g¦iÏgq¦fÐqreppg¥i¦h®i¥¦eoqfphgk¦áÖoqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppji¥ho¦gÙÏgh¥gge g¦iÏgj¦fÐjreppk¦uÐskk¦v­i¥¦ei¦eqqgpbx¦ejhgh¥gbeeebJfbKfbIfgbeeubJfbKfbIfgbeebJfbKfbIfgbeebJfbKfbIfg¦¥Ðgj¦uÏjs­repi¦ÕÖq¦fiqfpk¦uÐsk¦eqpbhbgbebf÷÷÷g¥kq±req¦äØkÏpk¦hÖoiähq¦gÙÏgojh¥ggeøù÷g¦iÏgj¦fÐjrepoq×jqpqp¦h®rekqÐjhq¦gÙÏgh¥ggqøùggmøùggiøùggeøù÷÷÷÷g¦uÏgj¦iÐjrepp¦ejii¥bxhgh¥ggbeeebJfbpeeggbeeubJfbpeuggbeebJfbpeggbeebJfbpeg¦¥Ðgj¦uÏjs­reppk¨eeå$÷úfkÐtg¥jk³rekkjÐf¦h°iäf¦áÖr¦iÐg¦gÛ¦fÏo¦hÖqbx¦epg¦q´i¥o¦adddlÖohj¦gÙÏgh¥ggbegebJfbpgeggbegubJfbpguggbegbJfbpgggbegbJfbpgg¦¥Ðgp¦uÏpo¦iÐoreppqi¥hjpÏ¦gÙÏgh¥ggbegebJfbpgeg¦uÏgq¦fÐqreppfr«rfjrÏjjpjÐqhj¦gÙÏgh¥gggeøgeg¦iÏgq¦fÐqreppöt¦e¯i¥l¦gÙu¦er¦ekÐvk¦fÖwk¦fÐ¦ÕÖq eoh¥er¦gÙÏygeekrÏ¦gÙÏ|gäiªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eg¦epbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥goÏfbeeebJfghÏjbeeebKfbIffbeeubJfjbeeubKfbIffbeebJfjbeebKfbIffbeebJfjbeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgp¦uÏps­repqpf|gebhbgbebf÷÷÷bhbgbebf÷÷÷g¥fk³ref¦äØgwiäyf¦gÙjÏgeøhjÏgeù÷ù÷f¦f×jfpfgv«ref¦gÙgkfÐjh¥goÏfgiøghÏpgiùfgeøpgeù÷÷ùù÷÷g¦mÏgj¦gÐjreppú ú mgeÃi¥nrgemgep  ouÏolrÏrt­reppg¥l¦f±rengefllÑgÏjtjt­t¦epfgÐf¦ef¦e¯rg¥k¦e±i¥qfpk¦hÖjg¥k¦fÐ¦h®i¥qfper¦gÙÏgk¦áÖpqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppjªreeprÏ¦gÙÏgh¥gge g¦iÏgj¦fÐjrepprt³re¦ekÐpk¦fÖuer¦gÙÏok¦fÐ¦ÕÖl h¥er¦gÙÏvgeekrÏ¦gÙÏwgäiªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eqoghjbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥gbeeebJfjbeeebKfbIfgbeeubJfjbeeubKfbIfgbeebJfjbeebKfbIfgbeebJfjbeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgj¦¥Ðjq¦uÏqs­replpfwgebhbgbebf÷÷÷bhbgbebf÷÷÷g¥fk³ref¦äØguiävf¦gÙjÏgeøhjÏgeù÷ù÷f¦f×jfpfgp«ref¦gÙgkfÐjh¥goÏfgiøghÏqgiùfgeøqgeù÷÷ùù÷÷g¦mÏgj¦gÐjreppú ú mgeÃi¥nrgemgep  o¦iÏor¦fÏrt¬reppppetÙÆ×ÌÊÙÄËÊÆÙÚ×ÊØflØÎÒÉ`;
const scalarWasm = String.raw`dynEncode010e15d7b662o{+nnns|{s{}O)q}szosmmvso~mpos  ÚN.OV.Oy/.O\N.Oy/.O/.O/N./O/N...x08.8 F..8.8 F..8.8 F..8.8 F.Ox/.Ox/.Ox/..VN..Oy0Z....x8.8 F../..T..y/..O0x/./N..x0..x08.8 F..8.8 F.Ox/.Oy0..x/..Ox0U.OZ.O/.8/.OT/.OT/./N..8. 0FN...8.8 F.OT..8.8 F...8.8 F..x/.Oy0N.0OVO.Oy/N..x08.¡0..x08¢.8.¡0.8¢.8.¡0.8¢.8.¡0.8¢.    /..¢..¢..¢..¢.    /.Ox/.Ox0.V.OyO0.\.O/.O..O0x8.¡0..x8¢. /..¢. /.O./O.y.T..y/..O0x/..x/N.8.¡0.¢.8.¡0.¢.  /..8¢..8¢.  /.Ox/.Ox/.Oy0..ÀQÍ 0£É..£É­.É°±ÄÊR/$N.......OD.ODN.OXN.O/.Oy0O]N./.O0/N. .8É®.8É®.8É®.8É®/ .Ox/.Oy0.N.O.x/./N. .8É®/ .Ox/.Oy0N.OWNO/./.O0/N.!.8É®.8É®.8É®.8É®/!.Ox/.Oy0.N.O.x/N.!.8É®/!.Ox/.Oy0.Oy/.À/.OVNO/O/.!Ä.£/O/./N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Ox0.V.O/O/.Oy/.À/O/.!.Å0!±Ä/N..\..Ox/.O0.O.x/./N.8.¡0.¢. /.Ox/.Oy0.../.OW..y/.O.x/N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Oy0O/.N./N..8.¡F..8.¡F..8.¡F..8.¡F.Ox/.Ox0.V..QÍ £/..y/N..\..Ox/..yO0N.O.x/N..8.¡F.Ox/.Ox/.Oy0.OW..y/.O.x/N..8.¡F..8.¡F..8.¡F..8.¡F.Ox/.Oy0./N.OZNO/.O/.O/O/./O/N. .8É¯/"..x8É/#.8/... .!±Ä..0.l..D..F../.".#®/ ..x/..x0.VN.OZ...z0x0...V)/O/..y0O.OX)/N.OZN.$/ .O/N.OyOWN.$/ .O.x/.$/ .O0/N. .8É®.8É®.8É®.8É®/ .Ox/.Oy0.S..xO.x/N. .8É®/ .Ox/.Oy0..\.O.x/..xO.x/N. .8É¯/".8É/#.8/... .!±Ä..0.lN..D..F.".#®/ .Ox/.Ox/.Ox0.U`;

export default class SynAudio {
  constructor(options = {}) {
    this._correlationSampleSize =
      options.correlationSampleSize > 0 ? options.correlationSampleSize : 11025;
    this._initialGranularity =
      options.initialGranularity > 0 ? options.initialGranularity : 16;
    this._correlationThreshold =
      options.correlationThreshold >= 0 ? options.correlationThreshold : 0.5;

    this._module = wasmModule.get(SynAudio);

    if (!this._module) {
      this._module = simd().then((simdSupported) =>
        simdSupported
          ? WebAssembly.compile(decode(simdWasm))
          : WebAssembly.compile(decode(scalarWasm)),
      );
      wasmModule.set(this._module);
    }

    this.SynAudioWorker = function SynAudioWorker(
      module,
      correlationSampleSize,
      initialGranularity,
    ) {
      this._sourceCache = new Map();

      // correlation sample size must not exceed the size of each audio clip
      this._getCorrelationSampleSize = (a, b) =>
        Math.min(
          a.samplesDecoded,
          b.samplesDecoded,
          this._correlationSampleSize,
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
          let type = "text/javascript",
            isNode,
            webworkerSourceCode =
              "'use strict';" +
              `(${((
                SynAudioWorker,
                functionName,
                correlationSampleSize,
                initialGranularity,
              ) => {
                self.onmessage = (msg) => {
                  const worker = new SynAudioWorker(
                    Promise.resolve(msg.data.module),
                    correlationSampleSize,
                    initialGranularity,
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

          try {
            isNode = typeof process.versions.node !== "undefined";
          } catch {}

          source = isNode
            ? `data:${type};base64,${Buffer.from(webworkerSourceCode).toString(
                "base64",
              )}`
            : URL.createObjectURL(new Blob([webworkerSourceCode], { type }));

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
            }),
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
              aPtr,
            );
            const bestCorrelationPtr = this._setAudioDataOnHeap(
              b.channelData,
              dataArray,
              bPtr,
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
              bestSampleOffsetPtr,
            );

            const bestCorrelation = heapView.getFloat32(
              bestCorrelationPtr,
              true,
            );
            const bestSampleOffset = heapView.getInt32(
              bestSampleOffsetPtr,
              true,
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

        // initial granularity  low -> high, more -> less threads
        // correlation sample   low -> high, less -> more threads
        // file size            low -> high, less -> more threads

        const correlationSampleSize = this._getCorrelationSampleSize(a, b);

        // rough estimate for a good max thread count for performance
        const maxThreads =
          (Math.log(a.samplesDecoded * correlationSampleSize) /
            Math.log(this._initialGranularity + 1)) *
          Math.log(correlationSampleSize / 10000 + 1);

        threads = Math.max(
          Math.round(
            Math.min(
              threads,
              maxThreads,
              a.samplesDecoded / correlationSampleSize / 4,
            ),
          ),
          1,
        );

        const aLength = Math.ceil(a.samplesDecoded / threads);

        let offset = 0;
        for (let t = 0; t < threads; t++) {
          const aSplit = {
            channelData: [],
          };

          for (let i = 0; i < a.channelData.length; i++) {
            const cutChannel = a.channelData[i].subarray(
              offset,
              offset + aLength + correlationSampleSize,
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
      this._initialGranularity,
    );
  }

  async syncWorkerConcurrent(a, b, threads) {
    return this._instance._syncWorkerConcurrentMain(
      a,
      b,
      threads >= 1 ? threads : 1,
    );
  }

  async syncWorker(a, b) {
    return this._instance._syncWorker(a, b);
  }

  async sync(a, b) {
    return this._instance._sync(a, b);
  }

  async syncMultiple(clips, threads) {
    threads = threads >= 1 ? threads : 8;

    const workers = [];
    const graph = [];

    let notify = () => {},
      wait = Promise.resolve(),
      runningThreads = 0;

    const resetNotify = () => {
      wait = new Promise((resolve) => {
        notify = resolve;
      });
    };

    for (let i = 0; i < clips.length; i++) graph.push({ vertex: {} });

    for (let v = 0; v < clips.length; v++) {
      const vertexClip = clips[v];
      const vertex = graph[v].vertex;

      vertex.name = vertexClip.name;
      vertex.samplesDecoded = vertexClip.data.samplesDecoded;
      vertex.edges = new Set();

      for (let e = 0; e < clips.length; e++) {
        if (v === e) continue;

        const edgeClip = clips[e];
        const edge = graph[e];

        runningThreads++;
        workers.push(
          this.syncWorker(vertexClip.data, edgeClip.data).then(
            (correlationResult) => {
              if (correlationResult.correlation > this._correlationThreshold) {
                vertex.edges.add({
                  parent: vertex,
                  vertex: edge.vertex,
                  samplesDecoded: edgeClip.data.samplesDecoded,
                  ...correlationResult,
                });
              }
              runningThreads--;
              notify();
            },
          ),
        );

        if (runningThreads >= threads) {
          resetNotify();
          await wait;
        }
      }
    }

    await Promise.all(workers);

    // prettier-ignore
    const weighResults = (a, b) => {
      if (a.parent && b.parent && a.parent.samplesDecoded !== b.parent.samplesDecoded) return a.parent.samplesDecoded > b.parent.samplesDecoded;
      if (a.correlation !== b.correlation) return a.correlation > b.correlation;
      if (a.sampleOffset !== b.sampleOffset) return a.sampleOffset > b.sampleOffset;
      return a.vertex && b.vertex && a.vertex.name.localeCompare(b.vertex.name) < 0;
    };

    // detect cycles and weigh for which edge to remove
    const path = new Map();
    const cycles = new Set();

    const detectCycle = (vertex) => {
      for (const edge of vertex.edges.values()) {
        if (path.has(vertex)) return path.get(vertex);

        path.set(vertex, edge);

        const cycleStartEdge = detectCycle(edge.vertex);
        const cycleEndEdge = edge;

        if (cycleStartEdge) {
          let keep, remove;
          if (weighResults(cycleStartEdge, cycleEndEdge)) {
            keep = cycleStartEdge;
            remove = cycleEndEdge;
          } else {
            keep = cycleEndEdge;
            remove = cycleStartEdge;
          }

          if (!remove.cycleWith) {
            remove.cycleWith = new Set();
            cycles.add(remove);
          }

          remove.cycleWith.add(keep);

          if (keep.cycleWith) {
            keep.cycleWith.delete(remove);
          }
        }

        path.delete(vertex);
      }
    };

    for (const { vertex } of graph) detectCycle(vertex);

    // delete any cycles
    for (const edge of cycles)
      if (edge.cycleWith.size) edge.parent.edges.delete(edge);

    // find the root elements
    const roots = new Set();
    for (const v of graph) roots.add(v.vertex);
    for (const v of graph)
      for (const edge of v.vertex.edges) roots.delete(edge.vertex);

    // build a unique sequence of matches for each root
    const traverseRoot = (path, root, edges, sampleOffsetFromRoot = 0) => {
      for (const edge of edges) {
        if (
          !(path.has(edge.vertex) && weighResults(path.get(edge.vertex), edge))
        )
          path.set(edge.vertex, {
            name: edge.vertex.name,
            correlation: edge.correlation,
            sampleOffset: sampleOffsetFromRoot + edge.sampleOffset,
          });

        traverseRoot(
          path,
          root,
          edge.vertex.edges,
          sampleOffsetFromRoot + edge.sampleOffset,
        );
      }
    };

    const results = [];

    for (const root of roots) {
      const path = new Map();
      path.set(root, {
        name: root.name,
        sampleOffset: 0,
      });
      traverseRoot(path, root, root.edges);

      results.push(
        [...path.values()].sort(
          (a, b) =>
            a.sampleOffset - b.sampleOffset ||
            (a.correlation || 0) - (b.correlation || 0) ||
            b.name.localeCompare(a.name),
        ),
      );
    }

    return results;
  }
}
