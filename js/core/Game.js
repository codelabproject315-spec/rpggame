// ============================================================
// ゲームループの中心。
// Input / Player / MapManager / Camera / Renderer をまとめて動かす。
// 会話ウィンドウが開いている間はプレイヤーの移動を止め、
// state を 'exploring' | 'dialogue' で切り替える。
// 昼夜・天候サイクル、足音・環境音、実績の判定もここでまとめて進行させる。
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
import { DayNightCycle } from './DayNightCycle.js';
import { AudioManager } from './AudioManager.js';
import { AchievementManager } from './AchievementManager.js';
import { AchievementUI } from './AchievementUI.js';
import { MISSIONS } from '../data/missions.js';
import { MissionUI } from './MissionUI.js';
import { MissionLogUI } from './MissionLogUI.js';
import { OmikujiUI } from './OmikujiUI.js';
import { TreasureLockUI } from './TreasureLockUI.js';

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

    this.dayNight = new DayNightCycle();
    this.audio = new AudioManager();
    // ブラウザの自動再生制限のため、最初のキー入力で音を鳴らせる状態にする
    window.addEventListener('keydown', () => this.audio.unlock(), { once: true });

    this.achievements = new AchievementManager();
    this.achievementUI = new AchievementUI(
      document.getElementById('achievement-toasts'),
      document.getElementById('achievement-panel')
    );

    this.missionUI = new MissionUI(document.getElementById('mission-tracker'));
    this.missionLogUI = new MissionLogUI(document.getElementById('mission-log'));
    this.omikujiUI = new OmikujiUI(document.getElementById('omikuji-overlay'));
    this.treasureLockUI = new TreasureLockUI(document.getElementById('treasure-lock-overlay'));
    this.activeMinigame = null; // 'omikuji' | 'treasureLock' | null

    const start = this.mapManager.currentMap.playerStart || { x: 1, y: 1 };
    this.player = new Player(start.x, start.y, TILE_SIZE);

    // 'exploring': 通常の探索中 / 'dialogue': 会話ウィンドウが開いている
    this.uiState = 'exploring';
    this._markVisited(this.mapManager.currentMap.id);
    this._checkAchievements();
    this._updateMissions();

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

  /** 新しく解除された実績があれば、トースト通知を出す */
  _checkAchievements() {
    const newlyUnlocked = this.achievements.checkAll(this.gameState);
    for (const achievement of newlyUnlocked) {
      this.achievementUI.showUnlocked(achievement);
      this.audio.playChime();
    }
  }

  /** 右上に「進行中のミッション」、左上に「全ミッション一覧」を描画し直す */
  _updateMissions() {
    const active = MISSIONS.filter((m) => m.isActive(this.gameState)).map((m) => ({
      id: m.id,
      title: m.title,
      objective: m.getObjective(this.gameState),
      hint: m.getHint ? m.getHint(this.gameState) : null,
    }));
    this.missionUI.render(active);

    const all = MISSIONS.map((m) => {
      const completed = m.isCompleted ? m.isCompleted(this.gameState) : false;
      const status = completed ? 'complete' : (m.isActive(this.gameState) ? 'inProgress' : 'notStarted');
      return {
        id: m.id,
        title: m.title,
        objective: m.getObjective(this.gameState),
        hint: m.getHint ? m.getHint(this.gameState) : null,
        status,
      };
    });
    this.missionLogUI.render(all);
  }

  /** そのNPCが「今」出現しているかどうか（隠しNPC用の条件判定） */
  _isNpcCurrentlyVisible(npc) {
    if (!npc.visibleWhen) return true;
    if (npc.visibleWhen === 'night') return this.dayNight.isNight();
    if (npc.visibleWhen === 'rain') return this.dayNight.isRaining();
    return true;
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
    if (this.input.wasJustPressed('KeyL')) {
      this.achievementUI.togglePanel(this.achievements.getAll(), this.gameState);
    }

    this.dayNight.update(dt);
    this.audio.setRaining(this.dayNight.isRaining());

    if (this.uiState === 'dialogue') {
      this.audio.updateFootsteps(dt, false);
      this._updateDialogueInput();
      return; // 会話中は移動・出口判定を行わない
    }

    if (this.uiState === 'minigame') {
      this.audio.updateFootsteps(dt, false);
      this._updateMinigameInput();
      return; // ミニゲーム中も移動・出口判定を行わない
    }

    const moveVector = this.input.getMoveVector();
    const mapData = this.mapManager.currentMap;
    this.player.update(dt, moveVector, mapData, TILE_SIZE);
    this.audio.updateFootsteps(dt, this.player.isMoving);

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

  /** ミニゲーム中の入力を、今アクティブなミニゲームへ振り分ける */
  _updateMinigameInput() {
    if (this.activeMinigame === 'omikuji') {
      if (this.input.wasJustPressed('Space') || this.input.wasJustPressed('Enter')) {
        this.omikujiUI.advance();
      }
    } else if (this.activeMinigame === 'treasureLock') {
      for (let n = 1; n <= 3; n++) {
        if (this.input.wasJustPressed(`Digit${n}`)) {
          this.treasureLockUI.selectByNumber(n);
        }
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

    for (const npc of mapData.npcs) {
      if (!this._isNpcCurrentlyVisible(npc)) continue;
      consider('npc', npc, npc.x, npc.y);
    }
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
        if (choice.minigame === 'omikuji') {
          this._startOmikujiMinigame(npc);
          return;
        }
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
    const onClose = result.minigame === 'treasureLock'
      ? () => this._startTreasureLockMinigame()
      : () => this._endDialogue();
    this.dialogueUI.show(result, { onClose });
  }

  /** おみくじミニゲームを開始し、終了後に結果のセリフへ戻す */
  _startOmikujiMinigame(npc) {
    this.dialogueUI.hide();
    this.uiState = 'minigame';
    this.activeMinigame = 'omikuji';
    this.omikujiUI.open((picked) => {
      this.activeMinigame = null;
      if (picked.isDaikichi) this.gameState.setFlag('drewDaikichi');
      this.uiState = 'dialogue';
      const lines = [`おみくじの結果は……「${picked.result}」。`, picked.comment];
      this.dialogueUI.show(
        { speaker: npc.name, lines, choices: null },
        { onClose: () => this._endDialogue() }
      );
    });
  }

  /** 宝箱の刻印パズルを開始し、成否に応じて結果のセリフへ戻す */
  _startTreasureLockMinigame() {
    this.uiState = 'minigame';
    this.activeMinigame = 'treasureLock';
    this.treasureLockUI.open((success) => {
      this.activeMinigame = null;
      this.uiState = 'dialogue';
      if (success) {
        this.gameState.setFlag('foundTreasureChest');
        this.dialogueUI.show(
          {
            speaker: '宝箱',
            lines: [
              '刻印がかちりと音を立てて、宝箱が開いた!',
              '中には、古い地図の切れ端が入っていた。',
              '（この町のどこかに、まだ何か隠されているのかもしれない）',
            ],
            choices: null,
          },
          { onClose: () => this._endDialogue() }
        );
      } else {
        this.dialogueUI.show(
          { speaker: '宝箱', lines: ['刻印の順番が違ったようだ……もう一度試してみよう。'], choices: null },
          { onClose: () => this._endDialogue() }
        );
      }
    });
  }

  _endDialogue() {
    this.uiState = 'exploring';
    this._checkAchievements();
    this._updateMissions();
  }

  _handleTransition(exit) {
    this.mapManager.switchTo(exit.target);
    this._markVisited(exit.target);
    this.player.x = exit.targetX * TILE_SIZE + TILE_SIZE / 2;
    this.player.y = exit.targetY * TILE_SIZE + TILE_SIZE / 2;
    // 遷移直後に再度出口判定してしまい行き来し続けるのを防ぐ
    this.transitionCooldown = 0.4;
    this._checkAchievements();
    this._updateMissions();
  }

  _render() {
    const interactTarget = this.uiState === 'exploring' ? this._findInteractable() : null;
    this.renderer.render(this.mapManager.currentMap, this.camera, this.player, {
      debug: this.debug,
      interactTarget,
      dayNight: this.dayNight,
      isNpcVisible: (npc) => this._isNpcCurrentlyVisible(npc),
    });
  }
}
