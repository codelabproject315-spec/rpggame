import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 敷地の境界を軽い森で囲む（南側の出口だけ空ける）
  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 13, 19, 4, 1, TileType.ROAD); // 南の出口部分だけ道にする

  // 玄関から南の出口までの通路 + 前庭の小さな広場
  fillRect(tiles, 14, 8, 3, 12, TileType.ROAD);
  fillRect(tiles, 10, 11, 10, 3, TileType.ROAD); // 前庭の広場

  // 生垣で囲まれた花の庭（左右対称、入口は1か所だけ）
  fillRect(tiles, 6, 3, 6, 5, TileType.FOREST);
  fillRect(tiles, 7, 4, 4, 3, TileType.FLOWER);
  fillRect(tiles, 8, 7, 1, 1, TileType.GRASS); // 南側に入口の隙間

  fillRect(tiles, 20, 3, 6, 5, TileType.FOREST);
  fillRect(tiles, 21, 4, 4, 3, TileType.FLOWER);
  fillRect(tiles, 22, 7, 1, 1, TileType.GRASS); // 南側に入口の隙間

  // 裏庭の小さな池
  fillRect(tiles, 5, 14, 4, 3, TileType.RIVER);
  setPoints(tiles, [[9, 15], [4, 16]], TileType.ROCK);

  // 反対側に点在する庭木
  setPoints(tiles, [[21, 14], [24, 16], [22, 17]], TileType.TREE);

  // 主人公の家
  placeBuilding(tiles, buildings, {
    type: BuildingType.HOME,
    x: 12, y: 3, w: 6, h: 5,
    name: '主人公の家',
  });

  // オブジェクト
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 11, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 20, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 9, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 12, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 18, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 11, y: 11 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 19, y: 11 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 15, y: 13 });

  // 家族NPC
  placeNpc(tiles, npcs, {
    id: 'home_family_01', type: NpcType.FAMILY,
    x: 15, y: 9, name: '母', facing: 'down',
  });

  // 出口: 南 -> 住宅街
  defineExit(exits, {
    x: 14, y: 18, w: 3, h: 2,
    target: 'residential', targetX: 15, targetY: 2,
  });

  return {
    id: 'home',
    name: '主人公の家',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    buildings,
    objects,
    npcs,
    exits,
    playerStart: { x: 15, y: 10 },
  };
}

export default build();
