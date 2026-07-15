// ============================================================
// プレイヤーエンティティ。
// 座標はピクセル単位(浮動小数点)で保持し、なめらかな移動を実現する。
// 衝突解決はX軸・Y軸を別々に行うことで、壁に当たっても
// 沿うように移動できる（斜め移動時に引っかからないようにするため）。
// ============================================================

import { PLAYER_SPEED, PLAYER_HITBOX, PLAYER_SPRITE, Direction } from '../constants.js';
import { isRectWalkable } from '../map/Collision.js';

export class Player {
  constructor(tileX, tileY, tileSize) {
    // タイル座標の中心にプレイヤーの見た目中心が来るように配置
    this.x = tileX * tileSize + tileSize / 2;
    this.y = tileY * tileSize + tileSize / 2;
    this.facing = Direction.DOWN;
    this.isMoving = false;
  }

  /** 当たり判定用の矩形(px)。見た目の足元付近だけを判定に使う */
  getHitbox() {
    return {
      x: this.x - PLAYER_HITBOX.width / 2,
      y: this.y - PLAYER_HITBOX.height / 2 + (PLAYER_SPRITE.height - PLAYER_HITBOX.height) / 2 - 4,
      width: PLAYER_HITBOX.width,
      height: PLAYER_HITBOX.height,
    };
  }

  update(dt, moveVector, mapData, tileSize) {
    const { x: mx, y: my } = moveVector;
    this.isMoving = mx !== 0 || my !== 0;

    if (mx !== 0) this.facing = mx > 0 ? Direction.RIGHT : Direction.LEFT;
    if (my !== 0) this.facing = my > 0 ? Direction.DOWN : Direction.UP;

    const distance = PLAYER_SPEED * dt;

    // X軸移動を試みる
    if (mx !== 0) {
      const nextX = this.x + mx * distance;
      const testBox = this._boxAt(nextX, this.y);
      if (isRectWalkable(testBox, mapData, tileSize)) {
        this.x = nextX;
      }
    }

    // Y軸移動を試みる（X軸とは独立に判定することで壁沿い移動が可能になる）
    if (my !== 0) {
      const nextY = this.y + my * distance;
      const testBox = this._boxAt(this.x, nextY);
      if (isRectWalkable(testBox, mapData, tileSize)) {
        this.y = nextY;
      }
    }
  }

  _boxAt(x, y) {
    const box = this.getHitbox();
    const offsetX = x - this.x;
    const offsetY = y - this.y;
    return { ...box, x: box.x + offsetX, y: box.y + offsetY };
  }
}
