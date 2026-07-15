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

  // 南の出口だけがつながっている行き止まりの図書館
  fillRect(tiles, 14, 15, 3, 5, TileType.ROAD);
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 14, HEIGHT - 1, 3, 1, TileType.ROAD); // 南口だけ空ける

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

  reserveNpcSpot(npcSpawns, { id: 'library_librarian_01', x: 15, y: 12, note: '司書NPC配置予定' });

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
    npcSpawns,
    exits,
  };
}

export default build();
