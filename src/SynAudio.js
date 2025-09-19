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
const wasmHeapBase = new WeakMap();

/* WASM strings are embedded during the build, do not manually edit the below */
// BEGIN generated variables
const simdWasm = String.raw`dynEncode010e324cc972o{ns|{s{}O)q}szosmmvso~mposó2ð2NRþM/;R/<NN.Oy0%S.OUN..Oy0O~0Ox0..Y)0O0#..yOx/.O.OONy..O0Ox0x/$.O/!.Ox/.ONy/..yOy0OY/".Ox0..#yx/N././N...x0.ò...ò.....ò...>.>ò>.ONy/.Oy0N..[./N."S.. .!z0x.$W..$x.Y././N....xò.Ox/.Ox0./.#S..Ox/N..8..x8 F.Ox/..Ox0Y..!x/. Ox0 .%U.ONy.Y..OOy.zx.YO/.O/.O>x/.O.x/.Ox/N././N.SN..... zO0xò....xò....xò....xòN..8..x08 F..8.8 F..8.8 F..8.8 F.Ox/.Oy0..x/. Ox0 .%UN.Oy0$S.OUN..Oy0O~0Ox0..W)0O/#..#.yOx/.O.OONy..O0Ox0x/!.O/".Ox/.ONy/O/..yOy0OY/.Ox0..#yx/O/ N././N...x0.ò...ò.....ò...>.>ò>.ONy/.Oy0N..[./N.S.. ."z0x.!W..!x.Y././N....xò.Ox/.Ox0./.#S..Ox/N..8..x8 F.Ox/..Ox0Y.."x/. Ox0 .$U.ONy.Y..OOy.zx.YO/.O/.O>x/.O.x/.Ox/O/O/ N././N.SN..... zO0xò....xò....xò....xòN..8..x08 F..8.8 F..8.8 F..8.8 F.Ox/.Oy0..x/. Ox0 .$UO/.OD.ODN.SNO~/NNN.OUN./.O0/N...kmþ/..Ox/.Oy0......þ//5..T..y/..Ox/N.5.8É®/5.Ox/.Oy0.OTNO/.O//.././N...kmþ/..Ox/.Oy0......þ//7..T..y/..Ox/N.7.8É®/7.Ox/.Oy0.7.Æ07±Ä/'.Oy0/.O/O/!O.'!/1O//../N..1ó0/./ô..ò..1ó0/./ôò...1ó0/./ôò.>.1ó0/./ôò/..ONy/..Ox0YO/!.OyO~Ox/..-..- ..- ..- /(N..]...y0O].(./...Ox/.'!/1.O0/N..1ó0/./ô..ò/..Ox/.Oy0......ò0/././ò-/(..T..x.0y/..Ox/N.8.'¡0&.&¢.( /(.Ox/.Oy0.ÁQÍ /,O/.!SN.'!//./N.../ó.../ó..../ó...>./ó>.ONy/..Ox0Y.(.,£/&N..[...y0OY..Ox/.'!//.O0/N.../ó.Ox/.Oy0..T..x.0y/..Ox/N..8.'¡F.Ox/.Oy0..y/".&/*..UN.O/.;.7±/8QM.,£/+.OyO~Ox/.8/'.*É/9O/./N..Ox08/&.5.8°Ä/-.!N/./0O.-!/2O/O//0/.N..x0.2ó03..x0ô.0ò..2ó04.ôò...2ó01..ôò.>.2ó0/.>ôò/0.3.3ô..ò.4.4ôò.1.1ôò././ôò/..ONy/..Ox0Y./.&É/6..-..- ..- ..- /(.0-.0- .0- .0- /)N..0[..y0O].O/.)./..(./0.-!//.O0/N..x./ó01..xô..ò/..Ox/.1.1ô.0ò/0.Oy0.....1ò0/././ò-/).0.0./ò0/././ò-/(..T..x.0O/..y/N..x8.-¡0&..x8¢.) /).Ox/.&.&¢.( /(.Oy0..Ox8É/:.5.6¯/6.'.).+¢É.(.+¢É­.9°±Ä0&nS..D..&F.&.'/'.6.:®/5..x/..x0."WN.O[.60..z0x0.".."W)/..y/N.SN.</5N.OTN.</5O/..Ox//..O0/N...kmþ/..Ox/.Oy0......þ//5..T..O.Ox.Oyx/..y/N.5.8É®/5.Ox/.Oy0..[..O.Oyx/.;.7±/8QM.,£/+.OyO~Ox/.8/'.*É/9N..Ox08/&.5.8°Ä/*.!N/./0O.*!/2O/././/0/.N..2ó03.ô.0ò..2ó04.ôò...2ó01..ôò.>.2ó0/.>ôò/0.3.3ô..ò.4.4ôò.1.1ôò././ôò/..ONy/.ONy/..Ox0Y./.&É/6..-..- ..- ..- /(.0-.0- .0- .0- /)N..]..y0O].O/.)./..(./0.*!//.O0/N..x./ó01..xô..ò/..Ox/.1.1ô.0ò/0.Oy0.....1ò0/././ò-/).0.0./ò0/././ò-/(..T..x.0O/..y/N..x8.*¡0&..x8¢.) /).Ox/.&.&¢.( /(.Oy0..Ox8É/:.5.6¯/6.'.).+¢É.(.+¢É­.9°±Ä0&nS..D..&F.&.'/'.6.:®/5.Ox/.Ox0.U`;
const scalarWasm = String.raw`dynEncode010e26c673ddo{+nnns|{s{}O)q}szosmmvso~mposàN.Oy0S.Oy0N.O/.Ox0/N./././O/N..8..x08 F..8.8 F..8.8 F..8.8 F.0Ox/.0Ox/.Ox/..Ox0Y..YNN..8.8 F.Ox/.Ox/..Ox0Y..x/..x/.Ox0.U.O/.8/.OT/.OT/./N...8 0FN...8.8 F.OT..8.8 F...8.8 F..x/.Oy0N.0Oy0.Oy/N..x08.¡0..x08¢. .8.¡0.8¢ .8.¡0.8¢ .8.¡0.8¢ /..¢. ..¢ ..¢ ..¢ /.Ox/..Ox0Y.OOxO0.]..yO..O0x8.¡0..x8¢. /..¢. /.Ox./.Oy.T..y/..O0x/..x/N.8.¡0.¢.8.¡0.¢.  /..8¢..8¢.  /.Ox/.Ox/.Oy0..ÁQÍ 0£É..£É­.É°±ÄÖNRþM/%R/&N.......OD.ODN.SNO/Q.O/.Oy0O]N./.O0/N. .8É®.8É®.8É®.8É®/ .Ox/.Oy0.N.O.x/./N. .8É®/ .Ox/.Oy0N.OWNO/./.O0/N.!.8É®.8É®.8É®.8É®/!.Ox/.Oy0.N.O.x/N.!.8É®/!.Ox/.Oy0.Á/.Oy0S.!Ä.£/O/./N.8.¡0.¢. .8.¡0.¢ .8.¡0.¢ .8.¡0.¢ /.Ox/..Ox0Y.OyOOx/OO/O/O/.!.Æ0$±Ä/N..[..yO0.O.x/./N.8.¡0.¢. /.Ox/.Oy0..x./..yOY..y/.O.x/N.8.¡0.¢.8.¡0.¢.8.¡0.¢.8.¡0.¢.    /.Ox/.Oy0.QÍ /O/.SN./N..8.¡F..8.¡F..8.¡F..8.¡F.Ox/..Ox0Y..£/N..]./..yO0N..x/.O.x/N..8.¡F.Ox/.Oy0..yOY..y/.O.x/N..8.¡F..8.¡F..8.¡F..8.¡F.Ox/.Oy0..y/./O/..UN.O/.O/.%.$±/"./O/N. .8É¯/#..x8É/!.8/... ."°Ä..0.mS..D..F../.#.!®/ ..x/..x0.WN.O[...z0x0...W)/..y/N.SN.&/ .O/N.OyOWN.&/ O/.O.x/.&/ .O0/N. .8É®.8É®.8É®.8É®/ .Ox/.Oy0.S.O.Ox.Oy.x/N. .8É®/ .Ox/.Oy0..].O.Oy.x/.O/.%.$±/"N. .8É¯/#..x8É/!.8/... ."°Ä..0.mSN..D..F.#.!®/ .Ox/.Ox0.U`;
const sharedWasm = String.raw`dynEncode010e1a4ff503o{n s|{s{}O)q}szosmmvso~mposó2ð2NRþM/;R/<NN.Oy0%S.OUN..Oy0O~0Ox0..Y)0O0#..yOx/.O.OONy..O0Ox0x/$.O/!.Ox/.ONy/..yOy0OY/".Ox0..#yx/N././N...x0.ò...ò.....ò...>.>ò>.ONy/.Oy0N..[./N."S.. .!z0x.$W..$x.Y././N....xò.Ox/.Ox0./.#S..Ox/N..8..x8 F.Ox/..Ox0Y..!x/. Ox0 .%U.ONy.Y..OOy.zx.YO/.O/.O>x/.O.x/.Ox/N././N.SN..... zO0xò....xò....xò....xòN..8..x08 F..8.8 F..8.8 F..8.8 F.Ox/.Oy0..x/. Ox0 .%UN.Oy0$S.OUN..Oy0O~0Ox0..W)0O/#..#.yOx/.O.OONy..O0Ox0x/!.O/".Ox/.ONy/O/..yOy0OY/.Ox0..#yx/O/ N././N...x0.ò...ò.....ò...>.>ò>.ONy/.Oy0N..[./N.S.. ."z0x.!W..!x.Y././N....xò.Ox/.Ox0./.#S..Ox/N..8..x8 F.Ox/..Ox0Y.."x/. Ox0 .$U.ONy.Y..OOy.zx.YO/.O/.O>x/.O.x/.Ox/O/O/ N././N.SN..... zO0xò....xò....xò....xòN..8..x08 F..8.8 F..8.8 F..8.8 F.Ox/.Oy0..x/. Ox0 .$UO/.OD.ODN.SNO~/NNN.OUN./.O0/N...kmþ/..Ox/.Oy0......þ//5..T..y/..Ox/N.5.8É®/5.Ox/.Oy0.OTNO/.O//.././N...kmþ/..Ox/.Oy0......þ//7..T..y/..Ox/N.7.8É®/7.Ox/.Oy0.7.Æ07±Ä/'.Oy0/.O/O/!O.'!/1O//../N..1ó0/./ô..ò..1ó0/./ôò...1ó0/./ôò.>.1ó0/./ôò/..ONy/..Ox0YO/!.OyO~Ox/..-..- ..- ..- /(N..]...y0O].(./...Ox/.'!/1.O0/N..1ó0/./ô..ò/..Ox/.Oy0......ò0/././ò-/(..T..x.0y/..Ox/N.8.'¡0&.&¢.( /(.Ox/.Oy0.ÁQÍ /,O/.!SN.'!//./N.../ó.../ó..../ó...>./ó>.ONy/..Ox0Y.(.,£/&N..[...y0OY..Ox/.'!//.O0/N.../ó.Ox/.Oy0..T..x.0y/..Ox/N..8.'¡F.Ox/.Oy0..y/".&/*..UN.O/.;.7±/8QM.,£/+.OyO~Ox/.8/'.*É/9O/./N..Ox08/&.5.8°Ä/-.!N/./0O.-!/2O/O//0/.N..x0.2ó03..x0ô.0ò..2ó04.ôò...2ó01..ôò.>.2ó0/.>ôò/0.3.3ô..ò.4.4ôò.1.1ôò././ôò/..ONy/..Ox0Y./.&É/6..-..- ..- ..- /(.0-.0- .0- .0- /)N..0[..y0O].O/.)./..(./0.-!//.O0/N..x./ó01..xô..ò/..Ox/.1.1ô.0ò/0.Oy0.....1ò0/././ò-/).0.0./ò0/././ò-/(..T..x.0O/..y/N..x8.-¡0&..x8¢.) /).Ox/.&.&¢.( /(.Oy0..Ox8É/:.5.6¯/6.'.).+¢É.(.+¢É­.9°±Ä0&nS..D..&F.&.'/'.6.:®/5..x/..x0."WN.O[.60..z0x0.".."W)/..y/N.SN.</5N.OTN.</5O/..Ox//..O0/N...kmþ/..Ox/.Oy0......þ//5..T..O.Ox.Oyx/..y/N.5.8É®/5.Ox/.Oy0..[..O.Oyx/.;.7±/8QM.,£/+.OyO~Ox/.8/'.*É/9N..Ox08/&.5.8°Ä/*.!N/./0O.*!/2O/././/0/.N..2ó03.ô.0ò..2ó04.ôò...2ó01..ôò.>.2ó0/.>ôò/0.3.3ô..ò.4.4ôò.1.1ôò././ôò/..ONy/.ONy/..Ox0Y./.&É/6..-..- ..- ..- /(.0-.0- .0- .0- /)N..]..y0O].O/.)./..(./0.*!//.O0/N..x./ó01..xô..ò/..Ox/.1.1ô.0ò/0.Oy0.....1ò0/././ò-/).0.0./ò0/././ò-/(..T..x.0O/..y/N..x8.*¡0&..x8¢.) /).Ox/.&.&¢.( /(.Oy0..Ox8É/:.5.6¯/6.'.).+¢É.(.+¢É­.9°±Ä0&nS..D..&F.&.'/'.6.:®/5.Ox/.Ox0.U`;
const simdHeapBase = 66560;
const scalarHeapBase = 66560;
const sharedHeapBase = 66560;
// END generated variables

