// ============================================================
// 昼夜・天候のサイクルを管理するクラス。
// 実時間の経過に応じて「時刻(0〜1の周期)」と「天候(晴れ/雨)」を
// 進める。実際の色や明るさへの変換はここで計算し、
// Renderer側はこのクラスが返す値をそのまま使うだけでよい。
// ============================================================

// 1周(朝→昼→夕方→夜→朝)にかかる実時間（秒）。デモなので短めにしてある。
const DAY_LENGTH_SECONDS = 240;

// 天候が持続するおおよその時間（秒）。この範囲でランダムに次の切り替えを決める。
const CLEAR_DURATION_RANGE = [50, 110];
const RAIN_DURATION_RANGE = [25, 55];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(colorA, colorB, t) {
  const ar = (colorA >> 16) & 0xff, ag = (colorA >> 8) & 0xff, ab = colorA & 0xff;
  const br = (colorB >> 16) & 0xff, bg = (colorB >> 8) & 0xff, bb = colorB & 0xff;
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const b = Math.round(lerp(ab, bb, t));
  return (r << 16) | (g << 8) | b;
}

// 時刻ごとの空の色（16進数カラー）。この間をなめらかに補間する。
const SKY_KEYFRAMES = [
  { t: 0.0, color: 0x141a2e }, // 深夜
  { t: 0.2, color: 0x3a4a6b }, // 明け方
  { t: 0.28, color: 0xe8956b }, // 朝焼け
  { t: 0.35, color: 0xbfe3f2 }, // 朝
  { t: 0.65, color: 0xbfe3f2 }, // 昼
  { t: 0.75, color: 0xe8956b }, // 夕焼け
  { t: 0.85, color: 0x3a4a6b }, // 宵
  { t: 1.0, color: 0x141a2e }, // 深夜
];

function sampleKeyframes(phase, keyframes) {
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (phase >= a.t && phase <= b.t) {
      const span = b.t - a.t || 1;
      const t = (phase - a.t) / span;
      return lerpColor(a.color, b.color, t);
    }
  }
  return keyframes[keyframes.length - 1].color;
}

function randomBetween([min, max]) {
  return min + Math.random() * (max - min);
}

export class DayNightCycle {
  constructor() {
    this.phase = 0.4; // 0〜1。0.4付近＝日中スタート（デモが暗い画面から始まらないように）
    this.weather = 'clear'; // 'clear' | 'rain'
    this._weatherTimer = randomBetween(CLEAR_DURATION_RANGE);
  }

  update(dt) {
    this.phase = (this.phase + dt / DAY_LENGTH_SECONDS) % 1;

    this._weatherTimer -= dt;
    if (this._weatherTimer <= 0) {
      this.weather = this.weather === 'clear' ? 'rain' : 'clear';
      this._weatherTimer = randomBetween(
        this.weather === 'clear' ? CLEAR_DURATION_RANGE : RAIN_DURATION_RANGE
      );
    }
  }

  isNight() {
    return this.phase < 0.22 || this.phase > 0.88;
  }

  isRaining() {
    return this.weather === 'rain';
  }

  /** 現在の空・霧の色（16進数カラー） */
  getSkyColor() {
    const base = sampleKeyframes(this.phase, SKY_KEYFRAMES);
    if (this.weather === 'rain') {
      // 雨の日は少しくすんだ色にする
      return lerpColor(base, 0x6b7480, 0.5);
    }
    return base;
  }

  /** 太陽（メインの光源）の明るさ・色 */
  getSunLight() {
    const daylight = this.phase > 0.28 && this.phase < 0.75;
    const dawnDusk = (this.phase > 0.2 && this.phase <= 0.28) || (this.phase >= 0.75 && this.phase < 0.85);
    let intensity = daylight ? 0.9 : dawnDusk ? 0.55 : 0.18;
    if (this.weather === 'rain') intensity *= 0.55;
    const color = dawnDusk ? 0xffb37a : 0xffffff;
    return { intensity, color };
  }

  /** 環境光（全体の底上げ）の明るさ */
  getAmbientIntensity() {
    let base = this.isNight() ? 0.35 : 0.75;
    if (this.weather === 'rain') base *= 0.85;
    return base;
  }
}
