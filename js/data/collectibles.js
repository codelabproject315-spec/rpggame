// ============================================================
// 「収集アイテム」の定義（コレクション要素）。
// 入手方法は2種類:
//   ・source: 'hidden'  … 各マップに隠れて置かれているオブジェクトを調べて入手
//   ・source: 'choice'  … 特定NPCとの会話で、選んだ選択肢に応じて入手
// (choiceタイプは、どちらの選択肢を選んでも同じアイテムが手に入るが、
//  入手時のセリフ・後日談は選んだ内容によって変わる)
//
// 実際に「持っているかどうか」は state.hasItem(id) で判定する。
// CollectionUI（Kキーで開くコレクション帳）は、この一覧を元に
// 「入手済みは詳細を表示、未入手は？？？で伏せる」という表示を行う。
// ============================================================

export const COLLECTIBLES = [
  // ---- 隠しアイテム（マップに置かれたオブジェクトを調べて入手） ----
  {
    id: 'item_clover',
    name: '四つ葉のクローバー',
    description: '公園の花畑の片隅で見つけた、幸運のお守り。',
    source: 'hidden',
  },
  {
    id: 'item_bell',
    name: '鈴の欠片',
    description: '神社の参道に落ちていた、小さな鈴の欠片。',
    source: 'hidden',
  },
  {
    id: 'item_coin',
    name: '町内会の記念コイン',
    description: '広場の庭園に落ちていた、少し古い記念コイン。',
    source: 'hidden',
  },
  {
    id: 'item_raffle',
    name: '福引の景品',
    description: '商店街の庭先に落ちていた、当たりくじの景品。',
    source: 'hidden',
  },
  {
    id: 'item_yearbook',
    name: '古い卒業アルバムの写真',
    description: '校庭の花壇のそばで見つけた、色あせた一枚の写真。',
    source: 'hidden',
  },
  {
    id: 'item_bookmark',
    name: 'しおり',
    description: '図書館の読書ガーデンに落ちていた、手作りのしおり。',
    source: 'hidden',
  },
  {
    id: 'item_bottle',
    name: '瓶に入った手紙',
    description: '住宅街の庭先で見つけた、誰かからの小さな手紙。',
    source: 'hidden',
  },
  {
    id: 'item_charm_child',
    name: '小さい頃のお守り',
    description: '自宅の庭に落ちていた、幼い頃のお守り。',
    source: 'hidden',
  },

  // ---- 選択肢のごほうび（NPCとの会話で入手） ----
  {
    id: 'item_charm_forest',
    name: '森番のお守り',
    description: '森の人影が、正体を明かした証にくれたお守り。',
    source: 'choice',
  },
  {
    id: 'item_charm_star',
    name: '星のペンダント',
    description: '星を眺める人が、大切な思い出を話してくれた後にくれた品。',
    source: 'choice',
  },
  {
    id: 'item_charm_rain',
    name: '雨宿りの人からの手紙',
    description: '雨の日だけ現れる人影が、この町に残ると決めた日にくれた手紙。',
    source: 'choice',
  },
  {
    id: 'item_charm_shrine',
    name: '神社の御守り',
    description: '町の言い伝えを聞かせてくれた神主から授かった御守り。',
    source: 'choice',
  },
];
