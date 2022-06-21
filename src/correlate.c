//#define WASM_SIMD

#ifdef WASM_SIMD

#include <wasm_simd128.h>

typedef float float4 __attribute__((__vector_size__(16)));
#define float4_size 4
#define new_float4 wasm_f32x4_splat(0)

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
#define calc_stddev(vec, data, dataMean) vec = \
  wasm_f32x4_add( \
    vec, \
    wasm_f32x4_mul( \
      wasm_f32x4_sub( \
        wasm_v128_load(&data), \
        wasm_f32x4_splat(dataMean) \
      ), \
      wasm_f32x4_sub( \
        wasm_v128_load(&data), \
        wasm_f32x4_splat(dataMean) \
      ) \
    ) \
  )

#define vec_to_float(vec) (wasm_f32x4_extract_lane(vec, 0) + wasm_f32x4_extract_lane(vec, 1) + wasm_f32x4_extract_lane(vec, 2) + wasm_f32x4_extract_lane(vec, 3))

#define sum_covariance(cov, sampleSize) vec_to_float(cov) / ((float) sampleSize - 1)
#define sum_stddev(std, sampleSize) __builtin_sqrt(vec_to_float(std) / ((float) sampleSize - 1))

#else

typedef float float4;
#define float4_size 1
#define new_float4 0

#define calc_stddev(std, data, dataMean) std += (data - dataMean) * (data - dataMean)
#define calc_covariance(cov, a, b, aMean, bMean) cov += (a - aMean) * (b - bMean)

#define sum_covariance(cov, sampleSize) cov / ((float) sampleSize - 1)
#define sum_stddev(std, sampleSize) __builtin_sqrt(std / ((float) sampleSize - 1))

#endif

float calc_correlation(float *a, float *b, float aMean, float bMean, long sampleSize) {
    int loopUnroll = 1*float4_size;
    float4 covariance = new_float4;
    float4 aStd = new_float4;
    float4 bStd = new_float4;

    for (
      int i = 0;
      i < sampleSize - loopUnroll;
      i+=loopUnroll
    ) {
      calc_stddev(aStd, a[i], aMean);
      calc_stddev(bStd, b[i], bMean);
      calc_covariance(covariance, a[i],                        b[i],                        aMean, bMean);
      //calc_covariance(covariance, a[i + 1 * float4_size],  b[i + 1 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 2 * float4_size],  b[i + 2 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 3 * float4_size],  b[i + 3 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 4 * float4_size],  b[i + 4 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 5 * float4_size],  b[i + 5 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 6 * float4_size],  b[i + 6 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 7 * float4_size],  b[i + 7 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 8 * float4_size],  b[i + 8 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 9 * float4_size],  b[i + 9 * float4_size],  aMean, bMean);
      //calc_covariance(covariance, a[i + 10 * float4_size], b[i + 10 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 11 * float4_size], b[i + 11 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 12 * float4_size], b[i + 12 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 13 * float4_size], b[i + 13 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 14 * float4_size], b[i + 14 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 15 * float4_size], b[i + 15 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 16 * float4_size], b[i + 16 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 17 * float4_size], b[i + 17 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 18 * float4_size], b[i + 18 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 19 * float4_size], b[i + 19 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 20 * float4_size], b[i + 20 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 21 * float4_size], b[i + 21 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 22 * float4_size], b[i + 22 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 23 * float4_size], b[i + 23 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 24 * float4_size], b[i + 24 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 25 * float4_size], b[i + 25 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 26 * float4_size], b[i + 26 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 27 * float4_size], b[i + 27 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 28 * float4_size], b[i + 28 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 29 * float4_size], b[i + 29 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 30 * float4_size], b[i + 30 * float4_size], aMean, bMean);
      //calc_covariance(covariance, a[i + 31 * float4_size], b[i + 31 * float4_size], aMean, bMean);
    }

    return sum_covariance(covariance, sampleSize) / (sum_stddev(aStd, sampleSize) * sum_stddev(bStd, sampleSize));
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
    long sampleSize, // amount of data to compare on b
    long initialGranularity, // initial search size
    float *bestCorrelation,
    long *bestSampleOffset,
    long *bestSampleTrim
    )
{
    sum_channels(a, aSamples, aChannels);
    sum_channels(b, bSamples, bChannels);

    float correlation;
    *bestCorrelation = 0;
    *bestSampleOffset = 0;
    float bestAMean, bestBMean;

    // find sample offset of a where the greatest correlation exists between a and b
    // do a rough search for correlation in every <initialGranularity> samples
    long aOffsetStart = 0;
    long aOffsetEnd = aSamples - sampleSize;

    double aSum = sum_for_mean(a, 0, sampleSize);
    double bSum = sum_for_mean(b, 0, sampleSize);

    float bMean = bSum / (float) sampleSize;

    for (long aOffset = aOffsetStart; aOffset < aOffsetEnd; aOffset += initialGranularity) {
      float aMean = aSum / sampleSize;
      // shift mean sum up one element
      aSum -= (double) a[aOffset];
      aSum += (double) a[aOffset + sampleSize];

      correlation = calc_correlation(a + aOffset, b, aMean, bMean, sampleSize);

      if (*bestCorrelation < correlation) {
        bestAMean = aMean;
        *bestCorrelation = correlation;
        *bestSampleOffset = aOffset;
      }
    }

    // narrow down exact correlation from previous results
    aOffsetStart = *bestSampleOffset - initialGranularity * 2;
    aOffsetEnd = *bestSampleOffset + initialGranularity * 2;

    aSum = sum_for_mean(a, aOffsetStart, aOffsetStart + sampleSize);

    for (long aOffset = aOffsetStart; aOffset < aOffsetEnd; aOffset++) {
      float aMean = aSum / sampleSize;
      // shift mean sum up one element
      aSum -= (double) a[aOffset];
      aSum += (double) a[aOffset + sampleSize];

      correlation = calc_correlation(a + aOffset, b, aMean, bMean, sampleSize);

      if (*bestCorrelation < correlation) {
        bestAMean = aMean;
        *bestCorrelation = correlation;
        *bestSampleOffset = aOffset;
      }
    }

    long bOffsetStart = 0;
    long bOffsetEnd = sampleSize;
    float bMeanLength = bOffsetEnd;
/*
    // trim any non-matching data from beginning of b
    for (long bOffset = bOffsetStart; bOffset < bOffsetEnd; bOffset++) {
      float bMean = bSum / bMeanLength;
      // shift mean sum up one element
      bSum -= (double) b[bOffset];
      bSum += (double) b[bOffset + sampleSize];

      correlation = calc_correlation(a + *bestSampleOffset + bOffset, b + bOffset, bestAMean, bMean, sampleSize);

      if (*bestCorrelation < correlation) {
        bestBMean = bMean;
        *bestCorrelation = correlation;
        *bestSampleTrim = bOffset;
      }
    }
*/
}