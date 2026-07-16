import { TileType } from '../tileTypes.js';
import { ObjectType } from '../objectTypes.js';
import { createGrid } from '../../utils/grid.js';
import { placeObject, defineExit } from '../mapHelpers.js';

// 蔵の中の迷路。
// 「穴掘り法（recursive backtracker）」でセルグリッドの迷路を自動生成し、
// 壁=CLIFF（岩壁）、床=ROAD（石畳）で表現する。
// セル1つが2タイル幅（部屋1タイル＋壁1タイル）になるようにマッピングしている。
const CELL_COLS = 12;
const CELL_ROWS = 9;
const WIDTH = CELL_COLS * 2 + 1; // 25
const HEIGHT = CELL_ROWS * 2 + 1; // 19

/** セル(cx,cy)の中心タイル座標 */
function cellTile(cx, cy) {
  return [cx * 2 + 1, cy * 2 + 1];
}

/** 穴掘り法で迷路の通路タイル集合を作る。戻り値: { carved: Set<"x,y">, startCx, startCy } */
function generateMaze() {
  const visited = Array.from({ length: CELL_ROWS }, () => Array(CELL_COLS).fill(false));
  const carved = new Set();
  const carve = (x, y) => carved.add(`${x},${y}`);

  const startCx = Math.floor(CELL_COLS / 2);
  const startCy = CELL_ROWS - 1; // 入口は南端中央のセル

  visited[startCy][startCx] = true;
  const [sx, sy] = cellTile(startCx, startCy);
  carve(sx, sy);

  const DIRS = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  const stack = [[startCx, startCy]];

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    const options = [];
    for (const [dx, dy] of DIRS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < CELL_COLS && ny >= 0 && ny < CELL_ROWS && !visited[ny][nx]) {
        options.push([nx, ny, dx, dy]);
      }
    }
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const [nx, ny, dx, dy] = options[Math.floor(Math.random() * options.length)];
    visited[ny][nx] = true;
    const [cxT, cyT] = cellTile(cx, cy);
    const [nxT, nyT] = cellTile(nx, ny);
    carve(cxT + dx, cyT + dy); // セルとセルの間の壁を崩す
    carve(nxT, nyT);
    stack.push([nx, ny]);
  }

  return { carved, startCx, startCy };
}

function build() {
  const tiles = createGrid(WIDTH, HEIGHT, TileType.CLIFF);
  const buildings = [];
  const objects = [];
  const npcs = [];
  const exits = [];

  const { carved, startCx, startCy } = generateMaze();
  for (const key of carved) {
    const [x, y] = key.split(',').map(Number);
    tiles[y][x] = TileType.ROAD;
  }

  // 入口: 南端中央のセルから、外壁まで一直線に通路を伸ばす
  const [enterX, enterY] = cellTile(startCx, startCy);
  for (let y = enterY; y < HEIGHT; y++) tiles[y][enterX] = TileType.ROAD;
  defineExit(exits, {
    x: enterX, y: HEIGHT - 1, w: 1, h: 1,
    target: 'forest', targetX: 9, targetY: 21,
  });

  // ゴール: 北西のセルをお宝部屋にし、外壁までもう1本通路を伸ばして「もう一つの出口」にする
  const [goalX, goalY] = cellTile(0, 0);
  for (let y = goalY; y >= 0; y--) tiles[y][goalX] = TileType.ROAD; // 通路（宝箱でふさがないよう空けておく）
  defineExit(exits, {
    x: goalX, y: 0, w: 1, h: 1,
    target: 'forest', targetX: 9, targetY: 21,
  });

  // 宝箱は、セルとセルをつなぐ壁の上ではなく、外壁側の安全なくぼみに置く
  // （セル同士の壁の上に置くと、迷路の唯一の接続をふさいでしまうことがあるため）
  tiles[goalY][goalX - 1] = TileType.ROAD;
  placeObject(tiles, objects, { type: ObjectType.TREASURE_CHEST, x: goalX - 1, y: goalY });

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
