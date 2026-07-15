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

  // 縦の参道（北=広場, 南=公園）
  fillRect(tiles, 14, 0, 3, HEIGHT, TileType.ROAD);

  // 東西は森と岩で囲む（神社の杜）
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 14, 0, 3, 1, TileType.ROAD); // 北口
  fillRect(tiles, 14, HEIGHT - 1, 3, 1, TileType.ROAD); // 南口
  fillRect(tiles, 4, 8, 5, 4, TileType.FOREST);
  fillRect(tiles, 21, 8, 5, 4, TileType.FOREST);

  placeBuilding(tiles, buildings, {
    type: BuildingType.SHRINE,
    x: 12, y: 6, w: 6, h: 4,
    name: '神社',
  });

  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 15, y: 11 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 12, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 17, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 10, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 19, y: 15 });

  reserveNpcSpot(npcSpawns, { id: 'shrine_keeper_01', x: 15, y: 8, note: '神主NPC配置予定' });

  defineExit(exits, {
    x: 14, y: 0, w: 3, h: 2,
    target: 'plaza', targetX: 15, targetY: 17,
  });
  defineExit(exits, {
    x: 14, y: HEIGHT - 2, w: 3, h: 2,
    target: 'park', targetX: 15, targetY: 2,
  });

  return {
    id: 'shrine',
    name: '神社',
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
