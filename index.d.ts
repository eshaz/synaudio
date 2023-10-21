declare interface PCMAudio {
  channelData: Float32Array[];
  samplesDecoded: number;
}

declare interface AudioClip {
  name: string;
  data: PCMAudio;
}

declare interface TwoClipMatch {
  correlation: number;
  sampleOffset: number;
}

declare interface MultipleClipMatchFirst {
  name: string;
  sampleOffset: 0;
}

declare interface MultipleClipMatch {
  name: string;
  correlation: number;
  sampleOffset: number;
}

declare type MultipleClipMatchList =
  | []
  | [MultipleClipMatchFirst, ...MultipleClipMatch];

declare interface SynAudioOptions {
  correlationSampleSize?: number; // default 11025
  initialGranularity?: number; // default 16
  correlationThreshold?: number; // default 0.5
}

declare class SynAudio {
  constructor(options?: SynAudioOptions);

  public sync(base: PCMAudio, comparison: PCMAudio): Promise<TwoClipMatch>;

  public syncWorker(
    base: PCMAudio,
    comparison: PCMAudio,
  ): Promise<TwoClipMatch>;

  public syncWorkerConcurrent(
    base: PCMAudio,
    comparison: PCMAudio,
    threads?: number, // default 1
  ): Promise<TwoClipMatch>;

  public syncMultiple(
    clips: AudioClip[],
    threads?: number, // default 8
  ): Promise<MultipleClipMatchList[]>;
}

export default SynAudio;

export type {
  PCMAudio,
  AudioClip,
  TwoClipMatch,
  MultipleClipMatchFirst,
  MultipleClipMatch,
  MultipleClipMatchList,
  SynAudioOptions,
};
