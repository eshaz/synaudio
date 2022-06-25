declare interface PCMAudio {
  channelData: Float32Array[];
  samplesDecoded: number;
}

declare interface SynAudioResult {
  correlation: number;
  sampleOffset: number;
}

declare interface SynAudioOptions {
  correlationSampleSize?: number;
  initialGranularity?: number;
}

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
}

export default SynAudio;

export type { PCMAudio, SynAudioOptions, SynAudioResult };
