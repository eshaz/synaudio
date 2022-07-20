# `synaudio`

`synaudio` is a JavaScript library that finds the synchronization point between two similar audio clips.
  * Synchronize two audio clips by finding the sample offset with the [Pearson correlation coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient).
  * Correlation algorithm implemented as WebAssembly SIMD.
  * Built in Web Worker implementations for concurrency.

## View the live [Demo](https://eshaz.github.io/synaudio)!

---

* [Installing](#installing)
* [Usage](#usage)
* [API](#api)
  * [Options](#options)
  * [Methods](#methods)
  * [Types](#types)

## Installing

### Install via [NPM](https://www.npmjs.com/package/synaudio)
* `npm i synaudio`

## Usage

1. Create a new instance of `SynAudio`.

   ```js
   import SynAudio from 'synaudio';

   const synAudio = new SynAudio({
     correlationSampleSize: 5000,
     initialGranularity: 16,
   });
   ```

1. Call the `sync`, `syncWorker`, or `syncWorkerConcurrent` method on the instance to find the synchronization point in samples between two audio clips.

   * See the [API](#api) section below for details on these methods.

   ```js
   // example "base" object
   const base = {
     channelData: [leftChannelFloat32Array, rightChannelFloat32Array]
     samplesDecoded: 5678
   };

   // example "comparison" object
   const comparison = {
     channelData: [leftChannelFloat32Array, rightChannelFloat32Array]
     samplesDecoded: 1234
   }

   const {
     sampleOffset, // position relative to `base` where `comparison` matches best
     correlation, //  covariance coefficient of the match [ ranging -1 (worst) to 1 (best) ]
   } = await synAudio.syncWorkerConcurrent(
     base, //        audio data to use a base for the comparison
     comparison, //  audio data to compare against the base
     4 //            number of threads to spawn
   );
   ```

## API

## `SynAudio`

Class that that finds the synchronization point between two similar audio clips.

```js
new SynAudio({
  correlationSampleSize: 1234,
  initialGranularity: 1
});
```

### Options
```ts
declare interface SynAudioOptions {
  correlationSampleSize?: number; // default 11025
  initialGranularity?: number; // default 16
}
```
* `correlationSampleSize` *optional, defaults to 11025*
  * Number of samples to compare while finding the best offset
  * Higher numbers will increase accuracy at the cost of slower computation
* `initialGranularity` *optional, defaults to 16*
  * Number of samples to jump while performing the first pass search
  * Higher numbers will decrease accuracy at the benefit of much faster computation


### Methods
```ts
declare class SynAudio {
  constructor(options?: SynAudioOptions);

  public async sync(
    base: PCMAudio,
    comparison: PCMAudio
  ): Promise<SynAudioResult>;

  public async syncWorker(
    base: PCMAudio,
    comparison: PCMAudio
  ): Promise<SynAudioResult>;

  public async syncWorkerConcurrent(
    base: PCMAudio,
    comparison: PCMAudio,
    threads?: number // default 1
  ): Promise<SynAudioResult>;
}
```

* `sync(base: PCMAudio, comparison: PCMAudio): SynAudioResult`
  * Executes on the main thread.
  * Parameters
    * `base` Audio data to compare against
    * `comparison` Audio data to use as a comparison
  * Returns
    * `SynAudioResult` containing the `correlation` and `sampleOffset`
* `syncWorker(base: PCMAudio, comparison: PCMAudio): SynAudioResult`
  * Execute in a separate thread as a web worker.
  * Parameters
    * `base` Audio data to compare against
    * `comparison` Audio data to use as a comparison
  * Returns
    * `SynAudioResult` containing the `correlation` and `sampleOffset`
* `syncWorkerConcurrent(base: PCMAudio, comparison: PCMAudio, threads: number): SynAudioResult`
  * Splits the incoming data into chunks and spawns multiple workers that execute concurrently.
  * Parameters
    * `base` Audio data to compare against
    * `comparison` Audio data to use as a comparison
    * `threads` Number of threads to spawn *optional, defaults to 1*
  * Returns
    * `SynAudioResult` containing the `correlation` and `sampleOffset`

### Types

```ts
interface PCMAudio {
  channelData: Float32Array[];
  samplesDecoded: number;
}
```
* `channelData`
  * Array of Float32Array of audio data
  * Each Float32Array represents a single channel
  * Each channel should be exactly the same length
* `samplesDecoded`
  * Total number of samples in a single audio channel

```ts
interface SynAudioResult {
  correlation: number;
  sampleOffset: number; 
}
```
* `correlation`
  * Correlation coefficient of the `base` and `comparison` audio at the `sampleOffset`
  * Ranging from -1 (worst) to 1 (best)
* `sampleOffset`
  * Number of samples relative to `base` where `comparison` has the highest correlation