import { Game } from './core/Game.js';

const canvas = document.getElementById('game-canvas');
const game = new Game(canvas);
game.start();

// デバッグ表示のON/OFFボタン（F1キーと同じ機能）
const debugButton = document.getElementById('debug-toggle');
debugButton.addEventListener('click', () => {
  game.debug = !game.debug;
});
