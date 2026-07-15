// ============================================================
// ゲーム全体で使う定数
// ここを変えるだけでタイルサイズや画面サイズを調整できる
// ============================================================

export const TILE_SIZE = 32;

export const VIEWPORT_WIDTH = 640;
export const VIEWPORT_HEIGHT = 480;

// プレイヤーの移動速度 (px / 秒)
export const PLAYER_SPEED = 180;

// プレイヤーの当たり判定サイズ（見た目より少し小さくして自然な操作感にする）
export const PLAYER_HITBOX = { width: 20, height: 20 };

// プレイヤーの見た目サイズ
export const PLAYER_SPRITE = { width: 28, height: 36 };

// 向き
export const Direction = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};
