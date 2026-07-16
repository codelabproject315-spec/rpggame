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

  // 縦の参道（北=広場, 南=公園）
  fillRect(tiles, 22, 0, 3, HEIGHT, TileType.ROAD);

  // 東西は森と岩で囲む（神社の杜）
  setBorder(tiles, TileType.FOREST, 1);
  fillRect(tiles, 22, 0, 3, 1, TileType.ROAD); // 北口
  fillRect(tiles, 22, HEIGHT - 1, 3, 1, TileType.ROAD); // 南口
  fillRect(tiles, 0, 15, 1, 3, TileType.ROAD); // 西口（裏道で学校へ）

  // 裏道: 西口から参道へ抜ける横道
  fillRect(tiles, 0, 15, 23, 3, TileType.ROAD);

  // 杜（参道の上下、横道より上側に配置）
  fillRect(tiles, 6, 6, 8, 6, TileType.FOREST);
  fillRect(tiles, 32, 6, 8, 6, TileType.FOREST);

  // 神社裏手の鯉が泳ぐ池（左右対称、横道より下側）
  fillRect(tiles, 10, 21, 5, 4, TileType.RIVER);
  fillRect(tiles, 31, 21, 5, 4, TileType.RIVER);
  setPoints(tiles, [[9, 22], [36, 22]], TileType.ROCK);

  placeBuilding(tiles, buildings, {
    type: BuildingType.SHRINE,
    x: 18, y: 9, w: 10, h: 6,
    name: '神社',
  });

  // 参道の灯籠（石灯籠代わりの街灯）と、社の護り岩
  placeObject(tiles, objects, { type: ObjectType.SIGNBOARD, x: 26, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 19, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 27, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 19, y: 3 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 26, y: 3 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 19, y: 24 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 26, y: 24 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 15, y: 23 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 30, y: 23 });
  placeObject(tiles, objects, { type: ObjectType.SPARKLE, x: 23, y: 5 }); // 隠しアイテム: 鈴の欠片

  setPoints(tiles, [[16, 10], [29, 10]], TileType.ROCK); // 参道を護る狛犬代わりの岩
  setPoints(tiles, [[8, 8], [37, 8]], TileType.ROCK); // 杜の中の岩

  placeNpc(tiles, npcs, { id: 'shrine_keeper_01', type: NpcType.SHRINE_KEEPER, x: 23, y: 17, name: '神主', facing: 'down' });
  placeNpc(tiles, npcs, { id: 'shrine_visitor_01', type: NpcType.VILLAGER, x: 20, y: 20, name: '参拝者', facing: 'up' });
  placeNpc(tiles, npcs, { id: 'shrine_visitor_02', type: NpcType.VILLAGER, x: 27, y: 20, name: '参拝者', facing: 'left' });
  placeNpc(tiles, npcs, { id: 'shrine_child_01', type: NpcType.STUDENT, x: 12, y: 16, name: '地元の子ども', facing: 'right' });
  placeNpc(tiles, npcs, { id: 'shrine_cat_01', type: NpcType.CAT, x: 12, y: 20, name: '三毛猫', facing: 'down' });

  defineExit(exits, {
    x: 22, y: 0, w: 3, h: 2,
    target: 'plaza', targetX: 23, targetY: 27,
  });
  defineExit(exits, {
    x: 22, y: HEIGHT - 2, w: 3, h: 2,
    target: 'park', targetX: 23, targetY: 2,
  });
  defineExit(exits, {
    x: 0, y: 15, w: 2, h: 3,
    target: 'school', targetX: 43, targetY: 15,
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
