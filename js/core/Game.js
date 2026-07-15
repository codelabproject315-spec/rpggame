// ============================================================
// ゲームループの中心。
// Input / Player / MapManager / Camera / Renderer をまとめて動かす。
// 会話ウィンドウが開いている間はプレイヤーの移動を止め、
// state を 'exploring' | 'dialogue' で切り替える。
// ============================================================

import { TILE_SIZE, Direction } from '../constants.js';
import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { Renderer } from './Renderer.js';
import { MapManager } from '../map/MapManager.js';
import { Player } from '../entities/Player.js';
import { GameState } from './GameState.js';
import { DialogueManager } from './DialogueManager.js';
import { DialogueUI } from './DialogueUI.js';

// プレイヤーが「向いている方向」を、話しかけ相手を探すためのベクトルに変換する
const FACING_VECTORS = {
  [Direction.DOWN]: [0, 1],
  [Direction.UP]: [0, -1],
  [Direction.LEFT]: [-1, 0],
  [Direction.RIGHT]: [1, 0],
};

const INTERACT_RANGE = TILE_SIZE * 1.6;

export class Game {
  constructor(container) {
    this.container = container;

    this.input = new Input();
    this.mapManager = new MapManager(TILE_SIZE);
    this.camera = new Camera(window.innerWidth / window.innerHeight);
    this.renderer = new Renderer(container);

    this.gameState = new GameState();
    this.dialogueManager = new DialogueManager();
    this.dialogueUI = new DialogueUI(document.getElementById('dialogue-box'));

    const start = this.mapManager.currentMap.playerStart || { x: 1, y: 1 };
    this.player = new Player(start.x, start.y, TILE_SIZE);

    // 'exploring': 通常の探索中 / 'dialogue': 会話ウィンドウが開いている
    this.uiState = 'exploring';
    this._markVisited(this.mapManager.currentMap.id);

    this.debug = false;
    this.lastTime = 0;

    // 出口を踏んだ直後の連続トリガーを防ぐためのクールダウン
    this.transitionCooldown = 0;

    window.addEventListener('resize', () => this._handleResize());
  }

  _handleResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.setAspect(window.innerWidth / window.innerHeight);
  }

  /** そのマップを訪れたことを表すフラグを立てる（NPCの噂セリフなどに使われる） */
  _markVisited(mapId) {
    this.gameState.setFlag(`visited_${mapId}`);
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

    if (this.uiState === 'dialogue') {
      this._updateDialogueInput();
      return; // 会話中は移動・出口判定を行わない
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

    if (this.input.wasJustPressed('Space') || this.input.wasJustPressed('Enter')) {
      this._tryInteract();
    }
  }

  _updateDialogueInput() {
    if (this.input.wasJustPressed('Space') || this.input.wasJustPressed('Enter')) {
      this.dialogueUI.advance();
    }
    for (let n = 1; n <= 9; n++) {
      if (this.input.wasJustPressed(`Digit${n}`)) {
        this.dialogueUI.selectChoiceByNumber(n);
      }
    }
  }

  /** プレイヤーが向いている先にいるNPC、またはオブジェクトを探す */
  _findInteractable() {
    const mapData = this.mapManager.currentMap;
    const [fx, fz] = FACING_VECTORS[this.player.facing] || [0, 1];

    let best = null;
    let bestDist = Infinity;

    const consider = (kind, entity, tileX, tileY) => {
      const wx = tileX * TILE_SIZE + TILE_SIZE / 2;
      const wz = tileY * TILE_SIZE + TILE_SIZE / 2;
      const dx = wx - this.player.x;
      const dz = wz - this.player.y;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > INTERACT_RANGE || dist < 0.001) return;
      const facingDot = (dx * fx + dz * fz) / dist;
      if (facingDot < 0.4) return; // だいたい前方にあるものだけを対象にする
      if (dist < bestDist) {
        bestDist = dist;
        best = { kind, entity };
      }
    };

    for (const npc of mapData.npcs) consider('npc', npc, npc.x, npc.y);
    for (const obj of mapData.objects) {
      if (this.dialogueManager.hasObjectInteraction(mapData.id, obj)) {
        consider('object', obj, obj.x, obj.y);
      }
    }

    return best;
  }

  _tryInteract() {
    const target = this._findInteractable();
    if (!target) return;

    if (target.kind === 'npc') {
      this._startNpcDialogue(target.entity);
    } else if (target.kind === 'object') {
      this._startObjectDialogue(target.entity);
    }
  }

  _startNpcDialogue(npc) {
    const result = this.dialogueManager.startNpcDialogue(npc, this.gameState);
    this.uiState = 'dialogue';
    this.dialogueUI.show(result, {
      onChoiceSelected: (index) => {
        const choice = result.choices[index];
        const follow = this.dialogueManager.resolveChoice(choice, npc, this.gameState);
        this.dialogueUI.show(follow, { onClose: () => this._endDialogue() });
      },
      onClose: () => this._endDialogue(),
    });
  }

  _startObjectDialogue(obj) {
    const result = this.dialogueManager.startObjectInteraction(this.mapManager.currentMap.id, obj, this.gameState);
    if (!result) return;
    this.uiState = 'dialogue';
    this.dialogueUI.show(result, { onClose: () => this._endDialogue() });
  }

  _endDialogue() {
    this.uiState = 'exploring';
  }

  _handleTransition(exit) {
    this.mapManager.switchTo(exit.target);
    this._markVisited(exit.target);
    this.player.x = exit.targetX * TILE_SIZE + TILE_SIZE / 2;
    this.player.y = exit.targetY * TILE_SIZE + TILE_SIZE / 2;
    // 遷移直後に再度出口判定してしまい行き来し続けるのを防ぐ
    this.transitionCooldown = 0.4;
  }

  _render() {
    const interactTarget = this.uiState === 'exploring' ? this._findInteractable() : null;
    this.renderer.render(this.mapManager.currentMap, this.camera, this.player, {
      debug: this.debug,
      interactTarget,
    });
  }
}