export default class SynAudio {
  constructor(options = {}) {
    this._correlationSampleSize =
      options.correlationSampleSize > 0 ? options.correlationSampleSize : 11025;
    this._initialGranularity =
      options.initialGranularity > 0 ? options.initialGranularity : 16;
    this._correlationThreshold =
      options.correlationThreshold >= 0 ? options.correlationThreshold : 0.5;
    this._useSharedMemory = options.shared === true ? true : false;

    this._module = wasmModule.get(SynAudio);
    this._heapBase = wasmHeapBase.get(SynAudio);
    if (!this._module) {
      if (this._useSharedMemory) {
        this._module = WebAssembly.compile(decode(sharedWasm));
        this._heapBase = Promise.resolve(sharedHeapBase);
      } else {
        this._module = simd().then((simdSupported) =>
          simdSupported
            ? WebAssembly.compile(decode(simdWasm))
            : WebAssembly.compile(decode(scalarWasm)),
        );
        this._heapBase = simd().then((simdSupported) =>
          simdSupported ? simdHeapBase : scalarHeapBase,
        );
      }
      wasmModule.set(this._module);
      wasmHeapBase.set(this._heapBase);
    }

    this.SynAudioWorker = function SynAudioWorker(
      module,
      heapBase,
      useSharedMemory,
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

      this._setAudioDataOnHeap = (input, memory, heapPos) => {
        const output = new Float32Array(memory.buffer);
        let floatPos = heapPos / this._floatByteLength;

        // copy each channel
        for (let i = 0; i < input.length; i++) {
          heapPos += input[i].length * this._floatByteLength;
          output.set(input[i], floatPos);
          floatPos += input[i].length;
        }

        return heapPos;
      };

      /*
       * Memory Map (starting at heapBase)
       * float* varyingLength baseData
       *
       * for each comparisonData entry:
       * float* varyingLength comparisonData
       * float* 4 bytes       bestCorrelation
       * long*  4 bytes       bestSampleOffset
       */
      this._initWasmMemory = (a, bArray, heapBase) => {
        const aLen =
          a.samplesDecoded * a.channelData.length * this._floatByteLength;
        const bArrayLen = bArray.reduce(
          (acc, b) =>
            b.samplesDecoded * b.channelData.length * this._floatByteLength +
            acc,
          0,
        );
        const bestCorrelationLen = bArray.length * this._floatByteLength;
        const bestSampleOffsetLen = bArray.length * this._unsignedIntByteLength;

        const memoryPages =
          4 +
          (heapBase +
            aLen +
            bArrayLen +
            bestCorrelationLen +
            bestSampleOffsetLen) /
            this._pageSize;

        return new WebAssembly.Memory({
          initial: memoryPages,
          maximum: memoryPages,
          shared: this._useSharedMemory,
        });
      };

      this._setBaseAudioOnHeap = (a, memory, aPtr) => {
        const nextPtr = this._setAudioDataOnHeap(a.channelData, memory, aPtr);
        return [aPtr, nextPtr];
      };

      this._setComparisonAudioOnHeap = (b, memory, bPtr) => {
        const bestCorrelationPtr = this._setAudioDataOnHeap(
          b.channelData,
          memory,
          bPtr,
        );
        const bestSampleOffsetPtr = bestCorrelationPtr + this._floatByteLength;
        const nextPtr = bestSampleOffsetPtr + this._floatByteLength;
        return [bPtr, bestCorrelationPtr, bestSampleOffsetPtr, nextPtr];
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
                useSharedMemory,
                correlationSampleSize,
                initialGranularity,
              ) => {
                self.onmessage = (msg) => {
                  const worker = new SynAudioWorker(
                    Promise.resolve(msg.data.module),
                    Promise.resolve(msg.data.heapBase),
                    useSharedMemory,
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
              }).toString()})(${SynAudioWorker.toString()}, "${functionName}", ${this._useSharedMemory}, ${
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

      this._runCorrelate = (
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
            const bestSampleOffset = heapView.getUint32(
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
          const memory = this._initWasmMemory(a, [b], heapBase);

          let aPtr, bPtr, bestCorrelationPtr, bestSampleOffsetPtr, heapPosition;
          [aPtr, heapPosition] = this._setBaseAudioOnHeap(a, memory, heapBase);
          [bPtr, bestCorrelationPtr, bestSampleOffsetPtr, heapPosition] =
            this._setComparisonAudioOnHeap(b, memory, heapPosition);

          const correlationSampleSize = this._getCorrelationSampleSize(a, b);
          const initialGranularity = this._getInitialGranularity(a, b);

          return this._runCorrelate(
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
          const memory = this._initWasmMemory(a, bArray, heapBase);

          // build the parameters, copy the data to the heap
          let aPtr, bPtr, bestCorrelationPtr, bestSampleOffsetPtr, heapPosition;
          [aPtr, heapPosition] = this._setBaseAudioOnHeap(a, memory, heapBase);

          const syncParameters = bArray.map((b) => {
            [bPtr, bestCorrelationPtr, bestSampleOffsetPtr, heapPosition] =
              this._setComparisonAudioOnHeap(b, memory, heapPosition);

            const correlationSampleSize = this._getCorrelationSampleSize(a, b);
            const initialGranularity = this._getInitialGranularity(a, b);

            // optionally set boundaries for the base data
            let syncStart = b.syncStart || 0;
            let syncEnd = b.syncEnd || a.samplesDecoded;
            if (syncEnd - syncStart < b.samplesDecoded) {
              syncStart = 0;
              syncEnd = a.samplesDecoded;
            }

            const baseOffset = Math.min(
              a.samplesDecoded,
              Math.max(0, syncStart),
            );
            const baseSampleLength = Math.min(
              a.samplesDecoded - baseOffset,
              Math.max(0, baseOffset + syncEnd),
            );

            const params = [
              memory,
              aPtr + baseOffset * a.channelData.length * this._floatByteLength,
              baseSampleLength,
              a.channelData.length,
              bPtr,
              b.samplesDecoded,
              b.channelData.length,
              correlationSampleSize,
              initialGranularity,
              bestCorrelationPtr,
              bestSampleOffsetPtr,
            ];
            return [params, baseOffset];
          });

          a = null;
          bArray = null;

          // start tasks concurrently, limiting the number of threads
          let taskIndex = 0;
          let activeCount = 0;
          let doneCount = 0;
          const results = new Array(syncParameters.length);
          const running = [];

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

              const promise = this._executeAsWorker(
                "_syncWasmMemory",
                syncParameters[currentIndex][0],
              )
                .then((result) => {
                  result.sampleOffset += syncParameters[currentIndex][1];
                  results[currentIndex] = result;
                })
                .catch(reject)
                .finally(() => {
                  activeCount--;
                  doneCount++;
                  progressCallback(doneCount / results.length);
                  runNext(); // Start the next task
                });

              running.push(promise);

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
        ["_syncWasmMemory", this._runCorrelate],
        ["_syncOneToMany", this._syncOneToMany],
        ["_syncWorker", this._syncWorker],
        ["_syncWorkerConcurrent", this._syncWorkerConcurrent],
      ]);

      this._module = module;
      this._heapBase = heapBase;
      this._useSharedMemory = useSharedMemory;
      this._correlationSampleSize = correlationSampleSize;
      this._initialGranularity = initialGranularity;

      this._pageSize = 64 * 1024;
      this._floatByteLength = Float32Array.BYTES_PER_ELEMENT;
      this._unsignedIntByteLength = Uint32Array.BYTES_PER_ELEMENT;
    };

    this._instance = new this.SynAudioWorker(
      this._module,
      this._heapBase,
      this._useSharedMemory,
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
    const result = this._instance._syncOneToMany(
      a,
      bArray,
      threads,
      progressCallback,
    );
    a = null;
    bArray = null;
    return result;
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
