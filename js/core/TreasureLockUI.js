// ============================================================
// 森の宝箱を開けるための「刻印パズル」ミニゲーム。
// 3つの刻印（星・月・太陽）をランダムな順番でボタン表示し、
// プレイヤーは森で見つけた立て札のヒントを頼りに、
// 正しい順番でクリック（または数字キー1〜3）していく。
// ============================================================

const CORRECT_ORDER = ['star', 'moon', 'sun']; // 星 → 月 → 太陽の順が正解（立て札のヒントに対応）

const SYMBOLS = {
  star: { emoji: '★', label: '星' },
  moon: { emoji: '☾', label: '月' },
  sun: { emoji: '☀', label: '太陽' },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class TreasureLockUI {
  constructor(rootEl) {
    this.root = rootEl;
    this.buttonsEl = rootEl.querySelector('.treasure-lock-buttons');
    this.feedbackEl = rootEl.querySelector('.treasure-lock-feedback');

    this.onComplete = null;
    this.selected = [];
    this.order = [];
  }

  get isOpen() {
    return !this.root.classList.contains('hidden');
  }

  /** ミニゲームを開始する。onComplete(success: boolean) が結果確定後に呼ばれる */
  open(onComplete) {
    this.onComplete = onComplete;
    this.selected = [];
    this.order = shuffle(Object.keys(SYMBOLS));
    this.feedbackEl.textContent = '刻印を、正しい順番でクリックしよう（数字キーでもOK）';
    this._renderButtons();
    this.root.classList.remove('hidden');
  }

  _renderButtons() {
    this.buttonsEl.innerHTML = '';
    this.order.forEach((key, i) => {
      const btn = document.createElement('button');
      btn.className = 'treasure-lock-symbol';
      btn.innerHTML = `
        <span class="treasure-lock-emoji">${SYMBOLS[key].emoji}</span>
        <span class="treasure-lock-num">${i + 1}</span>
      `;
      btn.addEventListener('click', () => this._select(i));
      this.buttonsEl.appendChild(btn);
    });
  }

  /** 数字キー(1〜3)での選択に対応 */
  selectByNumber(num) {
    this._select(num - 1);
  }

  _select(index) {
    const btn = this.buttonsEl.children[index];
    if (!btn || btn.disabled) return;

    const key = this.order[index];
    btn.disabled = true;
    btn.classList.add('selected');
    this.selected.push(key);

    const stepIndex = this.selected.length - 1;
    if (key !== CORRECT_ORDER[stepIndex]) {
      this.feedbackEl.textContent = '……順番が違うようだ。もう一度、宝箱に話しかけて試そう。';
      setTimeout(() => this.close(false), 1000);
      return;
    }

    if (this.selected.length === CORRECT_ORDER.length) {
      this.feedbackEl.textContent = 'かちり……!';
      setTimeout(() => this.close(true), 700);
    } else {
      this.feedbackEl.textContent = 'いい調子だ。続けよう。';
    }
  }

  close(success) {
    this.root.classList.add('hidden');
    const cb = this.onComplete;
    this.onComplete = null;
    if (cb) cb(success);
  }
}
