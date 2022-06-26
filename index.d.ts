declare interface PCMAudio {
  channelData: Float32Array[];
  samplesDecoded: number;
}

declare interface SynAudioResult {
  correlation: number;
  sampleOffset: number;
}

declare interface SynAudioOptions {
  correlationSampleSize?: number; // default 11025
  initialGranularity?: number; // default 16
}

declare class SynAudio {
  constructor(options?: SynAudioOptions);

  public sync(base: PCMAudio, comparison: PCMAudio): Promise<SynAudioResult>;

  public syncWorker(
    base: PCMAudio,
    comparison: PCMAudio
  ): Promise<SynAudioResult>;

  public syncWorkerConcurrent(
    base: PCMAudio,
    comparison: PCMAudio,
    threads?: number // default 1
  ): Promise<SynAudioResult>;
}

export default SynAudio;

export type { PCMAudio, SynAudioOptions, SynAudioResult };
