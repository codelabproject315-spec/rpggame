// ============================================================
// 進行中の「ミッション」を、画面左上に常時表示するためのUI。
// AchievementUIとは違い、トースト通知ではなく「今アクティブな
// ミッションの一覧」を毎回まるごと描画し直すシンプルな作りにしてある
// （ミッションは同時に数個程度しか出ない想定のため）。
//
// パネル全体（ヘッダー）と、ミッションひとつひとつの両方を
// クリックで開閉できるようにしてある。開閉状態は再描画をまたいで
// 保持されるよう、このクラスの中に持たせている。
// ============================================================

export class MissionUI {
  constructor(containerEl) {
    this.container = containerEl;
    this.panelCollapsed = false;
    // ミッションIDごとの開閉状態。未登録（初回表示）は「開いた状態」扱い。
    this.expandedIds = new Set();
    this.seenIds = new Set();
  }

  /** activeMissions: [{ id, title, objective, hint }] */
  render(activeMissions) {
    this.container.innerHTML = '';

    if (!activeMissions || activeMissions.length === 0) {
      this.container.classList.add('hidden');
      return;
    }

    this.container.classList.remove('hidden');

    // 新しく出てきたミッションはデフォルトで開いた状態にしておく
    for (const mission of activeMissions) {
      if (!this.seenIds.has(mission.id)) {
        this.seenIds.add(mission.id);
        this.expandedIds.add(mission.id);
      }
    }

    // --- パネル全体の開閉ヘッダー ---
    const header = document.createElement('div');
    header.className = 'mission-panel-header';
    header.innerHTML = `
      <span class="mission-panel-title">ミッション（${activeMissions.length}）</span>
      <span class="mission-panel-toggle-icon${this.panelCollapsed ? ' collapsed' : ''}">▼</span>
    `;
    header.addEventListener('click', () => {
      this.panelCollapsed = !this.panelCollapsed;
      this.render(activeMissions);
    });
    this.container.appendChild(header);

    // --- ミッション一覧本体 ---
    const body = document.createElement('div');
    body.className = `mission-panel-body${this.panelCollapsed ? ' collapsed' : ''}`;

    for (const mission of activeMissions) {
      const isExpanded = this.expandedIds.has(mission.id);

      const item = document.createElement('div');
      item.className = 'mission-item';

      const head = document.createElement('div');
      head.className = 'mission-item-head';
      head.innerHTML = `
        <div>
          <div class="mission-item-label">ミッション</div>
          <div class="mission-item-title">${mission.title}</div>
        </div>
        <span class="mission-item-toggle-icon${isExpanded ? '' : ' collapsed'}">▼</span>
      `;

      const detail = document.createElement('div');
      detail.className = `mission-item-detail${isExpanded ? '' : ' collapsed'}`;
      detail.innerHTML = `
        <div class="mission-item-objective">${mission.objective}</div>
        ${mission.hint ? `
          <div class="mission-item-hint">
            <span class="mission-item-hint-icon">📍</span>
            <span>${mission.hint}</span>
          </div>
        ` : ''}
      `;

      item.addEventListener('click', () => {
        if (this.expandedIds.has(mission.id)) {
          this.expandedIds.delete(mission.id);
        } else {
          this.expandedIds.add(mission.id);
        }
        this.render(activeMissions);
      });

      item.appendChild(head);
      item.appendChild(detail);
      body.appendChild(item);
    }

    this.container.appendChild(body);
  }
}
