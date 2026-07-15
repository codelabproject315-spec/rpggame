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

  // 敷地の境界を軽い森で囲む（南側の出口だけ空ける）
  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 13, 19, 4, 1, TileType.ROAD); // 南の出口部分だけ道にする

  // 庭から南の出口までの通路
  fillRect(tiles, 14, 8, 3, 12, TileType.ROAD);

  // 花壇まわりの装飾
  fillRect(tiles, 6, 3, 6, 5, TileType.FOREST);
  fillRect(tiles, 20, 3, 6, 5, TileType.FOREST);
  setPoints(
    tiles,
    [
      [10, 6], [11, 6], [10, 7],
      [21, 6], [22, 6], [21, 7],
    ],
    TileType.FLOWER
  );

  // 主人公の家
  placeBuilding(tiles, buildings, {
    type: BuildingType.HOME,
    x: 12, y: 3, w: 6, h: 5,
    name: '主人公の家',
  });

  // オブジェクト
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 11, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 18, y: 8 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 20, y: 10 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 9, y: 10 });

  // 家族NPC
  placeNpc(tiles, npcs, {
    id: 'home_family_01', type: NpcType.FAMILY,
    x: 15, y: 9, name: '母', facing: 'down',
  });

  // 出口: 南 -> 住宅街
  defineExit(exits, {
    x: 14, y: 18, w: 3, h: 2,
    target: 'residential', targetX: 15, targetY: 2,
  });

  return {
    id: 'home',
    name: '主人公の家',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    buildings,
    objects,
    npcs,
    exits,
    playerStart: { x: 15, y: 10 },
  };
}

export default build();
