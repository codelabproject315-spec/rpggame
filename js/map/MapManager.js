// ============================================================
// 現在読み込まれているマップを保持し、
// ・出口(exit)に触れたときのマップ切り替え
// ・タイルサイズを考慮したピクセルサイズの提供
// を担当する。
// ============================================================

import { MAPS, START_MAP_ID } from '../data/maps/index.js';
import { rectsOverlap } from './Collision.js';

export class MapManager {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.currentMap = MAPS[START_MAP_ID];
  }

  get widthPx() {
    return this.currentMap.width * this.tileSize;
  }

  get heightPx() {
    return this.currentMap.height * this.tileSize;
  }

  /**
   * プレイヤーの当たり判定矩形(px)がいずれかの出口と重なっていれば、
   * その出口情報を返す。重なっていなければ null。
   */
  checkExit(playerRectPx) {
    for (const exit of this.currentMap.exits) {
      const exitRectPx = {
        x: exit.x * this.tileSize,
        y: exit.y * this.tileSize,
        width: exit.w * this.tileSize,
        height: exit.h * this.tileSize,
      };
      if (rectsOverlap(playerRectPx, exitRectPx)) {
        return exit;
      }
    }
    return null;
  }

  /**
   * 指定したマップIDに切り替える。存在しないIDの場合はエラーを投げる
   * （データの誤りにすぐ気づけるようにするため、静かに無視しない）。
   */
  switchTo(mapId) {
    const next = MAPS[mapId];
    if (!next) {
      throw new Error(`マップ "${mapId}" が見つかりません。data/maps/index.js の登録を確認してください。`);
    }
    this.currentMap = next;
  }
}
