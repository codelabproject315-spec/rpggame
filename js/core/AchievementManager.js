// ============================================================
// 実績の達成判定を行うクラス。
// checkAll(state) を呼ぶたびに全実績の条件を調べ、
// 新しく達成されたものだけを配列で返す（通知表示用）。
// ============================================================

import { ACHIEVEMENTS } from '../data/achievements.js';

export class AchievementManager {
  /** 実績一覧を返す（実績パネル表示用） */
  getAll() {
    return ACHIEVEMENTS;
  }

  /**
   * 全実績を判定し、今回新しく解除されたものだけを返す。
   * 解除済みかどうかは state.unlockedAchievements で管理する。
   */
  checkAll(state) {
    const newlyUnlocked = [];
    for (const achievement of ACHIEVEMENTS) {
      if (state.unlockedAchievements.has(achievement.id)) continue;
      if (achievement.check(state)) {
        state.unlockedAchievements.add(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }
    return newlyUnlocked;
  }
}
