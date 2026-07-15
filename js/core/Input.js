// ============================================================
// キーボード入力を管理するクラス
// WASD / 矢印キーの両方に対応。移動方向はベクトルとして取得できる。
// ============================================================

const MOVE_KEYS = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
};

export class Input {
  constructor() {
    this.pressed = new Set();
    this.justPressed = new Set();

    window.addEventListener('keydown', (e) => {
      if (!this.pressed.has(e.code)) {
        this.justPressed.add(e.code);
      }
      this.pressed.add(e.code);
    });
    window.addEventListener('keyup', (e) => {
      this.pressed.delete(e.code);
    });
  }

  /** 押されているキーから移動ベクトル { x, y } を -1〜1 の範囲で返す */
  getMoveVector() {
    let x = 0;
    let y = 0;
    for (const code of this.pressed) {
      const dir = MOVE_KEYS[code];
      if (dir === 'up') y -= 1;
      else if (dir === 'down') y += 1;
      else if (dir === 'left') x -= 1;
      else if (dir === 'right') x += 1;
    }
    // 斜め移動の速度が速くなりすぎないよう正規化
    if (x !== 0 && y !== 0) {
      const len = Math.sqrt(2);
      x /= len;
      y /= len;
    }
    return { x, y };
  }

  /** 直近フレームで押されたキーかどうか（トグル操作用） */
  wasJustPressed(code) {
    return this.justPressed.has(code);
  }

  /** 1フレーム分の「押された瞬間」情報をクリアする（毎フレーム最後に呼ぶ） */
  clearFrame() {
    this.justPressed.clear();
  }
}
