import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setBorder } from '../../utils/grid.js';
import { placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 十字の道（北=家, 東=商店街）
  fillRect(tiles, 14, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 9, WIDTH, 3, TileType.ROAD);

  // 南・西は未接続なので森で塞ぐ
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 14, 0, 3, 1, TileType.ROAD); // 北口だけ空ける
  fillRect(tiles, WIDTH - 1, 9, 1, 3, TileType.ROAD); // 東口だけ空ける

  // 住宅街らしい緑地
  fillRect(tiles, 3, 3, 5, 5, TileType.FOREST);
  fillRect(tiles, 22, 13, 5, 5, TileType.FOREST);

  // 道沿いの設置物
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 12, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 19, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 12, y: 14 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 10, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 20, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 17, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 6, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 24, y: 7 });

  // 近所の住人NPC
  placeNpc(tiles, npcs, { id: 'residential_neighbor_01', type: NpcType.VILLAGER, x: 9, y: 12, name: '近所の住人', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'residential_neighbor_02', type: NpcType.VILLAGER, x: 22, y: 8, name: '近所の住人', facing: 'left' });

  defineExit(exits, {
    x: 14, y: 0, w: 3, h: 2,
    target: 'home', targetX: 15, targetY: 17,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 9, w: 2, h: 3,
    target: 'shopping', targetX: 2, targetY: 10,
  });

  return {
    id: 'residential',
    name: '住宅街',
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
