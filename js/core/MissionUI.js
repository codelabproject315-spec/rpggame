// ============================================================
// 「現在進行中のミッション」だけを、画面右上に常時表示するためのUI。
// AchievementUIとは違い、トースト通知ではなく「今アクティブな
// ミッションの一覧」を毎回まるごと描画し直すシンプルな作りにしてある
// （ミッションは同時に数個程度しか出ない想定のため）。
//
// パネル全体はヘッダークリックで開閉できるが、デフォルト（初期状態）
// では開いた状態にしてあり、進行中の全ミッション（目的＋ヒント）を
// 最初から右上にまとめて表示する。
//
// ゲーム内の「全ミッション一覧」（未着手・クリア済みも含む）は
// MissionLogUI（左上）が別途担当する。
// ============================================================

export class MissionUI {
  constructor(containerEl) {
    this.container = containerEl;
    this.panelCollapsed = true; // デフォルトで閉じた状態
  }

  /** activeMissions: [{ id, title, objective, hint }] */
  render(activeMissions) {
    this.container.innerHTML = '';

    if (!activeMissions || activeMissions.length === 0) {
      this.container.classList.add('hidden');
      return;
    }

    this.container.classList.remove('hidden');

    // --- パネル全体の開閉ヘッダー ---
    const header = document.createElement('div');
    header.className = 'mission-panel-header';
    header.innerHTML = `
      <span class="mission-panel-title">進行中のミッション（${activeMissions.length}）</span>
      <span class="mission-panel-toggle-icon${this.panelCollapsed ? ' collapsed' : ''}">▼</span>
    `;
    header.addEventListener('click', () => {
      this.panelCollapsed = !this.panelCollapsed;
      this.render(activeMissions);
    });
    this.container.appendChild(header);

    // --- ミッション一覧本体（常に全項目を展開した状態で表示） ---
    const body = document.createElement('div');
    body.className = `mission-panel-body${this.panelCollapsed ? ' collapsed' : ''}`;

    for (const mission of activeMissions) {
      const item = document.createElement('div');
      item.className = 'mission-item';
      item.innerHTML = `
        <div class="mission-item-label">ミッション</div>
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
