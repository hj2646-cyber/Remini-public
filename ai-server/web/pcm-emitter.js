// AudioWorklet processor for voice-loop.js.
//
// 별도 정적 파일로 분리한 이유: iOS PWA(homescreen standalone) 환경에서
// `audioCtx.audioWorklet.addModule(blob:URL)` 가 promise 가 settle 안 되고
// 무한 보류되는 알려진 회귀가 있다. 정적 같은-출처 URL 로 바꾸면 해결됨.
// 출처: WebKit #237878, Apple Forum 734378/768347, MS speech-sdk-js #455.

const WORKLET_FRAME = 1024;

class PcmEmitter extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buf = new Float32Array(WORKLET_FRAME);
    this._n = 0;
  }
  process(inputs) {
    const ch = inputs[0][0];
    if (!ch) return true;
    let i = 0;
    while (i < ch.length) {
      const room = this._buf.length - this._n;
      const take = Math.min(room, ch.length - i);
      this._buf.set(ch.subarray(i, i + take), this._n);
      this._n += take;
      i += take;
      if (this._n === this._buf.length) {
        const out = new Int16Array(this._buf.length);
        for (let k = 0; k < this._buf.length; k++) {
          let s = Math.max(-1, Math.min(1, this._buf[k]));
          out[k] = s < 0 ? s * 32768 : s * 32767;
        }
        this.port.postMessage(out.buffer, [out.buffer]);
        this._n = 0;
      }
    }
    return true;
  }
}
registerProcessor("pcm-emitter", PcmEmitter);
