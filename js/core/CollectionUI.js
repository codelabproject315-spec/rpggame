// ============================================================
// 収集アイテム関連のUI（DOM操作）を担当するクラス。
// AchievementUI（Lキー）と対になる、Kキーで開閉するコレクション帳。
// 入手済みアイテムは詳細を、未入手は？？？で伏せて表示する。
// ============================================================

export class CollectionUI {
  constructor(panelEl) {
    this.panel = panelEl;
    this.panelListEl = panelEl.querySelector('.collection-list');
  }

  togglePanel(allCollectibles, state) {
    const isHidden = this.panel.classList.contains('hidden');
    if (isHidden) {
      this._renderPanel(allCollectibles, state);
    }
    this.panel.classList.toggle('hidden');
  }

  _renderPanel(allCollectibles, state) {
    this.panelListEl.innerHTML = '';
    const collectedCount = allCollectibles.filter((item) => state.hasItem(item.id)).length;

    const header = this.panel.querySelector('.collection-panel-count');
    if (header) header.textContent = `${collectedCount} / ${allCollectibles.length}`;

    for (const item of allCollectibles) {
      const collected = state.hasItem(item.id);
      const el = document.createElement('div');
      el.className = `collection-item ${collected ? 'collected' : 'locked'}`;
      el.innerHTML = collected
        ? `<div class="collection-item-title">${item.name}</div>
           <div class="collection-item-desc">${item.description}</div>`
        : `<div class="collection-item-title">？？？</div>
           <div class="collection-item-desc">未発見のアイテム</div>`;
      this.panelListEl.appendChild(el);
    }
  }
}
