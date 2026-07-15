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

  // 縦の参道（北=広場, 南=公園）
  fillRect(tiles, 14, 0, 3, HEIGHT, TileType.ROAD);

  // 東西は森と岩で囲む（神社の杜）
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 14, 0, 3, 1, TileType.ROAD); // 北口
  fillRect(tiles, 14, HEIGHT - 1, 3, 1, TileType.ROAD); // 南口
  fillRect(tiles, 4, 8, 5, 4, TileType.FOREST);
  fillRect(tiles, 21, 8, 5, 4, TileType.FOREST);

  // 杜の中に小さな参拝路の切れ間を作る
  fillRect(tiles, 5, 9, 2, 1, TileType.GRASS);
  fillRect(tiles, 23, 9, 2, 1, TileType.GRASS);

  // 神社裏手の鯉が泳ぐ池（左右対称）
  fillRect(tiles, 7, 14, 3, 3, TileType.RIVER);
  fillRect(tiles, 20, 14, 3, 3, TileType.RIVER);
  setPoints(tiles, [[6, 15], [23, 15]], TileType.ROCK);

  placeBuilding(tiles, buildings, {
    type: BuildingType.SHRINE,
    x: 12, y: 6, w: 6, h: 4,
    name: '神社',
  });

  // 参道の灯籠（石灯籠代わりの街灯）と、社の護り岩
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 15, y: 11 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 12, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 17, y: 12 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 13, y: 3 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 17, y: 3 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 13, y: 14 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 17, y: 14 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 10, y: 15 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 19, y: 15 });

  setPoints(tiles, [[11, 9], [18, 9]], TileType.ROCK); // 参道を護る狛犬代わりの岩
  setPoints(tiles, [[7, 10], [22, 10]], TileType.ROCK); // 杜の中の岩

  placeNpc(tiles, npcs, { id: 'shrine_keeper_01', type: NpcType.SHRINE_KEEPER, x: 15, y: 10, name: '神主', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'shrine_visitor_01', type: NpcType.VILLAGER, x: 13, y: 13, name: '参拝者', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'shrine_visitor_02', type: NpcType.VILLAGER, x: 18, y: 13, name: '参拝者', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'shrine_child_01', type: NpcType.STUDENT, x: 12, y: 13, name: '地元の子ども', facing: 'right' });

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
    npcs,
    exits,
  };
}

export default build();
