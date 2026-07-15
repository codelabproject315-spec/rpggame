import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { createGrid, fillRect, fillLine, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, reserveNpcSpot, defineExit } from '../mapHelpers.js';

const WIDTH = 30;
const HEIGHT = 20;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcSpawns = [];
  const exits = [];

  // 北の出口だけがつながっている行き止まりの公園
  fillRect(tiles, 14, 0, 3, 5, TileType.ROAD); // 入口からの道
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 14, 0, 3, 1, TileType.ROAD); // 北口だけ空ける

  // 公園らしい花畑と小川
  fillRect(tiles, 4, 10, 10, 6, TileType.FLOWER);
  fillRect(tiles, 18, 10, 8, 6, TileType.FLOWER);
  fillLine(tiles, 0, 8, WIDTH - 1, 8, TileType.RIVER);
  fillRect(tiles, 14, 8, 3, 1, TileType.BRIDGE); // 道と交差する橋

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
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 10, y: 16 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 19, y: 16 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 15, y: 12 });

  reserveNpcSpot(npcSpawns, { id: 'park_visitor_01', x: 12, y: 14, note: '公園の来訪者NPC配置予定' });
  reserveNpcSpot(npcSpawns, { id: 'park_visitor_02', x: 18, y: 14, note: '公園の来訪者NPC配置予定' });

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
    npcSpawns,
    exits,
  };
}

export default build();
