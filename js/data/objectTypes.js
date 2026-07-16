// ============================================================
// 設置オブジェクト（看板・ベンチ・街灯など）の種類定義
// 今回はイベントを実装しないため onInteract は常に null。
// 将来イベントシステムを実装する際は、
// ここに onInteract: (gameState) => {...} を追加するだけで
// 「調べる」動作にフックできるように設計してある。
// ============================================================

export const ObjectType = {
  SIGNBOARD: 'signboard',
  BENCH: 'bench',
  STREETLIGHT: 'streetlight',
  MAILBOX: 'mailbox',
  VENDING_MACHINE: 'vendingMachine',
  TREASURE_CHEST: 'treasureChest',
  FLOWER_BED: 'flowerBed',
  SPARKLE: 'sparkle',
  THICKET: 'thicket',
  FISHING_SPOT: 'fishingSpot',
};

export const OBJECT_DEFINITIONS = {
  [ObjectType.SIGNBOARD]: {
    name: '看板',
    color: '#c9a876',
    shape: 'signboard',
    walkable: false,
    onInteract: null, // 将来: イベント/会話フックをここに追加
  },
  [ObjectType.BENCH]: {
    name: 'ベンチ',
    color: '#8b5a2b',
    shape: 'bench',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.STREETLIGHT]: {
    name: '街灯',
    color: '#555555',
    shape: 'streetlight',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.MAILBOX]: {
    name: 'ポスト',
    color: '#c0392b',
    shape: 'mailbox',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.VENDING_MACHINE]: {
    name: '自動販売機',
    color: '#2f6f9f',
    shape: 'vendingMachine',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.TREASURE_CHEST]: {
    name: '宝箱',
    color: '#d4a017',
    shape: 'treasureChest',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.FLOWER_BED]: {
    name: '花壇',
    color: '#d1608a',
    shape: 'flowerBed',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.SPARKLE]: {
    name: '光のビーコン',
    color: '#e0293f',
    shape: 'sparkle',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.THICKET]: {
    name: '茂み',
    color: '#2f6b3a',
    shape: 'thicket',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.FISHING_SPOT]: {
    name: '釣り場',
    color: '#8a6a3a',
    shape: 'fishingSpot',
    walkable: false,
    onInteract: null,
  },
};
