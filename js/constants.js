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

// ------------------------------------------------------------
// 3D描画関連の定数（追従カメラの高さ・距離・画角、地物の高さなど）
// ------------------------------------------------------------

// カメラはプレイヤーの少し後ろ・上から見下ろす形で追従する
export const CAMERA_HEIGHT = TILE_SIZE * 9;
export const CAMERA_DISTANCE = TILE_SIZE * 7;
export const CAMERA_FOV = 45;
export const CAMERA_LOOK_AHEAD = TILE_SIZE * 1.5; // プレイヤーの少し先を見る

// 各種オブジェクトのおおよその高さ（タイルサイズを基準にした比率）
export const HEIGHTS = {
  TREE: TILE_SIZE * 1.6,
  FOREST_CLUMP: TILE_SIZE * 0.9,
  ROCK: TILE_SIZE * 0.5,
  MOUNTAIN: TILE_SIZE * 2.6,
  CLIFF: TILE_SIZE * 1.2,
  BUILDING: TILE_SIZE * 2.4,
  ROOF: TILE_SIZE * 1.1,
  BRIDGE: TILE_SIZE * 0.15,
  PLAYER: TILE_SIZE * 1.5,
  NPC: TILE_SIZE * 1.5,
};
