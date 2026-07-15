import { Game } from './core/Game.js';

const container = document.getElementById('game-container');
const game = new Game(container);
game.start();

// デバッグ表示のON/OFFボタン（F1キーと同じ機能）
const debugButton = document.getElementById('debug-toggle');
debugButton.addEventListener('click', () => {
  game.debug = !game.debug;
});
