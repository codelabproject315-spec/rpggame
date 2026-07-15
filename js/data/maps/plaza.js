import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect } from '../../utils/grid.js';
import { placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 町の中心ハブ: 北=図書館, 南=神社, 東=学校, 西=商店街
  fillRect(tiles, 14, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 9, WIDTH, 3, TileType.ROAD);
  // 中央の広場スペース（道を太くする）
  fillRect(tiles, 11, 7, 9, 7, TileType.ROAD);

  // 広場の設置物（4隅の街灯 + 掲示板 + ベンチ + 花壇）
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 15, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 12, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 12, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 13, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 17, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 15, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 20, y: 10 });

  // 広場は人の行き交うハブなのでNPCを多めに配置
  placeNpc(tiles, npcs, { id: 'plaza_npc_01', type: NpcType.STUDENT, x: 13, y: 9, name: '下校中の生徒', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_02', type: NpcType.CUSTOMER, x: 17, y: 9, name: '買い物帰りの住人', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'plaza_npc_03', type: NpcType.VILLAGER, x: 15, y: 13, name: '散歩中の住人', facing: 'up' });

  defineExit(exits, {
    x: 14, y: 0, w: 3, h: 2,
    target: 'library', targetX: 15, targetY: 17,
  });
  defineExit(exits, {
    x: 14, y: HEIGHT - 2, w: 3, h: 2,
    target: 'shrine', targetX: 15, targetY: 2,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 9, w: 2, h: 3,
    target: 'school', targetX: 2, targetY: 10,
  });
  defineExit(exits, {
    x: 0, y: 9, w: 2, h: 3,
    target: 'shopping', targetX: 27, targetY: 10,
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
