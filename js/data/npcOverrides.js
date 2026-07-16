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

// ============================================================

/**
 * おみくじを1回引く。結果に応じたセリフを返し、
 * 大吉を引いたときだけ実績用のフラグを立てる。
 * ※ 毎回結果が変わるように、この関数自体を choice.lines に渡す
 *   （DialogueManagerが呼び出し時に評価する）。
 */
function drawOmikuji(state) {
  const table = [
    { result: '大吉', weight: 5 },
    { result: '中吉', weight: 15 },
    { result: '小吉', weight: 20 },
    { result: '吉', weight: 25 },
    { result: '末吉', weight: 20 },
    { result: '凶', weight: 15 },
  ];
  const total = table.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * total;
  let picked = table[table.length - 1].result;
  for (const entry of table) {
    if (roll < entry.weight) { picked = entry.result; break; }
    roll -= entry.weight;
  }

  if (picked === '大吉') state.setFlag('drewDaikichi');

  const comments = {
    '大吉': '何をしても上手くいく、最高の運勢です。',
    '中吉': 'なかなかの好運。落ち着いて過ごしましょう。',
    '小吉': 'ささやかな幸運が訪れそうです。',
    '吉': '穏やかで、悪くない一日になりそうです。',
    '末吉': '焦らず、ゆっくりいきましょう。',
    '凶': '今日は無理をせず、慎重に過ごしましょう。',
  };

  return [`おみくじの結果は……「${picked}」。`, comments[picked]];
}

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
      when: (s) => s.getQuest('lostCat') === 'found',
      lines: (s) => s.hasFlag('catGentle')
        ? ['ミケを見つけてくれたのか! しかも、すっかり懐いてるじゃないか。', '本当にありがとうな。']
        : ['ミケを見つけてくれたのか! 本当にありがとう!', 'あの子、すぐふらふらどこかに行っちゃうんだ。恩に着るよ。'],
      effect: (s) => s.setQuest('lostCat', 'complete'),
    },
    {
      when: (s) => s.getQuest('lostCat') === 'inProgress',
      lines: ['うちの猫のミケ、まだ見つからないんだよなあ。', '見かけたら教えてくれると助かるよ。'],
    },
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
      when: (s) => s.getQuest('lostCat') === 'notStarted' && s.hasFlag('heardAboutLostCat'),
      lines: ['ああ、その話を聞いたのか。', 'うちの猫のミケが逃げ出しちまってな……探すの、手伝ってくれないか?'],
      choices: [
        {
          text: '引き受ける',
          lines: ['助かるよ! 見かけたらでいいから、気にかけておいてくれ。'],
          effect: (s) => s.setQuest('lostCat', 'inProgress'),
        },
        {
          text: '今はやめておく',
          lines: ['そうか……無理にとは言わないよ。'],
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
      when: (s) => s.hasFlag('talkedToMystery') && !s.hasFlag('mysterySecretRevealed'),
      lines: [
        '森の人影のこと? ええ、噂は知っているわ。',
        '昔、この町には森番と呼ばれる一族がいて、森を守っていたと本で読んだことがある。',
        'もしかしたら、その血を引く人が今もいるのかもしれないわね。',
      ],
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
      when: (s) => s.hasFlag('foundTreasureChest') && s.hasFlag('drewDaikichi') && !s.hasFlag('legendRevealed'),
      lines: [
        'ほう……その地図の切れ端、見せてもらえますか。',
        'やはり。これは、この神社を守っていた一族に代々伝わっていたものです。',
      ],
      choices: [
        {
          text: 'もっと詳しく聞く',
          lines: [
            '大吉を引いたあなたになら話しましょう。',
            'この町の氏神様は、元はその一族の始祖だったという言い伝えがあるのですよ。',
          ],
          effect: (s) => { s.setFlag('legendRevealed'); s.setFlag('legendCurious'); },
        },
        {
          text: '静かにうなずく',
          lines: ['……多くは語りますまい。', 'ただ、この町とあなたの間には、何か縁があるのかもしれませんね。'],
          effect: (s) => { s.setFlag('legendRevealed'); s.setFlag('legendRespectful'); },
        },
      ],
    },
    {
      when: (s) => !s.hasFlag('metNightVisitor') && !s.hasFlag('heardStargazerHintFromShrine'),
      lines: [
        'そういえば、夜のこの時間になると、公園で星を眺めている方がいるとか。',
        '無理に探さずとも、いずれ出会うこともあるでしょう。',
      ],
      effect: (s) => s.setFlag('heardStargazerHintFromShrine'),
    },
    {
      when: (s) => s.hasFlag('prayedAtShrine'),
      lines: ['また参拝に来てくれたのですね。'],
      choices: [
        {
          text: 'おみくじを引く',
          lines: (state) => drawOmikuji(state),
        },
        {
          text: '何もしない',
          lines: ['この神社は昔からこの町を見守ってきたのですよ。'],
        },
      ],
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
      when: (s) => s.hasFlag('mysteryGrateful'),
      lines: ['……また来たか。', '礼儀正しいお前を、この森は歓迎するぞ。'],
    },
    {
      when: (s) => s.hasFlag('mysteryQuiet'),
      lines: ['……。', 'お前はいつも多くを語らんな。それでいい。'],
    },
    {
      when: (s, npc) => s.hasFlag('mysteryTrusted') && s.getAffinity(npc.id) >= 4 && !s.hasFlag('mysterySecretRevealed'),
      lines: [
        '……ここまで通ってくるとはな。',
        '正体を明かそう。私は、昔この森を守っていた森番の血を引く者だ。',
        '町の者たちが安心して暮らせるよう、今も森の異変を見張っている。それだけのことだ。',
      ],
      choices: [
        {
          text: '「話してくれてありがとう」',
          lines: ['……礼を言われるとはな。', 'これからも、この森を頼むぞ。'],
          effect: (s) => { s.setFlag('mysterySecretRevealed'); s.setFlag('mysteryGrateful'); },
        },
        {
          text: '黙って頷く',
          lines: ['……お前らしいな。', '言葉はいらぬ、ということか。'],
          effect: (s) => { s.setFlag('mysterySecretRevealed'); s.setFlag('mysteryQuiet'); },
        },
      ],
    },
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
          effect: (s) => { s.setFlag('mysteryTrusted'); s.setFlag('talkedToMystery'); },
        },
        {
          text: '警戒する',
          lines: ['……賢明だな。', '見知らぬ相手を簡単に信じるものではない。'],
          effect: (s) => { s.setFlag('mysteryWary'); s.setFlag('talkedToMystery'); },
        },
      ],
    },
  ],

  // ---- 神社: 商店街からいなくなった猫「ミケ」 ----
  shrine_cat_01: [
    {
      when: (s) => s.hasFlag('catGentle'),
      lines: ['ミケはあなたに懐いたようだ。', '「ナー」（甘えるように鳴いている）'],
    },
    {
      when: (s) => s.hasFlag('catBold'),
      lines: ['ミケは日向ぼっこ中だ。', '「ナー」（相変わらず気まぐれな様子だ）'],
    },
    {
      when: (s) => s.getQuest('lostCat') === 'inProgress',
      lines: ['よく見ると、商店街の店主が探していた三毛猫だ!'],
      choices: [
        {
          text: '優しく抱き上げる',
          lines: ['「ナー」（安心したように、目を細めている）'],
          effect: (s) => { s.setQuest('lostCat', 'found'); s.setFlag('catFound'); s.setFlag('catGentle'); },
        },
        {
          text: 'そっと声をかける',
          lines: ['「ナー」（少し警戒しながらも、様子を見に近づいてきた）'],
          effect: (s) => { s.setQuest('lostCat', 'found'); s.setFlag('catFound'); s.setFlag('catBold'); },
        },
      ],
    },
    {
      lines: ['見慣れない三毛猫が日向ぼっこをしている。', '声をかけても知らんぷりだ。'],
    },
  ],

  // ---- 公園の隠しNPC: 夜だけ現れる、星を眺める人 ----
  park_stargazer_01: [
    {
      when: (s, npc) => s.hasFlag('stargazerListened'),
      lines: ['今夜も、星がきれいですね。', 'また今度、続きを話しますね。'],
    },
    {
      when: (s, npc) => s.hasFlag('stargazerComforted'),
      lines: ['……今日もここにいてくれるんですね。', 'それだけで、十分なんです。'],
    },
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 4 && !s.hasFlag('stargazerSecretRevealed'),
      lines: [
        '……あなたには、話してもいい気がしてきました。',
        '昔、大切な人とここで星を見る約束をしたんです。',
        'もうその人はいませんが、この時間だけは、あの頃に戻れる気がして。',
      ],
      choices: [
        {
          text: '「その人のこと、聞かせてください」',
          lines: ['……ありがとう。', 'いつかまた、ゆっくり話しますね。'],
          effect: (s) => { s.setFlag('stargazerSecretRevealed'); s.setFlag('stargazerListened'); },
        },
        {
          text: '何も言わず、隣に座る',
          lines: ['……何も言わないでいてくれるんですね。', 'それだけで、救われる気がします。'],
          effect: (s) => { s.setFlag('stargazerSecretRevealed'); s.setFlag('stargazerComforted'); },
        },
      ],
    },
    {
      when: (s, npc) => s.getAffinity(npc.id) >= 2,
      lines: ['また会いましたね。', '夜のこの時間だけ、ここに来るんです。'],
      effect: (s) => s.setFlag('metNightVisitor'),
    },
    {
      lines: [
        '……こんばんは。',
        '昼間はあまり人に会わないようにしているんです。',
        '星がきれいな夜は、ここで過ごすのが好きで。',
      ],
      effect: (s) => s.setFlag('metNightVisitor'),
    },
  ],
};
