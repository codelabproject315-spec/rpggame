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
  // 神社
  TORII: 'torii',
  KOMAINU: 'komainu',
  BELL: 'bell',
  // 公園
  SWING: 'swing',
  SLIDE: 'slide',
  FOUNTAIN: 'fountain',
  // 学校
  BICYCLE_RACK: 'bicycleRack',
  CLOCK_TOWER: 'clockTower',
  // 商店街
  CAFE_TABLE: 'cafeTable',
  LANTERN: 'lantern',
  SHOP_BANNER: 'shopBanner',
  // 住宅街
  WELL: 'well',
  TRASH_CAN: 'trashCan',
  FENCE: 'fence',
  // 主人公の家
  PLANTER: 'planter',
  LAUNDRY_POLE: 'laundryPole',
  // 森
  JIZO_STATUE: 'jizoStatue',
  TRAIL_SIGN: 'trailSign',
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

  // ---- 神社 ----
  [ObjectType.TORII]: {
    name: '鳥居',
    color: '#b23a2f',
    shape: 'torii',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.KOMAINU]: {
    name: '狛犬',
    color: '#9a9a94',
    shape: 'komainu',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.BELL]: {
    name: '鐘',
    color: '#8a6b3d',
    shape: 'bell',
    walkable: false,
    onInteract: null,
  },

  // ---- 公園 ----
  [ObjectType.SWING]: {
    name: 'ぶらんこ',
    color: '#5c7ab5',
    shape: 'swing',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.SLIDE]: {
    name: 'すべり台',
    color: '#e0a13a',
    shape: 'slide',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.FOUNTAIN]: {
    name: '噴水',
    color: '#9aa5ad',
    shape: 'fountain',
    walkable: false,
    onInteract: null,
  },

  // ---- 学校 ----
  [ObjectType.BICYCLE_RACK]: {
    name: '自転車置き場',
    color: '#6b6b6b',
    shape: 'bicycleRack',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.CLOCK_TOWER]: {
    name: '時計塔',
    color: '#d9cdb8',
    shape: 'clockTower',
    walkable: false,
    onInteract: null,
  },

  // ---- 商店街 ----
  [ObjectType.CAFE_TABLE]: {
    name: 'テーブル席',
    color: '#8b5a2b',
    shape: 'cafeTable',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.LANTERN]: {
    name: '提灯',
    color: '#c0392b',
    shape: 'lantern',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.SHOP_BANNER]: {
    name: 'のれん',
    color: '#2f6f9f',
    shape: 'shopBanner',
    walkable: false,
    onInteract: null,
  },

  // ---- 住宅街 ----
  [ObjectType.WELL]: {
    name: '井戸',
    color: '#7d7d70',
    shape: 'well',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.TRASH_CAN]: {
    name: 'ゴミ箱',
    color: '#4a6b4a',
    shape: 'trashCan',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.FENCE]: {
    name: '柵',
    color: '#c9a876',
    shape: 'fence',
    walkable: false,
    onInteract: null,
  },

  // ---- 主人公の家 ----
  [ObjectType.PLANTER]: {
    name: '花のプランター',
    color: '#a0522d',
    shape: 'planter',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.LAUNDRY_POLE]: {
    name: '物干し竿',
    color: '#c9c2ad',
    shape: 'laundryPole',
    walkable: false,
    onInteract: null,
  },

  // ---- 森 ----
  [ObjectType.JIZO_STATUE]: {
    name: 'お地蔵様',
    color: '#8f8f86',
    shape: 'jizoStatue',
    walkable: false,
    onInteract: null,
  },
  [ObjectType.TRAIL_SIGN]: {
    name: '道しるべ',
    color: '#8b5a2b',
    shape: 'trailSign',
    walkable: false,
    onInteract: null,
  },
};
