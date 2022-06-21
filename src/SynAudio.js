import { decode } from "simple-yenc";
import Worker from "web-worker";

// prettier-ignore
const simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]))

const wasmModule = new WeakMap();

/* WASM strings are embeded during the build */
const simdWasm = String.raw`dynEncode0064dÅ×ÑedddeteÄpããããããããããããdfsegÉÒÚjÑÉÑÓÖÝfdfgfedjleãd¥äìhokfmÇÓÖÖÉÐÅØÉddoÃÃÌÉÅÔÃÆÅ×Égdnzezhmßgàsãjáf¤e¥d°qdf¥f¬qdf¥eÏ¥deÏe¥eÕe¥àÕe¥fØdÎe¥hÏ¥fÚ¥eÎf¥bccckÕ}f¥eÕe¥h­g¤eÐ~¥dff¤f¤qddde~Î¥fØÎ­d~¥fØÎ­Õqd¥do¥h³h¤}jdfg¤ff|ÎadfdfadfdaHeaofdfadftfadftaHeaoftf¥Îfo¥lÎoj¥fÏjqdooh¤do¥fØÎfdo~Î¥fØÎadfdfadfdaHeaofdofeªqeof¥ã×jh¤df¥fØÎodf~Î¥fØÎfdofdöfdf¥eÖfojªqdefÏjf¥fØ~|Îdfg¤f~ÎofÎfdofdöfdofhofhöfhf¥lÎfj¥fÏjqdoo|Î|¥eÎ«qdoof¤h¥d°qdi¥f¬qdi¥eÏ~¥d|¥dhÏh¥eÕh¥àÕih¥fØgÎh¥hÏ¥fÚ¥eÎf¥bccckÕf¥eÕh¥h­¥dg¤hÐ}¥dff¤f¤qdggh}Î¥fØÎ­g}¥fØÎ­Õqd¥do¥h³h¤jgfg¤ff|ÎadfdfadfdaHeaofdfadftfadftaHeaoftf¥Îfo¥lÎoj¥fÏjqdooh¤go¥fØÎfgo}Î¥fØÎadfdfadfdaHeaofdohifªqeof¥ã×jh¤gf¥fØÎogf}Î¥fØÎfdofdöfdf¥eÖfojªqdhfÏjf¥fØ}|Îgfg¤f}ÎofÎfdofdöfdofhofhöfhf¥lÎfj¥fÏjqdoo|Î|~¥eÎ«qdoo¥dhn¥dfdm¥dfdekÏ|f¤k¥d°qdk¥gÕof¤k¥eÏi¥g­h¤¥depeodfk¥àÕejg¤yffdffhfflffpyf¥tÎfj¥hÏjqdoooh¤de¥fØÎfojg¤yffdyf¥hÎfj¥eÏjqdoof¤i¥g­h¤¥dipeogfk¥àÕijg¤zffdffhfflffpzf¥tÎfj¥hÏjqdooo©qdgi¥fØÎfg¤zffdzf¥hÎfo¥eÏoqdoozk|¥d®h¤l¥fØ§ddä#ök¥iÏe¥fÚ¥eÎf¥eÕ~f¥bccckÕ¥fØ}awukzk¥i¬e¥h­de¥dig¤di¥fØÎfd{dikÎ¥fØÎfdf¤h¤apddddddddddddddddpapddddddddddddddddqapddddddddddddddddrpeoyzawsapddddddddddddddddrfãh¤apddddddddddddddddqapddddddddddddddddp¥dpeojefgoapddddddddddddddddqapddddddddddddddddpg¤pfadddsaIetoaddduaIevaJeaHefaddtsaIewoaddtuaIexaJeaHeprvvaJeaHexxaJeaHerqttaJeaHewwaJeaHeqf¥Îfo¥Îoj¥fÏjqdo}of~©qdpf¥fØfÎadddsaIesfgÎaddduaIetaJeaHeprttaJeaHerqssaJeaHeqopagpafpadpaeöööùqagqafqadqaeöööùragrafradraeöööùÂh¤nifdmfdihoy{yeÎe|ilÎi®qdool¥eØjhÎhjÏif¤k¥d°h¤¨ddddddddypeok¥eÏlfãk¥gÕo©h¤¨ddddddddyipeohoÎedi¥fØÎf¨ddddddddyg¤yffdyf¥hÎfo¥eÏoqdoejÏoel¥g­qdde¥fØÎfhkÎeÏjÏog¤yffdffhfflffpyf¥tÎfo¥hÏoqdooi¬h¤§ddä#ödi¥fØÎek¥iÏf¥fÚ¥eÎh¥eÕ}h¥bccckÕh¥fØlawukzk¥i¬|f¥h­g¤di¥fØÎ~fd{dikÎ¥fØÎfdf¤|h¤apddddddddddddddddpapddddddddddddddddqapddddddddddddddddrpeoyzawsapddddddddddddddddrfãh¤apddddddddddddddddqapddddddddddddddddp¥dpeohjefgoapddddddddddddddddqapddddddddddddddddpg¤pfadddsaIetoaddduaIevaJeaHefaddtsaIewoaddtuaIexaJeaHeprvvaJeaHexxaJeaHerqttaJeaHewwaJeaHeqf¥Îfo¥Îoj¥fÏjqdolof}©qdpf¥fØf~ÎadddsaIesfgÎaddduaIetaJeaHeprttaJeaHerqssaJeaHeqopagpafpadpaeöööùqagqafqadqaeöööùragrafradraeöööùÂh¤nifdmfdoy{ye¥hÎei¥eÎi«qdoood~sØÅÖËÉØÃÊÉÅØÙÖÉ×ek×ÍÑÈ`;
const scalarWasm = String.raw`dynEncode000eo{ns|{s{}O)q}szosmmvso~mposýúN.OZ.OV.Oy/..O/,.O/+.O/-O/NO/.OUN./N...x0/8.8 F../8.8 F.Ox/.+.Ox0U.-N..Ox0....*zxOx8.8 F..,x/...*Ox0*UN.OZ.OV.Oy/.O/..O/,.O/+O/O/*NO/.OUN./N...x0-8.8 F..-8.8 F.Ox/.,.Ox0U.+N..Ox0....*zxOx8.8 F...x/..*Ox0*UO/.OD.OD..y/+N.OZ.O/N.Oy0OWNO/./.O0/N.'.8É®.8É®.8É®.8É®/'.Ox/.Oy0.N..Ox/./N.'.8É®/'.Ox/.Oy0N.OWNO/./.O0/N.(.8É®.8É®.8É®.8É®/(.Ox/.Oy0.S..Ox/N.(.8É®/(.Ox/.Oy0.(.À0É±Ä/.+OXN.O//.Ox/.Ox/*.O/0.QÍ /!.Oy0-O/..-O/,.Å/(O/N..Ox0180É/)...xOx8/&Q/Q/Q/N.OV..'.(±Ä0¡0.8.¡0¢Q /O/..¢Q /..¢Q /NN.-.,/./.*/N.8.¡0 .8.¡0"¢.Oy8.¡0#.Oy8.¡0$¢.  /."."¢.$.$¢.  /. . ¢.#.#¢.  /.Ox/.Ox/.Oy0../.0S.O0.1x8.¡0..x8.¡0 ¢. /. . ¢. /..¢. /..!£É..!£É­..!£É­°±Ä0.%lN..D..F./%./.'.)¯.&É®/'../x/.+..x0X.O0.x/,..y/N.OZNR/'.Oy/.O0SNR/'...x/..Ox/R/'N.'.8É®/'.Ox/.Oy0..y/.OW..Ox/..x.y.y/N.'.8É®.8É®.8É®.8É®/'.Ox/.Oy0..,VN.Ox/.O/-.QÍ /!.Oy0+O/*.+O/...yO.xOx/.Å/(N..Ox080É/)...xOx8/$Q/Q/Q/N.OV..'.(±Ä0¡0.8.¡0¢Q /O/..¢Q /..¢Q /NN.+../././N.8.¡0.8.¡0 ¢.Oy8.¡0".Oy8.¡0#¢.  /. . ¢.#.#¢.  /..¢."."¢.  /.Ox/.Ox/.Oy0.*/.-S.O0.x8.¡0..x8.¡0¢. /..¢. /..¢. /..!£É..!£É­..!£É­°±Ä0.%lN..D..F./%.'.)¯.$É®/'.Ox/.,.Ox0U`;

