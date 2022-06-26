/* Copyright 2022 Ethan Halsall
    
    This file is part of synaudio.
    
    synaudio is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    synaudio is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

#define min(a, b) a < b ? a : b
#define max(a, b) a > b ? a : b


#define calc_covariance(cov, a, b, aMean, bMean) cov += (a - aMean) * (b - bMean)
#define calc_stddev(std, data, dataMean) std += (data - dataMean) * (data - dataMean)
#define sum_covariance(cov, sampleSize) cov / ((float) sampleSize - 1)
#define sum_stddev(std, sampleSize) __builtin_sqrt(std / ((float) sampleSize - 1))

#ifdef WASM_SIMD

#include <wasm_simd128.h>

typedef float float4 __attribute__((__vector_size__(16)));
#define float4_size 4
#define new_float4 wasm_f32x4_splat(0)
#define float4_to_float(vec) (wasm_f32x4_extract_lane(vec, 0) + wasm_f32x4_extract_lane(vec, 1) + wasm_f32x4_extract_lane(vec, 2) + wasm_f32x4_extract_lane(vec, 3))

#define calc_covariance_float4(vec, a, b, aMean, bMean) vec = \
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
#define calc_stddev_float4(vec, data, dataMean) vec = \
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
#define sum_covariance_float4(cov, sampleSize) float4_to_float(cov) / ((float) sampleSize - 1)
#define sum_stddev_float4(std, sampleSize) __builtin_sqrt(float4_to_float(std) / ((float) sampleSize - 1))

#else

typedef float float4;
#define float4_size 1
#define new_float4 0
#define float4_to_float(f) (float) f

#define calc_covariance_float4 calc_covariance
#define calc_stddev_float4 calc_stddev
#define sum_covariance_float4 sum_covariance
#define sum_stddev_float4 sum_stddev

#endif

#define calc_correlation_step_float4(cov, aStd, bStd, aMean, bMean, a, b) \
  calc_stddev_float4(aStd, a, aMean); \
  calc_stddev_float4(bStd, b, bMean); \
  calc_covariance_float4(covariance, a, b, aMean, bMean);

#define calc_correlation_step(cov, aStd, bStd, aMean, bMean, a, b) \
  calc_stddev(aStd, a, aMean); \
  calc_stddev(bStd, b, bMean); \
  calc_covariance(covariance, a, b, aMean, bMean);

float calc_correlation(float *a, float *b, float aMean, float bMean, long sampleSize) {
    int loopUnroll = 4*float4_size;
    float4 covariance = new_float4;
    float4 aStd = new_float4;
    float4 bStd = new_float4;

    int i;
    for (
      i = 0;
      i < sampleSize - loopUnroll;
      i+=loopUnroll
    ) {
      calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i],                    b[i]                   );
      calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 1  * float4_size], b[i + 1  * float4_size]);
      calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 2  * float4_size], b[i + 2  * float4_size]);
      calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 3  * float4_size], b[i + 3  * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 4  * float4_size], b[i + 4  * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 5  * float4_size], b[i + 5  * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 6  * float4_size], b[i + 6  * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 7  * float4_size], b[i + 7  * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 8  * float4_size], b[i + 8  * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 9  * float4_size], b[i + 9  * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 10 * float4_size], b[i + 10 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 11 * float4_size], b[i + 11 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 12 * float4_size], b[i + 12 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 13 * float4_size], b[i + 13 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 14 * float4_size], b[i + 14 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 15 * float4_size], b[i + 15 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 16 * float4_size], b[i + 16 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 17 * float4_size], b[i + 17 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 18 * float4_size], b[i + 18 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 19 * float4_size], b[i + 19 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 20 * float4_size], b[i + 20 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 21 * float4_size], b[i + 21 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 22 * float4_size], b[i + 22 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 23 * float4_size], b[i + 23 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 24 * float4_size], b[i + 24 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 25 * float4_size], b[i + 25 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 26 * float4_size], b[i + 26 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 27 * float4_size], b[i + 27 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 28 * float4_size], b[i + 28 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 29 * float4_size], b[i + 29 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 30 * float4_size], b[i + 30 * float4_size]);
    //calc_correlation_step_float4(covariance, aStd, bStd, aMean, bMean, a[i + 31 * float4_size], b[i + 31 * float4_size]);
    }

    // calculate any remaining data
    float covarianceRemaining = float4_to_float(covariance);
    float aStdFloat = float4_to_float(aStd);
    float bStdFloat = float4_to_float(bStd);

    for (; i < sampleSize; i++) {
      calc_correlation_step(covarianceRemaining, aStdFloat, bStdFloat, aMean, bMean, a[i], b[i]);
    }

    return sum_covariance(covarianceRemaining, sampleSize) / (sum_stddev(aStdFloat, sampleSize) * sum_stddev(bStdFloat, sampleSize));;
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
    long sampleSize, // amount of data to compare on b
    long initialGranularity, // initial search size
    float *bestCorrelation, // stores best correlation
    long *bestSampleOffset // stores sample offset of a where b has the best correlation
    )
{
    sampleSize = min(aSamples, sampleSize); // base data length must be >= sample size
    sampleSize -= sampleSize % float4_size; // sample size must be divisible by the size of the vector
    bSamples = min(bSamples, sampleSize); // sample size must be >= comparison data

    // sum together to normalize audio with differing channels
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

    if (initialGranularity > 1) {
      // narrow down exact correlation from previous results
      aOffsetStart = max(*bestSampleOffset - initialGranularity * 2, 0);
      aOffsetEnd = min(*bestSampleOffset + initialGranularity * 2, aSamples - sampleSize);
  
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
    }
}