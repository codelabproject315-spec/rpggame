import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { createGrid, fillRect } from '../../utils/grid.js';
import { placeObject, defineExit } from '../mapHelpers.js';

// 蔵の中の迷路。壁=CLIFF（岩壁）、床=ROAD（石畳）で表現し、
// 南の入口から北のお宝部屋まで、ジグザグの通路でつなげている。
const WIDTH = 25;
const HEIGHT = 19;

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.CLIFF);

  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  // 入口からの縦通路（南→中段）
  fillRect(tiles, 10, 13, 3, 6, TileType.ROAD);
  // 中段の横通路（右→左）
  fillRect(tiles, 3, 11, 19, 3, TileType.ROAD);
  // 左側の縦通路（中段→上段）
  fillRect(tiles, 3, 4, 3, 9, TileType.ROAD);
  // 上段の横通路（左→右）
  fillRect(tiles, 3, 2, 19, 3, TileType.ROAD);
  // 右側の縦通路（上段→お宝部屋）
  fillRect(tiles, 19, 0, 3, 4, TileType.ROAD);
  // お宝部屋
  fillRect(tiles, 14, 0, 10, 4, TileType.ROAD);

  // 行き止まりの小部屋を2つ、迷路らしさのために足す
  fillRect(tiles, 6, 6, 3, 4, TileType.ROAD); // 左側の小部屋（左縦通路の途中から）
  fillRect(tiles, 16, 6, 3, 4, TileType.ROAD); // 右側の小部屋（中段通路の途中から）

  // お宝部屋の中央に、迷路クリアのごほうび
  placeObject(tiles, objects, { type: ObjectType.TREASURE_CHEST, x: 18, y: 1 });

  // 南の入口（蔵の入口・森へ戻る）
  defineExit(exits, {
    x: 10, y: HEIGHT - 1, w: 3, h: 1,
    target: 'forest', targetX: 9, targetY: 21,
  });

  return {
    id: 'maze',
    name: '蔵の中の迷路',
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
