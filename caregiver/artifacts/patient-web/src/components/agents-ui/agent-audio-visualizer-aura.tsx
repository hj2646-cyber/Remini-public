'use client';

import { useEffect, useMemo, useRef, type ComponentProps } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { type LocalAudioTrack, type RemoteAudioTrack } from 'livekit-client';
import { type AgentState, type TrackReferenceOrPlaceholder } from '@livekit/components-react';

import { useAgentAudioVisualizerAura } from '@/hooks/agents-ui/use-agent-audio-visualizer-aura';
import { cn } from '@/lib/utils';

const DEFAULT_COLOR = '#0D47A1';

interface LineColor {
  base: string;
  accent: string;
  alpha: number;
}

// 정책 (2026-05-09 v3): 살구 베이지 배경 보색 = Material 900대 진한 한색.
// 화이트워시 방지를 위해 채도·명도 모두 강하게.
const LINE_COLORS: LineColor[] = [
  { base: '#0D47A1', accent: '#1976D2', alpha: 0.95 }, // Deep Navy (main)
  { base: '#004D40', accent: '#00897B', alpha: 0.85 }, // Deep Teal
  { base: '#311B92', accent: '#5E35B1', alpha: 0.78 }, // Deep Purple
  { base: '#1B5E20', accent: '#388E3C', alpha: 0.65 }, // Deep Green
];

function hexToRgb(hex: string): [number, number, number] {
  const match = hex.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
  if (!match) return [13, 71, 161];
  return [
    parseInt(match[1], 16),
    parseInt(match[2], 16),
    parseInt(match[3], 16),
  ];
}

function tintLine(base: LineColor, accentColor: string, shift: number): LineColor {
  if (shift <= 0) return base;
  // Blend each base line slightly toward the user's accent color by `shift`.
  const [ar, ag, ab] = hexToRgb(accentColor);
  const [br, bg, bb] = hexToRgb(base.base);
  const k = Math.min(Math.max(shift, 0), 1);
  const nr = Math.round(br * (1 - k) + ar * k);
  const ng = Math.round(bg * (1 - k) + ag * k);
  const nb = Math.round(bb * (1 - k) + ab * k);
  const blended = `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  return { ...base, base: blended };
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

interface SiriCanvasProps {
  speed: number;
  amplitude: number;
  frequency: number;
  brightness: number;
  thickness: number;
  audioLevel: number;
  color: string;
  colorShift: number;
  themeMode: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
}

function SiriCanvas({
  speed,
  amplitude,
  frequency,
  brightness,
  thickness,
  audioLevel,
  color,
  colorShift,
  themeMode,
  className,
  style,
}: SiriCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const levelRef = useRef(0);
  const rafRef = useRef(0);

  const lines = useMemo(
    () => LINE_COLORS.map((c) => tintLine(c, color, colorShift)),
    [color, colorShift],
  );

  // Keep the latest values in refs so the RAF loop can read them without restarting.
  const paramsRef = useRef({ speed, amplitude, frequency, brightness, thickness, audioLevel, themeMode });
  paramsRef.current = { speed, amplitude, frequency, brightness, thickness, audioLevel, themeMode };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const gradientCache = new Map<string, CanvasGradient>();
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let time = 0;
    let prevTs = 0;
    let disposed = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(Math.floor(rect.width), 1);
      const h = Math.max(Math.floor(rect.height), 1);
      const nextDpr = Math.min(window.devicePixelRatio || 1, 1.25);
      if (w === cssW && h === cssH && nextDpr === dpr) return;
      cssW = w;
      cssH = h;
      dpr = nextDpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gradientCache.clear();
    };

    const getGradient = (line: LineColor) => {
      const key = `${line.base}_${cssW}`;
      const cached = gradientCache.get(key);
      if (cached) return cached;
      const grad = ctx.createLinearGradient(0, 0, cssW, 0);
      grad.addColorStop(0, `${line.base}00`);
      grad.addColorStop(0.22, line.base);
      grad.addColorStop(0.5, line.accent);
      grad.addColorStop(0.78, line.base);
      grad.addColorStop(1, `${line.base}00`);
      gradientCache.set(key, grad);
      return grad;
    };

    const drawLine = (line: LineColor, index: number) => {
      const { speed: sp, amplitude: am, frequency: fq, brightness: br, thickness: th } = paramsRef.current;
      const level = levelRef.current;
      const centerY = cssH * 0.5;
      const segments = cssW < 360 ? 32 : cssW < 700 ? 44 : 60;
      const step = cssW / segments;
      const phase = time * sp + index * 0.9;
      const freqA = fq * 2.4 + index * 0.55;
      const freqB = freqA * 0.6 + 1.3;

      const maxAmp = cssH * 0.42;
      const amp = maxAmp * (0.08 + level * am * 0.5) * (1 - index * 0.13);
      const lineWidth = clamp(th * br + level * 1.0 - index * 0.22, 1.2, 5.0);

      ctx.beginPath();
      for (let i = 0; i <= segments; i += 1) {
        const progress = i / segments;
        const x = i * step;
        const envelope = Math.sin(progress * Math.PI); // taper edges to zero
        const y =
          centerY +
          Math.sin(progress * Math.PI * freqA + phase) * amp * envelope +
          Math.cos(progress * Math.PI * freqB - phase * 0.7) * amp * 0.38 * envelope;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = getGradient(line);
      ctx.globalAlpha = line.alpha * clamp(br, 0.4, 1.4);
      ctx.stroke();
    };

    const frame = (ts: number) => {
      if (disposed) return;
      if (!prevTs) prevTs = ts;
      const dt = Math.min((ts - prevTs) / 1000, 0.05);
      prevTs = ts;
      time += dt;

      // Smooth the audioLevel so canvas responds gracefully.
      const target = paramsRef.current.audioLevel || 0;
      levelRef.current = levelRef.current + (target - levelRef.current) * 0.18;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.globalAlpha = 1;
      for (let i = lines.length - 1; i >= 0; i -= 1) {
        drawLine(lines[i], i);
      }
      ctx.globalAlpha = 1;

      rafRef.current = window.requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener('resize', resize);
    rafRef.current = window.requestAnimationFrame(frame);

    return () => {
      disposed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('resize', resize);
      gradientCache.clear();
    };
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={style}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

export const AgentAudioVisualizerAuraVariants = cva(['aspect-square'], {
  variants: {
    size: {
      icon: 'h-[24px] gap-[2px]',
      sm: 'h-[56px] gap-[4px]',
      md: 'h-[112px] gap-[8px]',
      lg: 'h-[224px] gap-[16px]',
      xl: 'h-[448px] gap-[32px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface AgentAudioVisualizerAuraProps {
  size?: 'icon' | 'sm' | 'md' | 'lg' | 'xl';
  state?: AgentState;
  color?: `#${string}`;
  colorShift?: number;
  themeMode?: 'dark' | 'light';
  /** Kept for API compatibility — audioLevel takes precedence when provided. */
  audioTrack?: LocalAudioTrack | RemoteAudioTrack | TrackReferenceOrPlaceholder;
  /** Precomputed audio level from 0 to 1. */
  audioLevel?: number;
}

