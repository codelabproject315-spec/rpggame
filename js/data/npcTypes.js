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
};

const DEFAULT_SKIN = '#f2c199';

export const NPC_DEFINITIONS = {
  [NpcType.FAMILY]: { bodyColor: '#d97ba0', skinColor: DEFAULT_SKIN, accentColor: null },
  [NpcType.VILLAGER]: { bodyColor: '#6fa8dc', skinColor: DEFAULT_SKIN, accentColor: null },
  [NpcType.TEACHER]: { bodyColor: '#4a5d7a', skinColor: DEFAULT_SKIN, accentColor: '#e9dcb8' },
  [NpcType.STUDENT]: { bodyColor: '#e0c352', skinColor: DEFAULT_SKIN, accentColor: '#3d3d3d' },
  [NpcType.SHOPKEEPER]: { bodyColor: '#c9762e', skinColor: DEFAULT_SKIN, accentColor: '#f2e9d8' },
  [NpcType.CUSTOMER]: { bodyColor: '#7fbf7f', skinColor: DEFAULT_SKIN, accentColor: null },
  [NpcType.LIBRARIAN]: { bodyColor: '#8a6fbd', skinColor: DEFAULT_SKIN, accentColor: '#e9dcb8' },
  [NpcType.SHRINE_KEEPER]: { bodyColor: '#f5f0e6', skinColor: DEFAULT_SKIN, accentColor: '#b03a3a' },
  [NpcType.PARK_VISITOR]: { bodyColor: '#56b6a0', skinColor: DEFAULT_SKIN, accentColor: null },
  [NpcType.MYSTERY]: { bodyColor: '#2e2e38', skinColor: '#4a4a55', accentColor: '#6a3fa0' },
};
