// ============================================================
// ゲームループの中心。
// Input / Player / MapManager / Camera / Renderer をまとめて動かす。
// 将来、会話ウィンドウやメニューを追加する際は、
// ここに「状態(state)」を持たせて分岐させる想定
// （例: state = 'exploring' | 'dialogue' | 'menu'）。
// ============================================================

import { TILE_SIZE, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../constants.js';
import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { Renderer } from './Renderer.js';
import { MapManager } from '../map/MapManager.js';
import { Player } from '../entities/Player.js';

export class Game {
  constructor(canvas) {
    canvas.width = VIEWPORT_WIDTH;
    canvas.height = VIEWPORT_HEIGHT;
    const ctx = canvas.getContext('2d');

    this.input = new Input();
    this.mapManager = new MapManager(TILE_SIZE);
    this.camera = new Camera(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    this.renderer = new Renderer(ctx, TILE_SIZE);

    const start = this.mapManager.currentMap.playerStart || { x: 1, y: 1 };
    this.player = new Player(start.x, start.y, TILE_SIZE);

    this.debug = false;
    this.lastTime = 0;

    // 出口を踏んだ直後の連続トリガーを防ぐためのクールダウン
    this.transitionCooldown = 0;
  }

  start() {
    requestAnimationFrame((t) => this._loop(t));
  }

  _loop(timeMs) {
    const dt = this.lastTime ? Math.min((timeMs - this.lastTime) / 1000, 0.05) : 0;
    this.lastTime = timeMs;

    this._update(dt);
    this._render();

    this.input.clearFrame();
    requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    if (this.input.wasJustPressed('F1')) {
      this.debug = !this.debug;
    }

    const moveVector = this.input.getMoveVector();
    const mapData = this.mapManager.currentMap;
    this.player.update(dt, moveVector, mapData, TILE_SIZE);

    if (this.transitionCooldown > 0) {
      this.transitionCooldown -= dt;
    } else {
      const exit = this.mapManager.checkExit(this.player.getHitbox());
      if (exit) this._handleTransition(exit);
    }

    this.camera.follow(this.player.x, this.player.y, this.mapManager.widthPx, this.mapManager.heightPx);
  }

  _handleTransition(exit) {
    this.mapManager.switchTo(exit.target);
    this.player.x = exit.targetX * TILE_SIZE + TILE_SIZE / 2;
    this.player.y = exit.targetY * TILE_SIZE + TILE_SIZE / 2;
    // 遷移直後に再度出口判定してしまい行き来し続けるのを防ぐ
    this.transitionCooldown = 0.4;
  }

  _render() {
    this.renderer.render(this.mapManager.currentMap, this.camera, this.player, {
      debug: this.debug,
    });
  }
}
