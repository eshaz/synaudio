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
const simdWasm = String.raw`dynEncode010fe4732c5fp|o!t}|t|~P*r~t{ptnnwtpnqptÙ1Ö1OP0'S0<OO/PW/Pz0%/P ]O//P z1P1P y1//Y*1P0&//&/zPy0//P1Py1/P/PPOzy0$/P0"/Py0/POz0 //zPz1PZ0!/Py1//&zy0O/0/0O////y1ó///ó/////ó///?/?ó?/POz0/Pz1O//[/0O/!T/ /"/#{1y/$X//$y/ Z/ 0/0O///y/ó/Py0/Py1/0/&T//Py0O///y9/9¡G/Py0//Py1Y//"y0/#Py1#/%V/P[//P1 y/Z//PPz/{y/ZP/PX0/P0/P?y0$/P/y0"/Py0!//'0OP0O/TO////#{P1y/óO/PU/!//!y/!ó/PU/"//"y/"ó/PU/$//$y/$ó//1U/0/O//y0//Py0/0O///y9/9¡G/Py0/Pz1//zPZ//z0//Py0O///y19/9¡G//9/9¡G//9/9¡G//9/9¡G/Py0/Pz1// y0/#Py1#/%VO/PW/Pz0$/P ]O//P z1P1P y1//W*1P0%//%/zPy0//P1Py1/P/PPOzy0"/P0!/Py0/POz0P0//zPz1PZ0 /Py1//%zy0P0#O/0/0O////y1ó///ó/////ó///?/?ó?/POz0/Pz1O//[/0O/ T//!/#{1y/"X//"y/Z/0/0O///y/ó/Py0/Py1/0/%T//Py0O///y9/9¡G/Py0//Py1Y//!y0/#Py1#/$V/P[//P1y/Z//PPz/{y/ZP/PX0/P0/P?y0"/P/y0!/Py0 //'0P0P0#OP0O/TO////#{P1y/óO/PU/ // y/ ó/PU/!//!y/!ó/PU/"//"y/"ó//1U/0/O//y0//Py0/0O///y9/9¡G/Py0/Pz1//zPZ//z0//Py0O///y19/9¡G//9/9¡G//9/9¡G//9/9¡G/Py0/Pz1//y0/#Py1#/$VP0!/PE/PE/PYO/P0O/Pz1PXOP0/0//'10O/8/9Ê¯/9Ê¯/9Ê¯/9Ê¯08/Py0/Pz1/O//Py0/0O/8/9Ê¯08/Py0/Pz1O/PXOP0/0//'10O/9/9Ê¯/9Ê¯/9Ê¯/9Ê¯09/Py0/Pz1/O//Py0O/9/9Ê¯09/Py0/Pz1/Pz0/9/Æ19²Å0)P/P W)/)"04P0/0O/1//4ô12/2õó//4ô12/2õó///4ô12/2õó/?/4ô12/2õó01/POz0//Py1YP0!/P zPPy/Pz0/</Æ19²Å0)P0/1./1./1./1.¡¡¡0*O//]//zP1//Py0/0O/9/)¢1(/(£/*¡0*/Py0/Pz1//y/0//zPZ//z0//Py0O/9/)¢1(/(£/9/)¢1(/(£/9/)¢1(/(£/9/)¢1(/(£/*¡¡¡¡0*/Py0/Pz1P0/!O/)"02/0O///2ô///2ô////2ô///?/2ô?/POz0//Py1Y/*/ÁRÎ¡1.¤0(//z0 O//[///z1PZ//Py0/)"02/P10O///2ô/Py0/Pz1//U//y/1z0//Py0O//9/)¢G/Py0/Pz1/( 0,/ PYO/P0/Pz0/P zPPy0/90)/,Ê0:P0/0O//Py1900/8/9²Å0//!TO0103P//"05P0P00301O/3//y1/5ô16//y1õó//5ô17/õó///5ô14//õó/?/5ô12/?õó03/1/6/6õó/7/7õó/4/4õó/2/2õó01/POz0//Py1Y/0/1./1./1./1.¡¡¡0*/3./3./3./3.¡¡¡0+O//]//zP//P1y9//¢1(//y9£/+¡0+/(/(£/*¡0*/Py/0//U/P0//z0O//y19//¢1-//y19£/9//¢1(/9£/+¡¡0+/-/-£/(/(£/*¡¡0*/Py0/Pz1//Py9Ê0;/)/+/.¤Ê/*/.¤Ê®/:±²Å1(l//E//(G/(/)0)/8/0Ê°/;¯08//y0//y1/ WO/P[/71//{1y1/ // W*0P0//z1P/PY*0O/P[O/<08/P0O/PzPXO/<08//Py0/<08//'10O/8/9Ê¯/9Ê¯/9Ê¯/9Ê¯08/Py0/Pz1/T//P/Pyy0O/8/9Ê¯08/Py0/Pz1//]/Pz0//Py0/P zPPy0/90)/,Ê0:O//Py1900/8/9²Å0,/!TO0103P/,"05P0/0/00301O/3//5ô16/õó//5ô17/õó///5ô14//õó/?/5ô12/?õó03/1/6/6õó/7/7õó/4/4õó/2/2õó01/POz0/POz0//Py1Y/0/1./1./1./1.¡¡¡0*/3./3./3./3.¡¡¡0+O//]//zP//P1y9/,¢1(//y9£/+¡0+/(/(£/*¡0*/Py/0//U/P0//z0O//y19/,¢1-//y19£/9/,¢1(/9£/+¡¡0+/-/-£/(/(£/*¡¡0*/Py0/Pz1//Py9Ê0;/)/+/.¤Ê/*/.¤Ê®/:±²Å1(l//E//(G/(/)0)/8/0Ê°/;¯08/Py0/Py1/VZpvtnutpt:p~|xr:|pq{t<v{~qp{:x|s@AG:q{z<|t|~:xv}<t`;
const scalarWasm = String.raw`dynEncode010f317f7943p|,ooot}|t|~P*r~t{ptnnwtpnqptà ¡O/PW/Pz0/P]O/Pz0/P0/Py10O/0/0/0P0O///y19/9¡G//9/9¡G//9/9¡G//9/9¡G/1Py0/1Py0/Py0//Py1Y//YOO//9/9¡G/Py0/Py0//Py1Y//y0//y0/Py1/V/P[/P0/90/PU0/PU0/0O//9/¡1GO///9/9¡G/PU//9/9¡G///9/9¡G//y0/Pz1O/1PWP/Pz0/Pz0O//y19/¢1//y19£/9/¢1/9£/9/¢1/9£/9/¢1/9£/¡¡¡¡0//£//£//£//£/¡¡¡¡0/Py0//Py1Y/PPy1/]//zP//P1y9/¢1//y9£/¡0//£/¡0/Py/0/Pz/U//z0//P1y0//y0O/9/¢1/£/9/¢1/£/¡¡0//9£//9£/¡¡0/Py0/Py0/Pz1//ÁRÎ¡1¤Ê//¤Ê®/Ê±²ÅÁOP0S0%O///////PE/PE/PYO/P0/Pz1P^O/0//10O/!/9Ê¯/9Ê¯/9Ê¯/9Ê¯0!/Py0/Pz1/O/P/y0/0O/!/9Ê¯0!/Py0/Pz1/P^O/0//10O/"/9Ê¯/9Ê¯/9Ê¯/9Ê¯0"/Py0/Pz1/O/P/y0O/"/9Ê¯0"/Py0/Pz1/Pz0/Á0 /PWOP0P/"Å/ ¤0P0/0O/9/¢1/£/9/¢1/£/9/¢1/£/9/¢1/£/¡¡¡¡0/Py0/Py1/WP0/PzPPy/Pz0/Á0 P0/"/Æ1"²Å0O//]//zP1/P/y0/0O/9/¢1/£/¡0/Py0/Pz1//y/0//zPZ//z0/P/y0O/9/¢1/£/9/¢1/£/9/¢1/£/9/¢1/£/¡¡¡¡0/Py0/Pz1P0/O/0O//9/¢G//9/¢G//9/¢G//9/¢G/Py0/Py1/W// RÎ¡¤0//z0O//]/0//zP1O//y0/P/y0O//9/¢G/Py0/Pz1//zPZ//z0/P/y0O//9/¢G//9/¢G//9/¢G//9/¢G/Py0/Pz1/ 0O/P[OP0/P0/P0P0/0P0O/!/9Ê°0#//y9Ê0$/90///!/"²Å//1 /m//E// G//0/#/$¯0!//y0//y1/WO/P[///{1y1///W*0P0//z1P/PY*0O/P[O/%0!/P0O/PzPXO/%0!/P/y0/%0!//10O/!/9Ê¯/9Ê¯/9Ê¯/9Ê¯0!/Py0/Pz1/T/P/Py/y0O/!/9Ê¯0!/Py0/Pz1//]/P0/P/y0O/!/9Ê°0#//y9Ê0$/90///!/"²Å//1 /mO//E// G/#/$¯0!/Py0/Py1/V;pvtnutpt:|pq{t<v{~qp{:xv}<t`;
const simdHeapBase = 66560;
const scalarHeapBase = 66560;
// END generated variables

