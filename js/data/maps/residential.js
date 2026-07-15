import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setBorder } from '../../utils/grid.js';
import { placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 46;
const HEIGHT = 30;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 十字の道（北=家, 東=商店街）※横の道はもともと地図の端まで通っている
  fillRect(tiles, 22, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 14, WIDTH, 3, TileType.ROAD);

  // 外周は森で塞ぎ、必要な出口だけ開ける
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 22, 0, 3, 1, TileType.ROAD); // 北口（家）
  fillRect(tiles, WIDTH - 1, 14, 1, 3, TileType.ROAD); // 東口（商店街）
  fillRect(tiles, 0, 14, 1, 3, TileType.ROAD); // 西口（裏道で広場へ）

  // 裏道: 西口から南西の広場を通って北の庭へ抜けるショートカット
  fillRect(tiles, 2, 12, 2, 9, TileType.ROAD);

  // 北西: 生垣で囲まれた庭のある家
  fillRect(tiles, 5, 3, 11, 8, TileType.FOREST);
  fillRect(tiles, 7, 5, 7, 4, TileType.FLOWER);
  fillRect(tiles, 10, 11, 2, 1, TileType.GRASS); // 入口の隙間

  // 南東: もう一軒の庭
  fillRect(tiles, 31, 18, 11, 9, TileType.FOREST);
  fillRect(tiles, 33, 20, 7, 5, TileType.FLOWER);
  fillRect(tiles, 35, 18, 2, 1, TileType.GRASS); // 入口の隙間

  // 北東: 小さな池のある一角
  fillRect(tiles, 36, 3, 6, 5, TileType.RIVER);

  // 南西: 行き止まりの小さな広場（裏道でつながる）
  fillRect(tiles, 4, 21, 11, 6, TileType.ROAD);

  // 道沿いの設置物
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 9 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 29, y: 9 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 21 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 15, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 31, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 27, y: 19 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 9, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 37, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 16, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 42, y: 21 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 30, y: 23 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 6, y: 27 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 12, y: 27 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 5, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.WELL, x: 20, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.TRASH_CAN, x: 16, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.TRASH_CAN, x: 30, y: 16 });
  placeObject(tiles, objects, { type: ObjectType.FENCE, x: 16, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.FENCE, x: 17, y: 13 });

  // 近所の住人NPC
  placeNpc(tiles, npcs, { id: 'residential_neighbor_01', type: NpcType.VILLAGER, x: 13, y: 18, name: '近所の住人', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'residential_neighbor_02', type: NpcType.VILLAGER, x: 33, y: 12, name: '近所の住人', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'residential_neighbor_03', type: NpcType.VILLAGER, x: 9, y: 24, name: '近所の住人', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'residential_neighbor_04', type: NpcType.VILLAGER, x: 34, y: 6, name: '近所の住人', facing: 'left' });

  defineExit(exits, {
    x: 22, y: 0, w: 3, h: 2,
    target: 'home', targetX: 23, targetY: 27,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 14, w: 2, h: 3,
    target: 'shopping', targetX: 2, targetY: 15,
  });
  defineExit(exits, {
    x: 0, y: 14, w: 2, h: 3,
    target: 'plaza', targetX: 2, targetY: 5,
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
