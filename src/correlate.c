#ifdef WASM_SIMD

#include <wasm_simd128.h>

typedef float covariance_type __attribute__((__vector_size__(16)));
#define covariance_size 4
#define new_covariance wasm_f32x4_splat(0)
#define calc_covariance(vec, a, b, aOffset, bOffset) vec = wasm_f32x4_add(vec, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset]), wasm_v128_load(&b[bOffset])))
#define sum_covariance(vec) wasm_f32x4_extract_lane(vec, 0) + wasm_f32x4_extract_lane(vec, 1) + wasm_f32x4_extract_lane(vec, 2) + wasm_f32x4_extract_lane(vec, 3)

#else

typedef float covariance_type;
#define covariance_size 1
#define new_covariance 0
#define calc_covariance(cov, a, b, aOffset, bOffset) cov += a[aOffset + bOffset] * b[bOffset]
#define sum_covariance(cov) cov

#endif

float nested_calc_covariance(float *a, float *b, long aOffset, long covarianceSampleSize) {
    int loopUnroll = 32*covariance_size;
    covariance_type covarianceSum = new_covariance;

    for (
      long bOffset = 0;
      bOffset < covarianceSampleSize - loopUnroll;
      bOffset+=loopUnroll
    ) {
      calc_covariance(covarianceSum, a, b, aOffset, bOffset);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 1 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 2 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 3 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 4 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 5 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 6 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 7 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 8 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 9 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 10 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 11 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 12 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 13 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 14 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 15 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 16 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 17 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 18 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 19 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 20 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 21 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 22 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 23 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 24 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 25 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 26 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 27 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 28 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 29 * covariance_size);
      calc_covariance(covarianceSum, a, b, aOffset, bOffset + 30 * covariance_size);
      //calc_covariance(covarianceSum, a, b, aOffset, bOffset + 31 * covariance_size);
    }

    return sum_covariance(covarianceSum);
}

void sum_channels(float *data, long samples, int channels) {
    for (int i = 0; i < channels - 1; i++)
      for (int j = 0; j < samples; j++)
        data[j] += data[j+i*samples];
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
    long *sampleTrim
    )
{
    sum_channels(a, aSamples, aChannels);
    sum_channels(b, bSamples, bChannels);

    *bestCovariance = 0;
    *bestSampleOffset = 0;

    // find highest covariance
    // do a rough search for covariance in every <initialGranularity> samples
    long aOffsetLimit = aSamples - covarianceSampleSize;

    for (long aOffset = 0; aOffset < aOffsetLimit; aOffset += initialGranularity) {
      float covariance = nested_calc_covariance(a, b, aOffset, covarianceSampleSize);

      if (*bestCovariance < covariance) {
        *bestCovariance = covariance;
        *bestSampleOffset = aOffset;
      }
    }

    // narrow down exact covariance from previous results
    aOffsetLimit = *bestSampleOffset + initialGranularity;

    for (long aOffset = *bestSampleOffset-initialGranularity; aOffset < aOffsetLimit; aOffset++) {
      float covariance = nested_calc_covariance(a, b, aOffset, covarianceSampleSize);

      if (*bestCovariance < covariance) {
        *bestCovariance = covariance;
        *bestSampleOffset = aOffset;
      }
    }

    // trim any non-matching data from beginning of b
    *sampleTrim = 0;
}