export default class SynAudio {
  constructor(options = {}) {
    this._correlationSampleSize =
      options.correlationSampleSize > 0 ? options.correlationSampleSize : 11025;
    this._initialGranularity =
      options.initialGranularity > 0 ? options.initialGranularity : 16;
    this._correlationThreshold =
      options.correlationThreshold >= 0 ? options.correlationThreshold : 0.5;

    this._module = wasmModule.get(SynAudio);
    this._heapBase = simd().then((simdSupported) =>
      simdSupported ? simdHeapBase : scalarHeapBase,
    );

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

      this._syncOneToMany = (a, bArray) => {
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

          const aPtr = heapBase;
          let bPtr = this._setAudioDataOnHeap(a.channelData, dataArray, aPtr);

          return Promise.all(
            bArray.map((b) => {
              const bestCorrelationPtr = this._setAudioDataOnHeap(
                b.channelData,
                dataArray,
                bPtr,
              );
              const bestSampleOffsetPtr = bestCorrelationPtr + floatByteLength;
              const nextBPtr = bestSampleOffsetPtr + floatByteLength;

              const correlationSampleSize = this._getCorrelationSampleSize(
                a,
                b,
              );
              const initialGranularity = this._getInitialGranularity(a, b);

              const syncPromise = this._executeAsWorker("_syncWasmMemory", [
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
              ]);

              bPtr = nextBPtr;
              return syncPromise;
            }),
          );
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

      this._syncOneToManyWorker = (a, bArray) => {
        return this._executeAsWorker("_syncOneToMany", [a, bArray]);
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

  async syncOneToManyWorker(a, bArray) {
    return this._instance._syncOneToManyWorker(a, bArray);
  }

  async syncOneToMany(a, bArray) {
    return this._instance._syncOneToMany(a, bArray);
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
