# `synaudio`

`synaudio` is a JavaScript and WebAssembly library that finds the synchronization points between two or more similar audio clips.

Audio clips are synchronized using the [Pearson correlation coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient) algorithm to compare each sample of the digital audio. The audio clips are shifted slightly, compared, and the correlation coefficient is stored. The shift offset with the highest correlation coefficient is returned as the synchronization point.

  * Correlation algorithm implemented as hand optimized WebAssembly 128bit SIMD instructions.
  * Works in all major browsers, and JavaScript runtimes
  * Built in Web Worker implementations for parallel processing.

## Example Use-Cases
* Syncing audio playback for streaming radio when the stream switches bit-rates, codecs, or reconnects. See [IcecastMetadataPlayer](https://github.com/eshaz/icecast-metadata-js/tree/main/src/icecast-metadata-player)
* Syncing multiple recordings from analog tape where the speed has slightly varied between captures. See [synaudio-cli](https://github.com/eshaz/synaudio-cli)
* Syncing multiple digital audio recordings where the digital clocks were mismatched.
* Syncing audio to an existing audio / video stream.
* Syncing audio clips that have been cut or recorded in multiple segments so they can be reconstructed.
* Syncing multitrack recordings that have slight delay, phase differences, or miss-matched clocks.

## View the live [Demo](https://eshaz.github.io/synaudio)!

---

* [Installing](#installing)
* [Usage](#usage)
* [API](#api)
  * [Options](#options)
  * [Methods](#methods)
  * [Types](#types)
* [Developing](#developing)

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

### Sync Two Clips

SynAudio can synchronize two clips: one base and one comparison. The comparison clip must be a subset of the base clip in order for there to be a valid match. If you don't know the ordering of the clips, see [Sync Multiple Clips](#sync-multiple-clips)

* Call the `sync`, `syncWorker`, or `syncWorkerConcurrent` method on the instance to find the synchronization point in samples between two audio clips.

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
     base, //         audio data to use a base for the comparison
     comparison, //   audio data to compare against the base
     4 //             number of threads to spawn
   );
   ```

### Sync One to Many Clips

`syncOneToMany` will synchronize one base to one or more comparison clips. The comparison clip(s) must be derived from the same audio source as the base clip in order for there to be a valid match.
* Note: This method requires `SharedMemory` to be enabled on your runtime platform.

* Call the `syncOneToMany` method on the instance to find the synchronization point in samples between base and the comparison audio clips.

   * See the [API](#api) section below for details on these methods.

   ```js
   // example "base" object
   const base = {
     channelData: [leftChannelFloat32Array, rightChannelFloat32Array]
     samplesDecoded: 20000
   };

   // example "comparisonClips" array
   const comparisonClips = [
     {
       name: "clip1",
       data: { // first comparison clip
         channelData: [leftChannelFloat32Array, rightChannelFloat32Array]
         samplesDecoded: 1234
       },
       syncStart: 0,
       syncEnd: 10000
     },
     {
       name: "clip2",
       data: { // second comparison clip
         channelData: [leftChannelFloat32Array, rightChannelFloat32Array]
         samplesDecoded: 1234
       }
       syncStart: 5000,
       syncEnd: 15000
     }
   ]

   const results = await synAudio.syncOneToMany(
     base, //            audio data to use a base for the comparison
     comparisonClips, // array of audio data to compare against the base
     16 //               number of comparison clips to sync concurrently
     onProgressUpdate // optional callback function
   );  
   ```

* The return value will contain an array of `MultipleClipMatch` objects that represent the correlation and sample offset for each comparison clip. The order of the results matches the order of the input comparison clips.
   ```js
   // results example
   [
     { // first comparison clip
       name: "clip1",
       sampleOffset: 1234, // position relative to `base` where the first `comparison` matches best
       correlation: 0.8,
     },
     { // second comparison clip
       name: "clip2",
       sampleOffset: 5678, // position relative to `base` where the second `comparison` matches best
       correlation: 0.9, 
     }
   ]

   ```

### Sync Multiple Clips

`syncMultiple` will find the best linear match(es) between a set of two or more clips. Internally, SynAudio will determine the correlation of every order combination of each clip and then will find the path(s) in this graph where the correlation is the highest.

* Call the `syncMultiple` method on the instance to find the best synchronization path between two or more audio clips.

   ```js
   // example "clips" array
   const clips = [
     {
       name: "clip1",
       data: {
         channelData: [leftChannelFloat32Array, rightChannelFloat32Array]
         samplesDecoded: 64445
       }
     },
     {
       name: "clip2",
       data: {
         channelData: [leftChannelFloat32Array, rightChannelFloat32Array]
         samplesDecoded: 24323
       }
     },
     {
       name: "clip3",
       data: {
         channelData: [leftChannelFloat32Array, rightChannelFloat32Array]
         samplesDecoded: 45675
       }
     }
   ];

   const results = await synAudio.syncMultiple(
     clips, // array of clips to compare
     8 //      number of threads to spawn
   );
   ```

* The `results` object will contain a two dimensional array of of match groups containing matching clips. Each match group represents an ordered list of matching audio clips where each clip relates to the previous. The sample offset within each match group is relative to the first clip in the series.
  * In the below example, there are two match groups with the first group containing three clips, and the second containing two clips. There was no significant correlation _(no correlation >= `options.correlationThreshold`)_ found between the clips in the two match groups. If a clip were to exist that relates the two groups together, then the result would contain only one match group, and relate all other clips to the first one in sequential order.

   ```js
   // results example
   [
     // first match group (no relation to second group)
     [ 
       {
         name: "cut_1601425_Mpeg", // first clip in match
         sampleOffset: 0,
       },
       {
         name: "cut_2450800_Mpeg",
         correlation: 0.9846370220184326,
         sampleOffset: 849375, // position where this clip starts relative to the first clip
       },
       {
         name: "cut_2577070_Mpeg",
         correlation: 0.9878544973345423,
         sampleOffset: 975645, // position where this clip starts relative to the first clip
       },
     ],
     // second match group (no relation to first group)
     [
       {
         name: "cut_194648_Mpeg",
         sampleOffset: 0,
       },
       {
         name: "cut_287549_Mpeg",
         correlation: 0.9885798096656799,
         sampleOffset: 92901, // position where this clip starts relative to the first clip
       },
     ]
   ]
   ```

## API

## `SynAudio`

Class that that finds the synchronization point between two or more similar audio clips.

```js
new SynAudio({
  correlationSampleSize: 1234,
  initialGranularity: 1,
});
```

### Options
```ts
declare interface SynAudioOptions {
  correlationSampleSize?: number; // default 11025
  initialGranularity?: number; // default 16
  correlationThreshold?: number; // default 0.5
  shared?: boolean; // default false
}
```
* `correlationSampleSize` *optional, defaults to 11025*
  * Number of samples to compare while finding the best offset
  * Higher numbers will increase accuracy at the cost of slower computation
* `initialGranularity` *optional, defaults to 16*
  * Number of samples to jump while performing the first pass search
  * Higher numbers will decrease accuracy at the benefit of much faster computation
* `correlationThreshold` *optional, defaults to 0.5*
  * Threshold that will filter out any low correlation matches
  * Only applicable to `syncMultiple`
* `shared` *optional, defaults to false*
  * Enables the use of `SharedMemory` between the main and worker threads
  * Runtime environment must support Web Assembly SIMD and Shared Memory features
  * Must be enabled to use `syncOneToMany`


### Methods
```ts
declare class SynAudio {
  constructor(options?: SynAudioOptions);

  /* 
   * Two Clips
  */
  public async sync(
    base: PCMAudio,
    comparison: PCMAudio
  ): Promise<TwoClipMatch>;

  public syncWorker(
    base: PCMAudio,
    comparison: PCMAudio
  ): Promise<TwoClipMatch>;

  public syncWorkerConcurrent(
    base: PCMAudio,
    comparison: PCMAudio,
    threads?: number // default 1
  ): Promise<TwoClipMatch>;

  /*
   * One Base, Multiple Comparison Clips 
  */
  public syncOneToMany(
    base: PCMAudio,
    comparisonClips: AudioClip[],
    threads?: number, // default 1
    onProgressUpdate?: (progress: number) => void
  ): Promise<MultipleClipMatch[]>;

  /* 
   * Multiple Clips
  */
  public syncMultiple(
    clips: AudioClip[],
    threads?: number // default 8
  ): Promise<MultipleClipMatchList[]>;
}
```
### Two Clips
* `sync(base: PCMAudio, comparison: PCMAudio): Promise<TwoClipMatch>`
  * Executes on the main thread.
  * Parameters
    * `base` Audio data to compare against
    * `comparison` Audio data to use as a comparison
  * Returns
    * Promise resolving to `TwoClipMatch` that contains the `correlation` and `sampleOffset`
* `syncWorker(base: PCMAudio, comparison: PCMAudio): Promise<TwoClipMatch>`
  * Execute in a separate thread as a web worker.
  * Parameters
    * `base` Audio data to compare against
    * `comparison` Audio data to use as a comparison
  * Returns
    * Promise resolving to `TwoClipMatch` that contains the `correlation` and `sampleOffset`
* `syncWorkerConcurrent(base: PCMAudio, comparison: PCMAudio, threads: number): Promise<TwoClipMatch>`
  * Splits the incoming data into chunks and spawns multiple workers that execute concurrently.
  * Parameters
    * `base` Audio data to compare against
    * `comparison` Audio data to use as a comparison
    * `threads` Number of threads to spawn *optional, defaults to 1*
  * Returns
    * Promise resolving to `TwoClipMatch` that contains the `correlation` and `sampleOffset`

### One To Many Clips
* `syncOneToMany(base: PCMAudio, comparisonClips: AudioClip[], threads?: number, onProgressUpdate?: (progress: number) => void): Promise<MultipleClipMatch[]>`
  * Executes on worker threads for each comparison clip
  * Parameters
    * `base` Audio data to use as the base of comparison
    * `comparisonClips` Array of `AudioClip`(s) to compare
       * `syncStart` and `syncEnd` can be set for each comparison `AudioClip` to define sync range of the base clip.
         If you have a known lower or upper bound, this will speed up the sync operation by limiting the search to those bounds.
    * `threads` Maximum number of concurrent comparisons to run. *optional, defaults to 1*
    * `onProgressUpdate` Callback function that is called with a number from 0 to 1 indicating the progress of the sync operation.
  * Returns
    * Promise resolving to an array of `MultipleClipMatch` that contains the `name`, `correlation`, and `sampleOffset` for each comparison clip

### Multiple Clips
* `syncMultiple(clips: AudioClip[], threads?: number): Promise<MultipleClipMatch[][]>`
  * Executes on the worker threads for each comparison.
  * Parameters
    * `clips` Array of `AudioClip`(s) to compare
    * `threads` Maximum number of threads to spawn *optional, defaults to 8*
  * Returns
    * Promise resolving to `MultipleClipMatchList[]` Two dimensional array containing a list of each matching audio clip groups

### Types

#### Input Types
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
interface AudioClip {
  name: string;
  data: PCMAudio;
  syncStart?: number;
  syncEnd?: number;
}
```
* `name`
  * Name of the audio clip
* `data`
  * Audio data for the clip
* `syncStart`
  * Audio sample starting offset from the base file to start syncing
  * Defaults to `0` (start of the base audio clip)
* `syncEnd`
  * Audio sample ending offset from the base file to end syncing
  * Defaults to the length of the base audio clip (end of the base audio clip)

#### Return Types

```ts
interface TwoClipMatch {
  correlation: number;
  sampleOffset: number; 
}
```
* `correlation`
  * Correlation coefficient of the `base` and `comparison` audio at the `sampleOffset`
  * Ranging from -1 (worst) to 1 (best)
* `sampleOffset`
  * Number of samples relative to `base` where `comparison` has the highest correlation


```ts
declare type MultipleClipMatchList =
  | []
  | [MultipleClipMatchFirst, ...MultipleClipMatch];

declare interface MultipleClipMatchFirst {
  name: string;
  sampleOffset: 0;
}

declare interface MultipleClipMatch {
  name: string;
  correlation: number;
  sampleOffset: number;
}
```
* `name`
  * Name of the matching clip
* `correlation`
  * Correlation coefficient between the previous clip and this cli
  * Ranging from -1 (worst) to 1 (best)
* `sampleOffset`
  * Number of samples relative to the root clip (first clip in the match)


## Developing

### Prerequisites
1. Install Emscripten by following these [instructions](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html#installation-instructions).
   * This repository has been tested with Emscripten 4.0.7.

### Building
1. Make sure to `source` the Emscripten path in the terminal you want build in.
   * i.e. `$ source path/to/emsdk/emsdk_env.sh`
1. Run `npm i` to install the dependencies.
1. Run `make clean` and `make` to build the libraries.
   * You can run `make -j8` where `8` is the number of CPU cores on your system to speed up the build.
1. The builds will be located in the `dist` folder.

### Testing
1. Run `npm run test` to run the test suite.
