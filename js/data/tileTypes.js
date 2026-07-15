// ============================================================
// 地形タイルの定義
// ここに1種類追加するだけで、新しい地形をマップデータ側で使えるようになる。
// walkable: false のタイルは自動的に「通れない」当たり判定になる。
// ============================================================

export const TileType = {
  GRASS: 0,
  ROAD: 1,
  FOREST: 2,
  TREE: 3,
  FLOWER: 4,
  RIVER: 5,
  BRIDGE: 6,
  ROCK: 7,
  MOUNTAIN: 8,
  CLIFF: 9,

  // 建物・オブジェクトの「足元」を塗りつぶす専用タイル。
  // 見た目は建物/オブジェクトのスプライトで上書きされるため、
  // ここでは当たり判定のためだけに存在する。
  BUILDING_FOOTPRINT: 10,
  OBJECT_FOOTPRINT: 11,
};

// タイルID -> 見た目・通行可否
export const TILE_DEFINITIONS = {
  [TileType.GRASS]: { name: '草原', color: '#7ec850', walkable: true },
  [TileType.ROAD]: { name: '道', color: '#d8c98f', walkable: true },
  [TileType.FOREST]: { name: '森', color: '#2f6b3a', walkable: false },
  [TileType.TREE]: { name: '木', color: '#3f7d3f', walkable: false, decoration: 'tree' },
  [TileType.FLOWER]: { name: '花', color: '#8fd15e', walkable: true, decoration: 'flower' },
  [TileType.RIVER]: { name: '川', color: '#4a90d9', walkable: false },
  [TileType.BRIDGE]: { name: '橋', color: '#a97a4b', walkable: true },
  [TileType.ROCK]: { name: '岩', color: '#8a8a8a', walkable: false, decoration: 'rock' },
  [TileType.MOUNTAIN]: { name: '山', color: '#6e6255', walkable: false },
  [TileType.CLIFF]: { name: '崖', color: '#5a4b3c', walkable: false },
  [TileType.BUILDING_FOOTPRINT]: { name: '建物', color: '#7ec850', walkable: false },
  [TileType.OBJECT_FOOTPRINT]: { name: 'オブジェクト', color: '#7ec850', walkable: false },
};
