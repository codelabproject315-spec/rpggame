import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

// マップサイズの共通規約: 46x30。中央十字の道は縦x22-24(3マス幅)/横y14-16(3マス幅)。
// 出口の着地点規約: 北から入る=(23,2) 南から入る=(23,27) 西から入る=(2,15) 東から入る=(43,15)
const WIDTH = 46;
const HEIGHT = 30;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 敷地の境界を軽い森で囲む（南側の出口だけ空ける）
  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 22, 29, 3, 1, TileType.ROAD); // 南の出口部分だけ道にする

  // 玄関から南の出口までの通路 + 前庭の広場
  fillRect(tiles, 22, 12, 3, 17, TileType.ROAD);
  fillRect(tiles, 15, 17, 16, 5, TileType.ROAD); // 前庭の広場

  // 裏道: 前庭から池のわきを通って南の道に合流するループ路
  fillRect(tiles, 6, 19, 10, 2, TileType.ROAD);
  fillRect(tiles, 6, 19, 2, 8, TileType.ROAD);
  fillRect(tiles, 6, 25, 18, 2, TileType.ROAD);

  // 生垣で囲まれた花の庭（左右対称、入口は1か所だけ）
  fillRect(tiles, 8, 5, 10, 8, TileType.FOREST);
  fillRect(tiles, 10, 7, 6, 4, TileType.FLOWER);
  fillRect(tiles, 12, 12, 2, 1, TileType.GRASS); // 入口の隙間

  fillRect(tiles, 28, 5, 10, 8, TileType.FOREST);
  fillRect(tiles, 30, 7, 6, 4, TileType.FLOWER);
  fillRect(tiles, 32, 12, 2, 1, TileType.GRASS); // 入口の隙間

  // 裏庭の池（裏道に沿うように配置）
  fillRect(tiles, 9, 21, 6, 4, TileType.RIVER);
  setPoints(tiles, [[16, 22], [8, 24]], TileType.ROCK);

  // 反対側に点在する庭木
  setPoints(tiles, [[31, 21], [36, 24], [33, 26], [40, 26], [37, 15]], TileType.TREE);

  // 主人公の家
  placeBuilding(tiles, buildings, {
    type: BuildingType.HOME,
    x: 18, y: 4, w: 10, h: 8,
    name: '主人公の家',
  });

  // オブジェクト
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 16, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 29, y: 13 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 30, y: 16 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 13, y: 16 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 18, y: 19 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 27, y: 19 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 16, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 30, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 23, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 7, y: 20 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 12, y: 26 });

  // 家族NPC
  placeNpc(tiles, npcs, {
    id: 'home_family_01', type: NpcType.FAMILY,
    x: 23, y: 13, name: '母', facing: 'down',
  });

  // 出口: 南 -> 住宅街
  defineExit(exits, {
    x: 22, y: 28, w: 3, h: 2,
    target: 'residential', targetX: 23, targetY: 2,
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
    playerStart: { x: 23, y: 14 },
  };
}

export default build();
