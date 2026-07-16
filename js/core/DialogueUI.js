// ============================================================
// 会話ウィンドウの見た目（DOM操作）を担当するクラス。
// ロジック（誰が何を話すか）はDialogueManager側の責務で、
// このクラスは「渡された内容をどう表示するか」だけを扱う。
// ============================================================

const TYPE_SPEED_MS = 28; // 1文字あたりの表示間隔

export class DialogueUI {
  constructor(rootEl) {
    this.root = rootEl;
    this.nameEl = rootEl.querySelector('.dialogue-name');
    this.textEl = rootEl.querySelector('.dialogue-text');
    this.choicesEl = rootEl.querySelector('.dialogue-choices');
    this.hintEl = rootEl.querySelector('.dialogue-hint');

    this.lines = [];
    this.lineIndex = 0;
    this.isTyping = false;
    this.choices = null;
    this.choicesVisible = false; // 選択肢ボタンが実際に画面に出ているか
    this.onChoiceSelected = null;
    this.onClose = null;
    this._typeTimer = null;
  }

  get isOpen() {
    return !this.root.classList.contains('hidden');
  }

  /**
   * 会話ウィンドウを表示する。
   * content: { speaker, lines, choices }
   * handlers: { onChoiceSelected(index), onClose() }
   */
  show(content, handlers = {}) {
    this.nameEl.textContent = content.speaker;
    this.lines = content.lines && content.lines.length ? content.lines : [''];
    this.lineIndex = 0;
    this.choices = content.choices || null;
    this.choicesVisible = false;
    this.onChoiceSelected = handlers.onChoiceSelected || null;
    this.onClose = handlers.onClose || null;

    this.choicesEl.innerHTML = '';
    this.choicesEl.classList.add('hidden');
    this.root.classList.remove('hidden');
    this._startLine();
  }

  _startLine() {
    this._clearTypeTimer();
    this.isTyping = true;
    this.textEl.textContent = '';
    this.hintEl.textContent = '';
    const line = this.lines[this.lineIndex] ?? '';
    let charIndex = 0;
    this._typeTimer = setInterval(() => {
      charIndex++;
      this.textEl.textContent = line.slice(0, charIndex);
      if (charIndex >= line.length) {
        this._clearTypeTimer();
        this.isTyping = false;
        this._onLineFinished();
      }
    }, TYPE_SPEED_MS);
  }

  _clearTypeTimer() {
    if (this._typeTimer) {
      clearInterval(this._typeTimer);
      this._typeTimer = null;
    }
  }

  _onLineFinished() {
    const isLastLine = this.lineIndex >= this.lines.length - 1;
    if (isLastLine && this.choices && this.choices.length) {
      this._showChoices();
    } else if (isLastLine) {
      this.hintEl.textContent = 'Space / Enter：閉じる';
    } else {
      this.hintEl.textContent = 'Space / Enter：次へ';
    }
  }

  _showChoices() {
    this.choicesVisible = true;
    this.hintEl.textContent = '';
    this.choicesEl.innerHTML = '';
    this.choicesEl.classList.remove('hidden');
    this.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.textContent = `${i + 1}. ${choice.text}`;
      btn.addEventListener('click', () => this._selectChoice(i));
      this.choicesEl.appendChild(btn);
    });
  }

  _selectChoice(index) {
    if (!this.choices || !this.choices[index]) return;
    const handler = this.onChoiceSelected;
    this.choicesEl.classList.add('hidden');
    this.choices = null;
    this.choicesVisible = false;
    if (handler) handler(index);
  }

  /** キーボードの数字キー(1〜9)での選択肢選びに対応 */
  selectChoiceByNumber(num) {
    if (!this.choices) return false;
    const index = num - 1;
    if (index >= 0 && index < this.choices.length) {
      this._selectChoice(index);
      return true;
    }
    return false;
  }

  /** Space/Enterキーなどで「進める」操作をしたときに呼ぶ */
  advance() {
    if (!this.isOpen) return;

    if (this.choicesVisible) {
      // 選択肢が実際に表示されている間はSpaceでは進めない（クリックか数字キーで選ぶ）
      return;
    }
    if (this.isTyping) {
      // 表示中なら瞬時に全文表示するだけに留める
      this._clearTypeTimer();
      this.isTyping = false;
      const line = this.lines[this.lineIndex] ?? '';
      this.textEl.textContent = line;
      this._onLineFinished();
      return;
    }

    const isLastLine = this.lineIndex >= this.lines.length - 1;
    if (isLastLine) {
      // 最後の行まで来ても、まだ選択肢が表示されていないなら
      // （_onLineFinishedで表示されているはずなので、通常ここには来ない）
      // 選択肢が無い場合のみ閉じる
      if (!this.choices) this.close();
      return;
    }
    this.lineIndex++;
    this._startLine();
  }

  /** 会話を終了させず、ウィンドウだけを一時的に隠す（ミニゲームへの割り込み用） */
  hide() {
    this._clearTypeTimer();
    this.root.classList.add('hidden');
  }

  close() {
    this._clearTypeTimer();
    this.root.classList.add('hidden');
    this.choicesEl.innerHTML = '';
    const cb = this.onClose;
    this.onClose = null;
    if (cb) cb();
  }
}
