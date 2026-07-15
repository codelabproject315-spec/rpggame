import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, fillLine, setPoints, setBorder } from '../../utils/grid.js';
import { placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.FOREST);

  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 西の出口から奥へ続く一本道
  fillRect(tiles, 0, 9, WIDTH, 3, TileType.ROAD);
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 0, 9, 1, 3, TileType.ROAD); // 西口だけ空ける

  // 森の奥は行き止まり（東・南・北は木で塞ぐ）
  fillRect(tiles, WIDTH - 3, 0, 3, HEIGHT, TileType.TREE);

  // 北へ分岐する小道の先にある隠れた木漏れ日の広場
  fillRect(tiles, 15, 2, 8, 4, TileType.GRASS);
  fillRect(tiles, 18, 3, 3, 7, TileType.ROAD);

  // 森を流れる小川と橋、東へ分岐する小さな支流
  fillLine(tiles, 12, 0, 12, HEIGHT - 1, TileType.RIVER);
  fillRect(tiles, 12, 9, 1, 3, TileType.BRIDGE);
  fillLine(tiles, 12, 14, 16, 14, TileType.RIVER);
  setPoints(tiles, [[11, 15]], TileType.ROCK);

  // 宝箱のまわりだけ木漏れ日の隠れた空き地
  fillRect(tiles, 22, 8, 5, 4, TileType.GRASS);
  setPoints(tiles, [[22, 9], [26, 9], [24, 8]], TileType.ROCK);

  // 木立と岩を点在させる
  setPoints(
    tiles,
    [
      [4, 4], [5, 5], [6, 4], [7, 7],
      [14, 3], [23, 4], [15, 6], [22, 6],
      [5, 14], [7, 15], [20, 15],
    ],
    TileType.TREE
  );
  setPoints(tiles, [[9, 6], [22, 13]], TileType.ROCK);

  // 森の奥に隠された宝箱
  placeObject(tiles, objects, { type: ObjectType.TREASURE_CHEST, x: 24, y: 10 });

  // 森の奥に佇む謎の人影
  placeNpc(tiles, npcs, { id: 'forest_mystery_01', type: NpcType.MYSTERY, x: 22, y: 6, name: '謎の人影', facing: 'down' });
  // 木漏れ日の広場で迷っている旅人
  placeNpc(tiles, npcs, { id: 'forest_wanderer_01', type: NpcType.VILLAGER, x: 16, y: 4, name: '道に迷った旅人', facing: 'down' });

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
    npcs,
    exits,
  };
}

export default build();
