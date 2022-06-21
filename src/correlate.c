#ifdef WASM_SIMD

#include <wasm_simd128.h>

typedef float covariance_type __attribute__((__vector_size__(16)));
#define covariance_size 4
#define new_covariance wasm_f32x4_splat(0)
#define calc_covariance(vec, a, b, aMean, bMean) vec = \
  wasm_f32x4_add(\
    vec, \
    wasm_f32x4_mul( \
      wasm_f32x4_sub( \
        wasm_v128_load(&a), \
        wasm_f32x4_splat(aMean) \
      ), \
      wasm_f32x4_sub( \
        wasm_v128_load(&b), \
        wasm_f32x4_splat(bMean) \
      ) \
    ) \
  )
#define sum_covariance(vec, covarianceSampleSize) (wasm_f32x4_extract_lane(vec, 0) + wasm_f32x4_extract_lane(vec, 1) + wasm_f32x4_extract_lane(vec, 2) + wasm_f32x4_extract_lane(vec, 3)) / ((float) covarianceSampleSize - 1)

#else

typedef float covariance_type;
#define covariance_size 1
#define new_covariance 0
#define calc_covariance(cov, a, b, aMean, bMean) cov += (a - aMean) * (b - bMean)
#define sum_covariance(cov, covarianceSampleSize) cov / ((float) covarianceSampleSize - 1)

#endif

covariance_type nested_calc_covariance(float *a, float *b, float aMean, float bMean, long covarianceSampleSize) {
    int loopUnroll = 32*covariance_size;
    covariance_type covariance = new_covariance;

    for (
      int i = 0;
      i < covarianceSampleSize - loopUnroll;
      i+=loopUnroll
    ) {
      calc_covariance(covariance, a[i],                        b[i],                        aMean, bMean);
      calc_covariance(covariance, a[i + 1 * covariance_size],  b[i + 1 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 2 * covariance_size],  b[i + 2 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 3 * covariance_size],  b[i + 3 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 4 * covariance_size],  b[i + 4 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 5 * covariance_size],  b[i + 5 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 6 * covariance_size],  b[i + 6 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 7 * covariance_size],  b[i + 7 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 8 * covariance_size],  b[i + 8 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 9 * covariance_size],  b[i + 9 * covariance_size],  aMean, bMean);
      calc_covariance(covariance, a[i + 10 * covariance_size], b[i + 10 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 11 * covariance_size], b[i + 11 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 12 * covariance_size], b[i + 12 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 13 * covariance_size], b[i + 13 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 14 * covariance_size], b[i + 14 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 15 * covariance_size], b[i + 15 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 16 * covariance_size], b[i + 16 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 17 * covariance_size], b[i + 17 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 18 * covariance_size], b[i + 18 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 19 * covariance_size], b[i + 19 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 20 * covariance_size], b[i + 20 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 21 * covariance_size], b[i + 21 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 22 * covariance_size], b[i + 22 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 23 * covariance_size], b[i + 23 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 24 * covariance_size], b[i + 24 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 25 * covariance_size], b[i + 25 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 26 * covariance_size], b[i + 26 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 27 * covariance_size], b[i + 27 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 28 * covariance_size], b[i + 28 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 29 * covariance_size], b[i + 29 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 30 * covariance_size], b[i + 30 * covariance_size], aMean, bMean);
      calc_covariance(covariance, a[i + 31 * covariance_size], b[i + 31 * covariance_size], aMean, bMean);
    }

    return covariance;
}

void sum_channels(float *data, long samples, int channels) {
    for (int i = 0; i < channels - 1; i++)
      for (int j = 0; j < samples; j++)
        data[j] += data[j+i*samples];
}

double sum_for_mean(float *data, long offset, long length) {
    double sum = 0;

    for (int i = offset; i < length; i++)
      sum += data[i];

    return sum;
}

// finds the best coorelation point between two sets of audio data
void correlate(
    // audio baseline
    float *a, 
    long aSamples, 
    int aChannels,
    // audio to compare
    float *b, 
    long bSamples, 
    int bChannels,
    long sampleRate, // sample rate of both a and b
    long covarianceSampleSize, // amount of data to compare on b
    long initialGranularity, // initial search size
    float *bestCovariance,
    long *bestSampleOffset,
    long *bestSampleTrim
    )
{
    sum_channels(a, aSamples, aChannels);
    sum_channels(b, bSamples, bChannels);

    covariance_type covariance;
    *bestCovariance = 0;
    *bestSampleOffset = 0;
    float bestAMean, bestBMean;

    // find sample offset of a where the greatest covariance exists between a and b
    // do a rough search for covariance in every <initialGranularity> samples
    long aOffsetStart = 0;
    long aOffsetEnd = aSamples - covarianceSampleSize;

    double aSum = sum_for_mean(a, 0, covarianceSampleSize);
    double bSum = sum_for_mean(b, 0, covarianceSampleSize);

    float bMean = bSum / (float) covarianceSampleSize;

    for (long aOffset = aOffsetStart; aOffset < aOffsetEnd; aOffset += initialGranularity) {
      float aMean = aSum / covarianceSampleSize;
      // shift mean sum up one element
      aSum -= a[aOffset];
      aSum += a[aOffset + covarianceSampleSize];

      covariance = nested_calc_covariance(a + aOffset, b, aMean, bMean, covarianceSampleSize);

      float covarianceSum = sum_covariance(covariance, covarianceSampleSize);

      if (*bestCovariance < covarianceSum) {
        bestAMean = aMean;
        *bestCovariance = covarianceSum;
        *bestSampleOffset = aOffset;
      }
    }

    // narrow down exact covariance from previous results
    aOffsetStart = *bestSampleOffset - initialGranularity * 2;
    aOffsetEnd = *bestSampleOffset + initialGranularity * 2;

    aSum = sum_for_mean(a, aOffsetStart, aOffsetStart + covarianceSampleSize);

    for (long aOffset = aOffsetStart; aOffset < aOffsetEnd; aOffset++) {
      float aMean = aSum / covarianceSampleSize;
      // shift mean sum up one element
      aSum -= a[aOffset];
      aSum += a[aOffset + covarianceSampleSize];

      covariance = nested_calc_covariance(a + aOffset, b, aMean, bMean, covarianceSampleSize);

      float covarianceSum = sum_covariance(covariance, covarianceSampleSize);

      if (*bestCovariance < covarianceSum) {
        bestAMean = aMean;
        *bestCovariance = covarianceSum;
        *bestSampleOffset = aOffset;
      }
    }

    long bOffsetStart = 0;
    long bOffsetEnd = covarianceSampleSize;
    float bMeanLength = bOffsetEnd;

    // trim any non-matching data from beginning of b
    for (long bOffset = bOffsetStart; bOffset < bOffsetEnd; bOffset++) {
      float bMean = bSum / bMeanLength;
      bSum -= a[bOffset]; // subtract one element from mean sum
      bMeanLength--; // subtract length of elements

      covariance_type covariance = nested_calc_covariance(a + *bestSampleOffset + bOffset, b + bOffset, bestAMean, bMean, covarianceSampleSize - bOffset);

      float covarianceSum = sum_covariance(covariance, covarianceSampleSize);

      if (covarianceSum >= *bestCovariance) {
        bestBMean = bMean;
        *bestCovariance = covarianceSum;
        *bestSampleTrim = bOffset;
      }
    }
}