import fs from "fs/promises";
import { MPEGDecoderWebWorker } from "mpg123-decoder";

import SynAudio from "synaudio";

const decode = async (audioData) => {
  let decodedAudio;
  const decoder = new MPEGDecoderWebWorker();

  await decoder.ready.then(() =>
    decoder
      .decode(audioData)
      .then((audio) => {
        decodedAudio = audio;
      })
      .then(() => decoder.free())
  );

  return decodedAudio;
};

const runTestSuite = (testData, testFunction, synAudioFunction, threads) => {
  testFunction("offset at 1600849", async () => {
    const synAudio = new SynAudio({
      correlationSampleSize: 5000,
      initialGranularity: 16,
    });

    const result = await testData.then((data) =>
      synAudio[synAudioFunction](data.fullMpeg, data.cut_1601425_Mpeg, threads)
    );

    process.stdout.write("\n" + synAudioFunction + " offset at 1600849" + "\n");
    process.stdout.write("\t" + JSON.stringify(result) + "\n");

    expect(result.sampleOffset).toEqual(1600849);
    // first rendered MPEG frame is less similar
    //expect(result.trim).toBeGreaterThanOrEqual(576);
    //expect(result.trim).toBeLessThanOrEqual(576 * 2);
  });

  testFunction("offset at 287549", async () => {
    const synAudio = new SynAudio({
      correlationSampleSize: 11025,
      initialGranularity: 64,
    });

    const result = await testData.then((data) =>
      synAudio[synAudioFunction](data.fullMpeg, data.cut_287549_Mpeg, threads)
    );

    process.stdout.write("\n" + synAudioFunction + " offset at 287549" + "\n");
    process.stdout.write("\t" + JSON.stringify(result) + "\n");

    expect(result.sampleOffset).toEqual(286973);
    // first rendered MPEG frame is less similar
    //expect(result.trim).toBeGreaterThanOrEqual(576);
    //expect(result.trim).toBeLessThanOrEqual(576 * 2);
  });

  testFunction("offset at 2450224", async () => {
    const synAudio = new SynAudio({
      correlationSampleSize: 5000,
      initialGranularity: 16,
    });

    const result = await testData.then((data) =>
      synAudio[synAudioFunction](data.fullMpeg, data.cut_2450800_Mpeg, threads)
    );

    process.stdout.write("\n" + synAudioFunction + " offset at 2450224" + "\n");
    process.stdout.write("\t" + JSON.stringify(result) + "\n");

    expect(result.sampleOffset).toEqual(2450224);
    // first rendered MPEG frame is less similar
    //expect(result.trim).toBeGreaterThanOrEqual(576);
    //expect(result.trim).toBeLessThanOrEqual(576 * 2);
  });

  testFunction("offset at 194072", async () => {
    const synAudio = new SynAudio({
      correlationSampleSize: 11025,
      initialGranularity: 32,
    });

    const result = await testData.then((data) =>
      synAudio[synAudioFunction](data.fullMpeg, data.cut_194648_Mpeg, threads)
    );

    process.stdout.write("\n" + synAudioFunction + " offset at 194072" + "\n");
    process.stdout.write("\t" + JSON.stringify(result) + "\n");

    expect(result.sampleOffset).toEqual(194072);
    // first rendered MPEG frame is less similar
    const roundedTrim = Math.ceil(result.trim / 576) * 576;

    //expect(roundedTrim).toBeGreaterThanOrEqual(576);
    //expect(roundedTrim).toBeLessThanOrEqual(576 * 2);
  });

  testFunction("offset at 194072 64kbs", async () => {
    const synAudio = new SynAudio({
      correlationSampleSize: 8000,
      initialGranularity: 32,
    });

    const result = await testData.then((data) =>
      synAudio[synAudioFunction](
        data.fullMpeg,
        data.cut_194648_64_Mpeg,
        threads
      )
    );

    process.stdout.write(
      "\n" + synAudioFunction + " offset at 194072 64kbs" + "\n"
    );
    process.stdout.write("\t" + JSON.stringify(result) + "\n");

    expect(result.sampleOffset).toEqual(194072);
    // first rendered MPEG frame is less similar, in practice one would round up to the nearest MPEG frame and splice there
    const roundedTrim = Math.ceil(result.trim / 576) * 576;

    //expect(roundedTrim).toBeGreaterThanOrEqual(576);
    //expect(roundedTrim).toBeLessThanOrEqual(576 * 2);
  });

  testFunction("offset at 194072 32kbs", async () => {
    const synAudio = new SynAudio({
      correlationSampleSize: 11025,
      initialGranularity: 32,
    });

    const result = await testData.then((data) =>
      synAudio[synAudioFunction](
        data.fullMpeg,
        data.cut_194648_32_Mpeg,
        threads
      )
    );

    process.stdout.write(
      "\n" + synAudioFunction + " offset at 194072 32kbs" + "\n"
    );
    process.stdout.write("\t" + JSON.stringify(result) + "\n");

    expect(result.sampleOffset).toEqual(194072);
    // first rendered MPEG frame is less similar, in practice one would round up to the nearest MPEG frame and splice there
    const roundedTrim = Math.ceil(result.trim / 576) * 576;

    //expect(roundedTrim).toBeGreaterThanOrEqual(576);
    //expect(roundedTrim).toBeLessThanOrEqual(576 * 2);
  });

  describe("Generational encoding", () => {
    testFunction("offset at 194072 32kbs 2nd generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen2_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 2nd generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(193496); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 2);
      //expect(result.trim).toBeLessThanOrEqual(576 * 3);
    });

    testFunction("offset at 194072 32kbs 3nd generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen3_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 3nd generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(192920); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 3);
      //expect(result.trim).toBeLessThanOrEqual(576 * 4);
    });

    testFunction("offset at 194072 32kbs 4th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen4_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 4th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(192344); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar, in practice one would round up to the nearest MPEG frame and splice there
      const roundedTrim = Math.ceil(result.trim / 576) * 576;

      //expect(roundedTrim).toBeGreaterThanOrEqual(576 * 4);
      //expect(roundedTrim).toBeLessThanOrEqual(576 * 5);
    });

    testFunction("offset at 194072 32kbs 5th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen5_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 5th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(191768); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar, in practice one would round up to the nearest MPEG frame and splice there
      const roundedTrim = Math.ceil(result.trim / 576) * 576;

      //expect(roundedTrim).toBeGreaterThanOrEqual(576 * 5);
      //expect(roundedTrim).toBeLessThanOrEqual(576 * 6);
    });

    testFunction("offset at 194072 32kbs 6th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen6_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 6th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(191192); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar, in practice one would round up to the nearest MPEG frame and splice there
      const roundedTrim = Math.ceil(result.trim / 576) * 576;

      //expect(roundedTrim).toBeGreaterThanOrEqual(576 * 6);
      //expect(roundedTrim).toBeLessThanOrEqual(576 * 7);
    });

    testFunction("offset at 194072 32kbs 7th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 11025,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen7_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 7th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(190616); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 7);
      //expect(result.trim).toBeLessThanOrEqual(576 * 8);
    });

    testFunction("offset at 194072 32kbs 8th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen8_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 8th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(190040); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 8);
      //expect(result.trim).toBeLessThanOrEqual(576 * 9);
    });

    testFunction("offset at 194072 32kbs 9th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen9_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 9th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(189464); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 9);
      //expect(result.trim).toBeLessThanOrEqual(576 * 10);
    });

    testFunction("offset at 194072 32kbs 10th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen10_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 10th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(188888); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 10);
      //expect(result.trim).toBeLessThanOrEqual(576 * 11);
    });

    testFunction("offset at 194072 32kbs 11th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen11_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 11th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(188312); // 576 bytes added to beginning (one frame). Each reencode added a frame of
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 11);
      //expect(result.trim).toBeLessThanOrEqual(576 * 12);
    });

    testFunction("offset at 194072 32kbs 12th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen12_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 12th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(187736); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 12);
      //expect(result.trim).toBeLessThanOrEqual(576 * 13);
    });

    testFunction("offset at 194072 32kbs 13th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen13_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 13th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(187160); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 13);
      //expect(result.trim).toBeLessThanOrEqual(576 * 14);
    });

    testFunction("offset at 194072 32kbs 14th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen14_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 14th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(186584); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 14);
      //expect(result.trim).toBeLessThanOrEqual(576 * 15);
    });

    testFunction("offset at 194072 32kbs 15th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen15_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 15th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(186008); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 15);
      //expect(result.trim).toBeLessThanOrEqual(576 * 16);
    });

    testFunction("offset at 194072 32kbs 16th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen16_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 16th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(185432); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 16);
      //expect(result.trim).toBeLessThanOrEqual(576 * 17);
    });

    testFunction("offset at 194072 32kbs 17th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen17_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 17th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(184856); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 17);
      //expect(result.trim).toBeLessThanOrEqual(576 * 18);
    });

    testFunction("offset at 194072 32kbs 18th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen18_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 18th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(184280); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 18);
      //expect(result.trim).toBeLessThanOrEqual(576 * 19);
    });

    testFunction("offset at 194072 32kbs 19th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen19_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 19th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(183704); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 19);
      //expect(result.trim).toBeLessThanOrEqual(576 * 20);
    });

    testFunction("offset at 194072 32kbs 20th generation", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 22050,
        initialGranularity: 32,
      });

      const result = await testData.then((data) =>
        synAudio[synAudioFunction](
          data.fullMpeg,
          data.cut_194648_32_gen20_Mpeg,
          threads
        )
      );

      process.stdout.write(
        "\n" +
          synAudioFunction +
          " offset at 194072 32kbs 20th generation" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(183128); // 576 bytes added to beginning (one frame). Each reencode added a frame of silence
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576 * 20);
      //expect(result.trim).toBeLessThanOrEqual(576 * 21);
    });
  });
};

