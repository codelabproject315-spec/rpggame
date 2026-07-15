// ============================================================
// NPCやオブジェクトのセリフデータ(js/data/npcTypeDialogues.js,
// npcOverrides.js, objectInteractions.js)から、現在の状況
// (フラグ・好感度・クエスト進行度)に応じた表示内容を選び出す。
// UI表示そのものはこのクラスの責務ではなく、Game.js側が
// このクラスの戻り値を使って表示する。
// ============================================================

import { NPC_TYPE_DIALOGUES } from '../data/npcTypeDialogues.js';
import { NPC_OVERRIDE_DIALOGUES } from '../data/npcOverrides.js';
import { OBJECT_INTERACTIONS, objectInteractionKey } from '../data/objectInteractions.js';

function pickRule(rules, state, npc) {
  for (const rule of rules) {
    if (!rule.when || rule.when(state, npc)) {
      return rule;
    }
  }
  return null;
}

export class DialogueManager {
  /**
   * NPCに話しかけたときの表示内容を返す。
   * 戻り値: { speaker, lines, choices } （choicesが無ければ選択肢なしの会話）
   * 会話回数(好感度)はここで自動的に1増える。
   */
  startNpcDialogue(npc, state) {
    state.incrementAffinity(npc.id);

    const rules = NPC_OVERRIDE_DIALOGUES[npc.id] || NPC_TYPE_DIALOGUES[npc.type] || [];
    const rule = pickRule(rules, state, npc);
    if (!rule) {
      return { speaker: npc.name, lines: ['……。'], choices: null };
    }

    if (rule.effect) rule.effect(state, npc);

    return {
      speaker: npc.name,
      lines: rule.lines && rule.lines.length ? rule.lines : [''],
      choices: rule.choices || null,
    };
  }

  /** 会話中に選択肢を1つ選んだときの、続きの表示内容を返す */
  resolveChoice(choice, npc, state) {
    if (choice.effect) choice.effect(state, npc);
    return {
      speaker: npc.name,
      lines: choice.lines && choice.lines.length ? choice.lines : [''],
      choices: null,
    };
  }

  /** そのオブジェクトに反応データが登録されているか（＝話しかけられる対象か） */
  hasObjectInteraction(mapId, obj) {
    const key = objectInteractionKey(mapId, obj);
    return Boolean(OBJECT_INTERACTIONS[key]);
  }

  /**
   * オブジェクト（宝箱など）を調べたときの表示内容を返す。
   * そのオブジェクトに反応データが無ければ null を返す
   * （＝話しかけられる相手ではない、という扱いになる）。
   */
  startObjectInteraction(mapId, obj, state) {
    const key = objectInteractionKey(mapId, obj);
    const entry = OBJECT_INTERACTIONS[key];
    if (!entry) return null;
    return entry.getResult(state);
  }
}
