// ============================================================
// 「ミッション」（今なにをすればいいか）の定義。
// achievements.js（達成済みの実績を記録するもの）とは違い、
// こちらは「今アクティブな目的」を画面右上に常時表示するために使う。
//
// isActive(state)  … このミッションを今表示すべきか
// getObjective(state) … 表示する「次にすべきこと」の文言
//   （同じミッションの中でも段階が進むと文言を変えられる）
//
// isActive が false になった瞬間（クエスト完了・フラグ成立など）に
// 画面右上から自動的に消える。
// ============================================================

export const MISSIONS = [
  {
    id: 'schoolNotice',
    title: 'お使い：お知らせを届けよう',
    isActive: (s) => ['inProgress', 'delivered'].includes(s.getQuest('schoolNotice')),
    getObjective: (s) => (s.getQuest('schoolNotice') === 'delivered'
      ? '商店街の店主に、届け終えたことを報告しよう'
      : '学校の先生に、お知らせを届けよう'),
  },
  {
    id: 'lostCat',
    title: '迷い猫：ミケを探そう',
    isActive: (s) => ['inProgress', 'found'].includes(s.getQuest('lostCat')),
    getObjective: (s) => (s.getQuest('lostCat') === 'found'
      ? '商店街の店主に、見つけたことを伝えよう'
      : '町のどこかにいる猫「ミケ」を探そう'),
  },
  {
    id: 'forestMystery',
    title: '森の人影：正体を確かめよう',
    isActive: (s) => s.hasFlag('talkedToMystery') && !s.hasFlag('mysterySecretRevealed'),
    getObjective: () => '森の奥の人影ともっと話して、信頼を得よう',
  },
  {
    id: 'stargazer',
    title: '星を眺める人：理由を聞こう',
    isActive: (s) => s.hasFlag('metNightVisitor') && !s.hasFlag('stargazerSecretRevealed'),
    getObjective: () => '夜の公園で、星を眺める人ともっと話そう',
  },
  {
    id: 'treasureMarks',
    title: '宝箱の刻印：3つの立て札を探そう',
    isActive: (s) => s.hasFlag('visited_forest') && !s.hasFlag('foundTreasureChest'),
    getObjective: (s) => {
      const found = ['foundMarkStar', 'foundMarkMoon', 'foundMarkSun'].filter((f) => s.hasFlag(f)).length;
      return found >= 3
        ? '森の宝箱の前で、刻印を正しい順番で押してみよう'
        : `森のどこかにある「刻印の立て札」を探そう（${found}/3）`;
    },
  },
  {
    id: 'townLegend',
    title: '町の言い伝え：真実を探ろう',
    isActive: (s) => (s.hasFlag('foundTreasureChest') || s.hasFlag('drewDaikichi')) && !s.hasFlag('legendRevealed'),
    getObjective: (s) => {
      if (!s.hasFlag('foundTreasureChest')) return '森の奥で、宝箱を探そう';
      if (!s.hasFlag('drewDaikichi')) return '神社でおみくじを引いて、大吉を当てよう';
      return '神主に、見つけた地図の切れ端の話をしよう';
    },
  },
];
