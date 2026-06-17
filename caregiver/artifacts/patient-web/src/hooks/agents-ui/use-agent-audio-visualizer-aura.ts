import { useMemo } from 'react';
import { type LocalAudioTrack, type RemoteAudioTrack } from 'livekit-client';
import {
  type AgentState,
  type TrackReference,
  type TrackReferenceOrPlaceholder,
  useTrackVolume,
} from '@livekit/components-react';

const DEFAULT_SPEED = 10;
const DEFAULT_AMPLITUDE = 2;
const DEFAULT_FREQUENCY = 0.5;
const DEFAULT_SCALE = 0.2;
const DEFAULT_BRIGHTNESS = 1.5;

export function useAgentAudioVisualizerAura(
  state: AgentState | undefined,
  audioTrack?: LocalAudioTrack | RemoteAudioTrack | TrackReferenceOrPlaceholder,
  audioLevel?: number,
) {
  const trackVolume = useTrackVolume(audioTrack as TrackReference, {
    fftSize: 512,
    smoothingTimeConstant: 0.55,
  });
  const volume = typeof audioLevel === 'number' ? audioLevel : trackVolume;

  return useMemo(() => {
    switch (state) {
      case 'idle':
      case 'failed':
      case 'disconnected':
        return {
          speed: 10,
          scale: 0.2,
          amplitude: 1.2,
          frequency: 0.4,
          brightness: 1.0,
        };
      case 'listening':
      case 'pre-connect-buffering':
        return {
          speed: 20,
          scale: 0.26 + 0.14 * volume,
          amplitude: 1.0 + volume * 0.8,
          frequency: 0.7 + volume * 0.35,
          brightness: 1.3 + volume * 0.9,
        };
      case 'thinking':
      case 'connecting':
      case 'initializing':
        return {
          speed: 30,
          scale: 0.3,
          amplitude: 0.5,
          frequency: 1.0,
          brightness: 1.5,
        };
      case 'speaking':
        return {
          speed: 70,
          scale: 0.24 + 0.24 * volume,
          amplitude: 0.75 + volume * 0.9,
          frequency: 1.25 + volume * 0.55,
          brightness: 1.35 + volume * 0.85,
        };
      default:
        return {
          speed: DEFAULT_SPEED,
          scale: DEFAULT_SCALE,
          amplitude: DEFAULT_AMPLITUDE,
          frequency: DEFAULT_FREQUENCY,
          brightness: DEFAULT_BRIGHTNESS,
        };
    }
  }, [state, volume]);
}
