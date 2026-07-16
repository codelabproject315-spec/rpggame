// ============================================================
// マップ登録簿
// ------------------------------------------------------------
// 新しいエリアを追加する手順:
//   1. js/data/maps/新マップ.js を作成する（他のファイルを参考に）
//   2. 下記に import 文と MAPS への登録を1行ずつ追加する
// これだけで MapManager が自動的に読み込めるようになる。
// ============================================================

import home from './home.js';
import residential from './residential.js';
import shopping from './shopping.js';
import school from './school.js';
import park from './park.js';
import library from './library.js';
import shrine from './shrine.js';
import forest from './forest.js';
import plaza from './plaza.js';
import maze from './maze.js';

export const MAPS = {
  [home.id]: home,
  [residential.id]: residential,
  [shopping.id]: shopping,
  [school.id]: school,
  [park.id]: park,
  [library.id]: library,
  [shrine.id]: shrine,
  [forest.id]: forest,
  [plaza.id]: plaza,
  [maze.id]: maze,
};

export const START_MAP_ID = 'home';
