import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, fillLine, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 十字の道（西=広場, 東=森）
  fillRect(tiles, 14, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 9, WIDTH, 3, TileType.ROAD);

  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 0, 9, 1, 3, TileType.ROAD); // 西口
  fillRect(tiles, WIDTH - 1, 9, 1, 3, TileType.ROAD); // 東口

  // 校庭のトラック（歩けるライン。中は普通の芝生のグラウンド）
  fillLine(tiles, 7, 11, 22, 11, TileType.ROAD);
  fillLine(tiles, 7, 17, 22, 17, TileType.ROAD);
  fillLine(tiles, 7, 11, 7, 17, TileType.ROAD);
  fillLine(tiles, 22, 11, 22, 17, TileType.ROAD);

  // 北西の花壇コーナー
  fillRect(tiles, 3, 11, 4, 4, TileType.FOREST);
  fillRect(tiles, 4, 12, 2, 2, TileType.FLOWER);
  fillRect(tiles, 4, 14, 1, 1, TileType.GRASS); // 入口の隙間

  // 南東のビオトープ（池）
  fillRect(tiles, 25, 11, 3, 3, TileType.RIVER);
  setPoints(tiles, [[24, 12]], TileType.ROCK);

  // 校舎
  placeBuilding(tiles, buildings, {
    type: BuildingType.SCHOOL,
    x: 10, y: 3, w: 10, h: 5,
    name: '学校',
  });

  // 校庭の設置物
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 14, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 8, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 21, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 6, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 23, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 2, y: 15 });

  placeNpc(tiles, npcs, { id: 'school_teacher_01', type: NpcType.TEACHER, x: 15, y: 8, name: '先生', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'school_teacher_02', type: NpcType.TEACHER, x: 18, y: 13, name: '先生', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'school_student_01', type: NpcType.STUDENT, x: 12, y: 13, name: '生徒', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'school_student_02', type: NpcType.STUDENT, x: 20, y: 14, name: '生徒', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'school_student_03', type: NpcType.STUDENT, x: 10, y: 15, name: '生徒', facing: 'right' });

  defineExit(exits, {
    x: 0, y: 9, w: 2, h: 3,
    target: 'plaza', targetX: 27, targetY: 10,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 9, w: 2, h: 3,
    target: 'forest', targetX: 2, targetY: 10,
  });

  return {
    id: 'school',
    name: '学校',
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
