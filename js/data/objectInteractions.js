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

  // ---- 隠しアイテム（コレクション要素）: 町中に散らばる、キラキラ光るもの ----
  // 一度拾ってしまえば、その後は「もう何もない」というだけの反応になる。
  'park:10,20': {
    getResult(state) {
      if (state.hasItem('item_clover')) {
        return { speaker: 'キラキラ光るもの', lines: ['もう拾った後のようだ。'] };
      }
      state.collectItem('item_clover');
      return { speaker: 'キラキラ光るもの', lines: ['花畑の中に、四つ葉のクローバーを見つけた!'] };
    },
  },
  'shrine:23,5': {
    getResult(state) {
      if (state.hasItem('item_bell')) {
        return { speaker: 'キラキラ光るもの', lines: ['もう拾った後のようだ。'] };
      }
      state.collectItem('item_bell');
      return { speaker: 'キラキラ光るもの', lines: ['参道に、小さな鈴の欠片が落ちていた。'] };
    },
  },
  'plaza:16,7': {
    getResult(state) {
      if (state.hasItem('item_coin')) {
        return { speaker: 'キラキラ光るもの', lines: ['もう拾った後のようだ。'] };
      }
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['この先は木や生垣が茂っていて、うまく通れない。', 'のこぎりがあれば切り開けそうだ。森の木こりに会いに行こう。'],
        };
      }
      state.collectItem('item_coin');
      return { speaker: 'キラキラ光るもの', lines: ['庭園の隅に、少し古い記念コインが落ちていた。'] };
    },
  },
  'shopping:7,7': {
    getResult(state) {
      if (state.hasItem('item_raffle')) {
        return { speaker: 'キラキラ光るもの', lines: ['もう拾った後のようだ。'] };
      }
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['この先は木や生垣が茂っていて、うまく通れない。', 'のこぎりがあれば切り開けそうだ。森の木こりに会いに行こう。'],
        };
      }
      state.collectItem('item_raffle');
      return { speaker: 'キラキラ光るもの', lines: ['庭先に、福引の景品が落ちていた!'] };
    },
  },
  'school:7,21': {
    getResult(state) {
      if (state.hasItem('item_yearbook')) {
        return { speaker: 'キラキラ光るもの', lines: ['もう拾った後のようだ。'] };
      }
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['この先は木や生垣が茂っていて、うまく通れない。', 'のこぎりがあれば切り開けそうだ。森の木こりに会いに行こう。'],
        };
      }
      state.collectItem('item_yearbook');
      return { speaker: 'キラキラ光るもの', lines: ['花壇のそばに、色あせた卒業アルバムの写真が落ちていた。'] };
    },
  },
  'library:7,8': {
    getResult(state) {
      if (state.hasItem('item_bookmark')) {
        return { speaker: 'キラキラ光るもの', lines: ['もう拾った後のようだ。'] };
      }
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['この先は木や生垣が茂っていて、うまく通れない。', 'のこぎりがあれば切り開けそうだ。森の木こりに会いに行こう。'],
        };
      }
      state.collectItem('item_bookmark');
      return { speaker: 'キラキラ光るもの', lines: ['読書ガーデンに、手作りのしおりが落ちていた。'] };
    },
  },
  'residential:50,30': {
    getResult(state) {
      if (state.hasItem('item_bottle')) {
        return { speaker: 'キラキラ光るもの', lines: ['もう拾った後のようだ。'] };
      }
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['この先は木や生垣が茂っていて、うまく通れない。', 'のこぎりがあれば切り開けそうだ。森の木こりに会いに行こう。'],
        };
      }
      state.collectItem('item_bottle');
      return { speaker: 'キラキラ光るもの', lines: ['庭先に、瓶に入った小さな手紙が落ちていた。'] };
    },
  },
  'home:15,12': {
    getResult(state) {
      if (state.hasItem('item_charm_child')) {
        return { speaker: 'キラキラ光るもの', lines: ['もう拾った後のようだ。'] };
      }
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['この先は木や生垣が茂っていて、うまく通れない。', 'のこぎりがあれば切り開けそうだ。森の木こりに会いに行こう。'],
        };
      }
      state.collectItem('item_charm_child');
      return { speaker: 'キラキラ光るもの', lines: ['庭の花の陰に、幼い頃のお守りが落ちていた。'] };
    },
  },

  // ---- 生垣の外にある「茂み」: のこぎりが無いと奥に進めないことを教えてくれる目印 ----
  // (生垣の中にある隠しアイテムそのものより手前、外から見つけやすい位置に置く)
  'plaza:15,9': {
    getResult(state) {
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['奥の方に、何か光るものが見える気がする……', '生垣が濃くて、うまく通れない。のこぎりがあれば切り開けそうだ。', '森の木こりに会いに行こう。'],
        };
      }
      return { speaker: '茂み', lines: ['のこぎりで切り開けそうな茂みだ。', 'この奥に、何か落ちているかもしれない。'] };
    },
  },
  'shopping:8,11': {
    getResult(state) {
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['奥の方に、何か光るものが見える気がする……', '生垣が濃くて、うまく通れない。のこぎりがあれば切り開けそうだ。', '森の木こりに会いに行こう。'],
        };
      }
      return { speaker: '茂み', lines: ['のこぎりで切り開けそうな茂みだ。', 'この奥に、何か落ちているかもしれない。'] };
    },
  },
  'school:6,24': {
    getResult(state) {
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['奥の方に、何か光るものが見える気がする……', '生垣が濃くて、うまく通れない。のこぎりがあれば切り開けそうだ。', '森の木こりに会いに行こう。'],
        };
      }
      return { speaker: '茂み', lines: ['のこぎりで切り開けそうな茂みだ。', 'この奥に、何か落ちているかもしれない。'] };
    },
  },
  'library:8,12': {
    getResult(state) {
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['奥の方に、何か光るものが見える気がする……', '生垣が濃くて、うまく通れない。のこぎりがあれば切り開けそうだ。', '森の木こりに会いに行こう。'],
        };
      }
      return { speaker: '茂み', lines: ['のこぎりで切り開けそうな茂みだ。', 'この奥に、何か落ちているかもしれない。'] };
    },
  },
  'residential:49,24': {
    getResult(state) {
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['奥の方に、何か光るものが見える気がする……', '生垣が濃くて、うまく通れない。のこぎりがあれば切り開けそうだ。', '森の木こりに会いに行こう。'],
        };
      }
      return { speaker: '茂み', lines: ['のこぎりで切り開けそうな茂みだ。', 'この奥に、何か落ちているかもしれない。'] };
    },
  },
  'home:17,17': {
    getResult(state) {
      if (!state.hasFlag('hasSaw')) {
        state.setFlag('sawHintSeen');
        return {
          speaker: '茂み',
          lines: ['奥の方に、何か光るものが見える気がする……', '生垣が濃くて、うまく通れない。のこぎりがあれば切り開けそうだ。', '森の木こりに会いに行こう。'],
        };
      }
      return { speaker: '茂み', lines: ['のこぎりで切り開けそうな茂みだ。', 'この奥に、何か落ちているかもしれない。'] };
    },
  },

  // ---- 蔵の迷路のお宝部屋 ----
  'maze:18,1': {
    getResult(state) {
      if (state.hasItem('item_maze_treasure')) {
        return { speaker: '宝箱', lines: ['空になった宝箱だ。よく踏破したものだ。'] };
      }
      state.collectItem('item_maze_treasure');
      state.setFlag('clearedMaze');
      return {
        speaker: '宝箱',
        lines: ['迷路の最深部で、埃をかぶった宝箱を見つけた!', '中には、古びたお宝が入っていた。'],
      };
    },
  },

  // ---- 釣りスポット（Game.js側でミニゲームを開始する） ----
  'forest:19,15': {
    getResult() {
      return { speaker: '釣り場', lines: ['川べりで、糸を垂らしてみよう。'], minigame: 'fishing' };
    },
  },
  'shrine:12,25': {
    getResult() {
      return { speaker: '釣り場', lines: ['神社の池で、糸を垂らしてみよう。'], minigame: 'fishing' };
    },
  },
  'park:37,8': {
    getResult() {
      return { speaker: '釣り場', lines: ['公園の池で、糸を垂らしてみよう。'], minigame: 'fishing' };
    },
  },
};

/** placeObjectで配置されたオブジェクトから、上のマップのキーを組み立てる */
export function objectInteractionKey(mapId, obj) {
  return `${mapId}:${obj.x},${obj.y}`;
}
