// ============================================================
// マップデータファイル (js/data/maps/*.js) 共通の補助関数。
// 「建物やオブジェクトを置く」という操作は
//   1. タイルグリッドの足元を通行不可にする
//   2. 描画・将来のイベント用にメタデータを配列へ積む
// の2つを必ずセットで行う必要があるため、ここに1つにまとめておく。
// こうすることで、マップデータ側は "何をどこに置くか" だけを
// 記述すればよくなり、可読性が上がる。
// ============================================================

import { TileType } from './tileTypes.js';
import { fillRect } from '../utils/grid.js';

/**
 * 建物を配置する（グリッドへの書き込み + buildings配列への追加）
 */
export function placeBuilding(grid, buildings, { type, x, y, w, h, name = null }) {
  fillRect(grid, x, y, w, h, TileType.BUILDING_FOOTPRINT);
  buildings.push({ type, x, y, w, h, name });
}

/**
 * 1マスのオブジェクトを配置する（グリッドへの書き込み + objects配列への追加）
 */
export function placeObject(grid, objects, { type, x, y }) {
  fillRect(grid, x, y, 1, 1, TileType.OBJECT_FOOTPRINT);
  objects.push({ type, x, y });
}

/**
 * NPCを配置する（グリッドへの書き込み + npcs配列への追加）。
 * 会話は未実装のため onInteract は今回すべて null。
 * id はセーブデータやフラグ管理・将来の会話データと紐づけるためのキー。
 */
export function placeNpc(grid, npcs, { id, type, x, y, name, facing = 'down', note = '' }) {
  fillRect(grid, x, y, 1, 1, TileType.OBJECT_FOOTPRINT);
  npcs.push({ id, type, x, y, name, facing, note, onInteract: null });
}

/**
 * マップ端の出入り口（他マップへの接続）を登録する。
 * x, y, w, h: タイル座標での判定範囲
 * target: 遷移先マップID
 * targetX, targetY: 遷移先でのプレイヤー出現位置（タイル座標）
 */
export function defineExit(exits, { x, y, w, h, target, targetX, targetY }) {
  exits.push({ x, y, w, h, target, targetX, targetY });
}
