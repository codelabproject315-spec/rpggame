import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setBorder } from '../../utils/grid.js';
import { placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 64;
const HEIGHT = 42;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 十字の道（北=家, 東=商店街）※横の道はもともと地図の端まで通っている
  fillRect(tiles, 31, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 20, WIDTH, 3, TileType.ROAD);

  // 外周は森で塞ぎ、必要な出口だけ開ける
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 31, 0, 3, 1, TileType.ROAD); // 北口（家）
  fillRect(tiles, WIDTH - 1, 20, 1, 3, TileType.ROAD); // 東口（商店街）
  fillRect(tiles, 0, 20, 1, 3, TileType.ROAD); // 西口（裏道で広場へ）

  // 裏道: 西口から南西の広場を通って北の庭へ抜けるショートカット
  fillRect(tiles, 3, 17, 2, 13, TileType.ROAD);

  // 北西: 生垣で囲まれた庭のある家
  fillRect(tiles, 7, 4, 15, 11, TileType.FOREST);
  fillRect(tiles, 10, 7, 9, 5, TileType.FLOWER);
  fillRect(tiles, 14, 15, 2, 1, TileType.GRASS); // 入口の隙間

  // 南東: もう一軒の庭
  fillRect(tiles, 43, 25, 15, 12, TileType.FOREST);
  fillRect(tiles, 46, 28, 9, 6, TileType.FLOWER);
  fillRect(tiles, 49, 25, 2, 1, TileType.GRASS); // 入口の隙間

  // 北東: 小さな池のある一角
  fillRect(tiles, 50, 4, 8, 7, TileType.RIVER);

  // 南西: 行き止まりの小さな広場（裏道でつながる）
  fillRect(tiles, 5, 29, 15, 8, TileType.ROAD);

  // 道沿いの設置物
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 25, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 40, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 25, y: 29 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 21, y: 21 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 43, y: 21 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 38, y: 27 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 13, y: 25 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 52, y: 14 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 22, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 58, y: 29 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 42, y: 32 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 9, y: 37 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 17, y: 37 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 7, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.SPARKLE, x: 50, y: 30 }); // 隠しアイテム: 瓶に入った手紙
  placeObject(tiles, objects, { type: ObjectType.THICKET, x: 49, y: 24 }); // 生垣の外の目印

  // 近所の住人NPC
  placeNpc(tiles, npcs, { id: 'residential_neighbor_01', type: NpcType.VILLAGER, x: 18, y: 25, name: '近所の住人', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'residential_neighbor_02', type: NpcType.VILLAGER, x: 46, y: 17, name: '近所の住人', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'residential_neighbor_03', type: NpcType.VILLAGER, x: 12, y: 33, name: '近所の住人', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'residential_neighbor_04', type: NpcType.VILLAGER, x: 47, y: 8, name: '近所の住人', facing: 'left' });

  // おばあちゃん（母から本を受け取る役、仲良くなると図書館への本の話をしてくれる）
  placeNpc(tiles, npcs, { id: 'residential_grandma_01', type: NpcType.ELDER, x: 24, y: 33, name: 'おばあちゃん', facing: 'up' });

  // 隠しNPC: 雨の日にだけ現れる、謎の人物
  placeNpc(tiles, npcs, {
    id: 'residential_mystery_01', type: NpcType.MYSTERY_RAIN,
    x: 17, y: 33, name: '雨宿りの人影', facing: 'down',
    visibleWhen: 'rain',
  });

  defineExit(exits, {
    x: 31, y: 0, w: 3, h: 2,
    target: 'home', targetX: 32, targetY: 39,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 20, w: 2, h: 3,
    target: 'shopping', targetX: 2, targetY: 21,
  });
  defineExit(exits, {
    x: 0, y: 20, w: 2, h: 3,
    target: 'plaza', targetX: 2, targetY: 7,
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
