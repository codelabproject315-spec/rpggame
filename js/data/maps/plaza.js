import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect } from '../../utils/grid.js';
import { placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 46;
const HEIGHT = 30;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 町の中心ハブ: 北=図書館, 南=神社, 東=学校, 西=商店街
  fillRect(tiles, 22, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 14, WIDTH, 3, TileType.ROAD);
  // 中央の広場スペース（道を太くする）
  fillRect(tiles, 16, 10, 14, 10, TileType.ROAD);

  // 裏道: 北西の出口(住宅街への近道)から中央広場へ抜ける道
  fillRect(tiles, 0, 4, 10, 3, TileType.ROAD);
  fillRect(tiles, 8, 4, 3, 11, TileType.ROAD);

  // 四隅の小さな庭園（生垣で囲む。北西だけ裏道を避けて内側に寄せる）
  fillRect(tiles, 12, 3, 8, 6, TileType.FOREST);
  fillRect(tiles, 14, 5, 4, 3, TileType.FLOWER);
  fillRect(tiles, 15, 8, 1, 1, TileType.GRASS);

  fillRect(tiles, 34, 3, 8, 6, TileType.FOREST);
  fillRect(tiles, 36, 5, 4, 3, TileType.FLOWER);
  fillRect(tiles, 37, 8, 1, 1, TileType.GRASS);

  fillRect(tiles, 4, 21, 8, 6, TileType.FOREST);
  fillRect(tiles, 6, 23, 4, 3, TileType.FLOWER);
  fillRect(tiles, 7, 21, 1, 1, TileType.GRASS);

  fillRect(tiles, 34, 21, 8, 6, TileType.FOREST);
  fillRect(tiles, 36, 23, 4, 3, TileType.FLOWER);
  fillRect(tiles, 37, 21, 1, 1, TileType.GRASS);

  // 広場の設置物（4隅の街灯 + 掲示板 + ベンチ + 花壇）
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 23, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 27, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 17 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 27, y: 17 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 20, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 25, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 23, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 30, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 16, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 40, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 12, y: 23 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 32, y: 23 });
  placeObject(tiles, objects, { type: ObjectType.SPARKLE, x: 16, y: 7 }); // 隠しアイテム: 町内会の記念コイン

  // 広場は人の行き交うハブなのでNPCを多めに配置
  placeNpc(tiles, npcs, { id: 'plaza_npc_01', type: NpcType.STUDENT, x: 20, y: 13, name: '下校中の生徒', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_02', type: NpcType.CUSTOMER, x: 26, y: 13, name: '買い物帰りの住人', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_03', type: NpcType.VILLAGER, x: 23, y: 19, name: '散歩中の住人', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_04', type: NpcType.VILLAGER, x: 16, y: 6, name: '庭でくつろぐ住人', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_05', type: NpcType.STUDENT, x: 39, y: 6, name: '庭でくつろぐ生徒', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_06', type: NpcType.CUSTOMER, x: 7, y: 24, name: '庭でくつろぐ住人', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_07', type: NpcType.VILLAGER, x: 37, y: 24, name: '庭でくつろぐ住人', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_08', type: NpcType.VILLAGER, x: 4, y: 5, name: '裏道の住人', facing: 'down' });

  defineExit(exits, {
    x: 22, y: 0, w: 3, h: 2,
    target: 'library', targetX: 23, targetY: 27,
  });
  defineExit(exits, {
    x: 22, y: HEIGHT - 2, w: 3, h: 2,
    target: 'shrine', targetX: 23, targetY: 2,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 14, w: 2, h: 3,
    target: 'school', targetX: 2, targetY: 15,
  });
  defineExit(exits, {
    x: 0, y: 14, w: 2, h: 3,
    target: 'shopping', targetX: 43, targetY: 15,
  });
  defineExit(exits, {
    x: 0, y: 4, w: 2, h: 3,
    target: 'residential', targetX: 2, targetY: 15,
  });

  return {
    id: 'plaza',
    name: '広場',
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
