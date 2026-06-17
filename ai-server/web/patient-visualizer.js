// Siri-style multi-line wave visualizer.
// - 4 overlapped thin lines with color gradient
// - Low CPU: ≤60 segments, no shadowBlur, no composite ops
// - Cached linear gradients per line/size
// - Reads mic/TTS AnalyserNode for volume reaction
// External interface preserved:
//   new PatientVisualizer(container)
//   setState(state), setAnalysers(mic, tts), destroy()
//   window.PatientVisualizer

const STATE_STYLE = {
  idle:       { speed: 0.6, ampBase: 0.06, ampGain: 0.18, thickness: 2.2 },
  listening:  { speed: 1.1, ampBase: 0.10, ampGain: 0.46, thickness: 2.6 },
  thinking:   { speed: 1.6, ampBase: 0.18, ampGain: 0.22, thickness: 2.4 },
  responding: { speed: 1.35, ampBase: 0.16, ampGain: 0.58, thickness: 3.0 },
  reassuring: { speed: 0.9, ampBase: 0.12, ampGain: 0.26, thickness: 2.3 },
};

// 정책 (2026-05-09 v3): 살구 베이지 배경 보색 = Material 900대 진한 한색.
// 화이트워시 방지를 위해 채도·명도 모두 강하게.
const LINE_COLORS = [
  { base: "#0D47A1", accent: "#1976D2", alpha: 0.95 }, // Deep Navy (main)
  { base: "#004D40", accent: "#00897B", alpha: 0.85 }, // Deep Teal
  { base: "#311B92", accent: "#5E35B1", alpha: 0.78 }, // Deep Purple
  { base: "#1B5E20", accent: "#388E3C", alpha: 0.65 }, // Deep Green
];

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

class PatientVisualizer {
  constructor(container) {
    this.container = container;
    this.state = "idle";
    this.micAnalyser = null;
    this.ttsAnalyser = null;
    this.analyser = null;

    this._destroyed = false;
    this._time = 0;
    this._prevTs = 0;
    this._level = 0;
    this._bass = 0;
    this._mid = 0;
    this._freqData = null;

    this._cssWidth = 0;
    this._cssHeight = 0;
    this._dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    this._gradientCache = new Map();

    this.canvas = document.createElement("canvas");
    this.canvas.className = "patient-aura-canvas";
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.container.replaceChildren(this.canvas);

    this._animate = this._animate.bind(this);
    this._onResize = this._onResize.bind(this);

    this._resize(true);
    window.addEventListener("resize", this._onResize);
    this._raf = requestAnimationFrame(this._animate);
  }

  setState(state) {
    const nextState = state === "speaking" ? "responding" : (STATE_STYLE[state] ? state : "idle");
    if (nextState === this.state) return;
    this.state = nextState;
    this._syncAnalyser();
  }

  setAnalysers(mic, tts) {
    this.micAnalyser = mic || null;
    this.ttsAnalyser = tts || null;
    this._syncAnalyser();
  }

