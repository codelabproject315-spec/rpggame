// ============================================================
// タイルグリッド生成・編集のための汎用ヘルパー
// マップデータファイル (js/data/maps/*.js) から利用する。
// 「マップは2次元配列」という詳細をここに閉じ込めることで、
// 将来グリッド構造を変えたくなってもここだけ直せばよい。
// ============================================================

/**
 * width x height のグリッドを、指定したタイルIDで埋めて生成する
 */
export function createGrid(width, height, fillTile = 0) {
  return Array.from({ length: height }, () => new Array(width).fill(fillTile));
}

/**
 * 矩形範囲を指定タイルIDで塗りつぶす（道・建物の敷地・水域などに使用）
 */
export function fillRect(grid, x, y, w, h, tile) {
  for (let j = y; j < y + h; j++) {
    if (!grid[j]) continue;
    for (let i = x; i < x + w; i++) {
      if (grid[j][i] === undefined) continue;
      grid[j][i] = tile;
    }
  }
}

/**
 * 水平 or 垂直の直線を指定タイルIDで引く（道・川・橋などに使用）
 */
export function fillLine(grid, x1, y1, x2, y2, tile) {
  if (y1 === y2) {
    const [xa, xb] = x1 <= x2 ? [x1, x2] : [x2, x1];
    for (let i = xa; i <= xb; i++) {
      if (grid[y1] && grid[y1][i] !== undefined) grid[y1][i] = tile;
    }
  } else if (x1 === x2) {
    const [ya, yb] = y1 <= y2 ? [y1, y2] : [y2, y1];
    for (let j = ya; j <= yb; j++) {
      if (grid[j] && grid[j][x1] !== undefined) grid[j][x1] = tile;
    }
  } else {
    throw new Error('fillLine は水平線または垂直線のみ対応しています');
  }
}

/**
 * 特定の座標群をまとめて1つのタイルIDにする（木・岩などの単発配置に使用）
 */
export function setPoints(grid, points, tile) {
  for (const [x, y] of points) {
    if (grid[y] && grid[y][x] !== undefined) grid[y][x] = tile;
  }
}

/**
 * グリッド外周を指定タイルIDで囲む（山や崖で町の境界を作る等に使用）
 */
export function setBorder(grid, tile, thickness = 1) {
  const height = grid.length;
  const width = grid[0].length;
  fillRect(grid, 0, 0, width, thickness, tile); // 上
  fillRect(grid, 0, height - thickness, width, thickness, tile); // 下
  fillRect(grid, 0, 0, thickness, height, tile); // 左
  fillRect(grid, width - thickness, 0, thickness, height, tile); // 右
}
