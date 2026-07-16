import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, fillLine, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 46;
const HEIGHT = 30;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.FOREST);

  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 西の出口から奥へ続く道
  fillRect(tiles, 0, 14, WIDTH, 3, TileType.ROAD);
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 0, 14, 1, 3, TileType.ROAD); // 西口だけ空ける

  // 森の奥は行き止まり（東・南・北は木で塞ぐ）
  fillRect(tiles, WIDTH - 4, 0, 4, HEIGHT, TileType.TREE);

  // 北へ分岐する小道の先にある隠れた木漏れ日の広場（2本の道でループにする）
  fillRect(tiles, 22, 3, 12, 6, TileType.GRASS);
  fillRect(tiles, 25, 5, 3, 10, TileType.ROAD);
  fillRect(tiles, 31, 5, 3, 10, TileType.ROAD);

  // 森を流れる小川と橋、東へ分岐する小さな支流
  fillLine(tiles, 18, 0, 18, HEIGHT - 1, TileType.RIVER);
  fillRect(tiles, 18, 14, 1, 3, TileType.BRIDGE);
  fillLine(tiles, 18, 21, 24, 21, TileType.RIVER);
  setPoints(tiles, [[16, 22]], TileType.ROCK);

  // 宝箱のまわりだけ木漏れ日の隠れた空き地
  fillRect(tiles, 33, 12, 7, 6, TileType.GRASS);
  setPoints(tiles, [[33, 13], [38, 13], [36, 12]], TileType.ROCK);

  // 木立と岩を点在させる
  setPoints(
    tiles,
    [
      [6, 6], [8, 8], [10, 6], [11, 11],
      [21, 5], [35, 6], [23, 9], [33, 9],
      [8, 21], [11, 23], [30, 23],
    ],
    TileType.TREE
  );
  setPoints(tiles, [[14, 9], [33, 20]], TileType.ROCK);

  // 森の奥に隠された宝箱
  placeObject(tiles, objects, { type: ObjectType.TREASURE_CHEST, x: 36, y: 15 });

  // 宝箱を開けるための手がかり「刻印の立て札」を森の各所に配置
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 5, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 23, y: 7 });
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 39, y: 14 });

  placeObject(tiles, objects, { type: ObjectType.FISHING_SPOT, x: 19, y: 15 }); // 釣りスポット(川べり)

  // 森の奥に佇む謎の人影
  placeNpc(tiles, npcs, { id: 'forest_mystery_01', type: NpcType.MYSTERY, x: 33, y: 9, name: '謎の人影', facing: 'down' });
  // 木漏れ日の広場で迷っている旅人
  placeNpc(tiles, npcs, { id: 'forest_wanderer_01', type: NpcType.VILLAGER, x: 24, y: 5, name: '道に迷った旅人', facing: 'down' });
  // 木漏れ日の広場にいる木こり（のこぎりをくれる）
  placeNpc(tiles, npcs, { id: 'forest_woodcutter_01', type: NpcType.WOODCUTTER, x: 29, y: 4, name: '木こり', facing: 'down' });

  // 南西に、中に入れる「古い蔵」を配置（中は迷路になっている）
  fillRect(tiles, 5, 17, 10, 8, TileType.GRASS);
  placeBuilding(tiles, buildings, {
    type: BuildingType.STOREHOUSE,
    x: 6, y: 17, w: 7, h: 3,
    name: '古い蔵',
  });
  fillRect(tiles, 7, 20, 6, 4, TileType.ROAD); // 蔵の前の小さな広場
  defineExit(exits, {
    x: 8, y: 20, w: 2, h: 1,
    target: 'maze', targetX: 11, targetY: 17,
  });

  defineExit(exits, {
    x: 0, y: 14, w: 2, h: 3,
    target: 'school', targetX: 43, targetY: 15,
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