describe("SynAudio", () => {
  // prettier-ignore
  const testData = Promise.all([
    fs.readFile("demo/clips/bumblebee/mpeg.cbr.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.cbr.1601425.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.cbr.287549.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.cbr.2450800.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.312782.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.cbr.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.64.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen2.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen3.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen4.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen5.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen6.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen7.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen8.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen9.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen10.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen11.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen12.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen13.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen14.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen15.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen16.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen17.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen18.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen19.194648.mp3").then(data => decode(data)),
    fs.readFile("demo/clips/bumblebee/mpeg.32.gen20.194648.mp3").then(data => decode(data)),
  ]).then((data) => ({
    fullMpeg: data[0],
    cut_1601425_Mpeg: data[1],
    cut_287549_Mpeg: data[2],
    cut_2450800_Mpeg: data[3],
    cut_312782_32_Mpeg: data[4],
    cut_194648_Mpeg: data[5],
    cut_194648_64_Mpeg: data[6],
    cut_194648_32_Mpeg: data[7],
    cut_194648_32_gen2_Mpeg: data[8],
    cut_194648_32_gen3_Mpeg: data[9],
    cut_194648_32_gen4_Mpeg: data[10],
    cut_194648_32_gen5_Mpeg: data[11],
    cut_194648_32_gen6_Mpeg: data[12],
    cut_194648_32_gen7_Mpeg: data[13],
    cut_194648_32_gen8_Mpeg: data[14],
    cut_194648_32_gen9_Mpeg: data[15],
    cut_194648_32_gen10_Mpeg: data[16],
    cut_194648_32_gen11_Mpeg: data[17],
    cut_194648_32_gen12_Mpeg: data[18],
    cut_194648_32_gen13_Mpeg: data[19],
    cut_194648_32_gen14_Mpeg: data[20],
    cut_194648_32_gen15_Mpeg: data[21],
    cut_194648_32_gen16_Mpeg: data[22],
    cut_194648_32_gen17_Mpeg: data[23],
    cut_194648_32_gen18_Mpeg: data[24],
    cut_194648_32_gen19_Mpeg: data[25],
    cut_194648_32_gen20_Mpeg: data[26]
  }));

  /*
  describe("sync", () => {
    runTestSuite(testData, it.concurrent, "sync");
  });

  describe("syncWorker", () => {
    runTestSuite(testData, it.concurrent, "syncWorker");
  });

  describe("syncWorkerConcurrent", () => {
    runTestSuite(testData, it, "syncWorkerConcurrent", 8);
  });

  describe("initialGranularity", () => {
    it("offset at 194072 32kbs 20th generation when granularity is set to 1", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 14004,
        initialGranularity: 1,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorkerConcurrent(
          data.fullMpeg,
          data.cut_194648_32_gen20_Mpeg,
          16
        )
      );

      process.stdout.write(
        "\n" +
          "offset at 194072 32kbs 20th generation when granularity is set to 1" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(183128);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);

    it("offset at 194072 32kbs 20th generation when granularity is set to 2", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 14004,
        initialGranularity: 2,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorkerConcurrent(
          data.fullMpeg,
          data.cut_194648_32_gen20_Mpeg,
          16
        )
      );

      process.stdout.write(
        "\n" +
          "offset at 194072 32kbs 20th generation when granularity is set to 2" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(183128);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);

    it("offset at 194072 32kbs 20th generation when granularity is set to 3", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 14004,
        initialGranularity: 3,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorkerConcurrent(
          data.fullMpeg,
          data.cut_194648_32_gen20_Mpeg,
          16
        )
      );

      process.stdout.write(
        "\n" +
          "offset at 194072 32kbs 20th generation when granularity is set to 3" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(183128);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);
  });

  describe("correlationSampleSize", () => {
    it("offset at 2450800, correlationSampleSize 1219", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 1219,
        initialGranularity: 16,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorker(data.fullMpeg, data.cut_2450800_Mpeg)
      );

      process.stdout.write(
        "\n" + "offset at 2450800, correlationSampleSize 1200" + "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(2450224);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);

    it("offset at 2450800, correlationSampleSize 1200", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 1400,
        initialGranularity: 16,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorker(data.fullMpeg, data.cut_2450800_Mpeg)
      );

      process.stdout.write(
        "\n" + "offset at 2450800, correlationSampleSize 1200" + "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(2450224);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);

    it("offset at 2450800, correlationSampleSize 1441", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 1441,
        initialGranularity: 16,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorker(data.fullMpeg, data.cut_2450800_Mpeg)
      );

      process.stdout.write(
        "\n" + "offset at 2450800, correlationSampleSize 1441" + "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(2450224);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);

    it("offset at 2450800, correlationSampleSize 1442", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 1442,
        initialGranularity: 16,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorker(data.fullMpeg, data.cut_2450800_Mpeg)
      );

      process.stdout.write(
        "\n" + "offset at 2450800, correlationSampleSize 1442" + "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(2450224);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);

    it("offset at 2450800, correlationSampleSize 4000", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 4000,
        initialGranularity: 16,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorker(data.fullMpeg, data.cut_2450800_Mpeg)
      );

      process.stdout.write(
        "\n" + "offset at 2450800, correlationSampleSize 4000" + "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(2450224);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);

    it("offset at 2450800, correlationSampleSize 88200, syncWorkerConcurrent", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 88200,
        initialGranularity: 16,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorkerConcurrent(data.fullMpeg, data.cut_2450800_Mpeg, 16)
      );

      process.stdout.write(
        "\n" +
          "offset at 2450800, correlationSampleSize 88200, syncWorkerConcurrent" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(2450224);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);

    it("offset at 2450800, correlationSampleSize 88200, syncWorkerConcurrent high thread ratio", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 4000,
        initialGranularity: 16,
      });

      const result = await testData.then((data) =>
        synAudio.syncWorkerConcurrent(data.fullMpeg, data.cut_2450800_Mpeg, 219)
      );

      process.stdout.write(
        "\n" +
          "offset at 2450800, correlationSampleSize 88200, syncWorkerConcurrent high thread ratio" +
          "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(result.sampleOffset).toEqual(2450224);
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 10000);
  });

  describe("Web Worker", () => {
    it("running in parallel", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 11025,
        initialGranularity: 16,
      });

      const [
        cut_1601425_Mpeg_result,
        cut_287549_Mpeg_result,
        cut_2450800_Mpeg_result,
        cut_194648_Mpeg_result,
      ] = await Promise.all([
        testData.then((data) =>
          synAudio.syncWorker(data.fullMpeg, data.cut_1601425_Mpeg)
        ),
        testData.then((data) =>
          synAudio.syncWorker(data.fullMpeg, data.cut_287549_Mpeg)
        ),
        testData.then((data) =>
          synAudio.syncWorker(data.fullMpeg, data.cut_2450800_Mpeg)
        ),
        testData.then((data) =>
          synAudio.syncWorker(data.fullMpeg, data.cut_194648_Mpeg)
        ),
      ]);

      process.stdout.write("\n" + "running in parallel" + "\n");
      process.stdout.write(JSON.stringify(cut_1601425_Mpeg_result) + "\n");
      process.stdout.write(JSON.stringify(cut_287549_Mpeg_result) + "\n");
      process.stdout.write(JSON.stringify(cut_2450800_Mpeg_result) + "\n");
      process.stdout.write(JSON.stringify(cut_194648_Mpeg_result) + "\n");

      expect(cut_1601425_Mpeg_result.sampleOffset).toEqual(1600849);
      //expect(cut_1601425_Mpeg_result.trim).toBeGreaterThanOrEqual(576);
      //expect(cut_1601425_Mpeg_result.trim).toBeLessThanOrEqual(576 * 2);

      expect(cut_287549_Mpeg_result.sampleOffset).toEqual(286973);
      //expect(cut_287549_Mpeg_result.trim).toBeGreaterThanOrEqual(576);
      //expect(cut_287549_Mpeg_result.trim).toBeLessThanOrEqual(576 * 2);

      expect(cut_2450800_Mpeg_result.sampleOffset).toEqual(2450224);
      //expect(cut_2450800_Mpeg_result.trim).toBeGreaterThanOrEqual(576);
      //expect(cut_2450800_Mpeg_result.trim).toBeLessThanOrEqual(576 * 2);

      expect(cut_194648_Mpeg_result.sampleOffset).toEqual(194072);
      // first rendered MPEG frame is less similar, in practice one would round up to the nearest MPEG frame and splice there
      //const roundedTrim_194648 =
      //  Math.ceil(cut_194648_Mpeg_result.trim / 576) * 576;
      //expect(roundedTrim_194648).toBeGreaterThanOrEqual(576);
      //expect(roundedTrim_194648).toBeLessThanOrEqual(576 * 2);
    });

    it("running in parallel multi threaded", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 11025,
        initialGranularity: 16,
      });

      const [
        cut_1601425_Mpeg_result,
        cut_287549_Mpeg_result,
        cut_2450800_Mpeg_result,
        cut_194648_Mpeg_result,
      ] = await Promise.all([
        testData.then((data) =>
          synAudio.syncWorkerConcurrent(data.fullMpeg, data.cut_1601425_Mpeg, 4)
        ),
        testData.then((data) =>
          synAudio.syncWorkerConcurrent(data.fullMpeg, data.cut_287549_Mpeg, 4)
        ),
        testData.then((data) =>
          synAudio.syncWorkerConcurrent(data.fullMpeg, data.cut_2450800_Mpeg, 4)
        ),
        testData.then((data) =>
          synAudio.syncWorkerConcurrent(data.fullMpeg, data.cut_194648_Mpeg, 4)
        ),
      ]);

      process.stdout.write("\n" + "running in parallel multi threaded" + "\n");
      process.stdout.write(JSON.stringify(cut_1601425_Mpeg_result) + "\n");
      process.stdout.write(JSON.stringify(cut_287549_Mpeg_result) + "\n");
      process.stdout.write(JSON.stringify(cut_2450800_Mpeg_result) + "\n");
      process.stdout.write(JSON.stringify(cut_194648_Mpeg_result) + "\n");

      expect(cut_1601425_Mpeg_result.sampleOffset).toEqual(1600849);
      //expect(cut_1601425_Mpeg_result.trim).toBeGreaterThanOrEqual(576);
      //expect(cut_1601425_Mpeg_result.trim).toBeLessThanOrEqual(576 * 2);

      expect(cut_287549_Mpeg_result.sampleOffset).toEqual(286973);
      //expect(cut_287549_Mpeg_result.trim).toBeGreaterThanOrEqual(576);
      //expect(cut_287549_Mpeg_result.trim).toBeLessThanOrEqual(576 * 2);

      expect(cut_2450800_Mpeg_result.sampleOffset).toEqual(2450224);
      //expect(cut_2450800_Mpeg_result.trim).toBeGreaterThanOrEqual(576);
      //expect(cut_2450800_Mpeg_result.trim).toBeLessThanOrEqual(576 * 2);

      expect(cut_194648_Mpeg_result.sampleOffset).toEqual(194072);
      // first rendered MPEG frame is less similar, in practice one would round up to the nearest MPEG frame and splice there
      //const roundedTrim_194648 =
      //  Math.ceil(cut_194648_Mpeg_result.trim / 576) * 576;
      //expect(roundedTrim_194648).toBeGreaterThanOrEqual(576);
      //expect(roundedTrim_194648).toBeLessThanOrEqual(576 * 2);
    });
  });
  */

  describe("syncMultiple", () => {
    it("offset at 2450800, correlationSampleSize 1219", async () => {
      const synAudio = new SynAudio({
        correlationSampleSize: 44100,
        initialGranularity: 16,
      });

      const result = await testData.then((data) =>
        synAudio.syncMultiple({
          fullMpeg: data.fullMpeg,
          fullMpeg2: data.fullMpeg, // should detect and prevent cyc,
          cut_2450800_Mpeg: data.cut_2450800_Mpeg,
          cut_287549_Mpeg: data.cut_287549_Mpeg,
          cut_1601425_Mpeg: data.cut_1601425_Mpeg,
          cut_312782_32_Mpeg: data.cut_312782_32_Mpeg,
          cut_194648_Mpeg: data.cut_194648_Mpeg,
          cut_194648_2_Mpeg: data.cut_194648_Mpeg,
          //cut_194648_32_Mpeg: data.cut_194648_32_Mpeg,
          //cut_194648_32_gen2_Mpeg: data.cut_194648_32_gen2_Mpeg,
          //cut_194648_32_gen3_Mpeg: data.cut_194648_32_gen3_Mpeg,
          //cut_194648_32_gen4_Mpeg: data.cut_194648_32_gen4_Mpeg,
          //cut_194648_32_gen5_Mpeg: data.cut_194648_32_gen5_Mpeg,
          //cut_194648_32_gen6_Mpeg: data.cut_194648_32_gen6_Mpeg,
          //cut_194648_32_gen7_Mpeg: data.cut_194648_32_gen7_Mpeg,
          //cut_194648_32_gen8_Mpeg: data.cut_194648_32_gen8_Mpeg,
          //cut_194648_32_gen9_Mpeg: data.cut_194648_32_gen9_Mpeg,
          //cut_194648_32_gen10_Mpeg: data.cut_194648_32_gen10_Mpeg,
          //cut_194648_32_gen11_Mpeg: data.cut_194648_32_gen11_Mpeg,
          //cut_194648_32_gen12_Mpeg: data.cut_194648_32_gen12_Mpeg,
          //cut_194648_32_gen13_Mpeg: data.cut_194648_32_gen13_Mpeg,
          //cut_194648_32_gen14_Mpeg: data.cut_194648_32_gen14_Mpeg,
          //cut_194648_32_gen15_Mpeg: data.cut_194648_32_gen15_Mpeg,
          //cut_194648_32_gen16_Mpeg: data.cut_194648_32_gen16_Mpeg,
          //cut_194648_32_gen17_Mpeg: data.cut_194648_32_gen17_Mpeg,
          //cut_194648_32_gen18_Mpeg: data.cut_194648_32_gen18_Mpeg,
          //cut_194648_32_gen19_Mpeg: data.cut_194648_32_gen19_Mpeg,
          //cut_194648_32_gen20_Mpeg: data.cut_194648_32_gen20_Mpeg,
        })
      );

      process.stdout.write(
        "\n" + "offset at 2450800, correlationSampleSize 1200" + "\n"
      );
      process.stdout.write("\t" + JSON.stringify(result) + "\n");

      expect(true).toBeTruthy();
      // first rendered MPEG frame is less similar
      //expect(result.trim).toBeGreaterThanOrEqual(576);
      //expect(result.trim).toBeLessThanOrEqual(576 * 2);
    }, 100000);
  });
});
