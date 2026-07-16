// ============================================================
// 「ミッション」（今なにをすればいいか）の定義。
// achievements.js（達成済みの実績を記録するもの）とは違い、
// こちらは「今アクティブな目的」を画面右上に、
// 「ゲーム内の全ミッション一覧」を画面左上に表示するために使う。
//
// isActive(state)    … このミッションを「進行中」として右上に出すか
// isCompleted(state) … このミッションをクリア済み扱いにするか（左上の一覧用）
// getObjective(state) … 表示する「次にすべきこと」の文言
//   （同じミッションの中でも段階が進むと文言を変えられる）
// getHint(state)      … 「どこに行けばいいか」のヒント文言
//
// isActive が false になった瞬間（クエスト完了・フラグ成立など）に
// 画面右上から自動的に消える。
// 左上の一覧では、isCompleted() で「未着手 / 進行中 / クリア済み」を
// 判定し、常に全ミッションを表示し続ける。
// ============================================================

export const MISSIONS = [
  {
    id: 'schoolNotice',
    title: 'お使い：お知らせを届けよう',
    isActive: (s) => ['inProgress', 'delivered'].includes(s.getQuest('schoolNotice')),
    isCompleted: (s) => s.getQuest('schoolNotice') === 'complete',
    getObjective: (s) => (s.getQuest('schoolNotice') === 'delivered'
      ? '商店街の店主に、届け終えたことを報告しよう'
      : '学校の先生に、お知らせを届けよう'),
    getHint: (s) => (s.getQuest('schoolNotice') === 'delivered'
      ? '商店街（しょうてんがい）マップにいる「店主」を探そう'
      : '学校（がっこう）マップにいる「先生」を探そう'),
  },
  {
    id: 'lostCat',
    title: '迷い猫：ミケを探そう',
    isActive: (s) => ['inProgress', 'found'].includes(s.getQuest('lostCat')),
    isCompleted: (s) => s.getQuest('lostCat') === 'complete',
    getObjective: (s) => (s.getQuest('lostCat') === 'found'
      ? '商店街の店主に、見つけたことを伝えよう'
      : '町のどこかにいる猫「ミケ」を探そう'),
    getHint: (s) => (s.getQuest('lostCat') === 'found'
      ? '商店街（しょうてんがい）マップにいる「店主」を探そう'
      : '神社（じんじゃ）マップの片隅にいる三毛猫を探そう'),
  },
  {
    id: 'forestMystery',
    title: '森の人影：正体を確かめよう',
    isActive: (s) => s.hasFlag('talkedToMystery') && !s.hasFlag('mysterySecretRevealed'),
    isCompleted: (s) => s.hasFlag('mysterySecretRevealed'),
    getObjective: () => '森の奥の人影ともっと話して、信頼を得よう',
    getHint: () => '森（もり）マップの奥にいる「謎の人影」に、何度も話しかけよう',
  },
  {
    id: 'stargazer',
    title: '星を眺める人：理由を聞こう',
    isActive: (s) => s.hasFlag('metNightVisitor') && !s.hasFlag('stargazerSecretRevealed'),
    isCompleted: (s) => s.hasFlag('stargazerSecretRevealed'),
    getObjective: () => '夜の公園で、星を眺める人ともっと話そう',
    getHint: () => '公園（こうえん）マップに、夜の時間帯に行こう。星を眺める人に何度も話しかけよう',
  },
  {
    id: 'treasureMarks',
    title: '宝箱の刻印：3つの立て札を探そう',
    isActive: (s) => s.hasFlag('visited_forest') && !s.hasFlag('foundTreasureChest'),
    isCompleted: (s) => s.hasFlag('foundTreasureChest'),
    getObjective: (s) => {
      const found = ['foundMarkStar', 'foundMarkMoon', 'foundMarkSun'].filter((f) => s.hasFlag(f)).length;
      return found >= 3
        ? '森の宝箱の前で、刻印を正しい順番で押してみよう'
        : `森のどこかにある「刻印の立て札」を探そう（${found}/3）`;
    },
    getHint: (s) => {
      const found = ['foundMarkStar', 'foundMarkMoon', 'foundMarkSun'].filter((f) => s.hasFlag(f)).length;
      return found >= 3
        ? '森（もり）マップの東側にある宝箱を調べよう'
        : '森（もり）マップの各所（西・北・東）に立て札が3つ隠れている';
    },
  },
  {
    id: 'townLegend',
    title: '町の言い伝え：真実を探ろう',
    isActive: (s) => (s.hasFlag('foundTreasureChest') || s.hasFlag('drewDaikichi')) && !s.hasFlag('legendRevealed'),
    isCompleted: (s) => s.hasFlag('legendRevealed'),
    getObjective: (s) => {
      if (!s.hasFlag('foundTreasureChest')) return '森の奥で、宝箱を探そう';
      if (!s.hasFlag('drewDaikichi')) return '神社でおみくじを引いて、大吉を当てよう';
      return '神主に、見つけた地図の切れ端の話をしよう';
    },
    getHint: (s) => {
      if (!s.hasFlag('foundTreasureChest')) return '森（もり）マップの宝箱イベントを先に進めよう';
      if (!s.hasFlag('drewDaikichi')) return '神社（じんじゃ）マップの神主に「おみくじを引く」を選ぼう';
      return '神社（じんじゃ）マップにいる「神主」に話しかけよう';
    },
  },
];
