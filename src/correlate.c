#ifdef WASM_SIMD
#include <wasm_simd128.h>

typedef float float4 __attribute__((__vector_size__(16)));

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

      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset]),       wasm_v128_load(&b[bOffset])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 4]),   wasm_v128_load(&b[bOffset + 4])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 8]),   wasm_v128_load(&b[bOffset + 8])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 12]),  wasm_v128_load(&b[bOffset + 12])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 16]),  wasm_v128_load(&b[bOffset + 16])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 20]),  wasm_v128_load(&b[bOffset + 20])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 24]),  wasm_v128_load(&b[bOffset + 24])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 28]),  wasm_v128_load(&b[bOffset + 28])));
 
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 32]),  wasm_v128_load(&b[bOffset + 32])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 36]),  wasm_v128_load(&b[bOffset + 36])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 40]),  wasm_v128_load(&b[bOffset + 40])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 44]),  wasm_v128_load(&b[bOffset + 44])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 48]),  wasm_v128_load(&b[bOffset + 48])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 52]),  wasm_v128_load(&b[bOffset + 52])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 56]),  wasm_v128_load(&b[bOffset + 56])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 60]),  wasm_v128_load(&b[bOffset + 60])));
 
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 64]),  wasm_v128_load(&b[bOffset + 64])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 68]),  wasm_v128_load(&b[bOffset + 68])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 72]),  wasm_v128_load(&b[bOffset + 72])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 76]),  wasm_v128_load(&b[bOffset + 76])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 80]),  wasm_v128_load(&b[bOffset + 80])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 84]),  wasm_v128_load(&b[bOffset + 84])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 88]),  wasm_v128_load(&b[bOffset + 88])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 92]),  wasm_v128_load(&b[bOffset + 92])));

      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 96]),  wasm_v128_load(&b[bOffset + 96])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 100]), wasm_v128_load(&b[bOffset + 100])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 104]), wasm_v128_load(&b[bOffset + 104])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 106]), wasm_v128_load(&b[bOffset + 106])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 112]), wasm_v128_load(&b[bOffset + 112])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 116]), wasm_v128_load(&b[bOffset + 116])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 120]), wasm_v128_load(&b[bOffset + 120])));
      covarianceVector = wasm_f32x4_add(covarianceVector, wasm_f32x4_mul(wasm_v128_load(&a[aOffset + bOffset + 124]), wasm_v128_load(&b[bOffset + 124])));
    }

    return
      wasm_f32x4_extract_lane(covarianceVector, 0) + 
      wasm_f32x4_extract_lane(covarianceVector, 1) + 
      wasm_f32x4_extract_lane(covarianceVector, 2) + 
      wasm_f32x4_extract_lane(covarianceVector, 3);
}
#else
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

      covariance += a[aOffset + bOffset]      * b[bOffset];
      covariance += a[aOffset + bOffset + 1]  * b[bOffset + 1];
      covariance += a[aOffset + bOffset + 2]  * b[bOffset + 2];
      covariance += a[aOffset + bOffset + 3]  * b[bOffset + 3];

      covariance += a[aOffset + bOffset + 4]  * b[bOffset + 4];
      covariance += a[aOffset + bOffset + 5]  * b[bOffset + 5];
      covariance += a[aOffset + bOffset + 6]  * b[bOffset + 6];
      covariance += a[aOffset + bOffset + 7]  * b[bOffset + 7];

      covariance += a[aOffset + bOffset + 8]  * b[bOffset + 8];
      covariance += a[aOffset + bOffset + 9]  * b[bOffset + 9];
      covariance += a[aOffset + bOffset + 10] * b[bOffset + 10];
      covariance += a[aOffset + bOffset + 11] * b[bOffset + 11];

      covariance += a[aOffset + bOffset + 12] * b[bOffset + 12];
      covariance += a[aOffset + bOffset + 13] * b[bOffset + 13];
      covariance += a[aOffset + bOffset + 14] * b[bOffset + 14];
      covariance += a[aOffset + bOffset + 15] * b[bOffset + 15];
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
float correlate(
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
    long initialGranularity // initial search size
    )
{
    sum_channels(a, aSamples, aChannels);
    sum_channels(b, bSamples, bChannels);

    float bestCovariance = 0;
    long bestSampleOffset = 0;

    // find highest covariance
    // do a rough search for covariance in every <initialGranularity> samples
    long aOffsetLimit = aSamples - covarianceSampleSize;

    for (long aOffset = 0; aOffset < aOffsetLimit; aOffset += initialGranularity) {
      float covariance = nested_covariance(a, b, aOffset, covarianceSampleSize);

      if (bestCovariance < covariance) {
        bestCovariance = covariance;
        bestSampleOffset = aOffset;
      }
    }

    // narrow down exact covariance from previous results
    aOffsetLimit = bestSampleOffset + initialGranularity;

    for (long aOffset = bestSampleOffset-initialGranularity; aOffset < aOffsetLimit; aOffset++) {
      float covariance = nested_covariance(a, b, aOffset, covarianceSampleSize);

      if (bestCovariance < covariance) {
        bestCovariance = covariance;
        bestSampleOffset = aOffset;
      }
    }

    return bestSampleOffset;
}