(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('web-worker')) :
  typeof define === 'function' && define.amd ? define(['web-worker'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SynAudio = factory(global.Worker));
})(this, (function (Worker) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Worker__default = /*#__PURE__*/_interopDefaultLegacy(Worker);

  const encode = (byteArray) => {
    const charArray = [];

    for (const byte of byteArray) {
      let encoded = (byte + 42) % 256;

      if (
        encoded === 0 || //  NULL
        encoded === 10 || // LF
        encoded === 13 || // CR
        encoded === 61 //    =
      ) {
        charArray.push("=" + String.fromCharCode((encoded + 64) % 256));
      } else {
        charArray.push(String.fromCharCode(encoded));
      }
    }

    return charArray.join("");
  };

  const decode = (string) => {
    const htmlCodeOverrides = new Map();
    [
      ,
      8364,
      ,
      8218,
      402,
      8222,
      8230,
      8224,
      8225,
      710,
      8240,
      352,
      8249,
      338,
      ,
      381,
      ,
      ,
      8216,
      8217,
      8220,
      8221,
      8226,
      8211,
      8212,
      732,
      8482,
      353,
      8250,
      339,
      ,
      382,
      376,
    ].forEach((k, v) => htmlCodeOverrides.set(k, v));

    const output = new Uint8Array(string.length);

    let escaped = false,
      byteIndex = 0,
      byte,
      offset = 42, // default yEnc offset
      startIdx = 0;

    if (string.length > 13 && string.substring(0, 9) === "dynEncode") {
      const version = parseInt(string.substring(9, 11), 16);
      if (version === 0) {
        offset = parseInt(string.substring(11, 13), 16);
        startIdx = 13;
      }
    }

    const offsetReverse = 256 - offset;

    for (let i = startIdx; i < string.length; i++) {
      byte = string.charCodeAt(i);

      if (byte === 61 && !escaped) {
        escaped = true;
        continue;
      }

      if (byte > 255) {
        const htmlOverride = htmlCodeOverrides.get(byte);
        if (htmlOverride) byte = htmlOverride + 127;
      }

      if (escaped) {
        escaped = false;
        byte -= 64;
      }

      output[byteIndex++] =
        byte < offset && byte > 0 ? byte + offsetReverse : byte - offset;
    }

    return output.subarray(0, byteIndex);
  };

  const dynamicEncode = (byteArray, stringWrapper = '"') => {
    let shouldEscape,
      offsetLength = Infinity,
      offset = 0;

    if (stringWrapper === '"')
      shouldEscape = (byte1) =>
        byte1 === 0 || //  NULL
        byte1 === 8 || //  BS
        byte1 === 9 || //  TAB
        byte1 === 10 || // LF
        byte1 === 11 || // VT
        byte1 === 12 || // FF
        byte1 === 13 || // CR
        byte1 === 34 || // "
        byte1 === 92 || // \
        byte1 === 61; //   =;

    if (stringWrapper === "'")
      shouldEscape = (byte1) =>
        byte1 === 0 || //  NULL
        byte1 === 8 || //  BS
        byte1 === 9 || //  TAB
        byte1 === 10 || // LF
        byte1 === 11 || // VT
        byte1 === 12 || // FF
        byte1 === 13 || // CR
        byte1 === 39 || // '
        byte1 === 92 || // \
        byte1 === 61; //   =;

    if (stringWrapper === "`")
      shouldEscape = (byte1, byte2) =>
        byte1 === 61 || // =
        byte1 === 13 || // CR
        byte1 === 96 || // `
        (byte1 === 36 && byte2 === 123); // ${

    // search for the byte offset with the least amount of escape characters
    for (let o = 0; o < 256; o++) {
      let length = 0;

      for (let i = 0; i < byteArray.length; i++) {
        const byte1 = (byteArray[i] + o) % 256 | 0;
        const byte2 = (byteArray[i + 1] + o) % 256 | 0;

        if (shouldEscape(byte1, byte2)) length++;
        length++;
      }

      if (length < offsetLength) {
        offsetLength = length;
        offset = o;
      }
    }

    const charArray = [
      "dynEncode", // magic signature
      "00", // version 0x00 - 0xfe (0xff reserved)
      offset.toString(16).padStart(2, "0"), // best offset in bytes 0x00 - 0xff
    ];

    for (let i = 0; i < byteArray.length; i++) {
      const byte1 = (byteArray[i] + offset) % 256;
      const byte2 = (byteArray[i + 1] + offset) % 256;

      if (shouldEscape(byte1, byte2)) {
        charArray.push("=", String.fromCharCode((byte1 + 64) % 256));
      } else {
        charArray.push(String.fromCharCode(byte1));
      }
    }

    return charArray.join("");
  };

  // allows embedded javascript string template
  const stringify = (rawString) =>
    rawString
      .replace(/[\\]/g, "\\\\")
      .replace(/[`]/g, "\\`")
      .replace(/\${/g, "\\${");

  var simpleYenc = {
    encode,
    dynamicEncode,
    decode,
    stringify,
  };

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

  // prettier-ignore
  const simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]));

  const wasmModule = new WeakMap();

  /* WASM strings are embeded during the build */
  const simdWasm = String.raw`dynEncode0065eÆØÒfeeefsfÅoääääääääääegtfhÊÓÛkÒÊÒÔ×Þgeghgfekmfäe¦åíiplgnÈÔ××ÊÑÆÙÊeepÄÄÍÊÆÕÄÇÆØÊheoHfEivälàlâiá©eeeeeeeeg¥g¥f¦e±reg¦g­reg¦fÐv¦efÐwf¦fÖxf¦áÖqef¦gÙyÏzf¦iÐ}¦gÛ¦fÏg¦cdddlÖsg¦fÖ~f¦i®{h¥fuÑt¦egg¥g¥{reeeftÏ¦gÙÏ®et¦gÙÏz®Öre¦ep}¦i´i¥soegh¥ggrÏ|begegbegebIfbpgeg|begugbegubIfbpgug¦Ïgp¦mÏpo¦gÐorepp~i¥ep¦gÙÏgeptÏ¦gÙÏbegegbegebIfbpgepfqg«rfpg¦äØoxiäeg¦gÙÏpegtÏ¦gÙÏgepge÷geg¦f×jgpgow«refgÐorg¦gÙtÏ|egh¥gtÏpg|Ïgepge÷gepgipgi÷gig¦mÏgo¦gÐoreppryÏru¦fÏuv¬reppg¥i¦e±rej¦g­rej¦fÐt¦er¦eiÐvi¦fÖwi¦áÖjhi¦gÙxÏyi¦iÐz¦gÛ¦fÏg¦cdddlÖqg¦fÖ}i¦i®~¦euh¥iuÑs¦egg¥g¥~rehhisÏ¦gÙÏ®hs¦gÙÏy®Öre¦epz¦i´i¥qohgh¥ggrÏ{begegbegebIfbpgeg{begugbegubIfbpgug¦Ïgp¦mÏpo¦gÐorepp}i¥hp¦gÙÏghpsÏ¦gÙÏbegegbegebIfbpgepjgi«rfpg¦äØowiähg¦gÙÏphgsÏ¦gÙÏgepge÷geg¦f×jgpgov«reigÐorg¦gÙsÏ{hgh¥gsÏpg{Ï|gepge÷gep|gipgi÷gig¦mÏgo¦gÐorepprxÏru¦fÏut¬repp¦ein¦egem¦egeg¥k¦e¯i¥k¦hÖpg¥k¦fÐi¦h®i¥¦ejqfpegk¦áÖjoh¥gge ggi ggm ggq g¦uÏgo¦iÐorepppi¥ej¦gÙÏgpoh¥gge g¦iÏgo¦fÐoreppg¥i¦h®i¥¦ejqfphgk¦áÖjoh¥gge ggi ggm ggq g¦uÏgo¦iÐorepppi¥hj¦gÙÏgh¥gge g¦iÏgp¦fÐpreppk¦uÐukk¦v­i¥¦ei¦eoqgpbx¦ephgh¥gbeeebJfbKfbIfgbeeubJfbKfbIfgbeebJfbKfbIfgbeebJfbKfbIfg¦¥Ðgp¦uÏpu­repi¦ÕÖo¦fiqfpk¦uÐuk¦eopbhbgbebf÷÷÷g¥ko±reo¦äØkÏrk¦hÖjiäho¦gÙÏgjph¥ggeøù÷g¦iÏgp¦fÐprepjo×jopor¦h®rekoÐpho¦gÙÏgh¥ggqøùggmøùggiøùggeøù÷÷÷÷g¦uÏgp¦iÐpreppfkÐtk¨eeå$÷úg¥k¦e±re¦erk¦i´i¥k¦áÖr¦iÐf¦gÛ¦fÏg¦hÖpbx¦eof¦q´i¥g¦adddlÖshgh¥ggbegebJfbpgeggbegubJfbpguggbegbJfbpgggbegbJfbpgg¦¥Ðgo¦uÏos¦iÐsrepppi¥ho¦gÙÏgh¥ggbegebJfbpgeg¦uÏgp¦fÐpreppkr«rfpkrÐphr¦gÙÏgh¥gggeøgeg¦iÏgp¦fÐpreppög¥t¦e±i¥¦efqfpl¦gÙv¦ef¦ekÐwk¦fÖxk¦fÐ¦ÕÖq ej¦erh¥er¦gÙÏygeekrÏ¦gÙÏzgäiªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eg¦esbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥gjÏobeeebJfghÏpbeeebKfbIfobeeubJfpbeeubKfbIfobeebJfpbeebKfbIfobeebJfpbeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgs¦uÏsu­repqpgzgebhbgbebf÷÷÷bhbgbebf÷÷÷g¥gk³reg¦äØpxiäyg¦gÙoÏgeøhoÏgeù÷÷g¦f×jgpopw«reo¦gÙgkoÐph¥gjÏogiøghÏsgiùogeøsgeù÷÷g¦mÏg÷÷p¦gÐpreppú ú mgeÃiänrgemgerjfpf  jvÏjlrÏrt­reppg¥l¦f±refllÑgÏjtjt­q¦esfgÐf¦ef¦e¯rg¥k¦e±i¥qfpk¦hÖpg¥k¦fÐ¦h®i¥qfper¦gÙÏgk¦áÖsoh¥gge ggi ggm ggq g¦uÏgo¦iÐorepppªreersÏ¦gÙÏgh¥gge g¦iÏgp¦fÐpreppqr±re¦ekÐsk¦fÖter¦gÙÏjk¦fÐ¦ÕÖl h¥er¦gÙÏvgeekrÏ¦gÙÏwgäiªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eojghpbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥gbeeebJfpbeeebKfbIfgbeeubJfpbeeubKfbIfgbeebJfpbeebKfbIfgbeebJfpbeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgp¦¥Ðpo¦uÏou­replpfwgebhbgbebf÷÷÷bhbgbebf÷÷÷g¥fk³ref¦äØgtiävf¦gÙoÏgeøhoÏgeù÷÷f¦f×jfpfgs«ref¦gÙgkfÐph¥gjÏfgiøghÏogiùfgeøogeù÷÷g¦mÏg÷÷p¦gÐpreppú ú mgeÃi¥nrgemgep  j¦iÏjr¦fÏrq¬reppppetÙÆ×ÌÊÙÄËÊÆÙÚ×ÊØflØÎÒÉ`;
  const scalarWasm = String.raw`dynEncode000eo{%nns|{s{}O)q}szosmmvso~mpos¿N.0OVO.Oy/N..x08.¡0..x08¢.8.¡0.8¢.8.¡0.8¢.8.¡0.8¢.    /..¢..¢..¢..¢.    /.Ox/.Ox0.V.OyO0.\.O/.O..O0x8.¡..x8¢. /.. /.O./O.y.T..y/..O0x/..x/N.8.¡.8¢.8.¡.8¢.  /.Ox/.Ox/.. . /.Oy0..ÀQÍ 0£É..£É­.É°±ÄÆR/(NN.OZ.OV.Oy/.O/.O/.O/NO/.OUN./N...x08.8 F..8.8 F.Ox/.Ox0.U.N.O.x0..z.xO.x8.8 F..x/.Ox0.UN.OZ.OV.Oy/.O/.O/.O/O/O/NO/.OUN./N...x08.8 F..8.8 F.Ox/.Ox0.U.N.O.x0..z.xO.x8.8 F..x/.Ox0.UO/.OD.ODN.OXN.O/N.Oy0OWNO/./.O0/N.$.8É®.8É®.8É®.8É®/$.Ox/.Oy0.N.O.x/./N.$.8É®/$.Ox/.Oy0N.OWNO/./.O0/N.%.8É®.8É®.8É®.8É®/%.Ox/.Oy0.N.O.x/N.%.8É®/%.Ox/.Oy0.À/#.OVNO/.Oy/.%Ä.#£/ O/./N.8. ¡0!.!¢.8. ¡0!.!¢.8. ¡0!.!¢.8. ¡0!.!¢."    /".Ox/.Ox0.V.O/.À/#.%.Å0%±Ä/ N..\..Ox/.O0.O.x/./N.8. ¡0!.!¢." /".Ox/.Oy0.../.OW..y/.O.x/N.8. ¡0!.!¢.8. ¡0!.!¢.8. ¡0!.!¢.8. ¡0!.!¢."    /".Ox/.Oy0..y/.".#QÍ £/"N.OZ.O/O/.OyO]N.O/./N..8. ¡F..8. ¡F..8. ¡F..8. ¡F.Ox/.Ox0.U.S.O.x/N..8. ¡F.Ox/.Oy0."/ N.OZNO/.O/.O/O/./O/N.$.8É¯/&..x8É/'.8/"...$.%±Ä. .0#."l..D..#F../.&.'®/$..x/..x0.VN.OZ...z0x0...X)/O/..y0O.OX)/N.OZN.(/$.O/N.OyOWN.(/$.O.x/.(/$.O0/N.$.8É®.8É®.8É®.8É®/$.Ox/.Oy0.S..xO.x/N.$.8É®/$.Ox/.Oy0..\.O.x/..xO.x/N.$.8É¯/&.8É/'.8/"...$.%±Ä. .0#."lN..D..#F.&.'®/$.Ox/.Ox/.Ox0.U`;

  class SynAudio {
    constructor(options = {}) {
      this._correlationSampleSize =
        options.correlationSampleSize > 0 ? options.correlationSampleSize : 11025;
      this._initialGranularity =
        options.initialGranularity > 0 ? options.initialGranularity : 16;

      this._module = wasmModule.get(SynAudio);

      if (!this._module) {
        this._module = simd().then((simdSupported) =>
          simdSupported
            ? WebAssembly.compile(simpleYenc.decode(simdWasm))
            : WebAssembly.compile(simpleYenc.decode(scalarWasm))
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

          const worker = new (globalThis.Worker || Worker__default["default"])(source, {
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

  return SynAudio;

}));
