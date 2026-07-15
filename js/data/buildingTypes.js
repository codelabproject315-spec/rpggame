// ============================================================
// 建物の種類定義
// 今回は「中に入る」機能は実装しないため、見た目と当たり判定のみを持つ。
// 将来、内部マップを追加する際は interiorMapId のようなフィールドを
// ここに追加すれば拡張できる（現時点では null）。
// ============================================================

export const BuildingType = {
  HOME: 'home',
  SCHOOL: 'school',
  SHOP: 'shop',
  LIBRARY: 'library',
  SHRINE: 'shrine',
  PARK_GATE: 'parkGate',
};

export const BUILDING_DEFINITIONS = {
  [BuildingType.HOME]: {
    name: '主人公の家',
    bodyColor: '#e8b98a',
    roofColor: '#b5533c',
    interiorMapId: null, // 将来: 内部マップのIDを入れる
  },
  [BuildingType.SCHOOL]: {
    name: '学校',
    bodyColor: '#f2f2e6',
    roofColor: '#5b7fbd',
    interiorMapId: null,
  },
  [BuildingType.SHOP]: {
    name: '商店',
    bodyColor: '#f0d9a6',
    roofColor: '#c76b3f',
    interiorMapId: null,
  },
  [BuildingType.LIBRARY]: {
    name: '図書館',
    bodyColor: '#d9cdb8',
    roofColor: '#6b4f3b',
    interiorMapId: null,
  },
  [BuildingType.SHRINE]: {
    name: '神社',
    bodyColor: '#8f2d2d',
    roofColor: '#4a1f1f',
    interiorMapId: null,
  },
  [BuildingType.PARK_GATE]: {
    name: '公園',
    bodyColor: '#c9a876',
    roofColor: '#5c7a4a',
    interiorMapId: null,
  },
};
