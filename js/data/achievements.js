// ============================================================
// 実績（スタンプラリー）の定義。
// check(state) が true を返した時点で「解除」となる。
// 一度解除された実績は、GameStateの unlockedAchievements に
// 記録され、二度と同じ通知は出ない。
// ============================================================

import { MAPS } from './maps/index.js';

const ALL_MAP_IDS = Object.keys(MAPS);

export const ACHIEVEMENTS = [
  {
    id: 'explorer',
    title: '町の案内人',
    description: '町にある9つのエリアをすべて訪れた',
    check: (state) => ALL_MAP_IDS.every((id) => state.hasFlag(`visited_${id}`)),
  },
  {
    id: 'treasureHunter',
    title: 'たからさがし',
    description: '森の奥で宝箱を見つけた',
    check: (state) => state.hasFlag('foundTreasureChest'),
  },
  {
    id: 'faithful',
    title: '祈りを込めて',
    description: '神社でお参りをした',
    check: (state) => state.hasFlag('prayedAtShrine'),
  },
  {
    id: 'mysteryFriend',
    title: '森の対話者',
    description: '森の奥の謎の人影と言葉を交わした',
    check: (state) => state.hasFlag('mysteryTrusted') || state.hasFlag('mysteryWary'),
  },
  {
    id: 'helpfulNeighbor',
    title: '頼れるお使い係',
    description: '商店街から学校へのお使いをやり遂げた',
    check: (state) => state.getQuest('schoolNotice') === 'complete',
  },
  {
    id: 'socialButterfly',
    title: '町の人気者',
    description: '10人以上のNPCと会話した',
    check: (state) => state.getTalkedCount() >= 10,
  },
  {
    id: 'nightWanderer',
    title: '夜のお客さん',
    description: '夜の公園で、誰かに出会った',
    check: (state) => state.hasFlag('metNightVisitor'),
  },
  {
    id: 'luckyDraw',
    title: '運命の大吉',
    description: 'おみくじで大吉を引いた',
    check: (state) => state.hasFlag('drewDaikichi'),
  },
  {
    id: 'forestKeeperLegacy',
    title: '森番の血統',
    description: '森の人影から、その正体を明かしてもらった',
    check: (state) => state.hasFlag('mysterySecretRevealed'),
  },
  {
    id: 'starPromise',
    title: '星空の約束',
    description: '星を眺める人の、大切な思い出を聞いた',
    check: (state) => state.hasFlag('stargazerSecretRevealed'),
  },
  {
    id: 'townLegend',
    title: '町に眠るもの',
    description: '宝箱の地図と大吉の力で、神主から町の言い伝えを聞き出した',
    check: (state) => state.hasFlag('legendRevealed'),
  },
  {
    id: 'catRescue',
    title: '迷い猫の恩人',
    description: '商店街からいなくなった猫を見つけた',
    check: (state) => state.hasFlag('catFound'),
  },
];
