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
  const simdWasm = String.raw`dynEncode0065eÆØÒfeeefsfÅoääääääääääegtfhÊÓÛkÒÊÒÔ×Þgeghgfekmfäe¦åíiplgnÈÔ××ÊÑÆÙÊeepÄÄÍÊÆÕÄÇÆØÊheofivälànâiá©eeeeeeeeg¥g¥g¦g­reg¦fÐ|f¦v³i¥f¦uÐz¦efÐ}ef¦gÙxÏ~e¦¥Ðuth¥ffwÑvÏ{tpuo¦eqh¥eqg¦gÙÏqqbeeeegvÏ¦gÙÏbeeebIfbpeeeg¦i×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeeeg¦m×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeeeg¦q×q¦gÙÏrrbeeeeqvÏ¦gÙÏbeeebIfbpeepr¦¥Ðpos¦¥Ðog¦uÏqz­repg¥fq±reg¥fqÐo¦i®reeqvÏ¦gÙÏ~®iäeq¦gÙÏe{¦gÙÏ®j¦epreo¦áÖ{¦iÐp¦gÛ¦fÏ¦fÖg¥pªi¥¦egqfpzgÐ¦áÖ¦iÐ¦gÛ¦fÏ¦cdddlÖp¦egh¥srbegesbegebIfbpgesrbegusbegubIfbpgur¦Ïrs¦Ïsg¦mÏgp¦gÐpreppi¥egqÏg¦gÙÏpegvÏ¦gÙÏbegepbegebIfbpgepo{«rffq{ÏqÐopq¦äØgo¦fÖiäeq¦gÙÏoeqvÏ¦gÙÏgeoge÷geq¦fÏjqpqg}«refqÐpyq¦gÙoÏregh¥goÏqgrÏsgeqge÷geqsgiqgi÷gig¦mÏgp¦gÐpreppxyÏytxÏtw¦fÏw|¬repqfpf¦e±re¦efÐtf¦fÖuef¦gÙvÏwf¦i®yf¦áÖo¦q«zh¥frÑs¦egg¥g¥yreeefsÏ¦gÙÏ®wes¦gÙÏq°ÖreeqbegeebegebIfbpgeg¥o¦i«reeqbeguebegubIfbpguo¦m«reeqbegebegbIfbpgzreeqbegebegbIfbpgpfog«rfpg¦äØquiäeg¦gÙÏxegsÏ¦gÙÏgexge÷geg¦f×jgpgqt«refgÐqpg¦gÙxÏ{egh¥gxÏsg{Ï}gesge÷ges}gisgi÷gig¦mÏgq¦gÐqrepppvÏpr¦fÏr|¬reppg¥j¦g­rej¦fÐvi¦v³i¥i¦uÐ|¦ey¦eiÐ{hi¦gÙzÏ}h¦¥Ðjt¦ewh¥iiwÑuÏxtpjo¦eqh¥hqg¦gÙÏqqbeeehguÏ¦gÙÏbeeebIfbpeehg¦i×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeehg¦m×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeehg¦q×q¦gÙÏrrbeeehquÏ¦gÙÏbeeebIfbpeepr¦¥Ðpos¦¥Ðog¦uÏq|­repg¥iq±reg¥iqÐo¦i®rehquÏ¦gÙÏ}®iähq¦gÙÏhx¦gÙÏ®j¦epreo¦áÖx¦iÐp¦gÛ¦fÏ¦fÖ~g¥pªi¥¦egqfp|gÐ¦áÖ¦iÐ¦gÛ¦fÏ¦cdddlÖp¦egh¥srbegesbegebIfbpgesrbegusbegubIfbpgur¦Ïrs¦Ïsg¦mÏgp¦gÐprepp~i¥hgqÏg¦gÙÏphguÏ¦gÙÏbegepbegebIfbpgepox«rfiqxÏqÐopq¦äØgo¦fÖiähq¦gÙÏohquÏ¦gÙÏgeoge÷geq¦fÏjqpqg{«reiqÐpyq¦gÙoÏrhgh¥goÏqgrÏsgeqge÷geqsgiqgi÷gig¦mÏgp¦gÐpreppyzÏytzÏtw¦fÏwv¬repqfpi¦e±re¦ep¦eiÐsi¦fÖthi¦gÙuÏwi¦i®yi¦áÖj¦q«|¦erh¥irÑo¦egg¥g¥yrehhioÏ¦gÙÏ®who¦gÙÏq°ÖrehqbegehbegebIfbpgeg¥j¦i«rehqbeguhbegubIfbpguj¦m«rehqbeghbegbIfbpg|rehqbeghbegbIfbpgpjgi«rfpg¦äØqtiähg¦gÙÏzhgoÏ¦gÙÏgezge÷geg¦f×jgpgqs«reigÐqpg¦gÙzÏxhgh¥gzÏogxÏ{geoge÷geo{giogi÷gig¦mÏgq¦gÐqrepppuÏpr¦fÏrv¬repp¦ein¦egem¦egeg¥k¦e¯i¥k¦hÖjg¥k¦fÐi¦h®i¥¦eoqfpegk¦áÖoqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppji¥eo¦gÙÏgjqh¥gge g¦iÏgq¦fÐqreppg¥i¦h®i¥¦eoqfphgk¦áÖoqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppji¥ho¦gÙÏgh¥gge g¦iÏgj¦fÐjreppk¦uÐskk¦v­i¥¦ei¦eqqgpbx¦ejhgh¥gbeeebJfbKfbIfgbeeubJfbKfbIfgbeebJfbKfbIfgbeebJfbKfbIfg¦¥Ðgj¦uÏjs­repi¦ÕÖq¦fiqfpk¦uÐsk¦eqpbhbgbebf÷÷÷g¥kq±req¦äØkÏpk¦hÖoiähq¦gÙÏgojh¥ggeøù÷g¦iÏgj¦fÐjrepoq×jqpqp¦h®rekqÐjhq¦gÙÏgh¥ggqøùggmøùggiøùggeøù÷÷÷÷g¦uÏgj¦iÐjrepp¦ejii¥bxhgh¥ggbeeebJfbpeeggbeeubJfbpeuggbeebJfbpeggbeebJfbpeg¦¥Ðgj¦uÏjs­reppk¨eeå$÷úfkÐtg¥jk³rekkjÐf¦h°iäf¦áÖr¦iÐg¦gÛ¦fÏo¦hÖqbx¦epg¦q´i¥o¦adddlÖohj¦gÙÏgh¥ggbegebJfbpgeggbegubJfbpguggbegbJfbpgggbegbJfbpgg¦¥Ðgp¦uÏpo¦iÐoreppqi¥hjpÏ¦gÙÏgh¥ggbegebJfbpgeg¦uÏgq¦fÐqreppfr«rfjrÏjjpjÐqhj¦gÙÏgh¥gggeøgeg¦iÏgq¦fÐqreppöt¦e¯i¥l¦gÙu¦er¦ekÐvk¦fÖwk¦fÐ¦ÕÖq eoh¥er¦gÙÏygeekrÏ¦gÙÏ|gäiªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eg¦epbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥goÏfbeeebJfghÏjbeeebKfbIffbeeubJfjbeeubKfbIffbeebJfjbeebKfbIffbeebJfjbeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgp¦uÏps­repqpf|gebhbgbebf÷÷÷bhbgbebf÷÷÷g¥fk³ref¦äØgwiäyf¦gÙjÏgeøhjÏgeù÷ù÷f¦f×jfpfgv«ref¦gÙgkfÐjh¥goÏfgiøghÏpgiùfgeøpgeù÷÷ùù÷÷g¦mÏgj¦gÐjreppú ú mgeÃi¥nrgemgep  ouÏolrÏrt­reppg¥l¦f±rengefllÑgÏjtjt­t¦epfgÐf¦ef¦e¯rg¥k¦e±i¥qfpk¦hÖjg¥k¦fÐ¦h®i¥qfper¦gÙÏgk¦áÖpqh¥gge ggi ggm ggq g¦uÏgq¦iÐqreppjªreeprÏ¦gÙÏgh¥gge g¦iÏgj¦fÐjrepprt³re¦ekÐpk¦fÖuer¦gÙÏok¦fÐ¦ÕÖl h¥er¦gÙÏvgeekrÏ¦gÙÏwgäiªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eqoghjbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥gbeeebJfjbeeebKfbIfgbeeubJfjbeeubKfbIfgbeebJfjbeebKfbIfgbeebJfjbeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgj¦¥Ðjq¦uÏqs­replpfwgebhbgbebf÷÷÷bhbgbebf÷÷÷g¥fk³ref¦äØguiävf¦gÙjÏgeøhjÏgeù÷ù÷f¦f×jfpfgp«ref¦gÙgkfÐjh¥goÏfgiøghÏqgiùfgeøqgeù÷÷ùù÷÷g¦mÏgj¦gÐjreppú ú mgeÃi¥nrgemgep  o¦iÏor¦fÏrt¬reppppetÙÆ×ÌÊÙÄËÊÆÙÚ×ÊØflØÎÒÉ`;
  const scalarWasm = String.raw`dynEncode000eo{+nnns|{s{}O)q}szosmmvso~mpos  ÚN.OV.Oy/.O\N.Oy/.O/.O/N./O/N...x08.8 F..8.8 F..8.8 F..8.8 F.Ox/.Ox/.Ox/..VN..Oy0Z....x8.8 F../..T..y/..O0x/./N..x0..x08.8 F..8.8 F.Ox/.Oy0..x/..Ox0U.OZ.O/.8/.OT/.OT/./N..8. 0FN...8.8 F.OT..8.8 F...8.8 F..x/.Oy0N.0OVO.Oy/N..x08.¡0..x08¢.8.¡0.8¢.8.¡0.8¢.8.¡0.8¢.    /..¢..¢..¢..¢.    /.Ox/.Ox0.V.OyO0.\.O/.O..O0x8.¡0..x8¢. /..¢. /.O./O.y.T..y/..O0x/..x/N.8.¡0.¢.8.¡0.¢.  /..8¢..8¢.  /.Ox/.Ox/.Oy0..ÀQÍ 0£É..£É­.É°±ÄÊR/$N.......OD.ODN.OXN.O/.Oy0O]N./.O0/N. .8É®.8É®.8É®.8É®/ .Ox/.Oy0.N.O.x/./N. .8É®/ .Ox/.Oy0N.OWNO/./.O0/N.!.8É®.8É®.8É®.8É®/!.Ox/.Oy0.N.O.x/N.!.8É®/!.Ox/.Oy0.Oy/.À/.OVNO/O/.!Ä.£/O/./N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Ox0.V.O/O/.Oy/.À/O/.!.Å0!±Ä/N..\..Ox/.O0.O.x/./N.8.¡0.¢. /.Ox/.Oy0.../.OW..y/.O.x/N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Oy0O/.N./N..8.¡F..8.¡F..8.¡F..8.¡F.Ox/.Ox0.V..QÍ £/..y/N..\..Ox/..yO0N.O.x/N..8.¡F.Ox/.Ox/.Oy0.OW..y/.O.x/N..8.¡F..8.¡F..8.¡F..8.¡F.Ox/.Oy0./N.OZNO/.O/.O/O/./O/N. .8É¯/"..x8É/#.8/... .!±Ä..0.l..D..F../.".#®/ ..x/..x0.VN.OZ...z0x0...V)/O/..y0O.OX)/N.OZN.$/ .O/N.OyOWN.$/ .O.x/.$/ .O0/N. .8É®.8É®.8É®.8É®/ .Ox/.Oy0.S..xO.x/N. .8É®/ .Ox/.Oy0..\.O.x/..xO.x/N. .8É¯/".8É/#.8/... .!±Ä..0.lN..D..F.".#®/ .Ox/.Ox/.Ox0.U`;

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
  }

  return SynAudio;

}));