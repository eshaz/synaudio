(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('web-worker')) :
  typeof define === 'function' && define.amd ? define(['web-worker'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.synaudio = factory(global.Worker));
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
  const simdWasm = String.raw`dynEncode0015v,uu$zzV 0xzvz tt}zvtwvz	'ÿ"5V&]V5V%65(6(5(6'U5+5575'ú7&5575(ú7%ûù5%5'ú7$5%5(ú7#ûù555'ú7"555(ú7!ûù5E5'ú7 5E5(ú7ûù6+5*5%5%ûù5#5#ûù5!5!ûù55ûù6*5)5&5&ûù5$5$ûù5"5"ûù5 5 ûù6)5VU65V%75]" 5VV 65*45*45*45*4§§§6-5)45)45)45)4§§§6,U55a"5V6U5VZU56! 5V655V7?5¨7.5.©5-§6-55?5¨7.5.©5,§6, 5V5["55655V76556U5?5¨7.5.©5?5¨7.5.©5-§§6-5?5¨7.5.©5?5¨7.5.©5,§§6,5V65V65V7"  5+45+45+45+4§§§5ÇXÔ§7ªÐ5,5ªÐ´5-5ªÐ´·¸Ë #'Y68U5555]07$V6%U5Va"5V]"5V6)V56*5V6+5V6 55V7,6-5V7.VV7V6!5V6/5V^6'U55&6"V6UU5'"5555"V^55"V5-^"V65.VdU5!656U555#7(5ù 55(%5%ù %5V565V65V7"  5/U55V7555"V5ù  55 7[" 5V65+55V7555"V?5?§M5V5 655*["5565#5V7"6(56U55"755(70?5?§M550?5?§M5V65V7"  5#5,6#5&V7&5)\"  5$5%6 U5V]"55 55 ]07!Va"5V6)5!V6*5!V655!V7+6,5!V7-VV7V65V6.V6#5!V^6/V6&U5!5&6"V6UU5/"555!5"V^55"V5,^"V65-VdU5656U555#7'5ù 55'%5%ù %5V565V65V7"  5.U55V7555"V5ù  575![" 5V65*55V7555"V?5?§M55 655!["5!565#5V7"6'56U55"755'7(?5?§M55(?5?§M5V65V7"  5#5+6#5&V7&5)\"  V65VK5VK55 6U5 Va"5 V6U5$5%V7V^UV6#! 565 V7#6U545?Ðµ5?Ðµ5?Ðµ5?!Ðµ645V%65V7"  5U55#V656U545?Ðµ645V65V7"  U5V^UV6! 565 V76U555?Ðµ5?Ðµ5?Ðµ5?!Ðµ655V%65V7"  5Z"55V6U555?Ðµ655V65V7"  555 ÇÐ¸Ë635V_U5$V5%V65V65 Ì6556V6U545?Ð¶6655?Ð6752555455¸Ë535 %71r55K551M516255 65657µ645565575]"  U5Va"55577555_06557V5V_06U5 VaU5864! 5$5%V65 V7ZU58645! 55V6586456U545?Ðµ645V65V7" 55 65V^"55V655$55%6U545?Ðµ5?Ðµ5?Ðµ5?!Ðµ645V%65V7"  55a"55V6555$5%V65 Ì65U545?Ð¶665?Ð6752555455¸Ë535 %71r55K551M5152 625657µ645V65V65V75\"    /$v|zt{zvz@~yFGM`;
  const scalarWasm = String.raw`dynEncode000eo{%nns|{s{}O)q}szosmmvso~mpos±ÛN.0OVO.Oy/N..x08.¡0..x08.¡0¢.8.¡0.8.¡0¢.8.¡0.8.¡0¢.8.¡0 .8.¡0!¢."    /"..¢..¢..¢.!.!¢.    /..¢..¢..¢. . ¢.    /.Ox/.Ox0.V.OyO0.\.O/N.OSN./.O/..O0x8.¡0.¢. /..x8.¡0.¢. /.O.yT..y/..O0x/..x/N.8.¡0.¢.8.¡0.¢.  /.8.¡0.¢.8.¡0.¢.  /.Ox/.Ox/.Oy0.".ÀQÍ 0£É..£É­..£É­°±ÄßR/(N..V/N.OZ.OV.Oy/.O/.O/.O/NO/.OUN./N...x0 8.8 F.. 8.8 F.Ox/.Ox0.U.N..Ox0....zxOx8.8 F..x/.Ox0.U...)/N.OV....V)0OZ.Oy/.O/.O/.O/O/O/NO/.OUN./N...x08.8 F..8.8 F.Ox/.Ox0.U.N..Ox0....zxOx8.8 F..x/.Ox0.UO/.OD.OD..y/N.OZ.O/N.Oy0OWNO/./.O0/N.$.8É®.8É®.8É®.8É®/$.Ox/.Oy0.N..Ox/./N.$.8É®/$.Ox/.Oy0N.OWNO/./.O0/N.%.8É®.8É®.8É®.8É®/%.Ox/.Oy0.S..Ox/N.%.8É®/%.Ox/.Oy0.%.ÀÉ±Ä/#.OXN.O/.O/.Å/%./O/N.$.8É¯/&..x8É/'."...$.%±Ä.#.0!k..D..!F.!/"../.&.'®/$..x/..x0.VN.OZ...z0x0...V)/..y0O.OX)/N.OZN.(/$.Oy/.O0SN.(/$...Ox/.(/$./N.$.8É®/$.Ox/.Oy0..x/.OW..Ox/..x.y/N.$.8É®.8É®.8É®.8É®/$.Ox/.Oy0..\..Ox/...xOx/.Å/%N.$.8É¯/&.8É/'."...$.%±Ä.#.0!k..D..!F.!."/".&.'®/$.Ox/.Ox/.Ox0.U`;

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
