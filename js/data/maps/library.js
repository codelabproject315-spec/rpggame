import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

const WIDTH = 46;
const HEIGHT = 30;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 南の出口だけがつながっている行き止まりの図書館
  fillRect(tiles, 22, 22, 3, 8, TileType.ROAD);
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 22, HEIGHT - 1, 3, 1, TileType.ROAD); // 南口だけ空ける
  fillRect(tiles, 0, 16, 1, 3, TileType.ROAD); // 西口（裏道で商店街へ）

  // 玄関前の広場
  fillRect(tiles, 15, 18, 16, 3, TileType.ROAD);

  // 裏道: 西口から玄関前の広場へ抜ける横道
  fillRect(tiles, 0, 15, 23, 3, TileType.ROAD);

  // 北西: 読書ガーデン
  fillRect(tiles, 4, 4, 9, 8, TileType.FOREST);
  fillRect(tiles, 6, 6, 5, 4, TileType.FLOWER);
  fillRect(tiles, 8, 11, 1, 1, TileType.GRASS); // 入口の隙間

  // 南東: 静かな中庭
  fillRect(tiles, 32, 18, 9, 8, TileType.FOREST);
  fillRect(tiles, 34, 20, 5, 4, TileType.FLOWER);
  fillRect(tiles, 36, 18, 1, 1, TileType.GRASS); // 入口の隙間

  // 並木道
  setPoints(tiles, [[18, 24], [27, 24], [18, 27], [27, 27]], TileType.TREE);

  placeBuilding(tiles, buildings, {
    type: BuildingType.LIBRARY,
    x: 17, y: 6, w: 12, h: 9,
    name: '図書館',
  });

  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 23, y: 17 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 15, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 30, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 14, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 31, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 12, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 29, y: 21 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 41, y: 21 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 19 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 28, y: 19 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 26, y: 19 });
  placeObject(tiles, objects, { type: ObjectType.SPARKLE, x: 7, y: 8 }); // 隠しアイテム: しおり
  placeObject(tiles, objects, { type: ObjectType.THICKET, x: 8, y: 12 }); // 生垣の外の目印

  placeNpc(tiles, npcs, { id: 'library_librarian_01', type: NpcType.LIBRARIAN, x: 23, y: 19, name: '司書', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'library_reader_01', type: NpcType.VILLAGER, x: 31, y: 13, name: '利用者', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'library_reader_02', type: NpcType.VILLAGER, x: 36, y: 21, name: '利用者', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'library_visitor_01', type: NpcType.VILLAGER, x: 8, y: 7, name: '利用者', facing: 'down' });

  // 都市伝説を調べている利用者（他の利用者と見た目で区別できるようにRESEARCHERタイプ）
  placeNpc(tiles, npcs, { id: 'library_researcher_01', type: NpcType.RESEARCHER, x: 36, y: 23, name: '都市伝説を調べる利用者', facing: 'up' });

  defineExit(exits, {
    x: 22, y: HEIGHT - 2, w: 3, h: 2,
    target: 'plaza', targetX: 23, targetY: 2,
  });
  defineExit(exits, {
    x: 0, y: 16, w: 2, h: 3,
    target: 'shopping', targetX: 22, targetY: 2,
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
