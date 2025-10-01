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

const build = async (
  simdPath,
  scalarPath,
  sharedPath,
  simdHeapBase,
  scalarHeapBase,
  sharedHeapBase,
) => {
  const [synAudio, simdWasm, scalarWasm, sharedWasm] = await Promise.all([
    fs.readFile(synAudioPath).then((buffer) => buffer.toString()),
    fs.readFile(simdPath).then((data) => dynamicEncode(data, "`")),
    fs.readFile(scalarPath).then((data) => dynamicEncode(data, "`")),
    fs.readFile(sharedPath).then((data) => dynamicEncode(data, "`")),
  ]);

  const simdMatcher =
    /(?<begin>const simdWasm = String.raw`)(?<wasm>[\s\S]*?)(?<end>`;)/;
  const scalarMatcher =
    /(?<begin>const scalarWasm = String.raw`)(?<wasm>[\s\S]*?)(?<end>`;)/;
  const sharedMatcher =
    /(?<begin>const sharedWasm = String.raw`)(?<wasm>[\s\S]*?)(?<end>`;)/;
  const simdHeapBaseMatcher =
    /(?<begin>const simdHeapBase = )(?<heapbase>[\s\S]*?)(?<end>;)/;
  const scalarHeapBaseMatcher =
    /(?<begin>const scalarHeapBase = )(?<heapbase>[\s\S]*?)(?<end>;)/;
  const sharedHeapBaseMatcher =
    /(?<begin>const sharedHeapBase = )(?<heapbase>[\s\S]*?)(?<end>;)/;

  const simdContent = synAudio.match(simdMatcher);
  const scalarContent = synAudio.match(scalarMatcher);
  const sharedContent = synAudio.match(sharedMatcher);
  const simdHeapBaseContent = synAudio.match(simdHeapBaseMatcher);
  const scalarHeapBaseContent = synAudio.match(scalarHeapBaseMatcher);
  const sharedHeapBaseContent = synAudio.match(sharedHeapBaseMatcher);

  const simdStart = simdContent.index;
  const simdEnd = simdStart + simdContent[0].length;

  const scalarStart = scalarContent.index;
  const scalarEnd = scalarStart + scalarContent[0].length;

  const sharedStart = sharedContent.index;
  const sharedEnd = sharedStart + sharedContent[0].length;

  const simdHeapBaseStart = simdHeapBaseContent.index;
  const simdHeapBaseEnd = simdHeapBaseStart + simdHeapBaseContent[0].length;

  const scalarHeapBaseStart = scalarHeapBaseContent.index;
  const scalarHeapBaseEnd =
    scalarHeapBaseStart + scalarHeapBaseContent[0].length;

  const sharedHeapBaseStart = sharedHeapBaseContent.index;
  const sharedHeapBaseEnd =
    sharedHeapBaseStart + sharedHeapBaseContent[0].length;

  // Concatenate the strings as buffers to preserve extended ascii
  const finalString = Buffer.concat(
    [
      // code before variables
      synAudio.substring(0, simdStart),
      // simd wasm
      simdContent.groups.begin,
      simdWasm,
      simdContent.groups.end,
      // scalar wasm
      synAudio.substring(simdEnd, scalarStart),
      scalarContent.groups.begin,
      scalarWasm,
      scalarContent.groups.end,
      // shared wasm
      synAudio.substring(scalarEnd, sharedStart),
      sharedContent.groups.begin,
      sharedWasm,
      sharedContent.groups.end,
      // simd heap base
      synAudio.substring(sharedEnd, simdHeapBaseStart),
      simdHeapBaseContent.groups.begin,
      simdHeapBase,
      simdHeapBaseContent.groups.end,
      // scalar heap base
      synAudio.substring(simdHeapBaseEnd, scalarHeapBaseStart),
      scalarHeapBaseContent.groups.begin,
      scalarHeapBase,
      scalarHeapBaseContent.groups.end,
      // shared heap base
      synAudio.substring(scalarHeapBaseEnd, sharedHeapBaseStart),
      sharedHeapBaseContent.groups.begin,
      sharedHeapBase,
      sharedHeapBaseContent.groups.end,
      // code after variables
      synAudio.substring(sharedHeapBaseEnd),
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
const sharedPath = process.argv[4];
const simdHeapBase = process.argv[5];
const scalarHeapBase = process.argv[6];
const sharedHeapBase = process.argv[7];

await build(
  simdPath,
  scalarPath,
  sharedPath,
  simdHeapBase,
  scalarHeapBase,
  sharedHeapBase,
);
