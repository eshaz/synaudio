#ifdef WASM_SIMD
#include <wasm_simd128.h>

typedef float float4 __attribute__((__vector_size__(16)));

#define covariance_v128(vec, a, b, aOffset, bOffset) vec = wasm_f32x4_add(vec, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset]), wasm_v128_load(&b[bOffset])))

float nested_covariance(float *a, float *b, long aOffset, long covarianceSampleSize) {
    int loopUnroll = 128;
    float4 covarianceVector = wasm_f32x4_splat(0);

    for (
      long bOffset = 0;
      bOffset < covarianceSampleSize - loopUnroll;
      bOffset += loopUnroll
    ) {
      /*for (int inc = 0; inc <= loopUnroll; inc+=4) {
        covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + inc]), wasm_v128_load(&b[bOffset + inc])));
      }*/

      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 4);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 8);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 12);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 16);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 20);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 24);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 28);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 32);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 36);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 40);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 44);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 48);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 52);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 56);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 60);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 64);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 68);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 72);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 76);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 80);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 84);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 88);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 92);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 96);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 100);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 104);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 106);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 112);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 116);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 120);
      covariance_v128(covarianceVector, a, b, aOffset, bOffset + 124);
    }

    return
      wasm_f32x4_extract_lane(covarianceVector, 0) + 
      wasm_f32x4_extract_lane(covarianceVector, 1) + 
      wasm_f32x4_extract_lane(covarianceVector, 2) + 
      wasm_f32x4_extract_lane(covarianceVector, 3);
}
#else

#define covariance_f32(vec, a, b, aOffset, bOffset) vec += a[aOffset + bOffset] * b[bOffset]

float nested_covariance(float *a, float *b, long aOffset, long covarianceSampleSize) {
    int loopUnroll = 16;
    float covariance = 0;

    for (
      long bOffset = 0;
      bOffset < covarianceSampleSize - loopUnroll;
      bOffset+=loopUnroll
    ) {
      /*for (int inc = 0; inc < loopUnroll; inc++) {
        covariance += a[aOffset + bOffset + inc] * b[bOffset + inc];
      }*/

      covariance_f32(covariance, a, b, aOffset, bOffset);
      covariance_f32(covariance, a, b, aOffset, bOffset + 1);
      covariance_f32(covariance, a, b, aOffset, bOffset + 2);
      covariance_f32(covariance, a, b, aOffset, bOffset + 3);
      covariance_f32(covariance, a, b, aOffset, bOffset + 4);
      covariance_f32(covariance, a, b, aOffset, bOffset + 5);
      covariance_f32(covariance, a, b, aOffset, bOffset + 6);
      covariance_f32(covariance, a, b, aOffset, bOffset + 7);
      covariance_f32(covariance, a, b, aOffset, bOffset + 8);
      covariance_f32(covariance, a, b, aOffset, bOffset + 9);
      covariance_f32(covariance, a, b, aOffset, bOffset + 10);
      covariance_f32(covariance, a, b, aOffset, bOffset + 11);
      covariance_f32(covariance, a, b, aOffset, bOffset + 12);
      covariance_f32(covariance, a, b, aOffset, bOffset + 13);
      covariance_f32(covariance, a, b, aOffset, bOffset + 14);
      covariance_f32(covariance, a, b, aOffset, bOffset + 15);
    }

    return covariance;
}
#endif

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
    long *bestSampleOffset
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
      float covariance = nested_covariance(a, b, aOffset, covarianceSampleSize);

      if (*bestCovariance < covariance) {
        *bestCovariance = covariance;
        *bestSampleOffset = aOffset;
      }
    }

    // narrow down exact covariance from previous results
    aOffsetLimit = *bestSampleOffset + initialGranularity;

    for (long aOffset = *bestSampleOffset-initialGranularity; aOffset < aOffsetLimit; aOffset++) {
      float covariance = nested_covariance(a, b, aOffset, covarianceSampleSize);

      if (*bestCovariance < covariance) {
        *bestCovariance = covariance;
        *bestSampleOffset = aOffset;
      }
    }
}