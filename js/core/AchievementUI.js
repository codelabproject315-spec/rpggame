// ============================================================
// 実績関連のUI（DOM操作）をまとめて担当するクラス。
// ・実績を解除した瞬間に出る、右上のトースト通知
// ・Lキーで開閉する実績一覧パネル
// ============================================================

const TOAST_DURATION_MS = 3200;

export class AchievementUI {
  constructor(toastContainerEl, panelEl) {
    this.toastContainer = toastContainerEl;
    this.panel = panelEl;
    this.panelListEl = panelEl.querySelector('.achievement-list');
  }

  /** 実績解除トーストを1件表示する（複数同時解除でも重ねて表示できる） */
  showUnlocked(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="achievement-toast-label">実績解除</div>
      <div class="achievement-toast-title">${achievement.title}</div>
      <div class="achievement-toast-desc">${achievement.description}</div>
    `;
    this.toastContainer.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, TOAST_DURATION_MS);
  }

  togglePanel(allAchievements, state) {
    const isHidden = this.panel.classList.contains('hidden');
    if (isHidden) {
      this._renderPanel(allAchievements, state);
    }
    this.panel.classList.toggle('hidden');
  }

  _renderPanel(allAchievements, state) {
    this.panelListEl.innerHTML = '';
    for (const achievement of allAchievements) {
      const unlocked = state.unlockedAchievements.has(achievement.id);
      const item = document.createElement('div');
      item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
      item.innerHTML = unlocked
        ? `<div class="achievement-item-title">${achievement.title}</div>
           <div class="achievement-item-desc">${achievement.description}</div>`
        : `<div class="achievement-item-title">？？？</div>
           <div class="achievement-item-desc">未解除の実績</div>`;
      this.panelListEl.appendChild(item);
    }
  }
}