export default class SynAudio {
  constructor(options = {}) {
    this._correlationSampleSize = options.correlationSampleSize || 11025;
    this._initialGranularity = options.initialGranularity || 16;

    this._module = wasmModule.get(SynAudio);

    if (!this._module) {
      this._module = simd().then((simdSupported) =>
        simdSupported
          ? WebAssembly.compile(decode(simdWasm))
          : WebAssembly.compile(decode(scalarWasm))
      );
      wasmModule.set(this._module);
    }

    this.SynAudioWorker = function (
      module,
      correlationSampleSize,
      initialGranularity
    ) {
      this._setAudioDataOnHeap = (i, o, heapPos) => {
        const bytesPerElement = o.BYTES_PER_ELEMENT;

        let floatPos = heapPos / bytesPerElement;

        for (const channel of i) {
          heapPos += channel.length * bytesPerElement;
          o.set(channel, floatPos);
          floatPos += channel.length;
        }

        return heapPos;
      };

      this.sync = (a, b, sampleRate) => {
        const pageSize = 64 * 1024;
        const floatByteLength = Float32Array.BYTES_PER_ELEMENT;

        const memory = new WebAssembly.Memory({
          initial:
            ((a.samplesDecoded * a.channelData.length +
              b.samplesDecoded * b.channelData.length) *
              floatByteLength) /
              pageSize +
            2,
        });

        return this._module
          .then((module) =>
            WebAssembly.instantiate(module, {
              env: { memory },
            })
          )
          .then((wasm) => {
            const instanceExports = new Map(Object.entries(wasm.exports));

            const correlate = instanceExports.get("correlate");
            const dataArray = new Float32Array(memory.buffer);
            const heapView = new DataView(memory.buffer);

            const aPtr = instanceExports.get("__heap_base").value;
            const bPtr = this._setAudioDataOnHeap(
              a.channelData,
              dataArray,
              aPtr
            );
            const bestCovariancePtr = this._setAudioDataOnHeap(
              b.channelData,
              dataArray,
              bPtr
            );
            const bestSampleOffsetPtr = bestCovariancePtr + floatByteLength;
            const sampleTrimPtr = bestSampleOffsetPtr + floatByteLength;

            correlate(
              aPtr,
              a.samplesDecoded,
              a.channelData.length,
              bPtr,
              b.samplesDecoded,
              b.channelData.length,
              sampleRate,
              this._correlationSampleSize,
              this._initialGranularity,
              bestCovariancePtr,
              bestSampleOffsetPtr,
              sampleTrimPtr
            );

            const bestCovariance = heapView.getFloat32(bestCovariancePtr, true);
            const bestSampleOffset = heapView.getInt32(
              bestSampleOffsetPtr,
              true
            );
            const sampleTrim = heapView.getInt32(sampleTrimPtr, true);

            /*console.log({
              sampleOffset: bestSampleOffset,
              correlation: bestCovariance,
              trim: sampleTrim,
            });*/

            return {
              sampleOffset: bestSampleOffset,
              correlation: bestCovariance,
              trim: sampleTrim,
            };
          });
      };

      this._module = module;
      this._correlationSampleSize = correlationSampleSize;
      this._initialGranularity = initialGranularity;
    };
  }

