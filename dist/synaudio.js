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
  const simdWasm = String.raw`dynEncode0064dÅ×ÑedddereÄnããããããããããdfsegÉÒÚjÑÉÑÓÖÝfdfgfedjleãd¥äìhokfmÇÓÖÖÉÐÅØÉddoÃÃÌÉÅÔÃÆÅ×Égdn~e ~huãmálßhà¨ddddddddf¤f¤e¥d°qdf¥f¬qdf¥eÏu¥deÏve¥eÕwe¥àÕpde¥fØxÎye¥hÏ|¥fÚ¥eÎf¥bccckÕrf¥eÕ}e¥h­zg¤etÐs¥dff¤f¤zqdddesÎ¥fØÎ­ds¥fØÎy­Õqd¥do|¥h³h¤rndfg¤ffqÎ{adfdfadfdaHeaofdf{adftfadftaHeaoftf¥Îfo¥lÎon¥fÏnqdoo}h¤do¥fØÎfdosÎ¥fØÎadfdfadfdaHeaofdoepfªqeof¥ã×nwhãdf¥fØÎodfsÎ¥fØÎfdofdöfdf¥eÖifofnvªqdefÏnqf¥fØsÎ{dfg¤fsÎof{Î~fdofdöfdo~fhofhöfhf¥lÎfn¥fÏnqdooqxÎqt¥eÎtu«qdoof¤h¥d°qdi¥f¬qdi¥eÏs¥dq¥dhÏuh¥eÕvh¥àÕigh¥fØwÎxh¥hÏy¥fÚ¥eÎf¥bccckÕpf¥eÕ|h¥h­}¥dtg¤htÐr¥dff¤f¤}qdgghrÎ¥fØÎ­gr¥fØÎx­Õqd¥doy¥h³h¤pngfg¤ffqÎzadfdfadfdaHeaofdfzadftfadftaHeaoftf¥Îfo¥lÎon¥fÏnqdoo|h¤go¥fØÎfgorÎ¥fØÎadfdfadfdaHeaofdoifhªqeof¥ã×nvhãgf¥fØÎogfrÎ¥fØÎfdofdöfdf¥eÖifofnuªqdhfÏnqf¥fØrÎzgfg¤frÎofzÎ{fdofdöfdo{fhofhöfhf¥lÎfn¥fÏnqdooqwÎqt¥eÎts«qdoo¥dhm¥dfdl¥dfdf¤j¥d®h¤j¥gÕof¤j¥eÏh¥g­h¤¥dipeodfj¥àÕing¤ffdffhfflffpf¥tÎfn¥hÏnqdoooh¤di¥fØÎfong¤ffdf¥hÎfn¥eÏnqdoof¤h¥g­h¤¥dipeogfj¥àÕing¤ffdffhfflffpf¥tÎfn¥hÏnqdoooh¤gi¥fØÎfg¤ffdf¥hÎfo¥eÏoqdooj¥tÏtjj¥u¬h¤¥dh¥dnpfoaw¥dogfg¤fadddaIeaJeaHefaddtaIeaJeaHefaddaIeaJeaHefaddaIeaJeaHef¥¤Ïfo¥tÎot¬qdoh¥ÔÕn¥ehpeoj¥tÏtj¥dnoejÏsagafadaeöööf¤jn°qdn¥ã×jÎij¥gÕehãgn¥fØÎfeog¤ffd÷øöf¥hÎfo¥eÏoqdoenÖinoni¥g­qdjnÏogn¥fØÎfg¤ffp÷øffl÷øffh÷øffd÷øööööf¥tÎfo¥hÏoqdooj§ddä#öùõf¤s¥d°h¤¥de§ddddpeok¥fØu¥de¥djÏvj¥eÕwj¥eÏ¥ÔÕpaw§dddddi¥dqg¤dq¥fØÎxfddjqÎ¥fØÎyfãh©h¤apddddddddddddddddapdddddddddddddddd¥dpeoaw¥df¥drapddddddddddddddddapddddddddddddddddg¤fiÎnadddaIefgÎoadddaIeaJeaHenaddtaIeoaddtaIeaJeaHenaddaIeoaddaIeaJeaHenaddaIeoaddaIeaJeaHeaJeaHeaJeaHeaJeaHeaJeaHef¥¤Ïfr¥tÎrt¬qdopofyfdagafadaeöööagafadaeöööf¤fj²qdf¥ã×owhãxf¥fØnÎfd÷gnÎfd÷øööf¥eÖifonovªqdn¥fØfjnÏog¤fiÎnfh÷fgÎrfh÷ønfd÷rfd÷øööf¥lÎfööo¥fÏoqdooùùÁhãmqfdlfdqieoeiuÎikqÎqs¬qdoof¤k¥e°qdekkÐfÎisis¬p¥drefÏe¥de¥d®qf¤j¥d°h¤peoj¥gÕof¤j¥eÏ¥g­h¤peodq¥fØÎfj¥àÕrng¤ffdffhfflffpf¥tÎfn¥hÏnqdooo©qddqrÎ¥fØÎfg¤ffdf¥hÎfo¥eÏoqdoopq°qd¥djÏrj¥eÕsdq¥fØÎij¥eÏ¥ÔÕkawg¤dq¥fØÎufddjqÎ¥fØÎvfãh©h¤apddddddddddddddddapdddddddddddddddd¥dpeoaw¥dnifgoapddddddddddddddddapddddddddddddddddg¤fadddaIeoadddaIeaJeaHefaddtaIeoaddtaIeaJeaHefaddaIeoaddaIeaJeaHefaddaIeoaddaIeaJeaHeaJeaHeaJeaHeaJeaHeaJeaHef¥¤Ïfo¥¤Ïon¥tÎnt¬qdokoevfdagafadaeöööagafadaeöööf¤ej²qde¥ã×fshãue¥fØnÎfd÷gnÎfd÷øööe¥eÖieoefrªqde¥fØfjeÏog¤fiÎefh÷fgÎnfh÷øefd÷nfd÷øööf¥lÎfööo¥fÏoqdooùùÁhámqfdlfdioi¥hÎiq¥eÎqp«qdooood~sØÅÖËÉØÃÊÉÅØÙÖÉ×ek×ÍÑÈ`;
  const scalarWasm = String.raw`dynEncode000eo{&nns|{s{}O)q}szosmmvso~mposµN.0OVO.Oy/N..x08.¡0..x08.¡¢.8.¡0.8.¡¢.8.¡0.8.¡¢.8.¡0.8.¡¢.    /..¢..¢..¢..¢.    /.Ox/.Ox0.V.OyO0.\.O/.O..O0x8.¡..x8.¡¢. /.. /.O./.O.yT..y/..O0x/..x/N.8.¡.8.¡¢.8.¡.8.¡¢.  /.Ox/.Ox/.. . /.Oy0..ÀQÍ 0£É..£É­.É°±Ä§R/(NN.OZ.OV.Oy/.O/.O/.O/NO/.OUN./N...x08.8 F..8.8 F.Ox/.Ox0.U.N..Ox0....zxOx8.8 F..x/.Ox0.UN.OZ.OV.Oy/.O/.O/.O/O/O/NO/.OUN./N...x08.8 F..8.8 F.Ox/.Ox0.U.N..Ox0....zxOx8.8 F..x/.Ox0.U.OD.ODN.OZ.O/N.Oy0OWNO/./.O0/N.'.8É®.8É®.8É®.8É®/'.Ox/.Oy0.N..Ox/./N.'.8É®/'.Ox/.Oy0N.OWNO/./.O0/N.&.8É®.8É®.8É®.8É®/&.Ox/.Oy0.S..Ox/N.&.8É®/&.Ox/.Oy0.À/".&.Å0$±/%.O\.Oy/.&Ä."£/!O/./N.8.!¡0#.#¢.8.!¡0#.#¢.8.!¡0#.#¢.8.!¡0#.#¢.     / .Ox/.Ox0.V.OyOO/..y/.%Ä/#N..0Z.O.x/.O0..Ox/./N.8.#¡0!.!¢.  / .Ox/.Oy0.../.OW..y/..Ox/N.8.#¡0!.!¢.8.#¡0!.!¢.8.#¡0!.!¢.8.#¡0!.!¢.     / .Ox/.Oy0. ."QÍ £/"N.OZNO/Q/ .O/.O/Q/ O/./O/N.'.8É¯/&..x8É/%. ...'.$±Ä.#.".0!k..D..!F.!/ ../.&.%®/'..x/..x0.VN.OZ...z0x0...V)/O/..y0O.OX)/N.OZN.(/'.O/N.OyOWN.(/'..Ox/.(/'.O0/N.'.8É®.8É®.8É®.8É®/'.Ox/.Oy0.S...xOx/N.'.8É®/'.Ox/.Oy0..Z..Ox/...xOx/N.'.8É¯/&.8É/%. ...'.$±Ä.#.".0!k..D..!F.!. / .&.%®/'.Ox/.Ox/.Ox0.U`;

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