  destroy() {
    this._destroyed = true;
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = 0;
    }
    window.removeEventListener("resize", this._onResize);
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this._gradientCache.clear();
    this._freqData = null;
  }

  _syncAnalyser() {
    if (this.state === "responding") {
      this.analyser = this.ttsAnalyser;
    } else if (this.state === "listening") {
      this.analyser = this.micAnalyser;
    } else {
      this.analyser = null;
    }
  }

  _onResize() {
    this._resize(true);
  }

  _resize(force = false) {
    const width = Math.max(this.container.clientWidth, window.innerWidth, 1);
    const height = Math.max(this.container.clientHeight, window.innerHeight, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    if (!force && width === this._cssWidth && height === this._cssHeight && dpr === this._dpr) {
      return;
    }
    this._cssWidth = width;
    this._cssHeight = height;
    this._dpr = dpr;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._gradientCache.clear();
  }

  _readLevel(style) {
    let rawLevel = 0;
    let rawBass = 0;
    let rawMid = 0;

    if (this.analyser) {
      if (!this._freqData || this._freqData.length !== this.analyser.frequencyBinCount) {
        this._freqData = new Uint8Array(this.analyser.frequencyBinCount);
      }
      try {
        this.analyser.getByteFrequencyData(this._freqData);
        const n = this._freqData.length;
        const bEnd = Math.max(1, Math.floor(n * 0.12));
        const mEnd = Math.max(bEnd + 1, Math.floor(n * 0.4));
        let bSum = 0;
        let mSum = 0;
        for (let i = 0; i < bEnd; i += 1) bSum += this._freqData[i];
        for (let i = bEnd; i < mEnd; i += 1) mSum += this._freqData[i];
        rawBass = (bSum / bEnd) / 255;
        rawMid = (mSum / (mEnd - bEnd)) / 255;
        rawLevel = rawBass * 0.55 + rawMid * 0.45;
      } catch (_) {
        this._freqData = null;
      }
    }

    const floor = style.ampBase;
    this._level = this._level + (Math.max(rawLevel, floor) - this._level) * 0.16;
    this._bass = this._bass + (Math.max(rawBass, floor * 0.9) - this._bass) * 0.2;
    this._mid = this._mid + (Math.max(rawMid, floor * 0.7) - this._mid) * 0.16;
    return { level: this._level, bass: this._bass, mid: this._mid };
  }

  _getHorizontalGradient(colorDef, width) {
    const key = `${colorDef.base}_${width | 0}`;
    let grad = this._gradientCache.get(key);
    if (!grad) {
      grad = this.ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, `${colorDef.base}00`);
      grad.addColorStop(0.22, colorDef.base);
      grad.addColorStop(0.5, colorDef.accent);
      grad.addColorStop(0.78, colorDef.base);
      grad.addColorStop(1, `${colorDef.base}00`);
      this._gradientCache.set(key, grad);
    }
    return grad;
  }

  _drawWave(style, profile, lineIndex, colorDef) {
    const W = this._cssWidth;
    const H = this._cssHeight;
    const centerY = H * 0.5;
    const segments = W < 700 ? 40 : 60;
    const step = W / segments;

    const time = this._time * style.speed;
    const phase = time + lineIndex * 0.9;
    const freqA = 2.0 + lineIndex * 0.55;
    const freqB = freqA * 0.6 + 1.3;

    const maxAmp = Math.min(H * 0.32, 220);
    const amp = maxAmp * (style.ampBase + profile.level * style.ampGain) * (1 - lineIndex * 0.13);
    const thickness = clamp(style.thickness + profile.bass * 1.0 - lineIndex * 0.22, 1.2, 4.5);

    this.ctx.beginPath();
    for (let i = 0; i <= segments; i += 1) {
      const progress = i / segments;
      const x = i * step;
      const envelope = Math.sin(progress * Math.PI); // tapered edges
      const y = centerY
        + Math.sin(progress * Math.PI * freqA + phase) * amp * envelope
        + Math.cos(progress * Math.PI * freqB - phase * 0.7) * amp * 0.38 * envelope;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }

    const grad = this._getHorizontalGradient(colorDef, W);
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = thickness;
    this.ctx.strokeStyle = grad;
    this.ctx.globalAlpha = colorDef.alpha;
    this.ctx.stroke();
  }

  _drawFrame() {
    const style = STATE_STYLE[this.state] || STATE_STYLE.idle;
    const profile = this._readLevel(style);

    this.ctx.clearRect(0, 0, this._cssWidth, this._cssHeight);
    this.ctx.globalAlpha = 1;

    // Reverse order so the cyan (main) line draws on top
    for (let i = LINE_COLORS.length - 1; i >= 0; i -= 1) {
      this._drawWave(style, profile, i, LINE_COLORS[i]);
    }
    this.ctx.globalAlpha = 1;
  }

  _animate(timestamp) {
    if (this._destroyed) return;
    if (!this._prevTs) this._prevTs = timestamp;
    const dt = Math.min((timestamp - this._prevTs) / 1000, 0.05);
    this._prevTs = timestamp;
    this._time += dt;
    this._drawFrame();
    this._raf = requestAnimationFrame(this._animate);
  }
}

window.PatientVisualizer = PatientVisualizer;