  async syncWorker(a, b, sampleRate) {
    const webworkerSourceCode =
      "'use strict';" +
      `(${((SynAudioWorker, correlationSampleSize, initialGranularity) => {
        self.onmessage = ({ data: { module, a, b, sampleRate } }) => {
          const worker = new SynAudioWorker(
            Promise.resolve(module),
            correlationSampleSize,
            initialGranularity
          );

          worker.sync(a, b, sampleRate).then((results) => {
            self.postMessage(results);
          });
        };
      }).toString()})(${this.SynAudioWorker.toString()}, ${
        this._correlationSampleSize
      }, ${this._initialGranularity})`;

    let type = "text/javascript",
      source;

    try {
      // browser
      source = URL.createObjectURL(new Blob([webworkerSourceCode], { type }));
    } catch {
      // nodejs
      source = `data:${type};base64,${Buffer.from(webworkerSourceCode).toString(
        "base64"
      )}`;
    }

    const worker = new Worker(source, { name: "SynAudio" });

    const result = new Promise((resolve) => {
      worker.onmessage = (message) => {
        worker.terminate();
        resolve(message.data);
      };
    });

    this._module.then((module) => {
      worker.postMessage({
        module,
        a,
        b,
        sampleRate,
      });
    });

    return result;
  }

  async sync(a, b, sampleRate) {
    const worker = new this.SynAudioWorker(
      this._module,
      this._correlationSampleSize,
      this._initialGranularity
    );

    return worker.sync(a, b, sampleRate);
  }
}
