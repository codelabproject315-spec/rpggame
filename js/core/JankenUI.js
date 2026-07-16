// ============================================================
// じゃんけん対決のミニゲーム。
// グー・チョキ・パーから1つ選ぶ（クリックまたは数字キー1〜3）と、
// 相手がランダムに手を出して勝敗が決まる。
// ============================================================

const HANDS = [
  { id: 'rock', label: 'グー', emoji: '✊' },
  { id: 'scissors', label: 'チョキ', emoji: '✌️' },
  { id: 'paper', label: 'パー', emoji: '🖐️' },
];

const BEATS = { rock: 'scissors', scissors: 'paper', paper: 'rock' };

function judge(player, cpu) {
  if (player === cpu) return 'draw';
  return BEATS[player] === cpu ? 'win' : 'lose';
}

export class JankenUI {
  constructor(rootEl) {
    this.root = rootEl;
    this.buttonsEl = rootEl.querySelector('.janken-buttons');
    this.promptEl = rootEl.querySelector('.janken-prompt');
    this.resultEl = rootEl.querySelector('.janken-result');
    this.resultTextEl = rootEl.querySelector('.janken-result-text');

    this.stage = 'idle'; // 'idle' -> 'revealed'
    this.onComplete = null;
    this.pendingOutcome = null;

    this.resultEl.addEventListener('click', () => this.advance());
  }

  get isOpen() {
    return !this.root.classList.contains('hidden');
  }

  /** ミニゲームを開始する。onComplete('win' | 'lose' | 'draw') が閉じたときに呼ばれる */
  open(onComplete) {
    this.onComplete = onComplete;
    this.stage = 'idle';
    this.resultEl.classList.add('hidden');
    this.promptEl.textContent = 'グー・チョキ・パーから選ぼう（数字キー1〜3でもOK）';
    this._renderButtons();
    this.root.classList.remove('hidden');
  }

  _renderButtons() {
    this.buttonsEl.innerHTML = '';
    HANDS.forEach((hand, i) => {
      const btn = document.createElement('button');
      btn.className = 'janken-hand';
      btn.innerHTML = `
        <span class="janken-emoji">${hand.emoji}</span>
        <span class="janken-label">${hand.label}</span>
      `;
      btn.addEventListener('click', () => this.selectByNumber(i + 1));
      this.buttonsEl.appendChild(btn);
    });
  }

  /** 数字キー(1〜3)での選択に対応 */
  selectByNumber(num) {
    if (this.stage !== 'idle') return;
    const hand = HANDS[num - 1];
    if (!hand) return;

    const cpuHand = HANDS[Math.floor(Math.random() * HANDS.length)];
    const outcome = judge(hand.id, cpuHand.id);
    this.pendingOutcome = outcome;

    const outcomeLabel = outcome === 'win' ? 'あなたの勝ち!' : outcome === 'lose' ? 'あなたの負け……' : 'あいこ!';
    this.resultTextEl.textContent = `あなたの${hand.label} vs 相手の${cpuHand.label} → ${outcomeLabel}`;
    this.resultEl.classList.remove('hidden');
    this.stage = 'revealed';
    this.promptEl.textContent = 'Space / Enter：閉じる';
  }

  /** Space/Enterキーが押されたときに呼ぶ */
  advance() {
    if (this.stage === 'revealed') this.close();
  }

  close() {
    this.root.classList.add('hidden');
    const cb = this.onComplete;
    const outcome = this.pendingOutcome;
    this.onComplete = null;
    this.pendingOutcome = null;
    if (cb) cb(outcome);
  }
}
