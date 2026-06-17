import type { AgentState } from "@livekit/components-react";

declare global {
  interface Window {
    FaceMesh?: new (options: { locateFile: (file: string) => string }) => FaceMeshInstance;
    VoiceLoopSession?: new (options: VoiceLoopSessionOptions) => VoiceLoopSessionInstance;
  }

  interface FaceMeshInstance {
    setOptions(options: Record<string, unknown>): void;
    onResults(handler: (results: FaceMeshResults) => void): void;
    send(input: { image: HTMLVideoElement }): Promise<void>;
  }

  interface FaceMeshResults {
    multiFaceLandmarks?: Array<Array<{ x: number; y: number }>>;
  }

  interface VoiceLoopSessionInstance {
    micAnalyser: AnalyserNode | null;
    ttsAnalyser: AnalyserNode | null;
    playCtx: AudioContext | null;
    playNextTime: number;
    start(): Promise<void>;
    stop(): Promise<void>;
    sendEndOfTurn(): void;
    setMicEnabled?(enabled: boolean): void;
  }

  interface VoiceLoopSessionOptions {
    url: string;
    sessionId: string;
    userId?: string | null;
    on?: {
      ready?: () => void;
      state?: (name: "LISTENING" | "RESPONDING" | "CLOSED" | string) => void;
      interim?: (text: string) => void;
      stt?: (text: string) => void;
      token?: (token: string) => void;
      audio?: (payload: {
        media_type?: string;
        data_b64?: string;
        text?: string;
      }) => void;
      audio_play_start?: (payload: {
        media_type?: string;
        data_b64?: string;
        text?: string;
      }) => void;
      done?: (payload: {
        reply?: string;
        used_retrieval?: string;
        memory_photo?: {
          image_url?: string;
          updated_at?: string | number;
        };
        reminiscence_photo?: {
          mode?: string;
          title?: string;
          image_url?: string;
          action?: string;
        };
      }) => void;
      ttsEnded?: () => void;
      cancel?: () => void;
      notice?: (payload: { reason?: string; message?: string }) => void;
      error?: (message: string) => void;
    };
  }
}

export type PatientVisualState = "idle" | "listening" | "thinking" | "speaking" | "reassuring";
export type PatientAgentAuraState = AgentState;

export {};
