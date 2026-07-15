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

  // 北の出口だけがつながっている行き止まりの公園
  fillRect(tiles, 14, 0, 3, 5, TileType.ROAD); // 入口からの道
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 14, 0, 3, 1, TileType.ROAD); // 北口だけ空ける

  // 公園らしい花畑
  fillRect(tiles, 4, 10, 10, 6, TileType.FLOWER);
  fillRect(tiles, 18, 10, 8, 6, TileType.FLOWER);

  // 蛇行する小川と橋
  fillLine(tiles, 0, 7, 11, 7, TileType.RIVER);
  fillLine(tiles, 11, 7, 11, 9, TileType.RIVER);
  fillLine(tiles, 11, 9, WIDTH - 1, 9, TileType.RIVER);
  fillRect(tiles, 14, 9, 3, 1, TileType.BRIDGE); // 道と交差する橋

  // 北東の小さな池
  fillRect(tiles, 24, 2, 4, 3, TileType.RIVER);
  setPoints(tiles, [[23, 3]], TileType.ROCK);

  // 花畑に点在する木と岩
  setPoints(tiles, [[6, 11], [9, 13], [22, 11], [25, 13]], TileType.TREE);
  setPoints(tiles, [[12, 12], [21, 14]], TileType.ROCK);

  // 公園ゲート
  placeBuilding(tiles, buildings, {
    type: BuildingType.PARK_GATE,
    x: 13, y: 5, w: 4, h: 2,
    name: '公園',
  });

  // 設置物
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 8, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 20, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 15, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 13, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 10, y: 16 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 19, y: 16 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 15, y: 17 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 15, y: 12 });

  placeNpc(tiles, npcs, { id: 'park_visitor_01', type: NpcType.PARK_VISITOR, x: 12, y: 14, name: '来園者', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'park_visitor_02', type: NpcType.PARK_VISITOR, x: 18, y: 14, name: '来園者', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'park_visitor_03', type: NpcType.PARK_VISITOR, x: 9, y: 11, name: '来園者', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'park_visitor_04', type: NpcType.PARK_VISITOR, x: 23, y: 4, name: '来園者', facing: 'right' });

  defineExit(exits, {
    x: 14, y: 0, w: 3, h: 2,
    target: 'shrine', targetX: 15, targetY: 17,
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
