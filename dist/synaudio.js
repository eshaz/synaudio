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
  const simdWasm = String.raw`dynEncode0064dÅ×ÑedddereÄnããããããããããdfsegÉÒÚjÑÉÑÓÖÝfdfgfedjleãd¥äìhokfmÇÓÖÖÉÐÅØÉddoÃÃÌÉÅÔÃÆÅ×Égdn^~e[~hxãnálßhà¨ddddddddf¤ejej¬t¥hÓuhtuÏr¬wf¤e¥d°qdf¥f¬qdf¥eÏx¥deÏye¥eÕze¥àÕode¥fØ{Î}e¥hÏ|¥fÚ¥eÎf¥bccckÕqf¥eÕ~e¥h­g¤evÐs¥djf¤f¤qdesÎ¥fØdÎd¯}s¥fØdÎ¯Õqd¥df|¥h³h¤qndjg¤jjpÎadfdjadfdaHeaofdjadftjadftaHeaoftj¥Îjf¥lÎfn¥fÏnqdoo~h¤f¥fØdÎjfsÎ¥fØdÎadfdjadfdaHeaofdoeojªqeoj¥ã×fzhãj¥fØdÎnjsÎ¥fØdÎfdnfdöfdj¥eÖijojfyªqdejÏnpj¥fØsÎdjg¤jsÎfjÎfdffdöfdffhffhöfhj¥lÎjn¥fÏnqdoop{Îpv¥eÎvx«qdoohrwof¤i¥f¬qdo¥d°qdi¥eÏvo¥eÕwo¥àÕhgo¥fØxÎyo¥hÏz¥fÚ¥eÎf¥bccckÕif¥eÕ{¥dpo¥h­}¥dqg¤oqÐs¥djf¤f¤}qdosÎ¥fØgÎg¯ys¥fØgÎ¯Õqd¥dfz¥h³h¤ingjg¤jjpÎ|adfdjadfdaHeaofdj|adftjadftaHeaoftj¥Îjf¥lÎfn¥fÏnqdoo{h¤f¥fØgÎjfsÎ¥fØgÎadfdjadfdaHeaofdohjoªqeoj¥eÖfwhãj¥fØgÎnjsÎ¥fØgÎfdnfdöfdfijojfoªqdojÏnpj¥fØsÎ|gjg¤jsÎfj|Î~fdffdöfdf~fhffhöfhj¥lÎjn¥fÏnqdoopxÎpq¥eÎqv«qdoom¥dfdl¥dfdf¤r¥d°qdr¥gÕff¤u¥ã×tÎh¥g­h¤¥dipeodjr¥àÕing¤jfdjfhjfljfpj¥tÎjn¥hÏnqdoofh¤i¥fØdÎjfng¤jfdj¥hÎjn¥eÏnqdoof¤h¥g­h¤¥dhpeogjr¥àÕhng¤jfdjfhjfljfpj¥tÎjn¥hÏnqdoof©qdh¥fØgÎjg¤jfdj¥hÎjf¥eÏfqdooro¥u²hão¥tÏhaw¥dfgjg¤jadddaIeaJeaHejaddtaIeaJeaHejaddaIeaJeaHejaddaIeaJeaHej¥¤Ïjf¥tÎfh¬qdoo¥eÏ¥ÔÕi¥doferÏsagafadaeöööf¤ofe°qde¥ã×oÎio¥gÕhhãe¥fØgÎjhfg¤jfd÷øöj¥hÎjf¥eÏfqdoehÖieoei¥g­qdoeÏfe¥fØgÎjg¤jfp÷øjfl÷øjfh÷øjfd÷øööööj¥tÎjf¥hÏfqdoof¤s¥d°h¤¥de§ddddpeoutÏvk¥fØwr¥gÕnr¥tÏxu¥ã×tÎyr¥eÏ¥ÔÕo§ddä#öùawr§dddd¥der¥u¬zdh¥dpg¤p¥fØdÎfdprÎ¥fØdÎ{fãzh¤apddddddddddddddddapdddddddddddddddd¥dpeoaw¥dj¥dqapddddddddddddddddapddddddddddddddddg¤hjÎfadddaIegjÎiadddaIeaJeaHefaddtaIeiaddtaIeaJeaHefaddaIeiaddaIeaJeaHefaddaIeiaddaIeaJeaHeaJeaHeaJeaHeaJeaHeaJeaHej¥¤Ïjq¥tÎqx¬qdoooi{fdagafadaeöööf¤ir²qdyiÏqnhãi¥fØhÎjnfg¤jfd÷øöj¥hÎjf¥eÏfqdoinÖiioiq¥g­qdivÎfi¥fØhÎjg¤jfp÷øjfl÷øjfh÷øjfd÷øööööj¥tÎjf¥hÎfqdooagafadaeöööùùÁhãmpfdlfdpieoehwÎhkpÎps¬qdoof¤k¥e°qdekkÐfÎhshs¬oefÏe¥de¥d®hf¤r¥d°h¤peou¥ã×tÎifãr¥gÕe©h¤hpeoh¥fØdÎjefg¤jfdj¥hÎjf¥eÏfqdoehÎoei¥g­qde¥fØdÎjhtÎeÏuÏfg¤jfdjfhjfljfpj¥tÎjf¥hÏfqdooho²qdutÏqr¥gÕkr¥tÏsh¥fØdÎiu¥ã×tÎtr¥eÏ¥ÔÕp§ddä#öùawrr¥u¬ug¤h¥fØdÎfdhrÎ¥fØdÎvfãuh¤apddddddddddddddddapdddddddddddddddd¥dpeoaw¥dnijgfapddddddddddddddddapddddddddddddddddg¤jadddaIefadddaIeaJeaHejaddtaIefaddtaIeaJeaHejaddaIefaddaIeaJeaHejaddaIefaddaIeaJeaHeaJeaHeaJeaHeaJeaHeaJeaHej¥¤Ïjf¥¤Ïfn¥tÎns¬qdopoevfdagafadaeöööf¤er²qdteÏnkhãe¥fØiÎjkfg¤jfd÷øöj¥hÎjf¥eÏfqdoekÖieoen¥g­qdeqÎfe¥fØiÎjg¤jfp÷øjfl÷øjfh÷øjfd÷øööööj¥tÎjf¥hÎfqdooagafadaeöööùùÁhámhfdlfdioi¥hÎih¥eÎho«qdooood~sØÅÖËÉØÃÊÉÅØÙÖÉ×ek×ÍÑÈ`;
  const scalarWasm = String.raw`dynEncode000eo{&nns|{s{}O)q}szosmmvso~mposÉ¢N.0OVO.Oy/N..x08.¡0..x08.¡¢.8.¡0.8.¡¢.8.¡0.8.¡¢.8.¡0.8.¡¢.    /..¢..¢..¢..¢.    /.Ox/.Ox0.V.OyO0.\..Ox/.O0.O.x/./N.8.¡0.¢. /.Ox/.Oy0.../.OW..y/.O.x/N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Oy0..ÀQÍ 0£É..£É­..£É­°±Ä°R/)N.....V)0$V/"N.OZ.OV.Oy/ .O/.O/.O/NO/.OUN./N...#x08.8 F..8.8 F.Ox/.Ox0.U.N.O.x0..!z.xO.x8.8 F..#x/#.!Ox0!. U..$.")/"N.OV."OZ.Oy/."O/."O/ ."O/O/#O/!NO/."OUN./N...#x08.8 F..8.8 F.Ox/.Ox0. U.N.O.x0.!."z.xO.x8.8 F..#x/#.!Ox0!.U.OD.ODN.$OZ.$O/N.$Oy0#OWNO/./.$O0/N.(.8É®.8É®.8É®.8É®/(.Ox/.Oy0.N.O.x/./N.(.8É®/(.Ox/.Oy0N.#OWNO/#./.$O0#/N.'.8É®.8É®.8É®.8É®/'.Ox/.Oy0.S.#O.x/N.'.8É®/'.Ox/.Oy0.'.$ÀÉ±Ä/..$y/#N."O\."Oy/O/./N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Ox0.V."OyOO0."\.O."x/."O0.O.x/./N.8.¡0.¢. /.Ox/.Oy0.../.OW.".y/.O.x/N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Oy0N.#OZNO/Q/.O/.$O/.$Å/'Q/O/./O/N.(.8É¯/&..x8É/%....(.'±Ä...$0k..D..F./../.&.%®/(..x/..x0.#VN.OZ...z0x0.#..#V)/..y0O.OX)/N.$OZN.)/(.$Oy/.$O0SN.)/(..O.x/.)/(./N.(.8É®/(.Ox/.Oy0..x/.OW.O.x/..$x.y/N.(.8É®.8É®.8É®.8É®/(.Ox/.Oy0..\.O.x/..$xO.x/.$Å/'N.(.8É¯/&.8É/%....(.'±Ä...$0k..D..F../.&.%®/(.Ox/.Ox/.Ox0.U`;

  class SynAudio {
    constructor(options = {}) {
      this._correlationSampleSize = options.correlationSampleSize || 11025;
      this._initialGranularity = options.initialGranularity || 16;

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

  return SynAudio;

}));
