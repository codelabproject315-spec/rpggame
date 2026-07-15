import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 46;
const HEIGHT = 30;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 十字の道（西=住宅街, 東=広場）※縦の道はもともと地図の端まで通っている
  fillRect(tiles, 22, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 14, WIDTH, 3, TileType.ROAD);

  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 0, 14, 1, 3, TileType.ROAD); // 西口
  fillRect(tiles, WIDTH - 1, 14, 1, 3, TileType.ROAD); // 東口
  fillRect(tiles, 22, 0, 3, 1, TileType.ROAD); // 北口（裏通りで図書館へ）

  // 裏通り: 商店の脇から北の出口まで抜ける道
  fillRect(tiles, 22, 8, 3, 6, TileType.ROAD);

  // 北西: 生垣に囲まれた小さな庭
  fillRect(tiles, 4, 3, 9, 8, TileType.FOREST);
  fillRect(tiles, 6, 5, 5, 4, TileType.FLOWER);
  fillRect(tiles, 8, 10, 1, 1, TileType.GRASS); // 入口の隙間

  // 露店が並ぶ通り（商店の裏手）
  fillRect(tiles, 27, 19, 12, 2, TileType.ROAD);

  // 南西の小さな池
  fillRect(tiles, 4, 20, 5, 5, TileType.RIVER);
  setPoints(tiles, [[10, 22], [3, 22]], TileType.ROCK);

  // 商店
  placeBuilding(tiles, buildings, {
    type: BuildingType.SHOP,
    x: 26, y: 5, w: 9, h: 6,
    name: '商店',
  });

  // 設置物
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 26, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.VENDING_MACHINE, x: 37, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.VENDING_MACHINE, x: 39, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 15, y: 9 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 15, y: 21 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 9, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 13, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.VENDING_MACHINE, x: 29, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.VENDING_MACHINE, x: 32, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 35, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 26, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 22, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.CAFE_TABLE, x: 24, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.CAFE_TABLE, x: 24, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.LANTERN, x: 25, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.LANTERN, x: 25, y: 16 });
  placeObject(tiles, objects, { type: ObjectType.SHOP_BANNER, x: 26, y: 11 });

  placeNpc(tiles, npcs, { id: 'shopping_owner_01', type: NpcType.SHOPKEEPER, x: 29, y: 13, name: '店主', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'shopping_customer_01', type: NpcType.CUSTOMER, x: 12, y: 12, name: '買い物客', facing: 'right' });
  placeNpc(tiles, npcs, { id: 'shopping_customer_02', type: NpcType.CUSTOMER, x: 30, y: 22, name: '買い物客', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'shopping_visitor_01', type: NpcType.VILLAGER, x: 8, y: 8, name: '通りすがりの住人', facing: 'down' });

  defineExit(exits, {
    x: 0, y: 14, w: 2, h: 3,
    target: 'residential', targetX: 43, targetY: 15,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 14, w: 2, h: 3,
    target: 'plaza', targetX: 2, targetY: 15,
  });
  defineExit(exits, {
    x: 22, y: 0, w: 3, h: 2,
    target: 'library', targetX: 2, targetY: 16,
  });

  return {
    id: 'shopping',
    name: '商店街',
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
