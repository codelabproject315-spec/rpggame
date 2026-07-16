// ============================================================
// 釣りのミニゲーム。
// 左右に往復するマーカーが、ハイライトされた「あたりゾーン」に
// 重なったタイミングでSpace/Enter（またはクリック）を押すと釣れる。
// ============================================================

const FISH_TABLE = [
  { id: 'fish_river', name: '川魚', weight: 40 },
  { id: 'fish_pond', name: '池の魚', weight: 40 },
  { id: 'fish_rare', name: '幻の魚', weight: 20 },
];

const PERIOD_SEC = 1.5; // マーカーが端から端まで往復する周期

export class FishingUI {
  constructor(rootEl) {
    this.root = rootEl;
    this.trackEl = rootEl.querySelector('.fishing-track');
    this.zoneEl = rootEl.querySelector('.fishing-zone');
    this.markerEl = rootEl.querySelector('.fishing-marker');
    this.titleEl = rootEl.querySelector('.fishing-title');
    this.resultEl = rootEl.querySelector('.fishing-result');
    this.resultTitleEl = rootEl.querySelector('.fishing-result-title');
    this.resultCommentEl = rootEl.querySelector('.fishing-result-comment');

    this.stage = 'idle'; // 'moving' -> 'revealed'
    this.onComplete = null;
    this.pendingFish = null;
    this._raf = null;
    this._startTime = 0;
    this._currentPos = 0;
    this.zoneStart = 0.4;
    this.zoneWidth = 0.2;

    this.trackEl.addEventListener('click', () => this._handleAction());
    this.resultEl.addEventListener('click', () => this._handleAction());
  }

  get isOpen() {
    return !this.root.classList.contains('hidden');
  }

  /** ミニゲームを開始する。onComplete(fish | null) が閉じたときに呼ばれる（釣れなければnull） */
  open(onComplete) {
    this.onComplete = onComplete;
    this.stage = 'moving';
    this.pendingFish = null;
    this.resultEl.classList.add('hidden');
    this.titleEl.textContent = 'タイミングよくSpace / Enterを押そう!';

    this.zoneWidth = 0.16 + Math.random() * 0.08; // 毎回すこし難易度を変える
    this.zoneStart = Math.random() * (1 - this.zoneWidth);
    this.zoneEl.style.left = `${this.zoneStart * 100}%`;
    this.zoneEl.style.width = `${this.zoneWidth * 100}%`;

    this._startTime = performance.now();
    this.root.classList.remove('hidden');
    this._tick();
  }

  advance() {
    this._handleAction();
  }

  _handleAction() {
    if (this.stage === 'moving') {
      this._attempt();
    } else if (this.stage === 'revealed') {
      this.close();
    }
  }

  _tick() {
    if (this.stage !== 'moving') return;
    const elapsed = (performance.now() - this._startTime) / 1000;
    const t = (elapsed % PERIOD_SEC) / PERIOD_SEC;
    // 三角波で0→1→0を往復させる
    this._currentPos = t < 0.5 ? t * 2 : 2 - t * 2;
    this.markerEl.style.left = `${this._currentPos * 100}%`;
    this._raf = requestAnimationFrame(() => this._tick());
  }

  _attempt() {
    this.stage = 'revealed';
    if (this._raf) cancelAnimationFrame(this._raf);

    const success = this._currentPos >= this.zoneStart && this._currentPos <= this.zoneStart + this.zoneWidth;
    this.pendingFish = success ? this._drawFish() : null;

    if (success) {
      this.resultTitleEl.textContent = `${this.pendingFish.name}を釣り上げた!`;
      this.resultCommentEl.textContent = 'コレクション帳に追加された。';
    } else {
      this.resultTitleEl.textContent = '……逃げられてしまった。';
      this.resultCommentEl.textContent = 'また挑戦してみよう。';
    }
    this.resultEl.classList.remove('hidden');
    this.titleEl.textContent = 'Space / Enter：閉じる';
  }

  _drawFish() {
    const total = FISH_TABLE.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * total;
    for (const entry of FISH_TABLE) {
      if (roll < entry.weight) return entry;
      roll -= entry.weight;
    }
    return FISH_TABLE[0];
  }

  close() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this.root.classList.add('hidden');
    const cb = this.onComplete;
    const fish = this.pendingFish;
    this.onComplete = null;
    this.pendingFish = null;
    if (cb) cb(fish);
  }
}
