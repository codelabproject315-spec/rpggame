// ============================================================
// NPCではない設置物（今回は宝箱）を調べたときの反応データ。
// キーは js/data/maps/*.js で placeObject に渡している
// オブジェクトの type ではなく、マップ上での一意な識別のために
// タイル座標を使う（同じtypeのオブジェクトが複数あっても
// 個別に反応を変えられるようにするため）。
// ============================================================

export const OBJECT_INTERACTIONS = {
  // 森の宝箱（js/data/maps/forest.js の配置座標と対応）
  'forest:36,15': {
    getResult(state) {
      if (state.hasFlag('foundTreasureChest')) {
        return { speaker: '宝箱', lines: ['空になった宝箱だ。'] };
      }
      state.setFlag('foundTreasureChest');
      return {
        speaker: '宝箱',
        lines: [
          '宝箱を見つけた!',
          '中には、古い地図の切れ端が入っていた。',
          '（この町のどこかに、まだ何か隠されているのかもしれない）',
        ],
      };
    },
  },
};

/** placeObjectで配置されたオブジェクトから、上のマップのキーを組み立てる */
export function objectInteractionKey(mapId, obj) {
  return `${mapId}:${obj.x},${obj.y}`;
}
