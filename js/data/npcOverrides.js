// ============================================================
// 特定のNPC（npc.idで指定）専用のセリフ定義。
// ここに id が登録されているNPCは、npcTypeDialogues.js の
// 汎用セリフではなく、必ずこちらが優先して使われる。
//
// クエストの合言葉として 'schoolNotice' というクエストIDを使う:
//   notStarted -> 店主から声をかけられていない
//   inProgress -> 店主から届け物を頼まれた
//   delivered  -> 先生に届け終えた（店主にまだ報告していない）
//   complete   -> 店主に報告して完了
// ============================================================

export const NPC_OVERRIDE_DIALOGUES = {
  // ---- 主人公の家: 母 ----
  home_family_01: [
    {
      when: (s) => s.getQuest('schoolNotice') === 'complete',
      lines: ['商店街のお使い、ちゃんとやり遂げたのね。', 'えらいわ、頼りにしてるわよ。'],
    },
    {
      when: (s) => s.hasFlag('foundTreasureChest'),
      lines: ['森で宝箱を見つけたんですって? 気をつけて行動するのよ。', '無理はしないでね。'],
    },
    {
      when: (s) => s.hasFlag('visited_forest'),
      lines: ['森の方まで行ったの? 一人で遠くまで行くときは気をつけてね。'],
    },
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 3,
      lines: ['今日も元気ね。', '町のみんなとは仲良くやれてる?'],
    },
    {
      lines: ['あら、おかえりなさい。', '今日はどこに出かけていたの?'],
    },
  ],

  // ---- 商店街: 店主（クエストの起点） ----
  shopping_owner_01: [
    {
      when: (s) => s.getQuest('schoolNotice') === 'complete',
      lines: ['この前は届け物、本当に助かったよ。', 'また何かあったら頼らせてもらうよ。'],
    },
    {
      when: (s) => s.getQuest('schoolNotice') === 'delivered',
      lines: ['学校まで届けてくれたんだね、ありがとう!'],
      effect: (s) => s.setQuest('schoolNotice', 'complete'),
    },
    {
      when: (s) => s.getQuest('schoolNotice') === 'inProgress',
      lines: ['学校の先生に、まだお知らせを届けてないんだね。', '届いたらまた声をかけてくれ。'],
    },
    {
      when: (s) => s.getQuest('schoolNotice') === 'notStarted',
      lines: [
        'おっと、ちょうどよかった。',
        '学校の先生宛てのお知らせを届けてほしいんだけど、頼めるかい?',
      ],
      choices: [
        {
          text: '引き受ける',
          lines: ['助かるよ! 学校の先生を訪ねてみてくれ。'],
          effect: (s) => s.setQuest('schoolNotice', 'inProgress'),
        },
        {
          text: '今はやめておく',
          lines: ['そうか、気が変わったらいつでも声をかけてくれよな。'],
        },
      ],
    },
    {
      lines: ['まいど!', 'うちの店、品揃えには自信があるんだ。'],
    },
  ],

  // ---- 学校: 先生（クエストの届け先） ----
  school_teacher_01: [
    {
      when: (s) => s.getQuest('schoolNotice') === 'inProgress',
      lines: ['お、商店街からのお知らせだね。', '届けてくれてありがとう。店主さんにもよろしく伝えておいてくれ。'],
      effect: (s) => s.setQuest('schoolNotice', 'delivered'),
    },
    {
      when: (s) => s.getQuest('schoolNotice') === 'delivered' || s.getQuest('schoolNotice') === 'complete',
      lines: ['この前のお知らせ、ちゃんと確認したよ。', '助かった、ありがとう。'],
    },
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 2,
      lines: ['お、また会ったね。', '勉強も大事だけど、体もちゃんと動かすんだよ。'],
    },
    {
      lines: ['おや、こんにちは。', '学校の中でも外でも、礼儀は忘れないようにね。'],
    },
  ],

  // ---- 図書館: 司書（噂の連鎖） ----
  library_librarian_01: [
    {
      when: (s) => s.hasFlag('foundTreasureChest'),
      lines: ['森で宝箱を見つけたって聞いたわ。', '古い言い伝えでは、この町にはまだ何か眠っているそうよ。'],
    },
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

  // ---- 神社: 神主（軽い選択肢分岐） ----
  shrine_keeper_01: [
    {
      when: (s) => s.hasFlag('prayedAtShrine'),
      lines: ['また参拝に来てくれたのですね。', 'この神社は昔からこの町を見守ってきたのですよ。'],
    },
    {
      lines: ['ようこそ、参拝ですか。'],
      choices: [
        {
          text: 'お参りする',
          lines: ['よい心がけです。', 'どうか、これからの道のりに幸多からんことを。'],
          effect: (s) => s.setFlag('prayedAtShrine'),
        },
        {
          text: '見学だけする',
          lines: ['ごゆっくりどうぞ。', 'この先には公園への小径もございます。'],
        },
      ],
    },
  ],

  // ---- 森: 謎の人影（意味深な分岐、フラグを立てる） ----
  forest_mystery_01: [
    {
      when: (s) => s.hasFlag('mysteryTrusted'),
      lines: ['……また来たか。', 'お前になら、この森のことを話してもいいかもしれないな。'],
    },
    {
      when: (s) => s.hasFlag('mysteryWary'),
      lines: ['……。', '警戒されるのも無理はない。だが、悪いようにはしない。'],
    },
    {
      lines: ['……。', 'お前も、この森の何かに気づいているのか。'],
      choices: [
        {
          text: '話を聞いてみる',
          lines: ['……そうか。', 'いずれ、話せる時が来るだろう。'],
          effect: (s) => s.setFlag('mysteryTrusted'),
        },
        {
          text: '警戒する',
          lines: ['……賢明だな。', '見知らぬ相手を簡単に信じるものではない。'],
          effect: (s) => s.setFlag('mysteryWary'),
        },
      ],
    },
  ],
};
