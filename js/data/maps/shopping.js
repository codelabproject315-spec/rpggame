import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setBorder } from '../../utils/grid.js';
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

  placeNpc(tiles, npcs, { id: 'shopping_owner_01', type: NpcType.SHOPKEEPER, x: 19, y: 8, name: '店主', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'shopping_customer_01', type: NpcType.CUSTOMER, x: 8, y: 8, name: '買い物客', facing: 'right' });

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
