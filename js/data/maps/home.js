import { TileType } from '../tileTypes.js';
import { BuildingType } from '../buildingTypes.js';
import { ObjectType } from '../objectTypes.js';
import { NpcType } from '../npcTypes.js';
import { createGrid, fillRect, setPoints, setBorder } from '../../utils/grid.js';
import { placeBuilding, placeObject, placeNpc, defineExit } from '../mapHelpers.js';

// マップサイズの共通規約: 64x42。中央十字の道は縦x31-33(3マス幅)/横y20-22(3マス幅)。
// 出口の着地点規約: 北から入る=(32,2) 南から入る=(32,39) 西から入る=(2,21) 東から入る=(61,21)
const WIDTH = 64;
const HEIGHT = 42;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.GRASS);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 敷地の境界を軽い森で囲む（南側の出口だけ空ける）
  setBorder(tiles, TileType.TREE, 1);
  fillRect(tiles, 31, 41, 3, 1, TileType.ROAD); // 南の出口部分だけ道にする

  // 玄関から南の出口までの通路 + 前庭の広場
  fillRect(tiles, 31, 17, 3, 24, TileType.ROAD);
  fillRect(tiles, 21, 24, 22, 7, TileType.ROAD); // 前庭の広場

  // 裏道: 前庭から池のわきを通って南の道に合流するループ路
  fillRect(tiles, 9, 27, 14, 2, TileType.ROAD);
  fillRect(tiles, 9, 27, 2, 12, TileType.ROAD);
  fillRect(tiles, 9, 37, 26, 2, TileType.ROAD);

  // 生垣で囲まれた花の庭（左右対称、入口は1か所だけ）
  fillRect(tiles, 11, 7, 13, 10, TileType.FOREST);
  fillRect(tiles, 14, 10, 7, 4, TileType.FLOWER);
  fillRect(tiles, 17, 16, 2, 1, TileType.GRASS); // 入口の隙間

  fillRect(tiles, 40, 7, 13, 10, TileType.FOREST);
  fillRect(tiles, 43, 10, 7, 4, TileType.FLOWER);
  fillRect(tiles, 45, 16, 2, 1, TileType.GRASS); // 入口の隙間

  // 裏庭の池（裏道に沿うように配置）
  fillRect(tiles, 13, 29, 9, 6, TileType.RIVER);
  setPoints(tiles, [[22, 31], [11, 33]], TileType.ROCK);

  // 反対側に点在する庭木
  setPoints(tiles, [[44, 29], [50, 33], [46, 36], [55, 36], [51, 21]], TileType.TREE);

  // 主人公の家
  placeBuilding(tiles, buildings, {
    type: BuildingType.HOME,
    x: 25, y: 6, w: 14, h: 11,
    name: '主人公の家',
  });

  // オブジェクト
  placeObject(tiles, objects, { type: ObjectType.MAILBOX, x: 22, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 41, y: 18 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 42, y: 22 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 18, y: 22 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 25, y: 27 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 38, y: 27 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 22, y: 25 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 42, y: 25 });
  placeObject(tiles, objects, { type: ObjectType.FLOWER_BED, x: 32, y: 28 });
  placeObject(tiles, objects, { type: ObjectType.STREETLIGHT, x: 10, y: 28 });
  placeObject(tiles, objects, { type: ObjectType.BENCH, x: 17, y: 36 });
  placeObject(tiles, objects, { type: ObjectType.SPARKLE, x: 15, y: 12 }); // 隠しアイテム: 小さい頃のお守り

  // 家族NPC
  placeNpc(tiles, npcs, {
    id: 'home_family_01', type: NpcType.FAMILY,
    x: 32, y: 18, name: '母', facing: 'down',
  });

  // 出口: 南 -> 住宅街
  defineExit(exits, {
    x: 31, y: 40, w: 3, h: 2,
    target: 'residential', targetX: 32, targetY: 2,
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
    playerStart: { x: 32, y: 20 },
  };
}

export default build();
