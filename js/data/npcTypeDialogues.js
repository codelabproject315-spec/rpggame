// ============================================================
// NPCの「種類」ごとの汎用セリフ。
// 個別のセリフ(npcOverrides.js)が用意されていないNPCは、
// 自分のNpcType(役割)に応じてここから選ばれる。
//
// ルールは配列の先頭から順番に調べ、条件(when)に一致した
// 最初のセリフが使われる。when が無いルールは「常に一致」＝
// 一番下に置く「通常時の一言」として使うのが基本形。
//
// when(state, npc) の中で使えること:
//   state.hasFlag('フラグ名')       … フラグが立っているか
//   state.getAffinity(npc.id)      … このNPCと会話した回数
//   state.getQuest('クエストID')   … クエストの進行状況
// ============================================================

import { NpcType } from './npcTypes.js';

export const NPC_TYPE_DIALOGUES = {
  [NpcType.VILLAGER]: [
    {
      when: (s) => s.hasFlag('foundTreasureChest'),
      lines: ['森で宝箱を見つけたって本当?', 'すごいじゃない、今度見せてよ。'],
    },
    {
      when: (s) => s.hasFlag('visited_forest'),
      lines: ['森の方まで行ったんだって? 気をつけてね、道に迷った人がいるらしいから。'],
    },
    {
      when: (s) => !s.hasFlag('metNightVisitor'),
      lines: ['そういえば、最近夜遅くに公園にいる人がいるらしいわよ。', '星を見に来ているとか…?'],
    },
    {
      when: (s) => s.getQuest('lostCat') === 'notStarted',
      lines: ['そういえば、商店街の店主さんが飼ってる猫、最近見かけないんだって。', 'ちょっと心配だわ。'],
      effect: (s) => s.setFlag('heardAboutLostCat'),
    },
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 3,
      lines: ['あら、また会ったわね。', 'この辺りは相変わらずのんびりしてるわ。'],
    },
    {
      when: (s, npc) => s.getAffinity(npc.id) === 2,
      lines: ['さっきも会ったわね。', '今日は天気がいいから、外に出てきたの。'],
    },
    {
      lines: ['こんにちは。', 'いいお天気ね。'],
    },
  ],

  [NpcType.STUDENT]: [
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 3,
      lines: ['またおはよう!', 'そういえば、学校の裏に近道があるって知ってた?'],
    },
    {
      when: (s, npc) => s.getAffinity(npc.id) === 2,
      lines: ['あ、さっきの人だ!', '暇だからちょっと話そうよ。'],
      choices: [
        {
          text: '好きな教科は?',
          lines: ['うーん、体育かな。教室にじっとしてるの苦手なんだ。'],
        },
        {
          text: 'また今度',
          lines: ['うん、またね!'],
        },
      ],
    },
    {
      lines: ['やっほー!', '学校、たまに近道すると先生に怒られるんだよね。'],
    },
  ],

  [NpcType.CUSTOMER]: [
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 2,
      lines: ['この前もお会いしましたね。', 'この商店街、自販機が増えて便利になったのよ。'],
    },
    {
      lines: ['こんにちは、お買い物ですか?', '商店街の自動販売機、意外と品揃えがいいんですよ。'],
    },
  ],

  [NpcType.PARK_VISITOR]: [
    {
      when: (s) => s.getQuest('lostCat') === 'inProgress',
      lines: ['さっき、三毛猫がふらふら歩いているのを見たわ。', '神社の方へ向かっていった気がする。'],
    },
    {
      when: (s) => s.hasFlag('talkedToMystery'),
      lines: ['森の奥で不思議な人と話したって聞いたけど…本当?', '私はちょっと怖くて森には近づけないわ。'],
    },
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 2,
      lines: ['また会いましたね。', 'この公園、天気のいい日はほんとに気持ちいいの。'],
    },
    {
      lines: [
        'この公園、静かでお気に入りなの。',
        'そういえば、森の奥で誰かを見たという人がいるらしいわ…気のせいかしら。',
      ],
    },
  ],

  [NpcType.TEACHER]: [
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 2,
      lines: ['お、また会ったね。', '勉強も大事だけど、体もちゃんと動かすんだよ。'],
    },
    {
      lines: ['おや、こんにちは。', '学校の中でも外でも、礼儀は忘れないようにね。'],
    },
  ],

  [NpcType.SHOPKEEPER]: [
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 2,
      lines: ['まいど!', 'うちの店、品揃えには自信があるんだ。'],
    },
    {
      lines: ['いらっしゃい!', '何か探し物かい? うちの店なら大抵の物は揃ってるよ。'],
    },
  ],

  [NpcType.LIBRARIAN]: [
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 2,
      lines: ['また来てくれたのね。', '静かに読書するなら、奥の中庭もおすすめよ。'],
    },
    {
      lines: [
        'いらっしゃい、ごゆっくりどうぞ。',
        'そういえば、神社の参道にある鐘の音、ここまで聞こえてくるのよ。',
      ],
    },
  ],

  [NpcType.SHRINE_KEEPER]: [
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 2,
      lines: ['また参拝に来てくれたのですね。', 'この神社は昔からこの町を見守ってきたのですよ。'],
    },
    {
      lines: ['ようこそ、参拝ですか。', 'この先には公園への小径もございます。'],
    },
  ],

  [NpcType.FAMILY]: [
    {
      lines: ['あら、おかえりなさい。', '今日はどこに出かけていたの?'],
    },
  ],

  [NpcType.MYSTERY]: [
    {
      lines: ['……。', 'お前も、この森の何かに気づいているのか。'],
    },
  ],
};
