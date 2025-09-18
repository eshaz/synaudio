import fs from "fs/promises";
import { dynamicEncode } from "simple-yenc";

import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { rollup } from "rollup";
import { minify } from "terser";

const synAudioPath = "src/SynAudio.js";
const distPath = "dist/";
const demoPath = "demo/";

const rollupInput = "index.js";
const rollupOutput = "synaudio.js";
const rollupConfigPath = "rollup.json";

const terserOutput = "synaudio.min.js";
const terserConfigPath = "terser.json";

const build = async (simdPath, scalarPath, simdHeapBase, scalarHeapBase) => {
  const [synAudio, simdWasm, scalarWasm] = await Promise.all([
    fs.readFile(synAudioPath).then((buffer) => buffer.toString()),
    fs.readFile(simdPath).then((data) => dynamicEncode(data, "`")),
    fs.readFile(scalarPath).then((data) => dynamicEncode(data, "`")),
  ]);

  const simdMatcher =
    /(?<begin>const simdWasm = String.raw`)(?<wasm>[\s\S]*?)(?<end>`;)/;
  const scalarMatcher =
    /(?<begin>const scalarWasm = String.raw`)(?<wasm>[\s\S]*?)(?<end>`;)/;
  const simdHeapBaseMatcher =
    /(?<begin>const simdHeapBase = )(?<heapbase>[\s\S]*?)(?<end>;)/;
  const scalarHeapBaseMatcher =
    /(?<begin>const scalarHeapBase = )(?<heapbase>[\s\S]*?)(?<end>;)/;

  const simdContent = synAudio.match(simdMatcher);
  const scalarContent = synAudio.match(scalarMatcher);
  const simdHeapBaseContent = synAudio.match(simdHeapBaseMatcher);
  const scalarHeapBaseContent = synAudio.match(scalarHeapBaseMatcher);

  const simdStart = simdContent.index;
  const simdEnd = simdStart + simdContent[0].length;

  const scalarStart = scalarContent.index;
  const scalarEnd = scalarStart + scalarContent[0].length;

  const simdHeapBaseStart = simdHeapBaseContent.index;
  const simdHeapBaseEnd = simdHeapBaseStart + simdHeapBaseContent[0].length;

  const scalarHeapBaseStart = scalarHeapBaseContent.index;
  const scalarHeapBaseEnd =
    scalarHeapBaseStart + scalarHeapBaseContent[0].length;

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
      synAudio.substring(scalarEnd, simdHeapBaseStart),
      simdHeapBaseContent.groups.begin,
      simdHeapBase,
      simdHeapBaseContent.groups.end,
      synAudio.substring(simdHeapBaseEnd, scalarHeapBaseStart),
      scalarHeapBaseContent.groups.begin,
      scalarHeapBase,
      scalarHeapBaseContent.groups.end,
      synAudio.substring(scalarHeapBaseEnd),
    ].map(Buffer.from),
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

  const rollupOutputConfig = JSON.parse(rollupConfig).output;
  rollupOutputConfig.file = distPath + rollupOutput;

  const bundle = await rollup(rollupInputConfig);
  const bundleOutput = await bundle
    .generate(rollupOutputConfig)
    .then(({ output }) => output[0]);

  // terser
  const minified = await minify(
    { [bundleOutput.fileName]: bundleOutput.code },
    terserConfig,
  );

  // write output files
  await Promise.all([
    bundle.write(rollupOutputConfig),
    fs.writeFile(distPath + terserOutput, minified.code),
    fs.writeFile(distPath + terserOutput + ".map", minified.map),
    fs.writeFile(demoPath + rollupOutput, bundleOutput.code),
    fs.writeFile(demoPath + terserOutput, minified.code),
    fs.writeFile(demoPath + terserOutput + ".map", minified.map),
  ]);
};

const simdPath = process.argv[2];
const scalarPath = process.argv[3];
const simdHeapBase = process.argv[4];
const scalarHeapBase = process.argv[5];

await build(simdPath, scalarPath, simdHeapBase, scalarHeapBase);