/**
 * Siri-style multi-line audio visualizer.
 * Replaces the previous WebGL shader implementation with a lightweight Canvas2D
 * renderer (4 layered gradient lines, ≤60 segments, no shadow blur) for smooth
 * 60fps playback on modest GPUs.
 */
export function AgentAudioVisualizerAura({
  size = 'lg',
  state = 'connecting',
  color = DEFAULT_COLOR,
  colorShift = 0.05,
  audioTrack,
  audioLevel,
  themeMode,
  className,
  ref,
  ...props
}: AgentAudioVisualizerAuraProps &
  ComponentProps<'div'> &
  VariantProps<typeof AgentAudioVisualizerAuraVariants>) {
  const { speed, scale, amplitude, frequency, brightness } = useAgentAudioVisualizerAura(
    state,
    audioTrack,
    audioLevel,
  );

  const resolvedThemeMode: 'dark' | 'light' =
    themeMode ??
    (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light');

  // Derive wave-space parameters from the existing state-to-params hook.
  // speed: 10-70, amplitude: 0.5-2, frequency: 0.4-1.25, scale: 0.2-0.5, brightness: 1.0-1.5
  const waveSpeed = speed / 30; // 0.33 .. 2.33
  const waveAmp = amplitude * 0.6; // 0.3 .. 1.2
  const waveFreq = frequency * 1.2; // 0.48 .. 1.5
  const waveThickness = 2.2 + scale * 3.0; // 2.8 .. 3.7
  const waveBrightness = brightness;

  const resolvedLevel = typeof audioLevel === 'number' ? audioLevel : 0;

  return (
    <div
      ref={ref}
      data-lk-state={state}
      className={cn(AgentAudioVisualizerAuraVariants({ size }), className)}
      {...props}
    >
      <SiriCanvas
        speed={waveSpeed}
        amplitude={waveAmp}
        frequency={waveFreq}
        brightness={waveBrightness}
        thickness={waveThickness}
        audioLevel={resolvedLevel}
        color={color}
        colorShift={colorShift}
        themeMode={resolvedThemeMode}
      />
    </div>
  );
}
