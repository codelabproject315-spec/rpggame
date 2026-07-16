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

  // 北の出口だけがつながっている行き止まりの公園
  fillRect(tiles, 22, 0, 3, 8, TileType.ROAD); // 入口からの道
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 22, 0, 3, 1, TileType.ROAD); // 北口だけ空ける

  // 花畑をぐるっと囲むように遊歩道を通す
  fillRect(tiles, 5, 16, 15, 9, TileType.FLOWER);
  fillRect(tiles, 27, 16, 13, 9, TileType.FLOWER);
  fillLine(tiles, 5, 16, 5, 24, TileType.ROAD);
  fillLine(tiles, 5, 24, 40, 24, TileType.ROAD);
  fillLine(tiles, 40, 16, 40, 24, TileType.ROAD);

  // 蛇行する小川と橋
  fillLine(tiles, 0, 11, 17, 11, TileType.RIVER);
  fillLine(tiles, 17, 11, 17, 14, TileType.RIVER);
  fillLine(tiles, 17, 14, WIDTH - 1, 14, TileType.RIVER);
  fillRect(tiles, 22, 14, 3, 1, TileType.BRIDGE); // 道と交差する橋

  // 北東の小さな池
  fillRect(tiles, 36, 3, 6, 5, TileType.RIVER);
  setPoints(tiles, [[35, 4]], TileType.ROCK);

  // 花畑に点在する木と岩
  setPoints(tiles, [[9, 17], [14, 20], [33, 17], [38, 20]], TileType.TREE);
  setPoints(tiles, [[18, 18], [31, 21]], TileType.ROCK);

  // 公園ゲート
  placeBuilding(tiles, buildings, {
    type: BuildingType.PARK_GATE,
    x: 20, y: 8, w: 6, h: 3,
    name: '公園',
  });

  // 設置物
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 12, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 30, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 22, y: 22 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 19, y: 22 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 15, y: 24 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 28, y: 24 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 22, y: 26 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 22, y: 18 });

  placeNpc(tiles, npcs, { id: 'park_visitor_01', type: NpcType.PARK_VISITOR, x: 17, y: 21, name: '来園者', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'park_visitor_02', type: NpcType.PARK_VISITOR, x: 27, y: 21, name: '来園者', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'park_visitor_03', type: NpcType.PARK_VISITOR, x: 13, y: 17, name: '来園者', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'park_visitor_04', type: NpcType.PARK_VISITOR, x: 34, y: 5, name: '来園者', facing: 'right' });

  // 隠しNPC: 夜の公園にだけ現れる、星を眺める人
  placeNpc(tiles, npcs, {
    id: 'park_stargazer_01', type: NpcType.MYSTERY,
    x: 23, y: 24, name: '星を眺める人', facing: 'up',
    visibleWhen: 'night',
  });

  defineExit(exits, {
    x: 22, y: 0, w: 3, h: 2,
    target: 'shrine', targetX: 23, targetY: 27,
  });

  return {
    id: 'park',
    name: '公園',
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
