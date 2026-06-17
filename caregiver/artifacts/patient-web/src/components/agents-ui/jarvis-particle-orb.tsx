import { useEffect, useRef } from "react";
import * as THREE from "three";

export type PatientOrbState = "idle" | "listening" | "thinking" | "speaking" | "reassuring";

export interface JarvisParticleOrbProps {
  /** Normalized audio RMS, 0..1. Drives orb displacement and particle size. */
  audioLevel: number;
  /** Conversation state — controls color palette and motion parameters. */
  state: PatientOrbState;
  size?: "sm" | "md" | "lg";
  className?: string;
}

type StateStyle = {
  color: THREE.Color;
  accent: THREE.Color;
  speed: number;
  amp: number;
  /** Uniform scale pulse gain — how much the whole orb breathes with audioLevel (0 = static). */
  pulse: number;
};

// 정책 분리 (2026-05-09 결정 + v3 보강):
// - 배경 (전체 면적 ~70%) = 임상 근거 난색 유지 (김형희·최외선 2010 등)
// - 동적 AI 시각 요소 (orb, wave) = 살구 베이지 배경 보색 한색
//   → AdditiveBlending 화이트워시 방지를 위해 Material 900대 진한 톤 사용
//   → 살구(#fbe9c4)의 정확한 보색 영역 = Deep Navy / Deep Teal / Deep Purple / Deep Green
// state 매핑: idle=Deep Navy / listening=Deep Teal / thinking=Deep Purple /
//            speaking=Deep Green / reassuring=Deep Purple-Magenta.
const STATE_STYLE: Record<PatientOrbState, StateStyle> = {
  idle: {
    color: new THREE.Color("#0D47A1"),    // Deep Navy (평온·안정)
    accent: new THREE.Color("#1976D2"),
    speed: 0.2,
    amp: 0.2,
    pulse: 0.03,
  },
  listening: {
    color: new THREE.Color("#004D40"),    // Deep Teal (수용)
    accent: new THREE.Color("#00897B"),
    speed: 0.45,
    amp: 0.55,
    pulse: 0.08,
  },
  thinking: {
    color: new THREE.Color("#311B92"),    // Deep Purple (집중)
    accent: new THREE.Color("#5E35B1"),
    speed: 0.7,
    amp: 0.3,
    pulse: 0.04,
  },
  speaking: {
    color: new THREE.Color("#1B5E20"),    // Deep Green (생기·교류)
    accent: new THREE.Color("#388E3C"),
    speed: 0.55,
    amp: 0.7,
    pulse: 0.18,
  },
  reassuring: {
    color: new THREE.Color("#4A148C"),    // Deep Purple-Magenta (깊은 안심)
    accent: new THREE.Color("#6A1B9A"),
    speed: 0.3,
    amp: 0.25,
    pulse: 0.04,
  },
};

