import fs from "fs/promises";

import SynAudio from "../src/SynAudio.js";

describe("SynAudio", () => {
  it("should find the best covariance between two clips", async () => {
    const synAudio = new SynAudio();

    const [fullMpeg, cutMpeg] = await Promise.all([
      fs.readFile("test/data/mpeg.cbr.mp3"),
      fs.readFile("test/data/mpeg.cbr.1601425.mp3"),
    ]);

    const result = await synAudio.sync(fullMpeg, cutMpeg);

    expect(result.sample).toEqual(1600849); // 1601425
  });
});
