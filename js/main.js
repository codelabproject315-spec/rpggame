import { Game } from './core/Game.js';

const container = document.getElementById('game-container');
const game = new Game(container);
game.start();

// デバッグ表示のON/OFFボタン（F1キーと同じ機能）
const debugButton = document.getElementById('debug-toggle');
debugButton.addEventListener('click', () => {
  game.debug = !game.debug;
});

// 全画面表示の切り替え（ブラウザのFullscreen APIを使用）
const fullscreenButton = document.getElementById('fullscreen-toggle');
fullscreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});
document.addEventListener('fullscreenchange', () => {
  fullscreenButton.textContent = document.fullscreenElement ? '全画面を解除' : '全画面';
});
