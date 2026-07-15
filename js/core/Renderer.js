// ============================================================
// 描画処理を1箇所にまとめたクラス。
// 「見た目」に関する変更（色を変える、装飾を増やす等）は
// 基本的にこのファイルとdata/配下の定義ファイルだけで完結する。
// ============================================================

import { TILE_DEFINITIONS } from '../data/tileTypes.js';
import { BUILDING_DEFINITIONS } from '../data/buildingTypes.js';
import { OBJECT_DEFINITIONS } from '../data/objectTypes.js';
import { NPC_DEFINITIONS } from '../data/npcTypes.js';
import { PLAYER_SPRITE, Direction } from '../constants.js';

export class Renderer {
  constructor(ctx, tileSize) {
    this.ctx = ctx;
    this.tileSize = tileSize;
  }

  render(mapData, camera, player, options = {}) {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    ctx.save();
    ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));

    this._drawTiles(mapData, camera);
    this._drawBuildings(mapData);
    this._drawObjects(mapData);
    this._drawNpcs(mapData);
    this._drawPlayer(player);
    if (options.debug) this._drawDebugOverlay(mapData, player, camera);

    ctx.restore();

    if (options.debug) this._drawScreenSpaceDebug(mapData, player);
  }

  _drawTiles(mapData, camera) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    const startCol = Math.max(0, Math.floor(camera.x / ts));
    const endCol = Math.min(mapData.width - 1, Math.ceil((camera.x + camera.viewportWidth) / ts));
    const startRow = Math.max(0, Math.floor(camera.y / ts));
    const endRow = Math.min(mapData.height - 1, Math.ceil((camera.y + camera.viewportHeight) / ts));

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const tileId = mapData.tiles[row][col];
        const def = TILE_DEFINITIONS[tileId];
        const x = col * ts;
        const y = row * ts;

        ctx.fillStyle = def ? def.color : '#000000';
        ctx.fillRect(x, y, ts, ts);

        if (def && def.decoration) {
          this._drawTileDecoration(def.decoration, x, y, ts);
        }
      }
    }
  }

  _drawTileDecoration(decoration, x, y, ts) {
    const ctx = this.ctx;
    if (decoration === 'tree') {
      ctx.fillStyle = '#5a3a22';
      ctx.fillRect(x + ts * 0.42, y + ts * 0.55, ts * 0.16, ts * 0.4);
      ctx.fillStyle = '#2d6b2d';
      ctx.beginPath();
      ctx.arc(x + ts / 2, y + ts * 0.4, ts * 0.38, 0, Math.PI * 2);
      ctx.fill();
    } else if (decoration === 'rock') {
      ctx.fillStyle = '#6e6e6e';
      ctx.beginPath();
      ctx.ellipse(x + ts / 2, y + ts * 0.6, ts * 0.36, ts * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (decoration === 'flower') {
      ctx.fillStyle = '#e85d75';
      const positions = [[0.3, 0.3], [0.7, 0.35], [0.5, 0.65]];
      for (const [px, py] of positions) {
        ctx.beginPath();
        ctx.arc(x + ts * px, y + ts * py, ts * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  _drawBuildings(mapData) {
    const ctx = this.ctx;
    const ts = this.tileSize;
    for (const building of mapData.buildings) {
      const def = BUILDING_DEFINITIONS[building.type];
      const x = building.x * ts;
      const y = building.y * ts;
      const w = building.w * ts;
      const h = building.h * ts;
      const roofH = Math.min(h * 0.4, ts * 1.2);

      // 建物本体
      ctx.fillStyle = def.bodyColor;
      ctx.fillRect(x, y + roofH, w, h - roofH);

      // 屋根
      ctx.fillStyle = def.roofColor;
      ctx.beginPath();
      ctx.moveTo(x - ts * 0.15, y + roofH);
      ctx.lineTo(x + w / 2, y - ts * 0.1);
      ctx.lineTo(x + w + ts * 0.15, y + roofH);
      ctx.closePath();
      ctx.fill();

      // 枠線
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y + roofH, w, h - roofH);

      // ラベル
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      const labelX = x + w / 2;
      const labelY = y + roofH + (h - roofH) / 2 + 5;
      ctx.strokeText(def.name, labelX, labelY);
      ctx.fillText(def.name, labelX, labelY);
    }
  }

  _drawObjects(mapData) {
    const ctx = this.ctx;
    const ts = this.tileSize;
    for (const obj of mapData.objects) {
      const def = OBJECT_DEFINITIONS[obj.type];
      const x = obj.x * ts;
      const y = obj.y * ts;
      this._drawObjectShape(def, x, y, ts);
    }
  }

  _drawObjectShape(def, x, y, ts) {
    const ctx = this.ctx;
    const cx = x + ts / 2;
    ctx.fillStyle = def.color;

    switch (def.shape) {
      case 'signboard':
        ctx.fillRect(cx - 3, y + ts * 0.35, 6, ts * 0.6);
        ctx.fillStyle = '#e9dcb8';
        ctx.fillRect(x + ts * 0.15, y + ts * 0.1, ts * 0.7, ts * 0.35);
        ctx.strokeStyle = '#7a6a4a';
        ctx.strokeRect(x + ts * 0.15, y + ts * 0.1, ts * 0.7, ts * 0.35);
        break;
      case 'bench':
        ctx.fillRect(x + ts * 0.1, y + ts * 0.45, ts * 0.8, ts * 0.18);
        ctx.fillRect(x + ts * 0.15, y + ts * 0.63, ts * 0.1, ts * 0.25);
        ctx.fillRect(x + ts * 0.75, y + ts * 0.63, ts * 0.1, ts * 0.25);
        break;
      case 'streetlight':
        ctx.fillRect(cx - 2, y + ts * 0.25, 4, ts * 0.7);
        ctx.fillStyle = '#f4d35e';
        ctx.beginPath();
        ctx.arc(cx, y + ts * 0.2, ts * 0.14, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'mailbox':
        ctx.fillRect(x + ts * 0.3, y + ts * 0.35, ts * 0.4, ts * 0.45);
        ctx.beginPath();
        ctx.arc(cx, y + ts * 0.35, ts * 0.2, Math.PI, 0);
        ctx.fill();
        break;
      case 'vendingMachine':
        ctx.fillRect(x + ts * 0.2, y + ts * 0.1, ts * 0.6, ts * 0.8);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(x + ts * 0.28, y + ts * 0.18, ts * 0.44, ts * 0.4);
        break;
      case 'treasureChest':
        ctx.fillRect(x + ts * 0.15, y + ts * 0.45, ts * 0.7, ts * 0.4);
        ctx.fillStyle = '#8a5a1c';
        ctx.fillRect(x + ts * 0.15, y + ts * 0.3, ts * 0.7, ts * 0.2);
        break;
      case 'flowerBed':
        ctx.fillRect(x + ts * 0.1, y + ts * 0.55, ts * 0.8, ts * 0.35);
        this._drawTileDecoration('flower', x, y - ts * 0.15, ts);
        break;
      default:
        ctx.fillRect(x + ts * 0.25, y + ts * 0.25, ts * 0.5, ts * 0.5);
    }
  }

  _drawPlayer(player) {
    const ctx = this.ctx;
    const w = PLAYER_SPRITE.width;
    const h = PLAYER_SPRITE.height;
    const x = player.x - w / 2;
    const y = player.y - h / 2;

    // 影
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(player.x, y + h - 4, w * 0.4, h * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 体
    ctx.fillStyle = '#3d6fd0';
    ctx.fillRect(x + w * 0.15, y + h * 0.35, w * 0.7, h * 0.55);

    // 頭
    ctx.fillStyle = '#f2c199';
    ctx.beginPath();
    ctx.arc(player.x, y + h * 0.28, w * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // 向きを示す小さな三角
    ctx.fillStyle = '#22335c';
    const dirOffsets = {
      [Direction.DOWN]: [0, 1],
      [Direction.UP]: [0, -1],
      [Direction.LEFT]: [-1, 0],
      [Direction.RIGHT]: [1, 0],
    };
    const [ox, oy] = dirOffsets[player.facing] || [0, 1];
    ctx.beginPath();
    ctx.arc(player.x + ox * w * 0.28, y + h * 0.28 + oy * h * 0.12, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawNpcs(mapData) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    for (const npc of mapData.npcs) {
      const def = NPC_DEFINITIONS[npc.type];
      const cx = npc.x * ts + ts / 2;
      const cy = npc.y * ts + ts / 2;

      // ほんの少しだけ上下に揺れる待機アニメーション（生きている感じを出すだけの演出）
      const bob = Math.sin(performance.now() / 500 + npc.x * 3 + npc.y) * 1.5;

      const w = ts * 0.8;
      const h = ts * 1.05;
      const x = cx - w / 2;
      const y = cy - h / 2 + bob;

      // 影
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.42, w * 0.38, h * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();

      // 体
      ctx.fillStyle = def.bodyColor;
      ctx.fillRect(x + w * 0.15, y + h * 0.35, w * 0.7, h * 0.5);

      // アクセント（襟・エプロン・帽子代わりの一色。無い種類は省略）
      if (def.accentColor) {
        ctx.fillStyle = def.accentColor;
        ctx.fillRect(x + w * 0.2, y + h * 0.38, w * 0.6, h * 0.12);
      }

      // 頭
      ctx.fillStyle = def.skinColor;
      ctx.beginPath();
      ctx.arc(cx, y + h * 0.26, w * 0.34, 0, Math.PI * 2);
      ctx.fill();

      // 向き（プレイヤーと同様の小さな三角の目印）
      const dirOffsets = {
        [Direction.DOWN]: [0, 1],
        [Direction.UP]: [0, -1],
        [Direction.LEFT]: [-1, 0],
        [Direction.RIGHT]: [1, 0],
      };
      const [ox, oy] = dirOffsets[npc.facing] || [0, 1];
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.arc(cx + ox * w * 0.26, y + h * 0.26 + oy * h * 0.1, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 名前ラベル
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 3;
      ctx.strokeText(npc.name, cx, y - 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(npc.name, cx, y - 4);
    }
  }

  _drawDebugOverlay(mapData) {
    const ctx = this.ctx;
    const ts = this.tileSize;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    for (const exit of mapData.exits) {
      ctx.strokeRect(exit.x * ts, exit.y * ts, exit.w * ts, exit.h * ts);
    }
  }

  _drawScreenSpaceDebug(mapData, player) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(8, 8, 220, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`マップ: ${mapData.name} (${mapData.id})`, 16, 26);
    ctx.fillText(`座標: ${Math.round(player.x)}, ${Math.round(player.y)}`, 16, 42);
    ctx.fillText(`向き: ${player.facing}  移動中: ${player.isMoving}`, 16, 58);
  }
}