const VERTEX_SHADER = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uLevel;
  uniform float uAmp;
  uniform float uPointScale;
  varying float vGlow;
  varying float vRim;

  // Cheap pseudo-random hash — not true noise but enough for particle wobble.
  float hash31(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  void main() {
    vec3 base = position;
    float wobble = hash31(base * 2.7 + vec3(uTime, uTime * 0.8, uTime * 1.3) + aSeed * 6.2831);
    float disp = mix(0.008, 0.055, uLevel) * uAmp * (0.5 + wobble);
    vec3 p = base * (1.0 + disp);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Much smaller base point size — prevents oversized particle overlap (white bloom bug).
    float sizePx = (1.0 + uLevel * 2.0) * uPointScale * (26.0 / -mv.z);
    gl_PointSize = sizePx;

    vGlow = 0.45 + 0.15 * uLevel + 0.1 * wobble;

    // Rim-light: particles on the silhouette edge glow brighter
    vec3 normal = normalize(base);
    vec3 viewDir = normalize(-mv.xyz);
    vRim = 1.0 - abs(dot(normal, viewDir));
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uAlpha;
  varying float vGlow;
  varying float vRim;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    float rim = pow(vRim, 1.6);
    vec3 col = mix(uColor, uAccent, a * 0.55) * vGlow;
    col += uAccent * rim * 0.18;
    gl_FragColor = vec4(col, a * uAlpha);
  }
`;

function buildGeometry(particleCount: number): THREE.BufferGeometry {
  const positions = new Float32Array(particleCount * 3);
  const seeds = new Float32Array(particleCount);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < particleCount; i += 1) {
    const y = 1 - (i / (particleCount - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geometry;
}

function buildMaterial(opts: { alpha: number; pointScale: number }): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLevel: { value: 0 },
      uAmp: { value: 0.3 },
      uAlpha: { value: opts.alpha },
      uPointScale: { value: opts.pointScale },
      uColor: { value: new THREE.Color("#0D47A1") },
      uAccent: { value: new THREE.Color("#1976D2") },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function pickParticleCount(): number {
  if (typeof window === "undefined") return 2048;
  // Mobile / low-end heuristic: narrow viewport or reduced-motion preference
  const narrow = window.innerWidth < 900;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reduced) return 1024;
  if (narrow) return 2048;
  return 4096;
}

export function JarvisParticleOrb({ audioLevel, state, size = "lg", className }: JarvisParticleOrbProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioLevelRef = useRef(audioLevel);
  const stateRef = useRef<PatientOrbState>(state);

  // Keep latest props in refs so the render loop doesn't need to re-run on each update.
  audioLevelRef.current = audioLevel;
  stateRef.current = state;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = pickParticleCount();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth || 320, clientHeight || 320, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const geometry = buildGeometry(particleCount);
    // Parent group lets us pulse the whole orb with one scale assignment.
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Main dense shell — crisp particles. alpha ↑ (라이트 배경 화이트워시 방어)
    const material = buildMaterial({ alpha: 0.62, pointScale: 1.0 });
    const points = new THREE.Points(geometry, material);
    orbGroup.add(points);

    // Inner core — smaller sphere, brighter small particles = center luminosity
    const coreMaterial = buildMaterial({ alpha: 0.78, pointScale: 0.6 });
    const corePoints = new THREE.Points(geometry, coreMaterial);
    corePoints.scale.setScalar(0.72);
    orbGroup.add(corePoints);

    // Smoothed scale state — decouples audio level from the final scale so
    // the orb breathes smoothly instead of snapping frame-to-frame.
    let pulseSmoothed = 1.0;
    let pulseGainSmoothed = STATE_STYLE.idle.pulse;

    const tmpColor = new THREE.Color();
    const tmpAccent = new THREE.Color();

    const resize = () => {
      if (!container) return;
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 320;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(container);
    window.addEventListener("resize", resize);

    let rafId = 0;
    let disposed = false;
    let lastTs = performance.now();

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;

      const style = STATE_STYLE[stateRef.current] ?? STATE_STYLE.idle;
      const level = audioLevelRef.current;

      for (const mat of [material, coreMaterial]) {
        const u = mat.uniforms;
        // 비대칭 lerp: 커질 때 0.45, 줄어들 때 0.70 (복귀 신속).
        const uLevelLerp = level > u.uLevel.value ? 0.45 : 0.70;
        u.uLevel.value += (level - u.uLevel.value) * uLevelLerp;
        u.uAmp.value += (style.amp - u.uAmp.value) * 0.08;
        tmpColor.copy(u.uColor.value as THREE.Color).lerp(style.color, 0.08);
        tmpAccent.copy(u.uAccent.value as THREE.Color).lerp(style.accent, 0.08);
        (u.uColor.value as THREE.Color).copy(tmpColor);
        (u.uAccent.value as THREE.Color).copy(tmpAccent);
        u.uTime.value += dt * style.speed;
      }
      // Core runs on slightly boosted amplitude for depth
      coreMaterial.uniforms.uAmp.value = material.uniforms.uAmp.value * 1.25;

      const levelNow = material.uniforms.uLevel.value;
      points.rotation.y += dt * 0.08 * (1 + levelNow * 2.2);
      points.rotation.x += dt * 0.02;
      corePoints.rotation.y = -points.rotation.y * 1.3;
      corePoints.rotation.z += dt * 0.15;

      // Whole-orb pulse: scale the group so every layer (core/main/halo)
      // breathes together proportionally. Strongest during `speaking`.
      pulseGainSmoothed += (style.pulse - pulseGainSmoothed) * 0.08;
      const targetPulse = 1.0 + levelNow * pulseGainSmoothed;
      // 비대칭 lerp: 커질 때 0.50, 줄어들 때 0.75 (복귀 신속).
      const pulseLerp = targetPulse > pulseSmoothed ? 0.50 : 0.75;
      pulseSmoothed += (targetPulse - pulseSmoothed) * pulseLerp;
      orbGroup.scale.setScalar(pulseSmoothed);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const handleVisibility = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId && !disposed) {
        lastTs = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resize);
      resizeObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      coreMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-patient-orb-state={state}
      className={`patient-aura patient-aura--${size}${className ? ` ${className}` : ""}`}
    />
  );
}
