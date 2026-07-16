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

import { MAPS } from './maps/index.js';

const ALL_MAP_IDS = Object.keys(MAPS);

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
  {
    id: 'grandmaBook',
    title: 'おつかい：おばあちゃんに本を届けよう',
    isActive: (s) => s.getQuest('grandmaBook') === 'inProgress',
    isCompleted: (s) => s.getQuest('grandmaBook') === 'complete',
    getObjective: (s) => (s.getQuest('grandmaBook') === 'notStarted'
      ? '母に話しかけてみよう'
      : 'おばあちゃんに、母から預かった本を届けよう'),
    getHint: (s) => (s.getQuest('grandmaBook') === 'notStarted'
      ? '「母」に話しかけよう'
      : '「おばあちゃん」を探して届けよう'),
  },
  {
    id: 'libraryBook',
    title: 'おつかい：司書に本を届けよう',
    isActive: (s) => s.getQuest('libraryBook') === 'inProgress',
    isCompleted: (s) => s.getQuest('libraryBook') === 'complete',
    getObjective: (s) => (s.getQuest('libraryBook') === 'notStarted'
      ? 'おばあちゃんともっと仲良くなろう'
      : '司書に、おばあちゃんから預かった本を届けよう'),
    getHint: (s) => (s.getQuest('libraryBook') === 'notStarted'
      ? '「おばあちゃん」ともっと話してみよう'
      : '「司書」を探して届けよう'),
  },
  {
    id: 'legendResearch',
    title: '調査：都市伝説の正体を確かめよう',
    isActive: (s) => s.getQuest('legendResearch') === 'inProgress',
    isCompleted: (s) => s.getQuest('legendResearch') === 'complete',
    getObjective: (s) => {
      if (s.getQuest('legendResearch') === 'notStarted') return '図書館の利用者に話しかけてみよう';
      if (s.hasFlag('mysterySecretRevealed') || s.hasFlag('stargazerSecretRevealed')) {
        return '図書館の利用者に、確かめてきたことを報告しよう';
      }
      return '森の人影か、星を眺める人、どちらかの正体を確かめよう';
    },
    getHint: (s) => (s.getQuest('legendResearch') === 'notStarted'
      ? '「都市伝説を調べる利用者」に話しかけよう'
      : '正体を確かめたら、「都市伝説を調べる利用者」に報告しよう'),
  },
  {
    id: 'rainMystery',
    title: '雨の日の噂：雨宿りの人影を探そう',
    isActive: (s) => s.hasFlag('talkedToRainMystery') && !s.hasFlag('rainMysterySecretRevealed'),
    isCompleted: (s) => s.hasFlag('rainMysterySecretRevealed'),
    getObjective: (s) => (s.hasFlag('talkedToRainMystery')
      ? '雨宿りの人影ともっと話して、信頼を得よう'
      : '雨の日に、どこかで誰かと出会えるかもしれない'),
    getHint: (s) => (s.hasFlag('talkedToRainMystery')
      ? '雨の日に、「雨宿りの人影」に何度も話しかけよう'
      : '雨の日を待って、いろんな場所を探してみよう'),
  },
  {
    id: 'woodcutterSaw',
    title: '茂みの向こう：木こりからのこぎりをもらおう',
    isActive: (s) => s.hasFlag('sawHintSeen') && !s.hasFlag('hasSaw'),
    isCompleted: (s) => s.hasFlag('hasSaw'),
    getObjective: (s) => {
      if (!s.hasFlag('sawHintSeen')) return '町を歩いていると、茂みに阻まれた場所があるかもしれない';
      if (!s.hasFlag('hasSaw')) return '森の木こりに会って、のこぎりを分けてもらおう';
      return 'のこぎりを使って、茂みの奥を調べてみよう';
    },
    getHint: (s) => (s.hasFlag('sawHintSeen')
      ? '森（もり）マップにいる「木こり」を探そう'
      : '町のあちこちを探検してみよう'),
  },
  {
    id: 'shrinePrayer',
    title: '神社でお参りをしよう',
    isActive: (s) => !s.hasFlag('prayedAtShrine'),
    isCompleted: (s) => s.hasFlag('prayedAtShrine'),
    getObjective: () => '神社で参拝してみよう',
    getHint: () => '神社（じんじゃ）にいる「神主」に話しかけよう',
  },
  {
    id: 'omikujiDraw',
    title: 'おみくじで大吉を引こう',
    isActive: (s) => s.hasFlag('prayedAtShrine') && !s.hasFlag('drewDaikichi'),
    isCompleted: (s) => s.hasFlag('drewDaikichi'),
    getObjective: () => '神主に、おみくじを引かせてもらおう',
    getHint: () => 'お参りの後、神社の「神主」にもう一度話しかけよう',
  },
  {
    id: 'explorer',
    title: '町の案内人：9つのエリアを訪れよう',
    isActive: (s) => !ALL_MAP_IDS.every((id) => s.hasFlag(`visited_${id}`)),
    isCompleted: (s) => ALL_MAP_IDS.every((id) => s.hasFlag(`visited_${id}`)),
    getObjective: (s) => {
      const count = ALL_MAP_IDS.filter((id) => s.hasFlag(`visited_${id}`)).length;
      return `町の9つのエリアを訪れよう（${count}/9）`;
    },
    getHint: () => 'まだ行ったことのない場所を探して、町中を歩き回ってみよう',
  },
  {
    id: 'socialButterfly',
    title: '町の人気者：10人以上と話そう',
    isActive: (s) => s.getTalkedCount() < 10,
    isCompleted: (s) => s.getTalkedCount() >= 10,
    getObjective: (s) => `いろんな人と話してみよう（${s.getTalkedCount()}/10人）`,
    getHint: () => '町中を歩いて、いろんな人に話しかけてみよう',
  },
  {
    id: 'itemCollector',
    title: 'コレクター：隠しアイテムを12個集めよう',
    isActive: (s) => s.getItemCount() < 12,
    isCompleted: (s) => s.getItemCount() >= 12,
    getObjective: (s) => `隠しアイテムを集めよう（${s.getItemCount()}/12個）`,
    getHint: () => '町のあちこちの茂みや花壇を探してみよう（Kキーでコレクション帳が見られるよ）',
  },
];
