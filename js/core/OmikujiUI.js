// ============================================================
// 神社の「おみくじ」を、ただの文字表示ではなくミニゲーム風の
// 演出にするためのUI。
// 1. Space/Enter（またはクリック）でおみくじ箱を振る
// 2. 少し待つと結果が明らかになる
// 3. もう一度Space/Enter（またはクリック）で閉じ、呼び出し元に結果を返す
// ============================================================

const RESULT_TABLE = [
  { result: '大吉', weight: 5 },
  { result: '中吉', weight: 15 },
  { result: '小吉', weight: 20 },
  { result: '吉', weight: 25 },
  { result: '末吉', weight: 20 },
  { result: '凶', weight: 15 },
];

const COMMENTS = {
  '大吉': '何をしても上手くいく、最高の運勢です。',
  '中吉': 'なかなかの好運。落ち着いて過ごしましょう。',
  '小吉': 'ささやかな幸運が訪れそうです。',
  '吉': '穏やかで、悪くない一日になりそうです。',
  '末吉': '焦らず、ゆっくりいきましょう。',
  '凶': '今日は無理をせず、慎重に過ごしましょう。',
};

const SHAKE_DURATION_MS = 1100;

export class OmikujiUI {
  constructor(rootEl) {
    this.root = rootEl;
    this.boxEl = rootEl.querySelector('.omikuji-box');
    this.promptEl = rootEl.querySelector('.omikuji-prompt');
    this.resultEl = rootEl.querySelector('.omikuji-result');
    this.resultTitleEl = rootEl.querySelector('.omikuji-result-title');
    this.resultCommentEl = rootEl.querySelector('.omikuji-result-comment');

    this.stage = 'idle'; // 'idle' -> 'shaking' -> 'revealed'
    this.onComplete = null;
    this.pendingResult = null;
    this._shakeTimer = null;

    this.boxEl.addEventListener('click', () => this._handleAction());
    this.resultEl.addEventListener('click', () => this._handleAction());
  }

  get isOpen() {
    return !this.root.classList.contains('hidden');
  }

  /** ミニゲームを開始する。onComplete({ result, comment, isDaikichi }) が閉じたときに呼ばれる */
  open(onComplete) {
    this.onComplete = onComplete;
    this.stage = 'idle';
    this.pendingResult = null;
    this.boxEl.classList.remove('shaking');
    this.resultEl.classList.add('hidden');
    this.promptEl.textContent = 'Space / Enter：おみくじを振る';
    this.root.classList.remove('hidden');
  }

  /** Space/Enterキーが押されたときに呼ぶ（クリックでも同じ処理を通る） */
  advance() {
    this._handleAction();
  }

  _handleAction() {
    if (this.stage === 'idle') {
      this._shake();
    } else if (this.stage === 'revealed') {
      this.close();
    }
    // 'shaking' 中は演出の途中なので何もしない
  }

  _shake() {
    this.stage = 'shaking';
    this.promptEl.textContent = '……';
    this.boxEl.classList.add('shaking');
    this._shakeTimer = setTimeout(() => this._reveal(), SHAKE_DURATION_MS);
  }

  _reveal() {
    this.boxEl.classList.remove('shaking');
    const picked = this._draw();
    this.pendingResult = picked;
    this.resultTitleEl.textContent = `「${picked.result}」`;
    this.resultCommentEl.textContent = picked.comment;
    this.resultEl.classList.remove('hidden');
    this.promptEl.textContent = 'Space / Enter：閉じる';
    this.stage = 'revealed';
  }

  _draw() {
    const total = RESULT_TABLE.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * total;
    let picked = RESULT_TABLE[RESULT_TABLE.length - 1].result;
    for (const entry of RESULT_TABLE) {
      if (roll < entry.weight) { picked = entry.result; break; }
      roll -= entry.weight;
    }
    return { result: picked, comment: COMMENTS[picked], isDaikichi: picked === '大吉' };
  }

  close() {
    if (this._shakeTimer) {
      clearTimeout(this._shakeTimer);
      this._shakeTimer = null;
    }
    this.root.classList.add('hidden');
    const cb = this.onComplete;
    const result = this.pendingResult;
    this.onComplete = null;
    this.pendingResult = null;
    if (cb && result) cb(result);
  }
}
