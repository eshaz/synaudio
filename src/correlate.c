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
    aint64_t with this program.  If not, see <https://www.gnu.org/licenses/>
*/

#define min(a, b) a < b ? a : b
#define max(a, b) a > b ? a : b

#define calc_covariance_sub_data_and_mean(data, mean) (data - mean)
#define calc_covariance(cov, a, bSubMean, aMean) cov + calc_covariance_sub_data_and_mean(a, aMean) * bSubMean
#define sum_covariance(cov, sampleSize) cov / ((float) sampleSize - 1)

#define calc_stddev_square(data, mean) (data - mean) * (data - mean)
#define calc_stddev(squareSums, sampleSize) __builtin_sqrt(squareSums / ((float) sampleSize - 1))
#define add_stddev_square(squareSums, square) squareSums + square

#define sum_and_store(a, b) a += b
#define sub_and_store(a, b) a -= b

#include <stdint.h>
#ifdef WASM_SIMD

#include <wasm_simd128.h>

typedef float float4 __attribute__((__vector_size__(16)));
#define float4_size 4
#define float4_to_float(vec) (wasm_f32x4_extract_lane(vec, 0) + wasm_f32x4_extract_lane(vec, 1) + wasm_f32x4_extract_lane(vec, 2) + wasm_f32x4_extract_lane(vec, 3))
#define float_to_float4(vec) wasm_f32x4_splat(vec)

#define calc_covariance_sub_data_and_mean_float4(data, mean) wasm_f32x4_sub(wasm_v128_load(&data), mean)
#define calc_covariance_float4(vec, a, bSubMean, aMean) \
  wasm_f32x4_add(\
    vec, \
    wasm_f32x4_mul( \
      calc_covariance_sub_data_and_mean_float4(a, aMean), \
      wasm_v128_load(&bSubMean) \
    ) \
  )
#define sum_covariance_float4(cov, sampleSize) float4_to_float(cov) / ((float) sampleSize - 1)

#define calc_stddev_square_float4(data, mean) \
    wasm_f32x4_mul( \
      wasm_f32x4_sub( \
        wasm_v128_load(&data), \
        mean \
      ), \
      wasm_f32x4_sub( \
        wasm_v128_load(&data), \
        mean \
      ) \
    )
#define add_stddev_square_float4(squareSums, square) wasm_f32x4_add(squareSums, square)

#define sum_and_store_float4(a, b) wasm_v128_store(&a, wasm_f32x4_add(wasm_v128_load(&a), wasm_v128_load(&b)))
#define sub_and_store_float4(a, b) wasm_v128_store(&a, wasm_f32x4_sub(wasm_v128_load(&a), wasm_v128_load(&b)))

#else

typedef float float4;
#define float4_size 1
#define float4_to_float(f) (float) f
#define float_to_float4(f) (float4) f

#define calc_covariance_sub_data_and_mean_float4 calc_covariance_sub_data_and_mean
#define calc_covariance_float4 calc_covariance
#define sum_covariance_float4 sum_covariance

#define calc_stddev_square_float4 calc_stddev_square
#define add_stddev_square_float4 add_stddev_square

#define sum_and_store_float4 sum_and_store
#define sub_and_store_float4 sub_and_store

#endif

float calc_correlation(float *a, float *b, float aMean, float bStdFloat, int64_t sampleSize) {
    int32_t loopUnroll = 4*float4_size;

    float4 covariance_4 = float_to_float4(0);
    float4 aSquare_4 = float_to_float4(0);
    float4 aMean_4 = float_to_float4(aMean);

    int64_t i = 0;
    for (
      ;
      i < sampleSize - loopUnroll;
      i+=loopUnroll
    ) {
      // covariance
      covariance_4 = calc_covariance_float4(covariance_4, a[i],                   b[i]                  , aMean_4);
      covariance_4 = calc_covariance_float4(covariance_4, a[i + 1 * float4_size], b[i + 1 * float4_size], aMean_4);
      covariance_4 = calc_covariance_float4(covariance_4, a[i + 2 * float4_size], b[i + 2 * float4_size], aMean_4);
      covariance_4 = calc_covariance_float4(covariance_4, a[i + 3 * float4_size], b[i + 3 * float4_size], aMean_4);

      // a standard deviation
      aSquare_4 = add_stddev_square_float4(aSquare_4, calc_stddev_square_float4(a[i]                  , aMean_4));
      aSquare_4 = add_stddev_square_float4(aSquare_4, calc_stddev_square_float4(a[i + 1 * float4_size], aMean_4));
      aSquare_4 = add_stddev_square_float4(aSquare_4, calc_stddev_square_float4(a[i + 2 * float4_size], aMean_4));
      aSquare_4 = add_stddev_square_float4(aSquare_4, calc_stddev_square_float4(a[i + 3 * float4_size], aMean_4));
    }

    // calculate any remaining data
    float covariance = float4_to_float(covariance_4);
    float aSquare = float4_to_float(aSquare_4);

    for (; i < sampleSize; i++) {
      covariance = calc_covariance(covariance, a[i], b[i], aMean);
      aSquare = add_stddev_square(aSquare, calc_stddev_square(a[i], aMean));
    }

    return sum_covariance(covariance, sampleSize) / (calc_stddev(aSquare, sampleSize) * bStdFloat);
}

