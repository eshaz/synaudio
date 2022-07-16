import fs from "fs/promises";
import { dynamicEncode } from "simple-yenc";

import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { rollup } from "rollup";
import { minify } from "terser";

const synAudioPath = "src/SynAudio.js";

const rollupInput = "index.js";
const rollupOutput = "dist/synaudio.js";
const rollupConfigPath = "rollup.json";

const terserOutput = "dist/synaudio.min.js";
const terserConfigPath = "terser.json";

const build = async (simdPath, scalarPath) => {
  const [synAudio, simdWasm, scalarWasm] = await Promise.all([
    fs.readFile(synAudioPath).then((buffer) => buffer.toString()),
    fs.readFile(simdPath).then((data) => dynamicEncode(data, "`")),
    fs.readFile(scalarPath).then((data) => dynamicEncode(data, "`")),
  ]);

  const simdMatcher =
    /(?<begin>const simdWasm = String.raw`)(?<wasm>[\s\S]*?)(?<end>`;)/;
  const scalarMatcher =
    /(?<begin>const scalarWasm = String.raw`)(?<wasm>[\s\S]*?)(?<end>`;)/;

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

  const [rollupConfig, terserConfig] = await Promise.all([
    fs.readFile(rollupConfigPath).then((b) => b.toString()),
    fs.readFile(terserConfigPath).then((b) => JSON.parse(b.toString())),
  ]);

  // rollup
  const rollupInputConfig = JSON.parse(rollupConfig);
  rollupInputConfig.input = rollupInput;
  rollupInputConfig.plugins = [nodeResolve(), commonjs()];

  const rollupOutputConfig = JSON.parse(rollupConfig);
  rollupOutputConfig.output.file = rollupOutput;

  const bundle = await rollup(rollupInputConfig);
  const bundleOutput = await bundle
    .generate(rollupOutputConfig)
    .then(({ output }) => output[0]);

  // terser
  const minified = await minify(
    { [bundleOutput.fileName]: bundleOutput.code },
    terserConfig
  );

  // write output files
  await Promise.all([
    bundle.write(rollupOutputConfig),
    fs.writeFile(terserOutput, minified.code),
    fs.writeFile(terserOutput + ".map", minified.map),
  ]);
};

const simdPath = process.argv[2];
const scalarPath = process.argv[3];

await build(simdPath, scalarPath);
