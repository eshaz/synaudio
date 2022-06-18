//import { MPEGDecoderWebWorker } from "./mpg123-decoder.min.js";

const MPEGDecoderWebWorker = window["mpg123-decoder"].MPEGDecoderWebWorker;

export default class SynAudio {
  constructor() {
    this._decoder = new MPEGDecoderWebWorker();
    this._covarianceSampleSize = 5000;
  }

  async decode(audioData) {
    const decodedAudio = await this._decoder.ready.then(() =>
      this._decoder.decode(audioData)
    );

    await this._decoder.reset();

    return decodedAudio;
  }

  async sync(a, b) {
    const decodedA = await this.decode(a);
    const decodedB = await this.decode(b);

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
    const result = [],
      sampleOffset = { covariance: 0, sample: 0 };

    for (let sample = 0; sample < audioA.length; sample++) {
      let covariance = 0;

      for (
        let j = 0;
        //j < decodedLeft.samplesDecoded && j + i < decodedRight.samplesDecoded;
        j < this._covarianceSampleSize && j + sample < audioA.length;
        j++
      ) {
        covariance += audioA[sample + j] * audioB[j];
      }

      if (sampleOffset.covariance < covariance) {
        sampleOffset.covariance = covariance;
        sampleOffset.sample = sample;
      }

      result.push({ covariance, sample });
    }

    return result;
  }
}
