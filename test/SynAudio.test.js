import fs from "fs/promises";

import SynAudio from "../src/SynAudio.js";

describe("SynAudio", () => {
  let fullMpeg, cutMpeg;

  beforeAll(async () => {
    [fullMpeg, cutMpeg] = await Promise.all([
      fs.readFile("test/data/mpeg.cbr.mp3"),
      fs.readFile("test/data/mpeg.cbr.1601425.mp3"),
    ]);
  });

  /*it("should find the best covariance between two clips", async () => {
    const synAudio = new SynAudio();

    const result = await synAudio.sync(fullMpeg, cutMpeg);

    expect(result).toEqual(1600849); // 1601425
  });*/

  it("should find the best covariance between two clips wasm", async () => {
    const synAudio = new SynAudio();

    const wasm = await fs.readFile("src/correlate.wasm");

    const result = await synAudio.syncWASM(fullMpeg, cutMpeg, wasm);

    expect(result).toEqual(1600849); // 1601425
  });
});
