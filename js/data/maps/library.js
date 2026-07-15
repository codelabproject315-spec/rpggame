import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 南の出口だけがつながっている行き止まりの図書館
  fillRect(tiles, 14, 15, 3, 5, TileType.ROAD);
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 14, HEIGHT - 1, 3, 1, TileType.ROAD); // 南口だけ空ける

  // 玄関前の小さな広場
  fillRect(tiles, 10, 12, 10, 2, TileType.ROAD);

  // 北西: 読書ガーデン
  fillRect(tiles, 2, 3, 6, 5, TileType.FOREST);
  fillRect(tiles, 3, 4, 4, 3, TileType.FLOWER);
  fillRect(tiles, 4, 7, 1, 1, TileType.GRASS); // 入口の隙間

  // 南東: 静かな中庭
  fillRect(tiles, 21, 12, 6, 5, TileType.FOREST);
  fillRect(tiles, 22, 13, 4, 3, TileType.FLOWER);
  fillRect(tiles, 23, 12, 1, 1, TileType.GRASS); // 入口の隙間

  // 並木道
  setPoints(tiles, [[12, 16], [18, 16], [12, 18], [18, 18]], TileType.TREE);

  placeBuilding(tiles, buildings, {
    type: BuildingType.LIBRARY,
    x: 11, y: 5, w: 8, h: 6,
    name: '図書館',
  });

  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 15, y: 11 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 10, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 20, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 9, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 20, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 8, y: 6 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 19, y: 14 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 27, y: 14 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 12, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 17, y: 12 });

  placeNpc(tiles, npcs, { id: 'library_librarian_01', type: NpcType.LIBRARIAN, x: 15, y: 12, name: '司書', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'library_reader_01', type: NpcType.VILLAGER, x: 20, y: 9, name: '利用者', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'library_reader_02', type: NpcType.VILLAGER, x: 24, y: 14, name: '利用者', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'library_visitor_01', type: NpcType.VILLAGER, x: 5, y: 5, name: '利用者', facing: 'down' });

  defineExit(exits, {
    x: 14, y: HEIGHT - 2, w: 3, h: 2,
    target: 'plaza', targetX: 15, targetY: 2,
  });

  return {
    id: 'library',
    name: '図書館',
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
