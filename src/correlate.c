
// finds the best coorelation point between two sets of audio data

long correlate(
    // audio baseline
    float *a, 
    int aChannels, 
    long aSamples, 
    // audio to compare
    float *b, 
    int bChannels, 
    long bSamples, 
    long sampleRate, // sample rate of both a and b
    long covarianceSampleSize // amount of data to compare on b
    )
{
    float bestCovariance = 0;
    long bestSampleOffset = 0;

    // find highest covariance
    for (long sampleOffset = aSamples - 1; sampleOffset >= 0; sampleOffset--) {
      float covariance = 0;
      long samplesRemaining = aSamples - sampleOffset;

      for (
        long j = (covarianceSampleSize < samplesRemaining
            ? covarianceSampleSize
            : samplesRemaining) - 1;
        j >= 0;
        j--
      ) {
        covariance += a[sampleOffset + j] * b[j];
      }

      if (bestCovariance < covariance) {
        bestCovariance = covariance;
        bestSampleOffset = sampleOffset;
      }
    }

    return bestSampleOffset;
}