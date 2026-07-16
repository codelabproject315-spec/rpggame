// ============================================================
// NPCではない設置物（今回は宝箱）を調べたときの反応データ。
// キーは js/data/maps/*.js で placeObject に渡している
// オブジェクトの type ではなく、マップ上での一意な識別のために
// タイル座標を使う（同じtypeのオブジェクトが複数あっても
// 個別に反応を変えられるようにするため）。
// ============================================================

export const OBJECT_INTERACTIONS = {
  // 森の宝箱（js/data/maps/forest.js の配置座標と対応）
  // 3つの刻印の立て札をすべて見つけるまでは開かず、
  // すべて見つけた後は Game.js が「刻印パズル」のミニゲームを開始する
  // （lines は結果を見た後 Space/Enter で進めた際の挙動を、
  //  minigame フラグで Game.js に伝えるためのもの）。
  'forest:36,15': {
    getResult(state) {
      if (state.hasFlag('foundTreasureChest')) {
        return { speaker: '宝箱', lines: ['空になった宝箱だ。'] };
      }
      const allMarksFound = state.hasFlag('foundMarkStar')
        && state.hasFlag('foundMarkMoon')
        && state.hasFlag('foundMarkSun');
      if (!allMarksFound) {
        return {
          speaker: '宝箱',
          lines: [
            '宝箱には、見慣れない3つの刻印の鍵がかかっている。',
            '森のどこかにある3つの「刻印の立て札」を探して、光る順番を確かめよう。',
          ],
        };
      }
      return {
        speaker: '宝箱',
        lines: ['3つの刻印がそろったようだ。', '刻印を、正しい順番で押してみよう。'],
        minigame: 'treasureLock',
      };
    },
  },

  // 森の各所にある「刻印の立て札」（宝箱を開けるための手がかり）
  'forest:5,15': {
    getResult(state) {
      state.setFlag('foundMarkStar');
      return {
        speaker: '刻印の立て札',
        lines: ['苔むした立て札に、星の刻印が刻まれている。', '「……瞬く星は、最初に光る」と読み取れる。'],
      };
    },
  },
  'forest:23,7': {
    getResult(state) {
      state.setFlag('foundMarkMoon');
      return {
        speaker: '刻印の立て札',
        lines: ['木漏れ日の下の立て札に、月の刻印が刻まれている。', '「……満ちる月は、二番目に光る」と読み取れる。'],
      };
    },
  },
  'forest:39,14': {
    getResult(state) {
      state.setFlag('foundMarkSun');
      return {
        speaker: '刻印の立て札',
        lines: ['宝箱のそばの立て札に、太陽の刻印が刻まれている。', '「……昇る太陽は、最後に光る」と読み取れる。'],
      };
    },
  },
};

/** placeObjectで配置されたオブジェクトから、上のマップのキーを組み立てる */
export function objectInteractionKey(mapId, obj) {
  return `${mapId}:${obj.x},${obj.y}`;
}
