import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { createGrid, fillRect, fillLine, setPoints, setBorder } from '../../utils/grid.js';
import { placeObject, reserveNpcSpot, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.FOREST);

  const buildings = [];
  const objects = [];
  const npcSpawns = [];
  const exits = [];

  // 西の出口から奥へ続く一本道
  fillRect(tiles, 0, 9, WIDTH, 3, TileType.ROAD);
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 0, 9, 1, 3, TileType.ROAD); // 西口だけ空ける

  // 森の奥は行き止まり（東・南・北は木で塞ぐ）
  fillRect(tiles, WIDTH - 3, 0, 3, HEIGHT, TileType.TREE);

  // 森を流れる小川と橋
  fillLine(tiles, 12, 0, 12, HEIGHT - 1, TileType.RIVER);
  fillRect(tiles, 12, 9, 1, 3, TileType.BRIDGE);

  // 木立と岩を点在させる
  setPoints(
    tiles,
    [
      [4, 4], [5, 5], [6, 4], [7, 7],
      [16, 5], [18, 6], [20, 4], [21, 7],
      [5, 14], [7, 15], [17, 14], [20, 15],
    ],
    TileType.TREE
  );
  setPoints(tiles, [[9, 6], [22, 13]], TileType.ROCK);

  // 森の奥に隠された宝箱
  placeObject(tiles, objects, { type: ObjectType.TREASURE_CHEST, x: 24, y: 10 });

  // 将来: 森の奥に現れる謎のNPC配置予定地
  reserveNpcSpot(npcSpawns, { id: 'forest_mystery_01', x: 22, y: 6, note: '森の中の謎のNPC配置予定' });

  defineExit(exits, {
    x: 0, y: 9, w: 2, h: 3,
    target: 'school', targetX: 27, targetY: 10,
  });

  return {
    id: 'forest',
    name: '森',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    buildings,
    objects,
    npcSpawns,
    exits,
  };
}

export default build();
