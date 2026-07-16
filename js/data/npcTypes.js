// ============================================================
// NPCの見た目バリエーション定義。
// 今回は「立っているだけ」で会話はできないが、将来会話システムを
// 実装する際は、各マップデータのnpcエントリが持つ id をキーにして
// セリフ・フラグ分岐を紐づけられるように設計してある
// （onInteract は今回すべて null）。
// ============================================================

export const NpcType = {
  FAMILY: 'family',
  VILLAGER: 'villager',
  TEACHER: 'teacher',
  STUDENT: 'student',
  SHOPKEEPER: 'shopkeeper',
  CUSTOMER: 'customer',
  LIBRARIAN: 'librarian',
  SHRINE_KEEPER: 'shrineKeeper',
  PARK_VISITOR: 'parkVisitor',
  MYSTERY: 'mystery',
  ELDER: 'elder',
  RESEARCHER: 'researcher',
  MYSTERY_RAIN: 'mysteryRain',
  WOODCUTTER: 'woodcutter',
  CAT: 'cat',
};

const DEFAULT_SKIN = '#f2c199';

// accessory: 職業や役割が一目でわかるよう頭・体につける小物。
// Renderer.js の buildCharacterMesh がこの値を見て追加パーツを組み立てる。
// 'none' なら追加パーツなし。
export const NPC_DEFINITIONS = {
  [NpcType.FAMILY]: { bodyColor: '#d97ba0', skinColor: DEFAULT_SKIN, accentColor: null, accessory: 'apron' },
  [NpcType.VILLAGER]: { bodyColor: '#6fa8dc', skinColor: DEFAULT_SKIN, accentColor: null, accessory: 'none' },
  [NpcType.TEACHER]: { bodyColor: '#4a5d7a', skinColor: DEFAULT_SKIN, accentColor: '#e9dcb8', accessory: 'glassesTie' },
  [NpcType.STUDENT]: { bodyColor: '#e0c352', skinColor: DEFAULT_SKIN, accentColor: '#3d3d3d', accessory: 'backpack' },
  [NpcType.SHOPKEEPER]: { bodyColor: '#c9762e', skinColor: DEFAULT_SKIN, accentColor: '#f2e9d8', accessory: 'apron' },
  [NpcType.CUSTOMER]: { bodyColor: '#7fbf7f', skinColor: DEFAULT_SKIN, accentColor: null, accessory: 'shoppingBag' },
  [NpcType.LIBRARIAN]: { bodyColor: '#8a6fbd', skinColor: DEFAULT_SKIN, accentColor: '#e9dcb8', accessory: 'glasses' },
  [NpcType.SHRINE_KEEPER]: { bodyColor: '#f5f0e6', skinColor: DEFAULT_SKIN, accentColor: '#b03a3a', accessory: 'none' },
  [NpcType.PARK_VISITOR]: { bodyColor: '#56b6a0', skinColor: DEFAULT_SKIN, accentColor: null, accessory: 'none' },
  [NpcType.MYSTERY]: { bodyColor: '#2e2e38', skinColor: '#4a4a55', accentColor: '#6a3fa0', accessory: 'hood' },
  // 住宅街のおばあちゃん: 落ち着いた小豆色のカーディガンと白髪で、他の一般住民と区別できるように
  [NpcType.ELDER]: { bodyColor: '#8a5a5a', skinColor: '#f2d9c4', accentColor: '#f5f0e6', accessory: 'cane' },
  // 図書館で都市伝説を調べる利用者: 深緑のコートに黒縁メガネ風のアクセントで、他の利用者と区別
  [NpcType.RESEARCHER]: { bodyColor: '#3d6b5c', skinColor: DEFAULT_SKIN, accentColor: '#2a2a2a', accessory: 'book' },
  // 雨の日だけ現れる謎の人物: 既存の「森の人影」「星を眺める人」(MYSTERY)とは
  // 違う色味にして、見ただけで「別の正体不明キャラだ」とわかるようにする
  [NpcType.MYSTERY_RAIN]: { bodyColor: '#1f3a52', skinColor: '#5a6a75', accentColor: '#3fb0c0', accessory: 'hood' },
  // 森の木こり: のこぎりをくれる役。作業着の焦茶色で、他の森の住人と区別できるように
  [NpcType.WOODCUTTER]: { bodyColor: '#6b4a30', skinColor: DEFAULT_SKIN, accentColor: '#c9a876', accessory: 'axe' },
  // 神社の三毛猫: 人型ではなく専用の四足モデルで描画する（Renderer.js側で分岐）
  [NpcType.CAT]: { bodyColor: '#f5efe0', skinColor: '#f5efe0', accentColor: null, accessory: 'none', patchColors: ['#d97a3a', '#2a2a2a'] },
};
