// ============================================================
// 当たり判定に関する純粋関数群。
// 「タイルグリッド = 唯一の当たり判定情報」という方針のもと、
// 建物・木・岩・川・崖などはすべてタイルの walkable=false で表現される。
// ============================================================

import { TILE_DEFINITIONS } from '../data/tileTypes.js';

/** 2つの矩形 { x, y, width, height }(px) が重なっているか */
export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * 指定した当たり判定矩形(px)が、現在のマップ上で通行可能かどうかを判定する。
 * 矩形の四隅が乗るタイルをすべて確認し、1つでも通行不可があれば false。
 */
export function isRectWalkable(rectPx, mapData, tileSize) {
  const left = Math.floor(rectPx.x / tileSize);
  const right = Math.floor((rectPx.x + rectPx.width - 1) / tileSize);
  const top = Math.floor(rectPx.y / tileSize);
  const bottom = Math.floor((rectPx.y + rectPx.height - 1) / tileSize);

  // マップ範囲外は通行不可扱い（境界線の役割も兼ねる）
  if (left < 0 || top < 0 || right >= mapData.width || bottom >= mapData.height) {
    return false;
  }

  for (let ty = top; ty <= bottom; ty++) {
    for (let tx = left; tx <= right; tx++) {
      const tileId = mapData.tiles[ty][tx];
      const def = TILE_DEFINITIONS[tileId];
      if (!def || !def.walkable) return false;
    }
  }
  return true;
}