// calculates the standard deviations of data at each offset
float calc_std(float *in, double meanSum, int64_t dataLength, int64_t sampleLength) {
    int32_t loopUnroll = 4*float4_size;

    float4 square_4 = float_to_float4(0);
    float4 mean_4 = float_to_float4(meanSum / sampleLength);

    // get the first square and use simd
    int64_t i = 0;
    for (
      i = 0;
      i < sampleLength - loopUnroll;
      i+=loopUnroll
    ) {
      square_4 = add_stddev_square_float4(square_4, calc_stddev_square_float4(in[i]                  , mean_4));
      square_4 = add_stddev_square_float4(square_4, calc_stddev_square_float4(in[i + 1 * float4_size], mean_4));
      square_4 = add_stddev_square_float4(square_4, calc_stddev_square_float4(in[i + 2 * float4_size], mean_4));
      square_4 = add_stddev_square_float4(square_4, calc_stddev_square_float4(in[i + 3 * float4_size], mean_4));
    }

    // calculate remaining elements for first square
    float square = float4_to_float(square_4);
    float mean = meanSum / sampleLength;

    for (; i < sampleLength; i++)
      square = add_stddev_square(square, calc_stddev_square(in[i], mean));

    // finalize the last element's standard deviation
    return calc_stddev(square, sampleLength);
}

void sum_channels(float *data, int64_t samples, int32_t channels) {
    for (int32_t i = 0; i < channels - 1; i++) {
      int32_t loopUnroll = 4*float4_size;

      int64_t j = 0;
      for (; j < samples - loopUnroll; j += loopUnroll) {
        sum_and_store_float4(data[j], data[j+i*samples]);
        sum_and_store_float4(data[j + 1 * float4_size], data[(j + 1 * float4_size)+i*samples]);
        sum_and_store_float4(data[j + 2 * float4_size], data[(j + 2 * float4_size)+i*samples]);
        sum_and_store_float4(data[j + 3 * float4_size], data[(j + 3 * float4_size)+i*samples]);
      }

      for (; j < samples; j++)
        sum_and_store(data[j], data[j+i*samples]);
    }
}

double sum_for_mean(float *data, int64_t length) {
    double meanSum = 0;

    for (int64_t i = 0; i < length; i++)
      meanSum += data[i];

    return meanSum;
}

void subtract_mean(float* data, float mean, int64_t samples) {
    int32_t loopUnroll = 4*float4_size;
    float4 mean_4 = float_to_float4(mean);

    int64_t i = 0;
    for (; i < samples - loopUnroll; i += loopUnroll) {
      sub_and_store_float4(data[i],                   mean_4);
      sub_and_store_float4(data[i + 1 * float4_size], mean_4);
      sub_and_store_float4(data[i + 2 * float4_size], mean_4);
      sub_and_store_float4(data[i + 3 * float4_size], mean_4);
    }

    for (; i < samples; i++)
      sub_and_store(data[i], mean);
}

// finds the best correlation point between two sets of audio data
void correlate(
    // audio baseline
    float *a, 
    uint32_t aSamples, 
    uint32_t aChannels,
    // audio to compare
    float *b, 
    uint32_t bSamples, 
    uint32_t bChannels,
    uint32_t sampleSize, // amount of data to compare on b
    uint32_t increment, // initial granularity search size
    float *bestCorrelation, // stores best correlation
    uint32_t *bestSampleOffset // stores sample offset of a where b has the best correlation
  )
{
    // sum together to normalize audio with differing channels
    sum_channels(a, aSamples, aChannels);
    sum_channels(b, bSamples, bChannels);

    float correlation;
    *bestCorrelation = 0;
    *bestSampleOffset = 0;

    // find sample offset of a where the greatest correlation exists between a and b
    // do a rough search for correlation in every <initialGranularity> samples
    int64_t aOffsetStart = 0;
    int64_t aOffsetEnd = aSamples - sampleSize;

    // get the standard deviation arrays
    double aSum = sum_for_mean(a, sampleSize);
    float aMean;

    double bSum = sum_for_mean(b, sampleSize);
    float bStd = calc_std(b, bSum, sampleSize, sampleSize);
    subtract_mean(b, bSum / sampleSize, sampleSize);

    for (int64_t aOffset = aOffsetStart; aOffset < aOffsetEnd; aOffset += increment) {
      aMean = aSum / sampleSize;
      // shift mean sum up one increment
      aSum -= a[aOffset];
      aSum += a[aOffset + sampleSize];

      correlation = calc_correlation(a + aOffset, b, aMean, bStd, sampleSize);

      if (*bestCorrelation < correlation) {
        *bestCorrelation = correlation;
        *bestSampleOffset = aOffset;
      }
    }

    if (increment > 1) {
      // narrow down exact correlation from previous results
      aOffsetStart = max(*bestSampleOffset - increment * increment, 0);
      aOffsetEnd = min(*bestSampleOffset + increment * increment, aSamples - sampleSize);
  
      aSum = sum_for_mean(a + aOffsetStart, sampleSize);
  
      for (int64_t aOffset = aOffsetStart; aOffset < aOffsetEnd; aOffset++) {
        aMean = aSum / sampleSize;
        // shift mean sum up one element
        aSum -= a[aOffset];
        aSum += a[aOffset + sampleSize];
  
        correlation = calc_correlation(a + aOffset, b, aMean, bStd, sampleSize);
  
        if (*bestCorrelation < correlation) {
          *bestCorrelation = correlation;
          *bestSampleOffset = aOffset;
        }
      }
    }
}