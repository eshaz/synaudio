(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@eshaz/web-worker')) :
  typeof define === 'function' && define.amd ? define(['@eshaz/web-worker'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SynAudio = factory(global.Worker));
})(this, (function (Worker) { 'use strict';

  const t=(t,n=4294967295,e=79764919)=>{const r=new Int32Array(256);let o,s,i,c=n;for(o=0;o<256;o++){for(i=o<<24,s=8;s>0;--s)i=2147483648&i?i<<1^e:i<<1;r[o]=i;}for(o=0;o<t.length;o++)c=c<<8^r[255&(c>>24^t[o])];return c},e=(n,e=t)=>{const r=t=>new Uint8Array(t.length/2).map(((n,e)=>parseInt(t.substring(2*e,2*(e+1)),16))),o=t=>r(t)[0],s=new Map;[,8364,,8218,402,8222,8230,8224,8225,710,8240,352,8249,338,,381,,,8216,8217,8220,8221,8226,8211,8212,732,8482,353,8250,339,,382,376].forEach(((t,n)=>s.set(t,n)));const i=new Uint8Array(n.length);let c,a,l,f=false,g=0,h=42,p=n.length>13&&"dynEncode"===n.substring(0,9),u=0;p&&(u=11,a=o(n.substring(9,u)),a<=1&&(u+=2,h=o(n.substring(11,u))),1===a&&(u+=8,l=(t=>new DataView(r(t).buffer).getInt32(0,true))(n.substring(13,u))));const d=256-h;for(let t=u;t<n.length;t++)if(c=n.charCodeAt(t),61!==c||f){if(92===c&&t<n.length-5&&p){const e=n.charCodeAt(t+1);117!==e&&85!==e||(c=parseInt(n.substring(t+2,t+6),16),t+=5);}if(c>255){const t=s.get(c);t&&(c=t+127);}f&&(f=false,c-=64),i[g++]=c<h&&c>0?c+d:c-h;}else f=true;const m=i.subarray(0,g);if(p&&1===a){const t=e(m);if(t!==l){const n="Decode failed crc32 validation";throw console.error("`simple-yenc`\n",n+"\n","Expected: "+l+"; Got: "+t+"\n","Visit https://github.com/eshaz/simple-yenc for more information"),Error(n)}}return m};

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


  // prettier-ignore
  const simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]));

  const wasmModule = new WeakMap();
  const wasmHeapBase = new WeakMap();

  /* WASM strings are embedded during the build, do not manually edit the below */
  // BEGIN generated variables
  const simdWasm = String.raw`dynEncode01651718049eeÆØÒfeeefsfÅoääääääääääegtfhÊÓÛkÒÊÒÔ×Þgeghgfekmfäe¦åíiplgnÈÔ××ÊÑÆÙÊeepÄÄÍÊÆÕÄÇÆØÊheofitämâlàmág¥¦cdddl}©eeeeeeU¤©eeeeeeeepg¥g¥g¦g­reg¦fÐzf¦v³i¥ff¦vÐp¦ÕÖg¦vÏofo¯o¦hÖxgx×oÐ¦uÏsp¦iÛr¦kÙeÏqo¦gÙp¦gÙ¦¥ÖÐÏyf¦gÙ{r¦fÏuq¦¥ÐpogÐ¦uÐo¦l°|g¦uÏqoxÐÏvh¥egurh¥ggtÏobeeegbeeebIfbpeegobeeugbeeubIfbpeugobeegbeebIfbpegobeegbeebIfbpeg¦¥Ðgr¦fÐrrepg¥fq±reqog¥|ªrepyw{ÑgÏ®ygpÏ°Örepgsoh¥ggbegegtÏbegebIfbpgeg¦uÏgo¦iÏorepvoxªrfpo¦gÙeÏgh¥gggegtÏge÷geg¦iÏgfo¦fÏo¯reppt{Ïtw¦fÏwz¬repqfpf¦e±reeef¦gÙyÏ®iäefg¦gÙ¦iÐÑeÏ®j¦epf¦i®×{f¦hÖse¦Ïue¦Ïve¦uÏxf¦adddlÖqh¥¦epg¥{ªi¥eebegeefwÑ¦gÙgÏbegebIfbpgeg¥q¦i«rexxbegegxÏbegebIfbpgeq¦m«revvbegegvÏbegebIfbpgeq¦q«reuubegeguÏbegebIfbpgepfqp«rfpptsi¥psÏtp¦gÙeÏgsoh¥gggegrÏge÷geg¦iÏgo¦fÐorepppfÐ¦á°reftÐpt¦gÙeÏgh¥gggegrÏoge÷gegggiogi÷gigggmogm÷gmgggqogq÷gqg¦uÏgp¦iÐpreppryÏrw¦fÏwz¬reppg¥j¦g­rej¦fÐxi¦v³i¥ii¦vÐj¦ÕÖg¦vÏoio¯o¦hÖvgv×oÐ¦uÏqj¦iÛp¦kÙhÏro¦gÙj¦gÙ¦¥ÖÐÏzi¦gÙyp¦fÏsr¦¥Ðj¦etogÐ¦uÐo¦l°{g¦uÏpovÐÏu¦ewh¥hgsrh¥ggtÏobeeegbeeebIfbpeegobeeugbeeubIfbpeugobeegbeebIfbpegobeegbeebIfbpeg¦¥Ðgr¦fÐrrepg¥ip±repog¥{ªrejzwyÑgÏ®zgjÏ°Örejgqoh¥ggbegegtÏbegebIfbpgeg¦uÏgo¦iÏorepuovªrfpo¦gÙhÏgh¥gggegtÏge÷geg¦iÏgio¦fÏo¯repptyÏtw¦fÏwx¬repqfpi¦e±rehhi¦gÙzÏ®iähij¦gÙ¦iÐÑhÏ®j¦epi¦i®×yi¦hÖqh¦Ïsh¦Ïuh¦uÏvi¦adddlÖj¦er¦ewh¥¦epg¥yªi¥hhbegehiwÑ¦gÙgÏbegebIfbpgeg¥j¦i«revvbegegvÏbegebIfbpgej¦m«reuubegeguÏbegebIfbpgej¦q«ressbegegsÏbegebIfbpgepijp«rfpptqi¥pqÏtp¦gÙhÏgqoh¥gggegrÏge÷geg¦iÏgo¦fÐorepppiÐ¦á°reitÐpt¦gÙhÏgh¥gggegrÏoge÷gegggiogi÷gigggmogm÷gmgggqogq÷gqg¦uÏgp¦iÐprepprzÏrw¦fÏwx¬repp¦eqn¦egem¦egegäk¦e¯i¥g¥g¥g¥g¥k¦f«i¥¦erqfpegk}Öroh¥gbÂgebÄbUfg¦mÏgo¦gÐorepbrmnopqrstefghijklbUfbekr«rfpkrÐor¦gÙeÏgh¥gge g¦iÏgo¦fÐorepk¦f«i¥¦erqgpk}Örpbqeeeeeeeeeeeeeeeehgroh¥gbÂgebÄbUfg¦mÏgo¦gÐorepbrmnopqrstefghijklbUfbekr«rfpkrÐor¦gÙhÏgh¥gge g¦iÏgo¦fÐoreppk¦uÐik~k¦v­i¥bqeeeeeeeeeeeeeeee¦eqgp~bx¦eobqeeeeeeeeeeeeeeeehgh¥gbeeebJfbKfbIfgbeeubJfbKfbIfgbeebJfbKfbIfgbeebJfbKfbIfg¦¥Ðgio¦uÏo¯rep¦fqk¦vÐ¦ÕÖ¦uÏqfpk¦uÐik¦epjbebf÷bg÷bh÷g¥jk³rekkjÐp¦i´iäbqeeeeeeeeeeeeeeeebej¦gÙhÏg~bxp¦áÖroh¥gbegebJfbKfbIfg¦uÏgo¦iÐorepbrmnopqrstefghefghbIfbrijklefghefghefghbIfbepr«rfjrÏjjpjÐoj¦gÙhÏgh¥gge~øù÷g¦iÏgo¦fÐoreppk¨eeå$÷¦eoqi¥~bxhgh¥ggbeeebJfbpeeggbeeubJfbpeuggbeebJfbpeggbeebJfbpeg¦¥Ðgio¦uÏo¯reppúfkÐsg¥ko±rekkoÐf¦h°iäo¦gÙhÏg~bxf¦áÖjrh¥ggbegebJfbpgeg¦uÏgr¦iÐrrepfj«rfjoÏjopoÐro¦gÙhÏgh¥ggge~øgeg¦iÏgr¦fÐrreppös¦e¯i¥l¦gÙv¨eeå¤úk¦vÐ¦ÕÖ¦uÏrmge ¦efeph¥f¦gÙeÏwge~gäqªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦eg¦etbqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥gpÏjbeeebJfghÏobeeebKfbIfjbeeubJfobeeubKfbIfjbeebJfobeebKfbIfjbeebJfobeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgit¦uÏt¯reprpj~ bebf÷bg÷bh÷~bebf÷bg÷bh÷g¥jk³rekjÐt¦i´iäj¦gÙgbqeeeeeeeeeeeeeeeebebqeeeeeeeeeeeeeeee~bebxt¦áÖuoh¥gpÏbegebJfghÏbegebKfbIfg¦uÏgbKfbIfo¦iÐorepbrmnopqrstefghefghbIfbrijklefghefghefghbIfbebrmnopqrstefghefghbIfbrijklefghefghefghbIfbe~tu«rfjuÏjjpj¦gÙgkjÐoh¥gpÏgeøghÏgeù÷g¦iÏgù~÷~o¦fÐoreppk¦gÙwÏge ù ~ù ~Åªiânfgem~ge~jppvÏpflÏfs­reppg¥l¦f±rengefllÑgÏjsjs­l¦erfgÐf¦ef¦e¯tg¥k¦e±i¥qfpk¦f¬i¥t¦gÙeÏgbqeeeeeeeeeeeeeeeek}Öroh¥gbÂgebÄbUfg¦mÏgo¦gÐorepbrmnopqrstefghijklbUfbekr«rfpr¦gÙt¦gÙÏeÏgkrÐoh¥gge g¦iÏgo¦fÐorepplt±re¨eeå¤út¦gÙeÏpk¦vÐ¦ÕÖ¦uÏjmge h¥t¦gÙeÏuge~gäqªi¥bqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeee¦eqfpbx¦erpghobqeeeeeeeeeeeeeeeebqeeeeeeeeeeeeeeeeh¥gbeeebJfobeeebKfbIfgbeeubJfobeeubKfbIfgbeebJfobeebKfbIfgbeebJfobeebKfbIfbKfbIfbKfbIfbKfbIfbKfbIfg¦¥Ðgo¦¥Ðoir¦uÏr¯repjpf~ bebf÷bg÷bh÷~bebf÷bg÷bh÷g¥fk³rekfÐr¦i´iäf¦gÙgbqeeeeeeeeeeeeeeeebebqeeeeeeeeeeeeeeee~bebxr¦áÖsoh¥gpÏbegebJfghÏbegebKfbIfg¦uÏgbKfbIfo¦iÐorepbrmnopqrstefghefghbIfbrijklefghefghefghbIfbebrmnopqrstefghefghbIfbrijklefghefghefghbIfbe~rs«rffsÏjfpf¦gÙgkfÐoh¥gpÏgeøghÏgeù÷g¦iÏgù~÷~o¦fÐoreppk¦gÙuÏge ù ~ù ~Åªiântgem~ge~jpp¦iÏpt¦fÏtl¬reppppe°tÙÆ×ÌÊÙÄËÊÆÙÚ×ÊØjlÆÙÔÒÎÈØtÒÚÙÆÇÑÊÌÑÔÇÆÑØlØÎÒÉpÇÚÑÐÒÊÒÔ×ÞmØÎÌÓÊÝÙ`;
  const scalarWasm = String.raw`dynEncode010fff699321p|,ooot}|t|~P*r~t{ptnnwtpnqptÿ ¡O/PW/Pz0/P]O/Pz0/P0/Py10O/0/0/0P0O//9//y19¡G//9/9¡G//9/9¡G//9/9¡G/1Py0/1Py0/Py0//Py1Y//YOO//9/9¡G/Py0/Py0//Py1Y//y0//y0/Py1/V/P[/P0/90/PU0/PU0/0O///9¡1GO///9/9¡G/PU//9/9¡G///9/9¡G//y0/Pz1O/1PWP/Pz0/Pz0O//y19/¢1//y19£/¡/9/¢1/9£¡/9/¢1/9£¡/9/¢1/9£¡0//£/¡//£¡//£¡//£¡0/Py0//Py1Y/PPy1/]//zP//P1y9/¢1//y9£/¡0//£/¡0/Py/0/Pz/U//z0//P1y0//y0O/9/¢1/£/9/¢1/£/¡¡0//9£//9£/¡¡0/Py0/Py0/Pz1//ÁRÎ¡1¤Ê//¤Ê®/Ê±²ÅàOP0SÿN0&S0'O///////PE/PE/PYO/P0/Pz1P^O/0//10O/!/9Ê¯/9Ê¯/9Ê¯/9Ê¯0!/Py0/Pz1/O/P/y0/0O/!/9Ê¯0!/Py0/Pz1/P^O/0//10O/"/9Ê¯/9Ê¯/9Ê¯/9Ê¯0"/Py0/Pz1/O/P/y0O/"/9Ê¯0"/Py0/Pz1/Pz0/Á0 /PWOP0P/"Å/ ¤0P0/0O/9/¢1/£/¡/9/¢1/£¡/9/¢1/£¡/9/¢1/£¡0/Py0/Py1/WP0/PzPPy/Pz0/Á0 P0/"/Æ1"²Å0O//]//zP1/P/y0/0O/9/¢1/£/¡0/Py0/Pz1//y/0//zPZ//z0/P/y0O/9/¢1/£/9/¢1/£/9/¢1/£/9/¢1/£/¡¡¡¡0/Py0/Pz1/ RÎ¡0 P0/O/0O//9/¢G//9/¢G//9/¢G//9/¢G/Py0/Py1/W// ¤0//z0O//]/0//zP1O//y0/P/y0O//9/¢G/Py0/Pz1//zPZ//z0/P/y0O//9/¢G//9/¢G//9/¢G//9/¢G/Py0/Pz1/ 0O/P[OP0/P0/P0/&/"²0#P0/0P0O/!/9Ê°0$//y9Ê0%/90///!/#±Å//1 /nT//E// G//0/$/%¯0!//y0//y1/WO/P[///{1y1///W*0P0//z1P/PY*0O/P[O/'0!/P0O/PzPXO/'0!/P/y0/'0!//10O/!/9Ê¯/9Ê¯/9Ê¯/9Ê¯0!/Py0/Pz1/T/P/Py/y0O/!/9Ê¯0!/Py0/Pz1//]/P0/&/"²0"/P/y0O/!/9Ê°0#//y9Ê0$/90///!/"±Å//1 /nTO//E// G/#/$¯0!/Py0/Py1/V;pvtnutpt:|pq{t<v{~qp{:xv}<t`;
  const simdHeapBase = 66560;
  const scalarHeapBase = 66560;
  // END generated variables

  class SynAudio {
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
            ? WebAssembly.compile(e(simdWasm))
            : WebAssembly.compile(e(scalarWasm)),
        );
        wasmModule.set(this._module);
      }

      this._heapBase = wasmHeapBase.get(SynAudio);
      if (!this._heapBase) {
        this._heapBase = simd().then((simdSupported) =>
          simdSupported ? simdHeapBase : scalarHeapBase,
        );
        wasmHeapBase.set(this._heapBase);
      }

      this.SynAudioWorker = function SynAudioWorker(
        module,
        heapBase,
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
                    Promise.resolve(msg.data.heapBase),
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

          Promise.all([this._module, this._heapBase]).then(
            ([module, heapBase]) => {
              worker.postMessage({
                module,
                heapBase,
                params,
              });
            },
          );

          return result;
        };

        this._syncWasmMemory = (
          memory,
          aPtr,
          aSamplesDecoded,
          aChannelDataLength,
          bPtr,
          bSamplesDecoded,
          bChannelDataLength,
          correlationSampleSize,
          initialGranularity,
          bestCorrelationPtr,
          bestSampleOffsetPtr,
        ) => {
          return this._module
            .then((module) =>
              WebAssembly.instantiate(module, {
                env: { memory },
              }),
            )
            .then(({ exports }) => {
              const instanceExports = new Map(Object.entries(exports));

              const correlate = instanceExports.get("correlate");
              const heapView = new DataView(memory.buffer);

              correlate(
                aPtr,
                aSamplesDecoded,
                aChannelDataLength,
                bPtr,
                bSamplesDecoded,
                bChannelDataLength,
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

        this._sync = (a, b) => {
          return this._heapBase.then((heapBase) => {
            const pageSize = 64 * 1024;
            const floatByteLength = Float32Array.BYTES_PER_ELEMENT;

            const aLen =
              a.samplesDecoded * a.channelData.length * floatByteLength;
            const bLen =
              b.samplesDecoded * b.channelData.length * floatByteLength;
            const outVariablesLen = 2 * floatByteLength;

            const memorySize =
              (aLen + bLen + outVariablesLen + heapBase) / pageSize + 4;
            const memory = new WebAssembly.Memory({
              initial: memorySize,
              maximum: memorySize,
              shared: true,
            });
            const dataArray = new Float32Array(memory.buffer);

            const aPtr = heapBase;
            const bPtr = this._setAudioDataOnHeap(a.channelData, dataArray, aPtr);
            const bestCorrelationPtr = this._setAudioDataOnHeap(
              b.channelData,
              dataArray,
              bPtr,
            );
            const bestSampleOffsetPtr = bestCorrelationPtr + floatByteLength;

            const correlationSampleSize = this._getCorrelationSampleSize(a, b);
            const initialGranularity = this._getInitialGranularity(a, b);

            return this._syncWasmMemory(
              memory,
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
          });
        };

        this._syncOneToMany = (
          a,
          bArray,
          threads = 1,
          progressCallback = () => {},
        ) => {
          return this._heapBase.then((heapBase) => {
            const pageSize = 64 * 1024;
            const floatByteLength = Float32Array.BYTES_PER_ELEMENT;

            const aLen =
              a.samplesDecoded * a.channelData.length * floatByteLength;
            const bArrayLen = bArray.reduce(
              (acc, b) =>
                b.samplesDecoded * b.channelData.length * floatByteLength + acc,
              0,
            );
            const outVariablesLen = bArray.length * (2 * floatByteLength);

            const memorySize =
              (aLen + bArrayLen + outVariablesLen + heapBase) / pageSize + 4;
            const memory = new WebAssembly.Memory({
              initial: memorySize,
              maximum: memorySize,
              shared: true,
            });
            const dataArray = new Float32Array(memory.buffer);

            // build the parameters
            const aPtr = heapBase;
            let bPtr = this._setAudioDataOnHeap(a.channelData, dataArray, aPtr);

            const syncParameters = bArray.map((b) => {
              const bestCorrelationPtr = this._setAudioDataOnHeap(
                b.channelData,
                dataArray,
                bPtr,
              );
              const bestSampleOffsetPtr = bestCorrelationPtr + floatByteLength;
              const nextBPtr = bestSampleOffsetPtr + floatByteLength;

              const correlationSampleSize = this._getCorrelationSampleSize(a, b);
              const initialGranularity = this._getInitialGranularity(a, b);

              const params = [
                memory,
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
              ];

              bPtr = nextBPtr;
              return params;
            });

            // start tasks concurrently, limiting by a defined thread count
            let taskIndex = 0;
            let activeCount = 0;
            let doneCount = 0;
            const results = new Array(syncParameters.length);

            return new Promise((resolve, reject) => {
              progressCallback(0);
              const runNext = () => {
                // All tasks have been started
                if (taskIndex >= syncParameters.length) {
                  if (activeCount === 0) resolve(results);
                  return;
                }

                // Start a new task
                const currentIndex = taskIndex++;
                activeCount++;

                this._executeAsWorker(
                  "_syncWasmMemory",
                  syncParameters[currentIndex],
                )
                  .then((result) => {
                    results[currentIndex] = result;
                  })
                  .catch(reject)
                  .finally(() => {
                    activeCount--;
                    doneCount++;
                    progressCallback(doneCount / results.length);
                    runNext(); // Start the next task
                  });

                // If we haven't reached the limit, start another one
                if (activeCount < threads) runNext();
              };

              runNext();
            });
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

        // needed to serialize minified code when methods are referenced as a string
        // prettier-ignore
        this._workerMethods = new Map([
          ["_sync", this._sync],
          ["_syncWasmMemory", this._syncWasmMemory],
          ["_syncOneToMany", this._syncOneToMany],
          ["_syncWorker", this._syncWorker],
          ["_syncWorkerConcurrent", this._syncWorkerConcurrent],
        ]);

        this._module = module;
        this._heapBase = heapBase;
        this._correlationSampleSize = correlationSampleSize;
        this._initialGranularity = initialGranularity;
      };

      this._instance = new this.SynAudioWorker(
        this._module,
        this._heapBase,
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

    async syncOneToMany(a, bArray, threads, progressCallback) {
      return this._instance._syncOneToMany(a, bArray, threads, progressCallback);
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

  return SynAudio;

}));
