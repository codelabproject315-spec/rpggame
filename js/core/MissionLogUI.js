// ============================================================
// ゲーム内の「全ミッション一覧」を、画面左上に常時表示するためのUI。
// MissionUI（右上・進行中のみ）とは違い、こちらは未着手・クリア済みを
// 含めた全ミッションを常に表示し続ける、いわば「クエストログ」。
//
// パネル全体はヘッダークリックで開閉できるが、デフォルト（初期状態）
// では開いた状態にしてあり、全ミッション（目的＋ヒント＋状態）を
// 最初から左上にまとめて表示する。
// ============================================================

const STATUS_LABEL = {
  notStarted: '未着手',
  inProgress: '進行中',
  complete: 'クリア済み',
};

export class MissionLogUI {
  constructor(containerEl) {
    this.container = containerEl;
    this.panelCollapsed = true; // デフォルトで閉じた状態
  }

  /** allMissions: [{ id, title, objective, hint, status }] （statusは 'notStarted' | 'inProgress' | 'complete'） */
  render(allMissions) {
    this.container.innerHTML = '';

    if (!allMissions || allMissions.length === 0) {
      this.container.classList.add('hidden');
      return;
    }

    this.container.classList.remove('hidden');

    // --- パネル全体の開閉ヘッダー ---
    const header = document.createElement('div');
    header.className = 'mission-panel-header';
    header.innerHTML = `
      <span class="mission-panel-title">全ミッション（${allMissions.length}）</span>
      <span class="mission-panel-toggle-icon${this.panelCollapsed ? ' collapsed' : ''}">▼</span>
    `;
    header.addEventListener('click', () => {
      this.panelCollapsed = !this.panelCollapsed;
      this.render(allMissions);
    });
    this.container.appendChild(header);

    // --- ミッション一覧本体（常に全項目を展開した状態で表示） ---
    const body = document.createElement('div');
    body.className = `mission-panel-body${this.panelCollapsed ? ' collapsed' : ''}`;

    for (const mission of allMissions) {
      const item = document.createElement('div');
      item.className = `mission-item mission-item-${mission.status}`;
      item.innerHTML = `
        <div class="mission-item-head-row">
          <div class="mission-item-label">ミッション</div>
          <span class="mission-item-status mission-item-status-${mission.status}">${STATUS_LABEL[mission.status]}</span>
        </div>
        <div class="mission-item-title">${mission.title}</div>
        <div class="mission-item-objective">${mission.objective}</div>
        ${mission.hint ? `
          <div class="mission-item-hint">
            <span class="mission-item-hint-icon">📍</span>
            <span>${mission.hint}</span>
          </div>
        ` : ''}
      `;
      body.appendChild(item);
    }

    this.container.appendChild(body);
  }
}
