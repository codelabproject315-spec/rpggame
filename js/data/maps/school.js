import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { createGrid, fillRect, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, reserveNpcSpot, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcSpawns = [];
  const exits = [];

  // 十字の道（西=広場, 東=森）
  fillRect(tiles, 14, 0, 3, HEIGHT, TileType.ROAD);
  fillRect(tiles, 0, 9, WIDTH, 3, TileType.ROAD);

  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 0, 9, 1, 3, TileType.ROAD); // 西口
  fillRect(tiles, WIDTH - 1, 9, 1, 3, TileType.ROAD); // 東口

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

  reserveNpcSpot(npcSpawns, { id: 'school_teacher_01', x: 15, y: 8, note: '先生NPC配置予定' });
  reserveNpcSpot(npcSpawns, { id: 'school_student_01', x: 12, y: 13, note: '生徒NPC配置予定' });

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
    npcSpawns,
    exits,
  };
}

export default build();
