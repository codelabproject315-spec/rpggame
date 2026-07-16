import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, fillLine, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 46;
const HEIGHT = 30;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 十字の道（西=広場, 東=森）※縦の道はもともと地図の端まで通っている
  fillRect(tiles, 22, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 14, WIDTH, 3, TileType.ROAD);

  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 0, 14, 1, 3, TileType.ROAD); // 西口
  fillRect(tiles, WIDTH - 1, 14, 1, 3, TileType.ROAD); // 東口
  fillRect(tiles, 22, HEIGHT - 1, 3, 1, TileType.ROAD); // 南口（裏道で神社へ）

  // 校庭のトラック（歩けるライン。中は普通の芝生のグラウンド）
  fillLine(tiles, 10, 18, 36, 18, TileType.ROAD);
  fillLine(tiles, 10, 26, 36, 26, TileType.ROAD);
  fillLine(tiles, 10, 18, 10, 26, TileType.ROAD);
  fillLine(tiles, 36, 18, 36, 26, TileType.ROAD);
  // トラックを横切る近道
  fillRect(tiles, 10, 22, 26, 1, TileType.ROAD);

  // 北西の花壇コーナー
  fillRect(tiles, 4, 18, 6, 6, TileType.FOREST);
  fillRect(tiles, 6, 20, 2, 2, TileType.FLOWER);
  fillRect(tiles, 6, 23, 1, 1, TileType.GRASS); // 入口の隙間

  // 南東のビオトープ（池）
  fillRect(tiles, 38, 18, 5, 5, TileType.RIVER);
  setPoints(tiles, [[37, 20]], TileType.ROCK);

  // 校舎
  placeBuilding(tiles, buildings, {
    type: BuildingType.SCHOOL,
    x: 16, y: 4, w: 15, h: 8,
    name: '学校',
  });

  // 校庭の設置物
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 22, y: 14 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 12, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 34, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 9, y: 9 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 36, y: 9 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 3, y: 24 });

  placeNpc(tiles, npcs, { id: 'school_teacher_01', type: NpcType.TEACHER, x: 23, y: 13, name: '先生', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'school_teacher_02', type: NpcType.TEACHER, x: 29, y: 20, name: '先生', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'school_student_01', type: NpcType.STUDENT, x: 18, y: 20, name: '生徒', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'school_student_02', type: NpcType.STUDENT, x: 32, y: 24, name: '生徒', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'school_student_03', type: NpcType.STUDENT, x: 15, y: 25, name: '生徒', facing: 'right' });

  defineExit(exits, {
    x: 0, y: 14, w: 2, h: 3,
    target: 'plaza', targetX: 43, targetY: 15,
  });
  defineExit(exits, {
    x: WIDTH - 2, y: 14, w: 2, h: 3,
    target: 'forest', targetX: 2, targetY: 15,
  });
  defineExit(exits, {
    x: 22, y: HEIGHT - 2, w: 3, h: 2,
    target: 'shrine', targetX: 2, targetY: 16,
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
