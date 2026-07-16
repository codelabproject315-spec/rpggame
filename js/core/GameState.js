// ============================================================
// ゲーム全体の「進行状況」を保持するクラス。
// ・フラグ（訪れた場所、見つけたものなど、はい/いいえの状態）
// ・NPCごとの好感度（会話した回数）
// ・クエストの進行状況
// を一箇所にまとめて管理する。
//
// 今回はセーブ/ロードは実装しないため、このクラスの中身は
// ページを開き直すとリセットされる（メモリ上だけの状態）。
// 将来セーブ機能を作る際は、このクラスの中身を
// JSON化して保存/復元するだけで済むように設計してある。
// ============================================================

export class GameState {
  constructor() {
    this.flags = new Set();
    this.affinity = new Map(); // npcId -> 会話回数
    this.quests = new Map(); // questId -> 'notStarted' | 'inProgress' | 'complete' など
    this.unlockedAchievements = new Set(); // 実績ID
    this.items = new Set(); // 収集したアイテムID（隠しアイテム／選択肢のごほうび）
  }

  setFlag(name) {
    this.flags.add(name);
  }

  hasFlag(name) {
    return this.flags.has(name);
  }

  /** そのNPCと会話した回数を1増やし、増やした後の回数を返す */
  incrementAffinity(npcId) {
    const next = (this.affinity.get(npcId) || 0) + 1;
    this.affinity.set(npcId, next);
    return next;
  }

  getAffinity(npcId) {
    return this.affinity.get(npcId) || 0;
  }

  /** これまでに会話した「異なるNPCの人数」（実績の判定などに使う） */
  getTalkedCount() {
    return this.affinity.size;
  }

  setQuest(questId, status) {
    this.quests.set(questId, status);
  }

  getQuest(questId) {
    return this.quests.get(questId) || 'notStarted';
  }

  /** アイテムを収集済みにする（すでに持っていても何も起きない） */
  collectItem(itemId) {
    this.items.add(itemId);
  }

  hasItem(itemId) {
    return this.items.has(itemId);
  }

  /** 収集済みアイテムの数（実績「収集家」の判定などに使う） */
  getItemCount() {
    return this.items.size;
  }
}
