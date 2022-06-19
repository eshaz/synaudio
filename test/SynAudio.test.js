import fs from "fs/promises";

import SynAudio from "../src/SynAudio.js";

describe("SynAudio", () => {
  let wasm,
    fullMpeg,
    cut_1601425_Mpeg,
    cut_287549_Mpeg,
    cut_2450800_Mpeg,
    cut_194648_Mpeg,
    cut_194648_64_Mpeg,
    cut_194648_32_Mpeg,
    cut_194648_32_gen2_Mpeg,
    cut_194648_32_gen3_Mpeg,
    cut_194648_32_gen4_Mpeg,
    cut_194648_32_gen5_Mpeg,
    cut_194648_32_gen6_Mpeg,
    cut_194648_32_gen7_Mpeg,
    cut_194648_32_gen8_Mpeg,
    cut_194648_32_gen9_Mpeg,
    cut_194648_32_gen10_Mpeg,
    cut_194648_32_gen11_Mpeg,
    cut_194648_32_gen12_Mpeg,
    cut_194648_32_gen13_Mpeg,
    cut_194648_32_gen14_Mpeg,
    cut_194648_32_gen15_Mpeg,
    cut_194648_32_gen16_Mpeg,
    cut_194648_32_gen17_Mpeg,
    cut_194648_32_gen18_Mpeg,
    cut_194648_32_gen19_Mpeg,
    cut_194648_32_gen20_Mpeg;

  beforeAll(async () => {
    [
      wasm,
      fullMpeg,
      cut_1601425_Mpeg,
      cut_287549_Mpeg,
      cut_2450800_Mpeg,
      cut_194648_Mpeg,
      cut_194648_64_Mpeg,
      cut_194648_32_Mpeg,
      cut_194648_32_gen2_Mpeg,
      cut_194648_32_gen3_Mpeg,
      cut_194648_32_gen4_Mpeg,
      cut_194648_32_gen5_Mpeg,
      cut_194648_32_gen6_Mpeg,
      cut_194648_32_gen7_Mpeg,
      cut_194648_32_gen8_Mpeg,
      cut_194648_32_gen9_Mpeg,
      cut_194648_32_gen10_Mpeg,
      cut_194648_32_gen11_Mpeg,
      cut_194648_32_gen12_Mpeg,
      cut_194648_32_gen13_Mpeg,
      cut_194648_32_gen14_Mpeg,
      cut_194648_32_gen15_Mpeg,
      cut_194648_32_gen16_Mpeg,
      cut_194648_32_gen17_Mpeg,
      cut_194648_32_gen18_Mpeg,
      cut_194648_32_gen19_Mpeg,
      cut_194648_32_gen20_Mpeg,
    ] = await Promise.all([
      fs.readFile("src/correlate.wasm"),
      fs.readFile("test/data/mpeg.cbr.mp3"),
      fs.readFile("test/data/mpeg.cbr.1601425.mp3"),
      fs.readFile("test/data/mpeg.cbr.287549.mp3"),
      fs.readFile("test/data/mpeg.cbr.2450800.mp3"),
      fs.readFile("test/data/mpeg.cbr.194648.mp3"),
      fs.readFile("test/data/mpeg.64.194648.mp3"),
      fs.readFile("test/data/mpeg.32.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen2.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen3.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen4.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen5.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen6.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen7.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen8.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen9.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen10.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen11.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen12.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen13.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen14.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen15.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen16.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen17.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen18.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen19.194648.mp3"),
      fs.readFile("test/data/mpeg.32.gen20.194648.mp3"),
    ]);
  });

  it("should find the sample accurate sync point between two clips 1600849", async () => {
    const synAudio = new SynAudio({
      covarianceSampleSize: 5000,
      initialGranularity: 16,
    });

    const result = await synAudio.syncWASM(fullMpeg, cut_1601425_Mpeg, wasm);

    expect(result.sampleOffset).toEqual(1600849); // trim = 576
  });

  it("should find the sample accurate sync point between two clips 287549", async () => {
    const synAudio = new SynAudio({
      covarianceSampleSize: 11025,
      initialGranularity: 64,
    });

    const result = await synAudio.syncWASM(fullMpeg, cut_287549_Mpeg, wasm);

    expect(result.sampleOffset).toEqual(286973);
  });

  it("should find the sample accurate sync point between two clips 2450224", async () => {
    const synAudio = new SynAudio({
      covarianceSampleSize: 5000,
      initialGranularity: 16,
    });

    const result = await synAudio.syncWASM(fullMpeg, cut_2450800_Mpeg, wasm);

    expect(result.sampleOffset).toEqual(2450224);
  });

  it("should find the sample accurate sync point between two clips 194072", async () => {
    const synAudio = new SynAudio({
      covarianceSampleSize: 11025,
      initialGranularity: 32,
    });

    const result = await synAudio.syncWASM(fullMpeg, cut_194648_Mpeg, wasm);

    expect(result.sampleOffset).toEqual(194072);
  });

  it("should find the sample accurate sync point between two clips 194072 64kbs", async () => {
    const synAudio = new SynAudio({
      covarianceSampleSize: 11025,
      initialGranularity: 32,
    });

    const result = await synAudio.syncWASM(fullMpeg, cut_194648_64_Mpeg, wasm);

    expect(result.sampleOffset).toEqual(194072);
  });

  it("should find the sample accurate sync point between two clips 194072 32kbs", async () => {
    const synAudio = new SynAudio({
      covarianceSampleSize: 11025,
      initialGranularity: 32,
    });

    const result = await synAudio.syncWASM(fullMpeg, cut_194648_32_Mpeg, wasm);

    expect(result.sampleOffset).toEqual(194072);
  });

  describe("Generational encoding", () => {
    it("should find the sample accurate sync point between two clips 194072 32kbs 2nd generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen2_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(193496); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 3nd generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen3_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(192920); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 3rd generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen3_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(192920); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 4th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen4_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(192344); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 5th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen5_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(191768); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 6th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen6_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(191192); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 7th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen7_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(190616); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 8th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen8_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(190040); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 9th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen9_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(189464); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 10th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen10_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(188888); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 11th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen11_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(188312); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 12th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen12_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(187736); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 13th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen13_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(187160); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 14th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen14_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(186584); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 15th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen15_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(186008); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 16th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen16_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(185432); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 17th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen17_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(184856); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 18th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen18_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(184280); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 19th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen19_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(183704); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });

    it("should find the sample accurate sync point between two clips 194072 32kbs 20th generation", async () => {
      const synAudio = new SynAudio({
        covarianceSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await synAudio.syncWASM(
        fullMpeg,
        cut_194648_32_gen20_Mpeg,
        wasm
      );

      expect(result.sampleOffset).toEqual(183128); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
    });
  });
});
