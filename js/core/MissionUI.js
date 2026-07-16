// ============================================================
// 進行中の「ミッション」を、画面右上に常時表示するためのUI。
// AchievementUIとは違い、トースト通知ではなく「今アクティブな
// ミッションの一覧」を毎回まるごと描画し直すシンプルな作りにしてある
// （ミッションは同時に数個程度しか出ない想定のため）。
// ============================================================

export class MissionUI {
  constructor(containerEl) {
    this.container = containerEl;
  }

  /** activeMissions: [{ id, title, objective }] */
  render(activeMissions) {
    this.container.innerHTML = '';

    if (!activeMissions || activeMissions.length === 0) {
      this.container.classList.add('hidden');
      return;
    }

    this.container.classList.remove('hidden');
    for (const mission of activeMissions) {
      const item = document.createElement('div');
      item.className = 'mission-item';
      item.innerHTML = `
        <div class="mission-item-label">ミッション</div>
        <div class="mission-item-title">${mission.title}</div>
        <div class="mission-item-objective">${mission.objective}</div>
      `;
      this.container.appendChild(item);
    }
  }
}
