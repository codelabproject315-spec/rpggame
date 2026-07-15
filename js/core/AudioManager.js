// ============================================================
// 音声ファイルを一切使わず、Web Audio APIでその場で音を合成するクラス。
// ・足音: プレイヤーが移動している間、一定間隔で短いノイズを鳴らす
// ・環境音: 風のような低い音を常時ループ再生
// ・雨音: 天候が雨のときだけ、環境音に重ねてザーッという音を鳴らす
// ・効果音: 実績解除・おみくじなど、短い和音を鳴らす
//
// ブラウザの自動再生制限のため、AudioContextは作成できても
// 実際に音が鳴るのは最初のキー入力（ユーザー操作）以降になる。
// ============================================================

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.windGain = null;
    this.rainGain = null;
    this._noiseBuffer = null;
    this._footstepTimer = 0;
    this._footstepToggle = false;
    this._unlocked = false;
  }

  /** 最初のユーザー操作（キー入力など）で呼び出し、音を鳴らせる状態にする */
  unlock() {
    if (this._unlocked) return;
    this._unlocked = true;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return; // 対応していない環境では何もしない
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);

    this._noiseBuffer = this._buildNoiseBuffer(2);

    this._startWindLoop();
    this._startRainLoop();

    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  _buildNoiseBuffer(seconds) {
    const length = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  _makeLoopingNoiseSource(filterType, frequency, q = 0.7) {
    const source = this.ctx.createBufferSource();
    source.buffer = this._noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = q;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    return { source, filter, gain };
  }

  _startWindLoop() {
    const { gain } = this._makeLoopingNoiseSource('lowpass', 420, 0.5);
    this.windGain = gain;
    this.windGain.gain.value = 0.05; // 常時、控えめに鳴らす
  }

  _startRainLoop() {
    const { gain } = this._makeLoopingNoiseSource('highpass', 1600, 0.6);
    this.rainGain = gain;
    this.rainGain.gain.value = 0; // 雨のときだけフェードインさせる
  }

  /** 天候が雨かどうかに応じて、雨音をフェードイン/アウトする */
  setRaining(isRaining) {
    if (!this.ctx || !this.rainGain) return;
    const target = isRaining ? 0.16 : 0;
    this.rainGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 1.5);
  }

  /** プレイヤーが移動しているかどうかを渡すと、一定間隔で足音を鳴らす */
  updateFootsteps(dt, isMoving) {
    if (!this.ctx || !isMoving) {
      this._footstepTimer = 0;
      return;
    }
    this._footstepTimer -= dt;
    if (this._footstepTimer <= 0) {
      this._footstepTimer = 0.32;
      this._playFootstep();
    }
  }

  _playFootstep() {
    if (!this.ctx) return;
    const source = this.ctx.createBufferSource();
    source.buffer = this._noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = this._footstepToggle ? 260 : 300;
    this._footstepToggle = !this._footstepToggle;

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(now);
    source.stop(now + 0.1);
  }

  /** 実績解除やおみくじなど、ちょっとした嬉しい出来事を知らせる短い和音 */
  playChime() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [880, 1108.7, 1318.5]; // 明るい響きの和音
    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      const start = now + i * 0.06;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.65);
    });
  }
}
