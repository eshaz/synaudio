import fs from "fs/promises";
import { dynamicEncode } from "simple-yenc";

const synAudioPath = "src/SynAudio.js";

const embedWasm = async (simdPath, scalarPath) => {
  const [synAudio, simdWasm, scalarWasm] = await Promise.all([
    fs.readFile(synAudioPath).then((buffer) => buffer.toString()),
    fs.readFile(simdPath).then((data) => dynamicEncode(data, "`")),
    fs.readFile(scalarPath).then((data) => dynamicEncode(data, "`")),
  ]);

  const simdMatcher =
    /(?<begin>const simdWasm = String.raw`)(?<wasm>.*?)(?<end>`;)/;
  const scalarMatcher =
    /(?<begin>const scalarWasm = String.raw`)(?<wasm>.*?)(?<end>`;)/;

  const simdContent = synAudio.match(simdMatcher);
  const scalarContent = synAudio.match(scalarMatcher);

  const simdStart = simdContent.index;
  const simdEnd = simdStart + simdContent[0].length;

  const scalarStart = scalarContent.index;
  const scalarEnd = scalarStart + scalarContent[0].length;

  // Concatenate the strings as buffers to preserve extended ascii
  const finalString = Buffer.concat(
    [
      synAudio.substring(0, simdStart),
      simdContent.groups.begin,
      simdWasm,
      simdContent.groups.end,
      synAudio.substring(simdEnd, scalarStart),
      scalarContent.groups.begin,
      scalarWasm,
      scalarContent.groups.end,
      synAudio.substring(scalarEnd),
    ].map(Buffer.from)
  );

  await fs.writeFile(synAudioPath, finalString, { encoding: "binary" });
};

const simdPath = process.argv[2];
const scalarPath = process.argv[3];

await embedWasm(simdPath, scalarPath);
