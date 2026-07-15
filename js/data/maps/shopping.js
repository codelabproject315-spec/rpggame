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

  // 十字の道（西=住宅街, 東=広場）
  fillRect(tiles, 14, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 9, WIDTH, 3, TileType.ROAD);

  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 0, 9, 1, 3, TileType.ROAD); // 西口
  fillRect(tiles, WIDTH - 1, 9, 1, 3, TileType.ROAD); // 東口

  // 北西: 生垣に囲まれた小さな庭
  fillRect(tiles, 3, 2, 6, 5, TileType.FOREST);
  fillRect(tiles, 4, 3, 4, 3, TileType.FLOWER);
  fillRect(tiles, 5, 6, 1, 1, TileType.GRASS); // 入口の隙間

  // 露店が並ぶ通り（商店の裏手）
  fillRect(tiles, 17, 12, 8, 1, TileType.ROAD);

  // 南西の小さな池
  fillRect(tiles, 3, 13, 3, 3, TileType.RIVER);
  setPoints(tiles, [[6, 14], [2, 14]], TileType.ROCK);

  // 商店
  placeBuilding(tiles, buildings, {
    type: BuildingType.SHOP,
    x: 17, y: 4, w: 6, h: 4,
    name: '商店',
  });

  // 設置物
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 17, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.VENDING_MACHINE, x: 24, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.VENDING_MACHINE, x: 25, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 10, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 10, y: 14 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 6, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 9, y: 4 });
  placeObject(tiles, objects, { type: ObjectType.VENDING_MACHINE, x: 19, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.VENDING_MACHINE, x: 21, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 23, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 17, y: 13 });

  placeNpc(tiles, npcs, { id: 'shopping_owner_01', type: NpcType.SHOPKEEPER, x: 19, y: 8, name: '店主', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'shopping_customer_01', type: NpcType.CUSTOMER, x: 8, y: 8, name: '買い物客', facing: 'right' });
  placeNpc(tiles, npcs, { id: 'shopping_customer_02', type: NpcType.CUSTOMER, x: 20, y: 14, name: '買い物客', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'shopping_visitor_01', type: NpcType.VILLAGER, x: 5, y: 5, name: '通りすがりの住人', facing: 'down' });

  defineExit(exits, {
    x: 0, y: 9, w: 2, h: 3,
    target: 'residential', targetX: 27, targetY: 10,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 9, w: 2, h: 3,
    target: 'plaza', targetX: 2, targetY: 10,
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
