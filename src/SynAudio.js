import { decode } from "simple-yenc";
import Worker from "web-worker";

// prettier-ignore
const simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]))

const wasmModule = new WeakMap();

/* WASM strings are embeded during the build */
const simdWasm = String.raw`dynEncode0064dÅ×ÑedddeseÄoãããããããããããdfsegÉÒÚjÑÉÑÓÖÝfdfgfedjleãd¥äìhokfmÇÓÖÖÉÐÅØÉddoÃÃÌÉÅÔÃÆÅ×Égdnwewhuãgàkßjáekek¬v¥hÓwf¤e¥d°qdf¥f¬qdf¥eÏx¥deÏye¥eÕze¥àÕoe¥fØ{dÎ|e¥hÏ}¥fÚ¥eÎf¥bccckÕpf¥eÕ~e¥h­tg¤esÐq¥dkf¤f¤tqdddeqÎ¥fØÎ­dq¥fØÎ|­Õqd¥df}¥h³h¤pjdkg¤kkrÎuadfdkadfdaHeaofdkuadftkadftaHeaoftk¥Îkf¥lÎfj¥fÏjqdoo~h¤df¥fØÎjdfqÎ¥fØÎadfdjadfdaHeaofdookeªqeok¥ã×fzh¤dk¥fØÎjdkqÎ¥fØÎfdjfdöfdk¥eÖkofyªqdekÏjk¥fØqrÎudkg¤kqÎfkuÎfdffdöfdffhffhöfhk¥lÎkj¥fÏjqdoor{Îrxs¥eÎs«qdoovwÏof¤i¥f¬qdhoho¬p¥d°qdi¥eÏxp¥eÕyp¥àÕhp¥fØzgÎ{p¥hÏ|¥fÚ¥eÎf¥bccckÕif¥eÕ}¥drp¥h­~¥dsg¤psÐq¥dkf¤f¤~qdggpqÎ¥fØÎ­gq¥fØÎ{­Õqd¥df|¥h³h¤ijgkg¤kkrÎtadfdkadfdaHeaofdktadftkadftaHeaoftk¥Îkf¥lÎfj¥fÏjqdoo}h¤gf¥fØÎjgfqÎ¥fØÎadfdjadfdaHeaofdophkªqeok¥eÖfyh¤gk¥fØÎjgkqÎ¥fØÎfdjfdöfdfkofpªqdpkÏjk¥fØqrÎtgkg¤kqÎfktÎufdffdöfdfufhffhöfhk¥lÎkj¥fÏjqdoorzÎrxs¥eÎs«qdoo¥din¥dfdm¥dfdeoÏpf¤o¥d°qdo¥gÕff¤vw¥ã×Îe¥g­h¤¥dhpeodko¥àÕhjg¤kfdkfhkflkfpk¥tÎkj¥hÏjqdoofh¤dh¥fØÎkfjg¤kfdk¥hÎkj¥eÏjqdoof¤e¥g­h¤¥depeogko¥àÕejg¤kfdkfhkflkfpk¥tÎkj¥hÏjqdoof©qdge¥fØÎkg¤kfdk¥hÎkf¥eÏfqdooop¥d®h¤l¥fØr§ddä#öo¥hÏsawoo¥i¬qde¥dhg¤dh¥fØÎfddhoÎ¥fØÎfdf¤qh¤apddddddddddddddddapddddddddddddddddapddddddddddddddddpeoaw¥djekgfapddddddddddddddddapddddddddddddddddapddddddddddddddddg¤kadddaIefadddaIeaJeaHek¥tÎkf¥tÎfaJeaHeaJeaHesj¥hÎj®qdooagafadaeöööùagafadaeöööùagafadaeöööùÂh¤nhfdmfdhioerÎephlÎh®qdool¥eØeiÎfpfp¬lieÏe¥de¥d®hf¤o¥d°h¤¨ddddddddpeovw¥ã×Îifão¥gÕe©h¤¨ddddddddhpeodh¥fØÎk¨ddddddddefg¤kfdk¥hÎkf¥eÏfqdoehÎoei¥g­qdde¥fØÎkhvÎeÏwÏfg¤kfdkfhkflkfpk¥tÎkf¥hÏfqdoohl¬h¤§ddä#öo¥hÏidh¥fØÎeawoo¥i¬pg¤dh¥fØÎfddhoÎ¥fØÎfdf¤ph¤apddddddddddddddddapddddddddddddddddapddddddddddddddddpeoaw¥djekgfapddddddddddddddddapddddddddddddddddapddddddddddddddddg¤kadddaIefadddaIeaJeaHek¥tÎkf¥tÎfaJeaHeaJeaHeij¥hÎj®qdooagafadaeöööùagafadaeöööùagafadaeöööùÂh¤nhfdmfdoe¥hÎelh¥eÎh«qdoood~sØÅÖËÉØÃÊÉÅØÙÖÉ×ek×ÍÑÈ`;
const scalarWasm = String.raw`dynEncode000eo{ns|{s{}O)q}szosmmvso~mpos..V/N.OZ.OV.Oy/.O/.O/.O/NO/.OUN./N...x0 8.8 F.. 8.8 F.Ox/..Ox0U.N..Ox0....zxOx8.8 F..x/..Ox0U...)/N.OV....V)0OZ.Oy/.O/.O/.O/O/O/NO/.OUN./N...x08.8 F..8.8 F.Ox/..Ox0U.N..Ox0....zxOx8.8 F..x/..Ox0UO/.OD.OD..y/N.OZ.O/N.Oy0OWNO/./.O0/N./.8É®.8É®.8É®.8É®//.Ox/.Oy0.N..Ox/./N./.8É®//.Ox/.Oy0N.OWNO/./.O0/N.0.8É®.8É®.8É®.8É®/0.Ox/.Oy0.S..Ox/N.0.8É®/0.Ox/.Oy0.0.À0&É±Ä/'.OXN.O/.Ox/.Ox/.O/ .&QÍ /).Oy0O/.O/.Å/0O/N..Ox0!80%É/1...xOx8/.Q/"Q/#Q/$N.OV.%./.0±Ä0%¡0#.8.'¡0$¢Q /"O/.#.#¢Q /#.$.$¢Q /$NN../././N.8.%¡0(.8.'¡0*¢.Oy8.%¡0+.Oy8.'¡0,¢."  /".*.*¢.,.,¢.$  /$.(.(¢.+.+¢.#  /#.Ox/.Ox/.Oy0./. S.O0.!x8.%¡0%..x8.'¡0(¢." /".(.(¢.$ /$.%.%¢.# /#.".)£É.#.)£É­.$.)£É­°±Ä0".-lN..D.."F."/-././.1¯..É®//..x/...x0X.O0.x0...V)/..y0O.OX)/N.OZNR//.Oy/.O0SNR//...Ox/R//./N./.8É®//.Ox/.Oy0..x/.OW..Ox/..x.y/N./.8É®.8É®.8É®.8É®//.Ox/.Oy0..VN.Ox/.O/.&QÍ /).Oy0O/.O/.O.xOx/.Å/0N..Ox080%É/1...xOx8/,Q/"Q/#Q/$N.OV.%./.0±Ä0%¡0#.8.'¡0$¢Q /"O/.#.#¢Q /#.$.$¢Q /$NN../././N.8.%¡0&.8.'¡0(¢.Oy8.%¡0*.Oy8.'¡0+¢."  /".(.(¢.+.+¢.$  /$.&.&¢.*.*¢.#  /#.Ox/.Ox/.Oy0./.S.O0.x8.%¡0%..x8.'¡0&¢." /".&.&¢.$ /$.%.%¢.# /#.".)£É.#.)£É­.$.)£É­°±Ä0".-lN..D.."F."/-./.1¯.,É®//.Ox/..Ox0U`;

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
            4,
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
              bestSampleOffsetPtr
            );

            const bestCovariance = heapView.getFloat32(bestCovariancePtr, true);
            const bestSampleOffset = heapView.getInt32(
              bestSampleOffsetPtr,
              true
            );

            return {
              sampleOffset: bestSampleOffset,
              correlation: bestCovariance,
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
