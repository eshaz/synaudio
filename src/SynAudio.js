import { MPEGDecoderWebWorker } from "mpg123-decoder";

export default class SynAudio {
  constructor() {
    this._covarianceSampleSize = 5000;
  }

  async decode(audioData) {
    let decoder = new MPEGDecoderWebWorker(),
      decodedAudio;

    await decoder.ready.then(() =>
      decoder
        .decode(audioData)
        .then((decoded) => (decodedAudio = decoded))
        .then(() => decoder.free())
    );

    return decodedAudio;
  }

  async sync(a, b) {
    const [decodedA, decodedB] = await Promise.all([
      this.decode(a),
      this.decode(b),
    ]);

    // sum the channels
    const audioA = [];

    for (let i = 0; i < decodedA.samplesDecoded; i++) {
      audioA[i] = 0;
      for (let j = 0; j < decodedA.channelData.length; j++)
        audioA[i] += decodedA.channelData[j][i];
    }

    const audioB = [];

    for (let i = 0; i < decodedB.samplesDecoded; i++) {
      audioB[i] = 0;
      for (let j = 0; j < decodedB.channelData.length; j++)
        audioB[i] += decodedB.channelData[j][i];
    }

    // find highest covariance
    const sampleOffset = { covariance: 0, sample: 0 };

    for (let sample = audioA.length - 1; sample >= 0; sample--) {
      let covariance = 0,
        samplesRemaining = audioA.length - sample;

      for (
        let j =
          (this._covarianceSampleSize < samplesRemaining
            ? this._covarianceSampleSize
            : samplesRemaining) - 1;
        j >= 0;
        j--
      ) {
        covariance += audioA[sample + j] * audioB[j];
      }

      if (sampleOffset.covariance < covariance) {
        sampleOffset.covariance = covariance;
        sampleOffset.sample = sample;
      }
    }

    return sampleOffset;
  }
}
