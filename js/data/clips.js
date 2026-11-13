// Clips: frases cortas de anime y de japonés real en videos de YouTube (formato en docs/FORMATO.md).
// Misma forma que una lectura (paras, questions, after) más el video: yt, from y to en segundos.
// El texto y los tiempos salen de los subtítulos en japonés que publica el canal.

export default [
  {
    id: 'c01', yt: '-dUOzVp6-Y0', from: 603.3, to: 617.9, src: 'ワンパンマン #01', after: 'u8l1',
    es: 'En la caja del supermercado',
    paras: [[
      ['四百八十二|よんひゃくはちじゅうに=百 円 です 。', 'Son 482 yenes.'],
      ['はい 。', 'Sí…'],
      ['あっ 、 ちょっと 待って=待つ 。', 'Ah, espera un poco.'],
      ['八十二|はちじゅうに=十 円 あります=ある 。', 'Tengo 82 yenes.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cuánto cuesta la compra?', opts: ['428 yenes', '482 yenes', '382 yenes'], a: 1,
        why: '「四百八十二円です」: 四百 (よんひゃく) + 八十 (はちじゅう) + 二 (に).' },
      { t: 'mc', q: '¿Qué dice Saitama al final?', opts: ['八十二|はちじゅうに=十 円 です 。', '八十二|はちじゅうに=十 円 ありません=ある 。', '八十二|はちじゅうに=十 円 あります=ある 。'], a: 2,
        why: '**あります** = «hay / tengo»: tiene justo los 82 yenes en monedas.' },
    ],
    note: 'La cajera habla cortés (です). Saitama habla casual: {ちょっと 待って=待つ} es {待って=待つ ください} sin ください.',
  },
  {
    id: 'c02', yt: '-dUOzVp6-Y0', from: 521.0, to: 526.2, src: 'ワンパンマン #01', after: 'u11l3',
    es: 'Lo que Saitama quería ser',
    paras: [[
      ['そう だ よ 。', 'Eso es.'],
      ['俺 は 小さい 頃 、 ヒーロー に なりたかった=なる んだ 。', 'De niño, yo quería ser un héroe.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué forma de なる dice Saitama?', opts: ['なりたい=なる', 'なりました=なる', 'なりたかった=なる', 'なりたくなかった=なる'], a: 2,
        why: '〜たい se conjuga como un adjetivo い: なりたい (quiero ser) → **なりたかった** (quería ser). Con un sustantivo, «llegar a ser» es 〜に なる.' },
    ],
    note: '{俺} es «yo» masculino e informal. {んだ} al final da tono de explicación: es la versión casual de 〜んです.',
  },
  {
    id: 'c03', yt: '-dUOzVp6-Y0', from: 122.3, to: 131.1, src: 'ワンパンマン #01', after: 'u14l1',
    es: '¿Quién eres tú?',
    paras: [[
      ['何者 だ 、 お前 は ？', '¿Quién eres tú?'],
      ['趣味 で ヒーロー を やって=やる いる 者 だ 。', 'Soy alguien que hace de héroe por hobby.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué responde Saitama?', opts: ['ヒーロー を やりました=やる 。', 'ヒーロー を やって=やる いる 。', 'ヒーロー を やりたい=やる 。'], a: 1,
        why: '**やっている** = lo hace actualmente, como costumbre (〜ている). やる es «hacer» en casual, como する.' },
    ],
    note: 'Toda la frase {趣味 で ヒーロー を やって=やる いる} describe a {者} (persona): «alguien que…». {お前} es un «tú» brusco y {何者} un «quién» dramático: suenan a anime, no los uses con desconocidos. El orden está invertido para dar énfasis; lo normal sería {お前 は 何者 だ}.',
  },
  {
    id: 'c04', yt: '3TKp9yCGBjQ', from: 100.8, to: 112.3, src: 'クロミアニメ 第1話', after: 'u15l3',
    es: 'Rumbo a París',
    paras: [[
      ['お姉ちゃん に 会い=会う:raíz-ます に 行く よ ！', '¡Voy a ver a mi hermana!'],
      ['目的地 は パリ ！', '¡Destino: París!'],
      ['いざ 、 スペイン へ ！', '¡Rumbo a España!'],
      ['スペイン ？', '¿España?'],
      ['パリ は フランス ゾナ ！', '¡París está en Francia!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Hacia dónde grita Kuromi que parten?', opts: ['A París', 'A Francia', 'A España'], a: 2,
        why: 'El destino era パリ, pero grita 「いざ、スペインへ！」. Por eso Baku la corrige: París está en Francia.' },
      { t: 'mc', q: '¿Qué dice Kuromi al principio?', opts: ['お姉ちゃん に 会い=会う:raíz-ます に 行く よ 。', 'お姉ちゃん に 会い=会う:raíz-ます に 来る よ 。', 'お姉ちゃん に 会いました=会う よ 。'], a: 0,
        why: '**会いに行く** = «ir a ver»: la raíz del verbo (会い) + に + 行く dice a qué vas.' },
    ],
    note: '{ゾナ} es la muletilla con que Baku termina sus frases; no significa nada. {いざ} es un «¡adelante!» solemne.',
  },
  {
    id: 'c05', yt: 'wLu0ufkJjX0', from: 60.1, to: 63.3, src: 'クロミアニメ 第2話', after: 'u12l3',
    es: 'Antes de dormir',
    paras: [[
      ['歯 を 磨いて=磨く から 寝る の よ 。', 'Lávate los dientes y después te acuestas.'],
      ['はあい=はい 。', 'Sííí.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice la mamá?', opts: ['寝て=寝る から 磨く', '磨く 前 に 寝る', '磨いて=磨く から 寝る'], a: 2,
        why: '〜てから = «después de…»: primero 磨く, después 寝る. {の よ} al final es una orden suave, típica de una mamá.' },
    ],
  },
  {
    id: 'c06', yt: '8T7fA5M6P5U', from: 51.0, to: 55.8, src: 'わたしの幸せな結婚', after: 'u6l2',
    es: 'Una declaración',
    paras: [[
      ['私 は 旦那様 が … 好き です ！', 'Yo, a usted… ¡lo quiero!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice Miyo?', opts: ['旦那様 は 好き じゃありません 。', '旦那様 が 好き です 。', '旦那様 が 好き でした=です 。'], a: 1,
        why: 'A は B が 好きです: lo que gusta lleva **が**. 好き sirve para cosas y también para declararse.' },
    ],
    note: '{旦那様} es una forma muy respetuosa y antigua de llamar al esposo o al señor de la casa.',
  },
  {
    id: 'c07', yt: 'Bp3adZrf8DI', from: 13.9, to: 33.9, src: 'ポケモン「プリンのうた」', after: 'u8l2',
    es: 'Una amiga nueva',
    paras: [[
      ['ねえ 、 君 。 大丈夫 ？', 'Oye, tú. ¿Estás bien?'],
      ['どうして 泣いてる=泣く:〜ている(casual) の ？', '¿Por qué lloras?'],
      ['じゃあ さ 、 一緒に 遊ぼ=遊ぶ:«juguemos»(casual) ！', 'Entonces… ¡juguemos juntos!'],
      ['私 は モモ 。 よろしく ね ！', 'Yo soy Momo. ¡Mucho gusto!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le pregunta la niña?', opts: ['どうして 泣いてる=泣く:〜ている(casual) の ？', 'どうして 泣かない=泣く の ？', 'どうして 泣いた=泣く の ？'], a: 0,
        why: '泣いてる es 泣いている dicho rápido (se cae la い): «estás llorando». {の} al final hace la pregunta en casual, en vez de か.' },
      { t: 'mc', q: '¿Cómo se llama la niña?', opts: ['Mimi', 'Momo', 'Purin'], a: 1, why: '「私はモモ」. プリン es el Pokémon, que solo sabe decir su nombre.' },
    ],
    note: '{遊ぼ=遊ぶ:«juguemos»(casual)} es 遊ぼう, la versión casual de {遊びましょう=遊ぶ}: «juguemos».',
  },
  {
    id: 'c08', yt: 'Bp3adZrf8DI', from: 113.6, to: 117.1, src: 'ポケモン「プリンのうた」', after: 'u9l1',
    es: 'La canción de Purin',
    paras: [[
      ['ねえ 、 私 も プリン の 歌 、 聞きたい=聞く ！', 'Oye, ¡yo también quiero oír la canción de Purin!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice la niña?', opts: ['プリン の 歌 、 聞きたくない=聞く 。', 'プリン の 歌 、 聞いた=聞く 。', 'プリン の 歌 、 聞きたい=聞く 。'], a: 2,
        why: 'Raíz ます + たい = querer: 聞きます → **聞きたい**. En casual se omite la partícula を.' },
    ],
  },
  {
    id: 'c09', yt: 'P2ROQZfSKW4', from: 302.7, to: 310.1, src: 'ポケモン「薄明の翼」第1話', after: 'u8l1',
    es: 'La carta',
    paras: [[
      ['それ 、 ローズ さん へ の 手紙 です 。', 'Esa es una carta para el señor Rose.'],
      ['あの=あの#duda … 読んで=読む ください 。', 'Esto… ¡léala, por favor!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pide el niño?', opts: ['読まないで=読む ください 。', '読んで=読む ください 。', '読みました=読む 。'], a: 1,
        why: 'Forma て + ください = pedir algo con cortesía: 読む → 読んで → **読んでください**.' },
    ],
    note: '{へ の 手紙} = «carta para…»: へ marca el destinatario y の lo une a 手紙.',
  },
  {
    id: 'c10', yt: 'rjmKQ-fjnyQ', from: 200.3, to: 212.5, src: 'Nihongo-Learning · 公園', after: 'u8l2',
    es: 'En el parque',
    paras: [[
      ['これ は 公園 です 。', 'Esto es un parque.'],
      ['たくさん の 人 が 、 遊んで=遊ぶ います=いる 。', 'Hay mucha gente jugando.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué hace la gente?', opts: ['遊びました=遊ぶ 。', '遊びません=遊ぶ 。', '遊んで=遊ぶ います=いる 。'], a: 2,
        why: 'Forma て + います = lo están haciendo ahora: 遊ぶ → 遊んで → **遊んでいます**.' },
    ],
  },
  {
    id: 'c11', yt: 'h8aHI9R4p0I', from: 253.9, to: 260.0, src: 'Natural Japanese · カレー', after: 'u9l2',
    es: 'Una invitación al gato',
    paras: [[
      ['猫 ちゃん 、 一緒に 食べません=食べる か ？', 'Gatito, ¿comemos juntos?'],
      ['食べない=食べる ？', '¿No comes?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo invita al gato?', opts: ['一緒に 食べました=食べる か 。', '一緒に 食べません=食べる か 。', '一緒に 食べたい=食べる です か 。'], a: 1,
        why: '〜ませんか = invitación cortés: «¿no quieres…?». Después lo repite en casual: 食べない？' },
    ],
  },
  {
    id: 'c12', yt: 'h8aHI9R4p0I', from: 384.6, to: 395.0, src: 'Natural Japanese · カレー', after: 'u6l2',
    es: 'Al esposo no le gusta',
    paras: [[
      ['そして 夫 は カレー が … 嫌い です 。', 'Y a mi esposo el curry… no le gusta nada.'],
      ['好き じゃありません 。', 'No le gusta.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice del esposo?', opts: ['カレー が 好き です 。', 'カレー が 好き でした=です 。', 'カレー が 嫌い です 。'], a: 2,
        why: '嫌い (きらい) es lo contrario de 好き y funciona igual: A は B が 嫌いです. Luego lo suaviza: 好きじゃありません.' },
    ],
  },
  // ── clips generados desde los subtítulos (tiempos calculados) ──
  {
    id: 'c13', yt: 'iAaTqHD91Co', from: 60.9, to: 64.2, src: 'コタローは1人暮らし', after: 'u7l3',
    es: '¿Es usted el papá?',
    paras: [[
      ['お父さん です か ？', '¿Es usted el papá?'],
      ['え ？ いや 、 違います=違う 。', '¿Eh? No, no lo soy.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué responde el hombre?', opts: ['はい 、 そう です 。', 'いや 、 違います=違う 。', 'いや 、 違いました=違う 。'], a: 1,
        why: '**違います** (de 違う, «ser distinto») es la forma normal de decir «no, se equivoca».' },
    ],
  },
  {
    id: 'c14', yt: 'iAaTqHD91Co', from: 129.9, to: 132.7, src: 'コタローは1人暮らし', after: 'u9l3',
    es: 'El vecino nuevo',
    paras: [[
      ['はじめまして 、 青田 と 言います=言う 。', 'Mucho gusto, me llamo Aota.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo dice su nombre?', opts: ['青田 です', '青田 と 言います=言う', '青田 と 言いました=言う'], a: 1,
        why: 'Nombre + **と言います** = «me llamo…»: と marca lo que se dice.' },
    ],
  },
  {
    id: 'c15', yt: 'J4TI78gmNSQ', from: 113.7, to: 117.4, src: '君に届け', after: 'u10l2',
    es: 'Feliz cumpleaños',
    paras: [[
      ['お誕生日 おめでとうございます 。', 'Feliz cumpleaños.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué celebra Sawako?', opts: ['Un cumpleaños', 'El Año Nuevo', 'Una graduación'], a: 0,
        why: '誕生日 = cumpleaños; con お delante es más cortés. おめでとうございます = felicidades.' },
    ],
  },
  {
    id: 'c16', yt: 'J4TI78gmNSQ', from: 77.3, to: 79.3, src: '君に届け', after: 'u8l3',
    es: '¿Puedo comer?',
    paras: [[
      ['食べて=食べる も いい ？', '¿Puedo comer?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo pide permiso?', opts: ['食べて=食べる ください', '食べて=食べる も いい ？', '食べたい=食べる ？'], a: 1,
        why: 'Forma て + も いい = «¿está bien si…?». En cortés sería 食べてもいいですか.' },
    ],
  },
  {
    id: 'c17', yt: 'J4TI78gmNSQ', from: 128.6, to: 133.9, src: '君に届け', after: 'u14l3',
    es: 'No pude hacer nada',
    paras: [[
      ['ごめんなさい 、 何も できなくて=できる 。', 'Perdón por no haber podido hacer nada.'],
      ['えっ 、 なんで ？ いい よ 。', '¿Eh? ¿Por qué? No pasa nada.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Por qué se disculpa Sawako?', opts: ['何も できなくて=できる', '何か できて=できる', '何も 食べなくて=食べる'], a: 0,
        why: '何も + negativo = «nada». できなくて es できない en forma て: da la razón de la disculpa.' },
    ],
  },
  {
    id: 'c18', yt: '9fytv9mk-2Q', from: 42.7, to: 49.3, src: '君に届け', after: 'u9l3',
    es: 'Creo que es precioso',
    paras: [[
      ['すごく=すごい いい ！', '¡Es buenísimo!'],
      ['素敵 だ と 思う 。', 'Creo que es precioso.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo da su opinión?', opts: ['素敵 だ と 思う', '素敵 だ と 言う', '素敵 だった=だ と 思う'], a: 0,
        why: 'Frase en forma simple + **と思う** = «creo que…». Con adjetivos な y sustantivos va だ antes de と.' },
    ],
  },
  {
    id: 'c19', yt: 'Oht1Z8aHNyA', from: 0, to: 3.3, src: 'クロミアニメ 第3話', after: 'u9l2',
    es: 'Llegamos a París',
    paras: [[
      ['ここ が パリ だ ね ！', '¡Así que esto es París!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice Kuromi?', opts: ['ここ が パリ だ ね', 'そこ が パリ だ ね', 'ここ は パリ じゃない=じゃありません:casual ね'], a: 0,
        why: 'ここ = aquí. だ es です en casual, y ね busca que el otro esté de acuerdo.' },
    ],
  },
  {
    id: 'c20', yt: 'Oht1Z8aHNyA', from: 7.9, to: 15.4, src: 'クロミアニメ 第3話', after: 'u7l1',
    es: '¿Dónde estará mi hermana?',
    paras: [[
      ['さ 、 あっち へ 行く よ ！', '¡Ya, vamos para allá!'],
      ['お姉ちゃん 、 どこ に いる んだろう 。', '¿Dónde estará mi hermana?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué se pregunta Kuromi?', opts: ['どこ に ある んだろう', 'どこ に いる んだろう', 'どこ に 行く んだろう'], a: 1,
        why: 'Para personas se usa **いる**, no ある. んだろう = «me pregunto…».' },
    ],
  },
  {
    id: 'c21', yt: 'kJtCbYWSliA', from: 43.1, to: 45.6, src: 'クロミアニメ 第4話', after: 'u11l3',
    es: 'Quiero ser más linda',
    paras: [[
      ['ウチ 、 もっと かわいく=かわいい なりたい=なる んで 。', 'Es que yo quiero ser más linda.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué quiere Greco?', opts: ['もっと かわいく=かわいい なりたい=なる', 'もっと かわいく=かわいい なった=なる', 'もっと かわいく=かわいい なりました=なる'], a: 0,
        why: 'Adjetivo い → く + なる = volverse…: かわいい → かわいく なる. Con たい: **かわいくなりたい**, «quiero volverme linda».' },
    ],
  },
  {
    id: 'c22', yt: 'kJtCbYWSliA', from: 72.8, to: 77.5, src: 'クロミアニメ 第4話', after: 'u11l2',
    es: 'Eres la número uno',
    paras: [[
      ['好き だ よ 、 グレコ 。', 'Te quiero, Greco.'],
      ['あんた が 一番 だ よ 。', 'Tú eres la número uno.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le dice a Greco?', opts: ['あんた が 一番 だ よ', 'あんた は 一番 じゃない=じゃありません:casual よ', 'あんた が 一番 だった=だ よ'], a: 0,
        why: '一番 (いちばん) = el número uno, el mejor. が señala quién lo es: «**tú** eres la mejor».' },
    ],
  },
  {
    id: 'c23', yt: 'hEBXyNS4WL8', from: 77.7, to: 79.9, src: 'クロミアニメ 第5話', after: 'u9l1',
    es: 'Antojo de cheesecake',
    paras: [[
      ['それより アタイ 、 チーズケーキ 食べたい=食べる ！', 'Más importante: ¡yo quiero comer cheesecake!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué quiere Kuromi?', opts: ['チーズケーキ 食べた=食べる', 'チーズケーキ 食べたい=食べる', 'チーズケーキ 食べない=食べる'], a: 1,
        why: 'Raíz ます + たい = querer: 食べます → **食べたい**. En casual se omite を.' },
    ],
  },
  {
    id: 'c24', yt: 'hEBXyNS4WL8', from: 40.8, to: 44.8, src: 'クロミアニメ 第5話', after: 'u8l1',
    es: '¡Escúchenme!',
    paras: [[
      ['わあ ！ 待って=待つ 、 話 を 聞いて=聞く ください ！', '¡Ay! ¡Esperen, escúchenme, por favor!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pide?', opts: ['話 を 聞いて=聞く ください', '話 を 聞かないで=聞く ください', '話 を して=する ください'], a: 0,
        why: 'Forma て + ください = pedir algo: 聞く → 聞いて → **聞いてください**. 話を聞く = escuchar lo que alguien dice.' },
    ],
  },
  {
    id: 'c25', yt: 'kvXocHmMKQc', from: 25.3, to: 27.9, src: 'ポケモン「ぽかぽかマグマッグハウス」', after: 'u11l3',
    es: 'Has crecido',
    paras: [[
      ['また 少し 大きく=大きい なった=なる ね 。', 'Has crecido otro poquito.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le dice el abuelo?', opts: ['大きい ね', '大きく=大きい なった=なる ね', '大きく=大きい なりたい=なる ね'], a: 1,
        why: 'Adjetivo い → く + なる = volverse…: 大きい → **大きく なった**, «te pusiste grande».' },
    ],
  },
  {
    id: 'c26', yt: 'kvXocHmMKQc', from: 38.9, to: 44.7, src: 'ポケモン「ぽかぽかマグマッグハウス」', after: 'u15l3',
    es: 'Mañana vengo a buscarla',
    paras: [[
      ['それじゃあ 、 明日 迎え に 来る から 。', 'Bueno, mañana vengo a buscarla.'],
      ['アンナ の こと 、 よろしく ね 。', 'Te encargo a Anna.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cuándo vuelve la mamá?', opts: ['今日', '明日', '来週'], a: 1,
        why: '迎えに来る = venir a buscar a alguien: sustantivo de acción + に + 来る.' },
    ],
  },
  {
    id: 'c27', yt: 'kvXocHmMKQc', from: 70.8, to: 77.1, src: 'ポケモン「ぽかぽかマグマッグハウス」', after: 'u15l2',
    es: 'Calienta la casa',
    paras: [[
      ['マグマッグ は 火 みたい に 熱い んだ よ 。', 'Slugma es caliente como el fuego.'],
      ['おうち を 暖かく=暖かい して=する くれる んだ 。', 'Nos mantiene calentita la casa.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué hace Slugma por la familia?', opts: ['おうち を 暖かく=暖かい して=する くれる', 'おうち を 暖かく=暖かい して=する あげる', 'おうち を 寒く=寒い して=する くれる'], a: 0,
        why: 'Forma て + **くれる** = alguien hace algo por mí o por los míos. 暖かくする = calentar.' },
    ],
  },
  {
    id: 'c28', yt: 'kvXocHmMKQc', from: 243.4, to: 252.3, src: 'ポケモン「ぽかぽかマグマッグハウス」', after: 'u15l2',
    es: 'Me ayudó a cocinar',
    paras: [[
      ['さあ 、 できた=できる ！', '¡Ya, listo!'],
      ['マグマッグ が 手伝って=手伝う くれた=くれる んだ よ 。', 'Slugma me ayudó.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Quién ayudó?', opts: ['マグマッグ が 手伝って=手伝う くれた=くれる', 'マグマッグ に 手伝って=手伝う あげた=あげる', 'マグマッグ を 手伝った=手伝う'], a: 0,
        why: '手伝ってくれた = «me ayudó» (hizo el favor de ayudarme). できた = «quedó listo».' },
    ],
  },
  {
    id: 'c29', yt: 'kvXocHmMKQc', from: 322.7, to: 325.5, src: 'ポケモン「ぽかぽかマグマッグハウス」', after: 'u6l3',
    es: '¿Lo pasaste bien?',
    paras: [[
      ['楽しかった=楽しい ？', '¿Lo pasaste bien?'],
      ['楽しかった=楽しい ！', '¡Lo pasé bien!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué forma de 楽しい usan?', opts: ['楽しい', '楽しかった=楽しい', '楽しくない=楽しい'], a: 1,
        why: 'Pasado de un adjetivo い: 楽しい → **楽しかった**. Subiendo el tono es pregunta.' },
    ],
  },
  {
    id: 'c30', yt: 'zK1PJAB6Wl8', from: 37.7, to: 40.3, src: 'ポケモン「薄明の翼」第2話', after: 'u5l2',
    es: 'Me bajo aquí',
    paras: [[
      ['ここ で 降ります=降りる ！', '¡Me bajo aquí!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice la chica?', opts: ['ここ で 降ります=降りる', 'ここ で 降りません=降りる', 'ここ で 降りました=降りる'], a: 0,
        why: '降りる = bajarse (de un taxi, tren o bus). で marca el lugar donde se hace.' },
    ],
  },
  {
    id: 'c31', yt: 'zK1PJAB6Wl8', from: 337.1, to: 341, src: 'ポケモン「薄明の翼」第2話', after: 'u3l4',
    es: 'Se te quedó esto',
    paras: [[
      ['ほら 、 これ 、 忘れ物 。', 'Toma, esto se te quedó.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le entrega?', opts: ['Algo que se le quedó', 'Un regalo', 'Una carta'], a: 0,
        why: '忘れ物 (わすれもの) = cosa olvidada: 忘れる (olvidar) + 物 (cosa).' },
    ],
  },
  {
    id: 'c32', yt: 'cwqz6ZVRclw', from: 65.3, to: 71.9, src: 'First Love 初恋', after: 'u9l3',
    es: '¿Existen los marcianos?',
    paras: [[
      ['えっ 、 野口 さん は どう 思います=思う か 。', '¿Y usted qué opina, Noguchi?'],
      ['えー 、 火星人 です か 。', 'Mmm… ¿de los marcianos?'],
      ['うん 、 いる と 思います=思う 。', 'Sí, creo que existen.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué responde Noguchi?', opts: ['いる と 思います=思う', 'いない=いる と 思います=思う', 'いる と 言いました=言う'], a: 0,
        why: 'Frase en forma simple + **と思います** = «creo que…». どう思いますか = «¿qué opina?».' },
    ],
  },
  {
    id: 'c33', yt: 'cwqz6ZVRclw', from: 77.1, to: 80.2, src: 'First Love 初恋', after: 'u9l1',
    es: 'Me gustaría ir a Marte',
    paras: [[
      ['行って=行く みたい=見る:quiero-probar です よ ね 。 私 も 行きたい=行く です 。', 'Dan ganas de ir, ¿cierto? Yo también quiero ir.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice al final?', opts: ['私 も 行きました=行く', '私 も 行きたい=行く です', '私 は 行きたくない=行く です'], a: 1,
        why: '行きたいです = quiero ir. 行ってみたい = «quiero probar ir»: forma て + みる, que el camino no enseña.' },
    ],
  },
  {
    id: 'c34', yt: 'cwqz6ZVRclw', from: 45.4, to: 49.7, src: 'First Love 初恋', after: 'u9l3',
    es: 'Una pregunta rara',
    paras: [[
      ['並木 さん は 、 火星人 って いる と 思います=思う ？', 'Namiki, ¿usted cree que existen los marcianos?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta?', opts: ['Si cree que existen los marcianos', 'Si ha visto un marciano', 'Si quiere ir a Marte'], a: 0,
        why: '火星人 (かせいじん) = marciano. って marca el tema en casual (como は). いると思います？ = ¿cree que existen?' },
    ],
  },
  {
    id: 'c35', yt: 'hoqVNsqMSow', from: 218.9, to: 221, src: 'ポケモン「放課後のブレス」', after: 'u9l2',
    es: '¡A disfrutar!',
    paras: [[
      ['いい ね ！ 楽しもう=楽しむ:«disfrutemos»(casual) ！', '¡Qué bien! ¡Disfrutémoslo!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice Nemona?', opts: ['楽しもう=楽しむ', '楽しかった=楽しい', '楽しくない=楽しい'], a: 0,
        why: '楽しもう es la forma casual de 楽しみましょう: «¡disfrutemos!». Viene del verbo 楽しむ, pariente de 楽しい.' },
    ],
  },
  {
    id: 'c36', yt: 'a5EUcaR9hzo', from: 88.1, to: 93.8, src: '喧嘩独学', after: 'u14l1',
    es: 'Hora de irse',
    paras: [[
      ['おはよう 。 そろそろ 行く 時間 よ ね 。', 'Buenos días. Ya casi es hora de irte, ¿no?'],
      ['今日 も 楽しんで=楽しむ ！', '¡Que lo pases bien hoy también!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice la mamá?', opts: ['そろそろ 行く 時間', 'そろそろ 寝る 時間', 'そろそろ 食べる 時間'], a: 0,
        why: '行く時間 = «hora de ir»: el verbo describe a 時間. 楽しんで es la forma て de 楽しむ, usada como deseo.' },
    ],
  },
  {
    id: 'c37', yt: 'a5EUcaR9hzo', from: 23.2, to: 27.5, src: '喧嘩独学', after: 'u11l3',
    es: '¿Quieres ser fuerte?',
    paras: [[
      ['あなた は 強く=強い なりたい=なる です か ？', '¿Quieres volverte fuerte?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta la voz?', opts: ['強く=強い なりたい=なる です か', '強く=強い なりました=なる か', '強い です か'], a: 0,
        why: 'Adjetivo い → く + なる = volverse…: 強い → 強く なる. Con たい: **強くなりたい**.' },
    ],
  },
  {
    id: 'c38', yt: 'a5EUcaR9hzo', from: 136.3, to: 141.1, src: '喧嘩独学', after: 'u9l3',
    es: 'Una transmisión en vivo',
    paras: [[
      ['はい 、 ルミ です 。', 'Hola, soy Rumi.'],
      ['まだまだ フォロワー 少ない ので 、 よろしくお願いします 。', 'Todavía tengo pocos seguidores, así que cuento con ustedes.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Por qué pide apoyo?', opts: ['Porque tiene pocos seguidores', 'Porque es su cumpleaños', 'Porque es su último video'], a: 0,
        why: '少ない = pocos. ので = «como…, por eso…»: da la razón igual que から, pero más suave.' },
    ],
  },
  {
    id: 'c39', yt: '7Vm_fEjWST0', from: 29, to: 35.6, src: 'Unscripted Japanese · vlog', after: 'u4l3',
    es: 'Vlog: día y hora',
    paras: [[
      ['えっと 、 今日 は 火曜日 。', 'A ver, hoy es martes.'],
      ['今 、 朝 の 十時|じゅうじ=時 十二分|じゅうにふん=分 です 。', 'Ahora son las 10:12 de la mañana.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué día es?', opts: ['月曜日', '火曜日', '木曜日'], a: 1,
        why: '火曜日 (かようび) = martes.' },
      { t: 'mc', q: '¿Qué hora es?', opts: ['10:12', '10:20', '12:10'], a: 0,
        why: '十時 (じゅうじ) 十二分 (じゅうにふん): la hora va primero, luego los minutos.' },
    ],
  },
  {
    id: 'c40', yt: '7Vm_fEjWST0', from: 35.4, to: 39.6, src: 'Unscripted Japanese · vlog', after: 'u8l2',
    es: 'Vlog: dónde vivo',
    paras: [[
      ['えっと 、 私 は 今 ここ 、 ロサンゼルス に 住んでる=住む:〜ている(casual) んだ けど 。', 'A ver, yo ahora vivo aquí, en Los Ángeles.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice Ami?', opts: ['ロサンゼルス に 住んでる=住む', 'ロサンゼルス に 住みたい=住む', 'ロサンゼルス に 行く'], a: 0,
        why: '住んでる es 住んでいる dicho rápido. El lugar donde se vive lleva **に**.' },
    ],
  },
  {
    id: 'c41', yt: '7Vm_fEjWST0', from: 39.4, to: 45.4, src: 'Unscripted Japanese · vlog', after: 'u5l2',
    es: 'Vlog: me voy al trabajo',
    paras: [[
      ['えっと 、 今日 は ちょっと 仕事 に 行ってきます 。', 'A ver, hoy voy un rato al trabajo.'],
      ['はい 、 それでは 行ってきます 。', 'Ya, entonces me voy.'],
    ]],
    questions: [
      { t: 'mc', q: '¿A dónde va?', opts: ['仕事 に', '学校 に', '公園 に'], a: 0,
        why: '行ってきます = «voy y vuelvo»: es lo que se dice al salir de casa.' },
    ],
  },
  {
    id: 'c42', yt: '7Vm_fEjWST0', from: 55.1, to: 65.5, src: 'Unscripted Japanese · vlog', after: 'u14l3',
    es: 'Vlog: solo seis minutos',
    paras: [[
      ['家 から 本当 に 六分|ろっぷん=分 。', 'Desde la casa son de verdad seis minutos.'],
      ['家 から たった の 六分|ろっぷん=分 。', 'Apenas seis minutos desde la casa.'],
      ['六分|ろっぷん=分 しか かかりません=かかる 。', 'No se demora más que seis minutos.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo dice «solo seis minutos»?', opts: ['六分|ろっぷん=分 しか かかりません=かかる', '六分|ろっぷん=分 しか かかります=かかる', '六分|ろっぷん=分 も かかります=かかる'], a: 0,
        why: '**しか** siempre va con el verbo en negativo: «no… más que». かかる = demorar, tomar tiempo.' },
    ],
  },
  {
    id: 'c43', yt: '7Vm_fEjWST0', from: 65.8, to: 71.7, src: 'Unscripted Japanese · vlog', after: 'u6l1',
    es: 'Vlog: el auto sucio',
    paras: [[
      ['ちょっと 車 、 めっちゃ 汚い んだ けど 。', 'El auto está súper sucio…'],
      ['はい 、 汚い です 。', 'Sí, está sucio.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo está el auto?', opts: ['きれい です', '汚い です', '新しい です'], a: 1,
        why: '汚い (きたない) = sucio; es un adjetivo い aunque termine parecido a きれい. めっちゃ = «súper», muy coloquial.' },
    ],
  },
  {
    id: 'c44', yt: '7Vm_fEjWST0', from: 89.7, to: 96.4, src: 'Unscripted Japanese · vlog', after: 'u8l2',
    es: 'Vlog: una merienda',
    paras: [[
      ['お腹 空いた|すいた=空く#すく から 、 おやつ 食べてます=食べる:〜ています(casual) 。', 'Me dio hambre, así que estoy comiendo algo.'],
      ['仕事 から 家 に 帰って=帰る きました=来る 。', 'Volví del trabajo a la casa.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Por qué come?', opts: ['お腹 空いた|すいた=空く#すく から', 'おいしい から', '時間 が ある から'], a: 0,
        why: 'お腹(が)空いた = «me dio hambre». から después de la frase da la razón.' },
    ],
  },
  {
    id: 'c45', yt: '7Vm_fEjWST0', from: 106.2, to: 110.6, src: 'Unscripted Japanese · vlog', after: 'u11l1',
    es: 'Vlog: quién soy',
    paras: [[
      ['名前 は あみ で 、 えっと 、 日本 人|じん=じん です 。', 'Me llamo Ami y, a ver, soy japonesa.'],
    ]],
    questions: [
      { t: 'mc', q: '¿De dónde es Ami?', opts: ['De Japón', 'De Estados Unidos', 'De China'], a: 0,
        why: '日本人 = japonés/a. で une las dos frases: «me llamo Ami **y**…» (forma て de です).' },
    ],
  },
  {
    id: 'c46', yt: 'rjmKQ-fjnyQ', from: 19, to: 30.6, src: 'Nihongo-Learning · 公園', after: 'u3l4',
    es: 'Parque: ¿qué es esto?',
    paras: [[
      ['これ は 何|なん=なん です か 。', '¿Qué es esto?'],
      ['これ は 花 です 。', 'Esto es una flor.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué es?', opts: ['花', '木', '水'], a: 0,
        why: 'これは何ですか = ¿qué es esto? 花 (はな) = flor.' },
    ],
  },
  {
    id: 'c47', yt: 'rjmKQ-fjnyQ', from: 154.9, to: 165.5, src: 'Nihongo-Learning · 公園', after: 'u7l1',
    es: 'Parque: muchos árboles',
    paras: [[
      ['この 公園 に は 、 木 が たくさん あります=ある 。', 'En este parque hay muchos árboles.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué hay en el parque?', opts: ['木 が たくさん あります=ある', '木 が たくさん います=いる', '木 が ありません=ある'], a: 0,
        why: 'Para cosas y plantas se usa **あります**; います es para personas y animales.' },
    ],
  },
  {
    id: 'c48', yt: 'rjmKQ-fjnyQ', from: 228.2, to: 241.3, src: 'Nihongo-Learning · 公園', after: 'u6l1',
    es: 'Parque: un edificio',
    paras: [[
      ['これ は ビル です 。', 'Esto es un edificio.'],
      ['ビル は 、 とても 大きい です 。', 'El edificio es muy grande.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo es el edificio?', opts: ['とても 小さい です', 'とても 大きい です', 'とても 古い です'], a: 1,
        why: '大きい (おおきい) = grande. とても = muy.' },
    ],
  },
  {
    id: 'c49', yt: 'h8aHI9R4p0I', from: 39.2, to: 46.1, src: 'Natural Japanese · カレー', after: 'u5l4',
    es: 'Curry: lo hice yo',
    paras: [[
      ['これ は 私 の カレー です 。', 'Este es mi curry.'],
      ['私 が 作りました=作る 。', 'Lo hice yo.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Quién hizo el curry?', opts: ['私 が 作りました=作る', '夫 が 作りました=作る', '私 が 買いました=買う'], a: 0,
        why: '私**が** = «fui yo quien…»: が destaca quién lo hizo.' },
    ],
  },
  {
    id: 'c50', yt: 'h8aHI9R4p0I', from: 65.1, to: 75.9, src: 'Natural Japanese · カレー', after: 'u5l4',
    es: 'Curry: todos los días',
    paras: [[
      ['カレー を たくさん 作りました=作る 。', 'Hice mucho curry.'],
      ['そして 毎日 毎日 毎日 カレー を 食べました=食べる 。', 'Y comí curry todos, todos, todos los días.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pasó después?', opts: ['毎日 カレー を 食べました=食べる', '毎日 カレー を 作りました=作る', '毎日 カレー を 買いました=買う'], a: 0,
        why: 'そして = «y después». Repite 毎日 para exagerar.' },
    ],
  },
  {
    id: 'c51', yt: 'h8aHI9R4p0I', from: 86.4, to: 92.9, src: 'Natural Japanese · カレー', after: 'u7l3',
    es: 'Curry: mi familia',
    paras: [[
      ['私 の 家族 は 、 私 と 猫 と 夫 です 。', 'Mi familia somos yo, el gato y mi esposo.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Quiénes son su familia?', opts: ['Ella, el gato y el esposo', 'Ella, el perro y el esposo', 'Ella, el gato y el hijo'], a: 0,
        why: 'と une sustantivos: 私 と 猫 と 夫.' },
    ],
  },
  {
    id: 'c52', yt: 'h8aHI9R4p0I', from: 368.8, to: 377.3, src: 'Natural Japanese · カレー', after: 'u9l1',
    es: 'Curry: quiero comer',
    paras: [[
      ['私 は カレー が 好き です 。', 'A mí me gusta el curry.'],
      ['食べたい=食べる です 。 食べたい=食べる 、 食べたい=食べる ！', 'Quiero comer. ¡Quiero, quiero!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué repite?', opts: ['食べたい=食べる', '食べました=食べる', '食べません=食べる'], a: 0,
        why: 'Raíz ます + たい = querer. Primero lo dice cortés (食べたいです) y después casual (食べたい).' },
    ],
  },
  {
    id: 'c53', yt: '-dUOzVp6-Y0', from: 680.3, to: 683.4, src: 'ワンパンマン #01', after: 'u9l2',
    es: '¿Me tomo esto?',
    paras: [[
      ['えっ … これ 、 飲む の ？', '¿Eh…? ¿Esto me lo tomo?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta?', opts: ['これ 、 飲む の ？', 'これ 、 飲んだ=飲む の ？', 'これ 、 飲まない=飲む の ？'], a: 0,
        why: 'Forma simple + の？ = pregunta casual (en cortés, 飲みますか).' },
    ],
  },
  {
    id: 'c54', yt: '-dUOzVp6-Y0', from: 1322.4, to: 1325, src: 'ワンパンマン #01', after: 'u11l3',
    es: 'Demasiado fuerte',
    paras: [[
      ['俺 は 強く=強い なりすぎた=なりすぎる 。', 'Me volví demasiado fuerte.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le pasó a Saitama?', opts: ['強く=強い なりたい=なる', '強く=強い なりすぎた=なりすぎる', '強く=強い なかった=ない'], a: 1,
        why: '強く なる = volverse fuerte. Raíz + すぎる = «demasiado»: なりすぎた, «me volví demasiado…».' },
    ],
  },
  {
    id: 'c55', yt: 'Bp3adZrf8DI', from: 242.4, to: 245.6, src: 'ポケモン「プリンのうた」', after: 'u9l2',
    es: 'Purin es mi amigo',
    paras: [[
      ['プリン は 私 の 友だち だ もん 。', '¡Es que Purin es mi amigo!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice la niña?', opts: ['プリン は 私 の 友だち だ もん', 'プリン は 私 の 友だち じゃない=じゃありません:casual もん', 'プリン は 私 の ポケモン だ もん'], a: 0,
        why: 'もん al final da una razón con tono de niño que reclama: «¡es que…!».' },
    ],
  },
  {
    id: 'c56', yt: 'rjmKQ-fjnyQ', from: 98.5, to: 101.3, src: 'Nihongo-Learning · 公園', after: 'u7l2',
    es: 'Parque: me siento en el banco',
    paras: [[
      ['ベンチ に 座ります=座る 。', 'Me siento en el banco.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué partícula lleva el banco?', opts: ['ベンチ に 座ります=座る', 'ベンチ を 座ります=座る', 'ベンチ で 座ります=座る'], a: 0,
        why: 'El lugar donde uno queda sentado lleva **に**: 〜に 座る.' },
    ],
  },
  {
    id: 'c57', yt: 'h8aHI9R4p0I', from: 489.3, to: 491.4, src: 'Natural Japanese · カレー', after: 'u6l3',
    es: 'Curry: todo estaba rico',
    paras: [[
      ['全部 おいしかった=おいしい です 。', 'Todo estaba rico.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo estaba la comida?', opts: ['全部 おいしい です', '全部 おいしかった=おいしい です', '全部 おいしくなかった=おいしい です'], a: 1,
        why: 'Pasado de un adjetivo い: おいしい → **おいしかった** (+ です para ser cortés).' },
    ],
  },
  {
    id: 'c58', yt: 'L0IExeAFzb8', from: 45.4, to: 49.5, src: 'コタローは1人暮らし', after: 'u9l2',
    es: 'Veamos dibujos animados',
    paras: [[
      ['コタロー きゅん 、 一緒に 「 とのさまん 」 見よう=見る:«veamos»(casual) ぜ 。', 'Kotaro, veamos «Tonosaman» juntos.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué propone el vecino?', opts: ['一緒に 見よう=見る ぜ', '一緒に 見た=見る ぜ', '一緒に 見ない=見る ぜ'], a: 0,
        why: '見よう es la forma casual de 見ましょう: «veamos». 一緒に = juntos.' },
    ],
  },
  {
    id: 'c59', yt: 'T4ghvDx7x4Q', from: 146.6, to: 150.1, src: '古見さんは、コミュ症です。', after: 'u7l1',
    es: 'Silencio en la biblioteca',
    paras: [[
      ['図書室 で は お静かに ！', '¡En la biblioteca, silencio!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Dónde hay que guardar silencio?', opts: ['図書室 で', '教室 で', '学校 で'], a: 0,
        why: '図書室 (としょしつ) es la biblioteca de un colegio; で marca el lugar donde pasa algo.' },
    ],
    note: '{お静かに} es la forma cortés y cortante de pedir silencio; viene de {静か}.',
  },
  {
    id: 'c60', yt: 'T4ghvDx7x4Q', from: 174.1, to: 177.2, src: '古見さんは、コミュ症です。', after: 'u9l2',
    es: '¿Adónde vamos ahora?',
    paras: [[
      ['さて 、 次 は どこ 行こっか=行く:«¿vamos?»(casual) ？', 'A ver, ¿adónde vamos ahora?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta Najimi?', opts: ['次 は どこ 行こっか=行く', '次 は どこ 行った=行く', '次 は いつ 行こっか=行く'], a: 0,
        why: '行こっか es 行こうか dicho rápido: «¿vamos…?» (casual de 行きましょうか). 次 = el siguiente.' },
    ],
  },
  {
    id: 'c61', yt: 'T4ghvDx7x4Q', from: 46.3, to: 50.3, src: '古見さんは、コミュ症です。', after: 'u8l3',
    es: 'Ve a comprármelo',
    paras: [[
      ['買って=買う きて=来る よ 。', 'Anda a comprármelo.'],
      ['パン は トースト ね 。', 'El pan, tostado, ¿ya?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le pide Najimi?', opts: ['買って=買う きて=来る よ', '買って=買う いる よ', '買わないで=買う よ'], a: 0,
        why: '買ってくる = «ir a comprar y volver». En forma て, sin ください, es una petición casual entre amigos.' },
    ],
  },
  {
    id: 'c62', yt: 'Hk5aBoVs11s', from: 23.7, to: 36.8, src: 'ロマンティック・キラー', after: 'u9l2',
    es: 'Llévate el paraguas',
    paras: [[
      ['持ってけ=持つ:«llévatelo»(casual) よ 。', 'Llévatelo.'],
      ['ううん 、 いらない=要る 。', 'No, no lo necesito.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué responde Anzu?', opts: ['ううん 、 いらない=要る', 'うん 、 いる=要る', 'ううん 、 いない=いる'], a: 0,
        why: 'いらない = «no lo necesito» (negativo de 要る, necesitar). ううん es «no» y うん es «sí»: se distinguen por la entonación.' },
    ],
  },
  {
    id: 'c63', yt: 'Hk5aBoVs11s', from: 60.9, to: 63.5, src: 'ロマンティック・キラー', after: 'u5l4',
    es: '¿Nos hemos visto antes?',
    paras: [[
      ['どこか で 会いました=会う っけ 。', '¿Nos habíamos visto en alguna parte?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta?', opts: ['どこか で 会いました=会う っけ', 'どこか で 会います=会う か', 'どこ で 会いたい=会う です か'], a: 0,
        why: 'どこかで = en alguna parte. っけ al final es para cuando uno trata de acordarse: «¿…era?».' },
    ],
  },
  {
    id: 'c64', yt: 'yuj1Iw-vtPc', from: 17.6, to: 19.8, src: 'アオのハコ', after: 'u12l3',
    es: 'Léelo antes de dormir',
    paras: [[
      ['寝る 前 に これ 読んで=読む 。', 'Lee esto antes de dormir.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cuándo tiene que leerlo?', opts: ['寝る 前 に', '寝て=寝る から', '寝た=寝る 後 で'], a: 0,
        why: 'Verbo en forma diccionario + **前に** = antes de…' },
    ],
  },
  {
    id: 'c65', yt: 'soxf2i6LQ6k', from: 45.7, to: 49.1, src: 'アオのハコ', after: 'u9l3',
    es: 'Sabía que lo dirías',
    paras: [[
      ['言う と 思った=思う 。', 'Sabía que lo ibas a decir.'],
      ['終わり 、 終わり 。', 'Se acabó, se acabó.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice el mayor?', opts: ['言う と 思った=思う', '言う と 思う', '言った=言う と 思う'], a: 0,
        why: '言うと思った = «pensé que lo dirías»: frase simple + と + 思った.' },
    ],
  },
  {
    id: 'c66', yt: 'soxf2i6LQ6k', from: 23, to: 25, src: 'アオのハコ', after: 'u11l3',
    es: 'Estás más fuerte',
    paras: [[
      ['また 強く=強い なってる=なる:〜ている(casual) 。', 'Te has vuelto más fuerte otra vez.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué nota el mayor?', opts: ['また 強く=強い なってる=なる', 'また 強く=強い なりたい=なる', 'また 強くない=強い'], a: 0,
        why: '強く なる = volverse fuerte; なってる (なっている) = «ya te has vuelto».' },
    ],
  },
  {
    id: 'c67', yt: 'ritJkCupbG4', from: 23.9, to: 27, src: 'アオのハコ', after: 'u14l1',
    es: 'Alguien a quien quiero ver',
    paras: [[
      ['一番 に 会いたい=会う 人 が いる 。', 'Hay alguien a quien quiero ver antes que a nadie.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice Taiki?', opts: ['会いたい=会う 人 が いる', '会った=会う 人 が いる', '会いたい=会う 人 が いない=いる'], a: 0,
        why: '会いたい人 = «persona a la que quiero ver»: 会いたい describe a 人. 一番に = antes que nadie.' },
    ],
  },
  {
    id: 'c68', yt: 'ritJkCupbG4', from: 51.3, to: 58.5, src: 'アオのハコ', after: 'u11l3',
    es: 'Se puso rojo',
    paras: [[
      ['見せて=見せる 。', 'Déjame ver.'],
      ['赤く=赤い なってる=なる:〜ている(casual) 。', 'Se te puso rojo.'],
      ['痛かった=痛い よ ね 。', 'Te dolió, ¿cierto?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo está el golpe?', opts: ['赤く=赤い なってる=なる', '赤く=赤い なりたい=なる', '赤くない=赤い'], a: 0,
        why: 'Adjetivo い → く + なる: 赤い → **赤く なってる**, «se puso rojo».' },
      { t: 'mc', q: '¿Qué le dice después?', opts: ['痛い よ ね', '痛かった=痛い よ ね', '痛くない=痛い よ ね'], a: 1,
        why: 'Pasado de 痛い: **痛かった**. よね busca confirmación: «¿cierto?».' },
    ],
  },
  {
    id: 'c69', yt: 'gnklvCO8pXE', from: 38.7, to: 40.7, src: 'アオのハコ', after: 'u9l2',
    es: 'Qué chicos más divertidos',
    paras: [[
      ['面白い 子 たち だ ね 。', 'Qué chicos más divertidos.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice la clienta?', opts: ['面白い 子 たち だ ね', '面白くない=面白い 子 たち だ ね', '面白かった=面白い 子 たち だ ね'], a: 0,
        why: '子 = chico/a; たち lo pone en plural. El adjetivo い va directo antes del sustantivo.' },
    ],
  },
  {
    id: 'c70', yt: 'GawqWTYKjBQ', from: 100, to: 102.7, src: 'わたしの幸せな結婚', after: 'u14l1',
    es: '¿No quieres nada?',
    paras: [[
      ['買いたい=買う 物 や 欲しい 物 は ない=ある の か ？', '¿No hay nada que quieras comprar o que desees?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dos cosas menciona?', opts: ['買いたい=買う 物 や 欲しい 物', '買った=買う 物 や 欲しい 物', '買いたい=買う 物 や 食べたい=食べる 物'], a: 0,
        why: '買いたい物 = cosas que quieres comprar; 欲しい物 = cosas que deseas. や une ejemplos: «cosas como A o B».' },
    ],
    note: 'Kiyoka pregunta con {の か}: suena seco y masculino. Entre amigos sería {ない=ある の ？}.',
  },
  {
    id: 'c71', yt: 'GawqWTYKjBQ', from: 71.3, to: 73.8, src: 'わたしの幸せな結婚', after: 'u9l2',
    es: 'Tú también come',
    paras: [[
      ['お前 も 食べる んだ ぞ 。', 'Tú también tienes que comer.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le dice Kiyoka?', opts: ['お前 も 食べる んだ ぞ', 'お前 は 食べない=食べる んだ ぞ', 'お前 も 食べた=食べる んだ ぞ'], a: 0,
        why: 'Forma simple + んだ, dicho con firmeza, funciona como orden suave. も = también.' },
    ],
  },
  {
    id: 'c72', yt: 'GawqWTYKjBQ', from: 95.2, to: 98, src: 'わたしの幸せな結婚', after: 'u8l2',
    es: 'No estaba esperando',
    paras: [[
      ['あ … いや 、 待って=待つ は いない=いる 。', 'Ah… no, no estaba esperando.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué responde Kiyoka?', opts: ['待って=待つ いる', '待って=待つ は いない=いる', '待ちたい=待つ'], a: 1,
        why: '待っている → negativo 待っていない. El は en medio (待ってはいない) recalca la negación: «esperar, lo que es esperar, no».' },
    ],
  },
  {
    id: 'c73', yt: 'sRzUqNwD7jk', from: 325.8, to: 329, src: 'ヴァイオレット・エヴァーガーデン', after: 'u8l3',
    es: '¿Puedo ponerte un nombre?',
    paras: [[
      ['じゃあ 、 私 が 名前 を つけて=つける いい か ？', 'Entonces, ¿puedo ponerte yo un nombre?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta el mayor?', opts: ['名前 を つけて=つける いい か', '名前 を つけて=つける ください', '名前 を つけました=つける か'], a: 0,
        why: 'Forma て + (も) いい = pedir permiso. 名前をつける = poner un nombre.' },
    ],
  },
  {
    id: 'c74', yt: 'sRzUqNwD7jk', from: 59.4, to: 61.6, src: 'ヴァイオレット・エヴァーガーデン', after: 'u13l3',
    es: '¿Cómo lo sabe?',
    paras: [[
      ['どうして 分かる の です か ？', '¿Cómo es que lo entiende?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta Violet?', opts: ['どうして 分かる の です か', 'どうして 分からない=分かる の です か', 'どうして 分かった=分かる の です か'], a: 0,
        why: 'Forma simple + のですか = pedir una explicación, en cortés (casual: 分かるの？).' },
    ],
  },
  {
    id: 'c75', yt: '-xGgmoUK6Nk', from: 94.9, to: 99, src: '極主夫道', after: 'u8l3',
    es: '¿Un regalo?',
    paras: [[
      ['えっ 、 何 ？ プレゼント ？ 開けて=開ける いい ？', '¿Eh, qué? ¿Un regalo? ¿Puedo abrirlo?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta Miku?', opts: ['開けて=開ける いい ？', '開けて=開ける ください', '開けた=開ける ？'], a: 0,
        why: 'Forma て + (も) いい？ = «¿puedo…?». Al hablar muchas veces se omite も.' },
    ],
  },
  {
    id: 'c76', yt: '-xGgmoUK6Nk', from: 103.7, to: 106.8, src: '極主夫道', after: 'u6l1',
    es: 'Qué alegría',
    paras: [[
      ['ありがとう 、 嬉しい よ 。', 'Gracias, me alegra mucho.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo se siente Miku?', opts: ['嬉しい', '忙しい', '寒い'], a: 0,
        why: '嬉しい (うれしい) = contento por algo que pasó; es la respuesta típica al recibir un regalo.' },
    ],
  },
  {
    id: 'c77', yt: 'SODuehdEbVk', from: 91.6, to: 95.6, src: '舞妓さんちのまかないさん', after: 'u14l1',
    es: '¿Quién quiere flan?',
    paras: [[
      ['キヨ の プリン=プリン#flan 、 食べたい=食べる 人 ！', '¡Quién quiere comer el flan de Kiyo!'],
      ['はーい=はい ！', '¡Yooo!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta?', opts: ['食べたい=食べる 人', '食べた=食べる 人', '食べない=食べる 人'], a: 0,
        why: '食べたい人 = «la gente que quiere comer»: 食べたい describe a 人. Así se pregunta «¿quién quiere…?» a un grupo.' },
    ],
  },
  {
    id: 'c78', yt: 'SODuehdEbVk', from: 119.2, to: 121.3, src: '舞妓さんちのまかないさん', after: 'u13l3',
    es: 'La comida está lista',
    paras: [[
      ['お夜食 、 できました=できる 。', 'La comida de la noche está lista.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué anuncia Kiyo?', opts: ['Que la comida está lista', 'Que se va a dormir', 'Que llegó alguien'], a: 0,
        why: 'できました = «quedó listo»: otro uso de できる, además de «poder».' },
    ],
  },
  {
    id: 'c79', yt: 'svmERbEv2AI', from: 152.6, to: 155.3, src: 'ポケモン「放課後のブレス」', after: 'u3l3',
    es: '¿De qué hablas?',
    paras: [[
      ['フルート ？ 何|なん=なん の 話 ？', '¿Flauta? ¿De qué hablas?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice Aliquis?', opts: ['何|なん=なん の 話 ？', '誰 の 話 ？', 'どこ の 話 ？'], a: 0,
        why: '何の話 = «conversación de qué»: の une 何 con 話.' },
    ],
  },
  {
    id: 'c80', yt: 'AFs3-fLIvfY', from: 126.8, to: 128.9, src: 'ポケモン「放課後のブレス」', after: 'u6l1',
    es: 'Es peligroso',
    paras: [[
      ['え ？ 危ない よ 。', '¿Eh? Es peligroso.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le advierte?', opts: ['危ない よ', '危なくない=危ない よ', '危なかった=危ない よ'], a: 0,
        why: '危ない (あぶない) = peligroso. よ avisa algo que el otro no sabe.' },
    ],
  },
  {
    id: 'c81', yt: 'AFs3-fLIvfY', from: 142.8, to: 143.8, src: 'ポケモン「放課後のブレス」', after: 'u3l3',
    es: '¿Y tú quién eres?',
    paras: [[
      ['あんた 、 誰 ？', '¿Y tú quién eres?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo sería en cortés?', opts: ['あなた は 誰 です か', 'あなた は 何 です か', 'あなた は どこ です か'], a: 0,
        why: 'あんた es あなた dicho con confianza o brusquedad. En casual se omiten は y ですか.' },
    ],
  },
  {
    id: 'c82', yt: 'PtSTnbqXJTs', from: 10.4, to: 12.5, src: 'クロミアニメ 第12話', after: 'u6l2',
    es: '¿Le gustan los guapos?',
    paras: [[
      ['イケメン は お好き です か ？', '¿Le gustan los hombres guapos?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta?', opts: ['イケメン は お好き です か', 'イケメン は 嫌い です か', 'イケメン が 好き でした=です か'], a: 0,
        why: 'お好きですか es 好きですか con お de cortesía: se usa para preguntar por los gustos del otro.' },
    ],
  },
  {
    id: 'c83', yt: 'PtSTnbqXJTs', from: 39.4, to: 42, src: 'クロミアニメ 第12話', after: 'u3l4',
    es: 'Te presento a Kooni',
    paras: [[
      ['この 子 は コオニ ちゃん ！', '¡Esta niña es Kooni!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo presenta a la niña?', opts: ['この 子 は コオニ ちゃん', 'その 子 は コオニ ちゃん', 'あの 子 は コオニ ちゃん'], a: 0,
        why: 'この = este/a (cerca de quien habla). ちゃん es el sufijo cariñoso para niños.' },
    ],
  },
  {
    id: 'c84', yt: 'J1nRmi_fMx0', from: 82.2, to: 85.5, src: 'クロミアニメ 第8話', after: 'u6l1',
    es: 'Por celular eres otra',
    paras: [[
      ['あんた 、 スマホ だと めっちゃ 明るい ね 。', 'Tú por celular eres súper alegre, ¿no?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo es por celular?', opts: ['めっちゃ 明るい', 'めっちゃ 暗い', 'めっちゃ 静か'], a: 0,
        why: '明るい = luminoso y, hablando de personas, alegre. スマホだと = «cuando es por celular».' },
    ],
  },
  {
    id: 'c85', yt: '9Sot9QTuP6s', from: 72.1, to: 75.5, src: 'クロミアニメ 第10話', after: 'u3l3',
    es: 'La foto de mi hermana',
    paras: [[
      ['これ … お姉ちゃん の 写真 。', 'Esto… es una foto de mi hermana.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué encuentra Kuromi?', opts: ['お姉ちゃん の 写真', 'お姉ちゃん の 手紙', 'お姉ちゃん の 本'], a: 0,
        why: '写真 (しゃしん) = foto. の une: «foto **de** mi hermana».' },
    ],
  },
  {
    id: 'c86', yt: 'D53XrHaS80g', from: 258.6, to: 261.2, src: 'ポケモン「幼なじみのカルボウ」', after: 'u9l2',
    es: 'Vamos juntos',
    paras: [[
      ['なら 、 一緒に 行こう=行く:«vamos»(casual) 。', 'Entonces vamos juntos.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué propone el niño?', opts: ['一緒に 行こう=行く', '一緒に 行った=行く', '一緒に 行かない=行く'], a: 0,
        why: '行こう es la forma casual de 行きましょう: «vamos». なら al principio = «si es así…».' },
    ],
  },
  {
    id: 'c87', yt: 'D53XrHaS80g', from: 917.4, to: 919.7, src: 'ポケモン「幼なじみのカルボウ」', after: 'u9l2',
    es: '¿Vienes tú también?',
    paras: [[
      ['君 も 一緒に 来る ？', '¿Tú también vienes con nosotros?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le pregunta?', opts: ['君 も 一緒に 来る ？', '君 も 一緒に 行く ？', '君 は 一緒に 来ない|こない=来る ？'], a: 0,
        why: '来る = venir (hacia donde está quien habla). も = también. Subir el tono basta para preguntar en casual.' },
    ],
  },
  {
    id: 'c88', yt: 'D53XrHaS80g', from: 176.4, to: 180.8, src: 'ポケモン「幼なじみのカルボウ」', after: 'u12l1',
    es: '¿Adónde se habrá ido?',
    paras: [[
      ['どこ に 行った=行く んだろ=んだろう 。', '¿Adónde se habrá ido?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué se pregunta el niño?', opts: ['どこ に 行った=行く んだろ=んだろう', 'どこ に 行く んだろ=んだろう', 'どこ に いる んだろ=んだろう'], a: 0,
        why: 'Pasado casual: 行く → **行った** (irregular: no es 行いた). んだろ(う) = «me pregunto…».' },
    ],
  },
  {
    id: 'c89', yt: 'rKSDGz9iAgU', from: 60.1, to: 62.4, src: 'ポケモン「ユメノツボミ」', after: 'u9l2',
    es: '¿Por qué yo no?',
    paras: [[
      ['なんで 私 は だめ な の ？', '¿Por qué yo no puedo?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué reclama Tsubomi?', opts: ['なんで 私 は だめ な の ？', 'なんで 私 は いい の ？', 'なんで 私 も だめ な の ？'], a: 0,
        why: 'だめ = no se puede, no está permitido. Con adjetivos な y sustantivos, la pregunta casual es 〜なの？' },
    ],
  },
  {
    id: 'c90', yt: 'rKSDGz9iAgU', from: 80.4, to: 87.4, src: 'ポケモン「ユメノツボミ」', after: 'u12l1',
    es: 'Hoy tampoco',
    paras: [[
      ['今日 も だめ だった=だ ね 。', 'Hoy tampoco resultó, ¿eh?'],
      ['パパ から も ママ に 言って=言う よ 。', 'Dile tú también a mamá, papá.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice el papá?', opts: ['今日 も だめ だった=だ ね', '今日 は だめ じゃない=じゃありません:casual ね', '今日 も だめ だ ね'], a: 0,
        why: 'Pasado casual de だ: **だった**. も = «también / tampoco».' },
    ],
  },
  {
    id: 'c91', yt: 'rKSDGz9iAgU', from: 124, to: 127.4, src: 'ポケモン「ユメノツボミ」', after: 'u11l3',
    es: 'Voy a ser campeona',
    paras: [[
      ['だから 私 は 、 絶対 チャンピオン に なる ！', '¡Por eso yo voy a ser campeona, pase lo que pase!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué va a ser Tsubomi?', opts: ['チャンピオン に なる', 'チャンピオン に なった=なる', 'チャンピオン に なりたくない=なる'], a: 0,
        why: 'Sustantivo + に なる = llegar a ser. 絶対 (ぜったい) = sin falta.' },
    ],
  },
  {
    id: 'c92', yt: '4vXdJ8-LZdY', from: 93.1, to: 95.1, src: 'ポケモン「ゲンガーになっちゃった！？」', after: 'u15l3',
    es: '¿Quién va a ver?',
    paras: [[
      ['見=見る:raíz-ます に 行く 人 ！', '¡Quién va a ir a verla!'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué pregunta la niña?', opts: ['見=見る に 行く 人', '見=見る に 来る 人', '見て=見る いる 人'], a: 0,
        why: 'Raíz ます + に + 行く = ir a hacer algo: 見に行く, «ir a ver». 〜人！ = «¿quién…?» a un grupo.' },
    ],
  },
  {
    id: 'c93', yt: '4vXdJ8-LZdY', from: 114.5, to: 117.1, src: 'ポケモン「ゲンガーになっちゃった！？」', after: 'u9l2',
    es: '¿Shoko también va?',
    paras: [[
      ['え … ショーコ も 行く の ？', '¿Eh…? ¿Shoko también va?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué les sorprende?', opts: ['ショーコ も 行く の ？', 'ショーコ は 行かない=行く の ？', 'ショーコ も 行った=行く の ？'], a: 0,
        why: 'も = también. Forma simple + の？ = pregunta casual.' },
    ],
  },
  {
    id: 'c94', yt: '4vXdJ8-LZdY', from: 167, to: 169.3, src: 'ポケモン「ゲンガーになっちゃった！？」', after: 'u6l1',
    es: '¿No te da miedo?',
    paras: [[
      ['怖くない=怖い の ？', '¿No te da miedo?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le preguntan a Shoko?', opts: ['怖い の ？', '怖くない=怖い の ？', '怖かった=怖い の ？'], a: 1,
        why: 'Negativo de un adjetivo い: 怖い → **怖くない**.' },
    ],
  },
  {
    id: 'c95', yt: 'J-3lxsr5CYc', from: 101.4, to: 104.4, src: 'ポケモン「ヒーローになりたいヤンチャム」', after: 'u7l1',
    es: 'Pancham tenía un sueño',
    paras: [[
      ['ヤンチャム に は 夢 が ありました=ある 。', 'Pancham tenía un sueño.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué tenía Pancham?', opts: ['夢 が ありました=ある', '夢 が ありません=ある', '夢 が いました=いる'], a: 0,
        why: '〜には 〜が あります = «(alguien) tiene…». Para cosas abstractas como 夢 también se usa ある.' },
    ],
  },
  {
    id: 'c96', yt: 'J-3lxsr5CYc', from: 377.7, to: 381.8, src: 'ポケモン「ヒーローになりたいヤンチャム」', after: 'u15l2',
    es: 'Un regalo de papá',
    paras: [[
      ['この スカーフ は お父さん が 誕生日 に くれた=くれる んだ 。', 'Este pañuelo me lo dio mi papá para mi cumpleaños.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Quién se lo dio?', opts: ['お父さん が くれた=くれる', 'お父さん に あげた=あげる', 'お父さん が もらった=もらう'], a: 0,
        why: '**くれる** = alguien me da a mí. El que da lleva が.' },
    ],
  },
  {
    id: 'c97', yt: '6KMmF3QTy2Q', from: 46, to: 54.9, src: 'Japanese in Japan · 夜', after: 'u8l3',
    es: 'Noche: llegar a casa',
    paras: [[
      ['ドア を 開けて=開ける 、 電気 を つけます=つける 。', 'Abro la puerta y prendo la luz.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué hace primero?', opts: ['ドア を 開けて=開ける', '電気 を つけて=つける', 'ドア を 閉めて=閉める'], a: 0,
        why: 'La forma て encadena acciones en orden: 開けて、つけます = «abro y (luego) prendo».' },
    ],
  },
  {
    id: 'c98', yt: '6KMmF3QTy2Q', from: 54.7, to: 62.8, src: 'Japanese in Japan · 夜', after: 'u6l3',
    es: 'Noche: hacía frío',
    paras: [[
      ['今日 は 風 が 強く=強い 、 外 は とっても 寒かった=寒い です 。', 'Hoy había mucho viento y afuera hacía muchísimo frío.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo estaba afuera?', opts: ['とっても 寒い です', 'とっても 寒かった=寒い です', 'とっても 暑かった=暑い です'], a: 1,
        why: 'Pasado de 寒い: **寒かった**. 風が強い = hay viento fuerte.' },
    ],
  },
  {
    id: 'c99', yt: '6KMmF3QTy2Q', from: 31.7, to: 39.7, src: 'Japanese in Japan · 夜', after: 'u13l1',
    es: 'Noche: sin zapatos',
    paras: [[
      ['まず は 靴 を 脱ぎます=脱ぐ 。', 'Primero me saco los zapatos.'],
      ['日本 で は 家 の 中 で 靴 を 履かない=履く ので 。', 'Es que en Japón no se usan zapatos dentro de la casa.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué se hace en Japón?', opts: ['家 の 中 で 靴 を 履かない=履く', '家 の 中 で 靴 を 履く', '家 の 外 で 靴 を 脱ぐ'], a: 0,
        why: '脱ぐ = sacarse (ropa, zapatos); 履く = ponerse (zapatos). 履かない es el negativo simple de 履く.' },
    ],
  },
  {
    id: 'c100', yt: '6KMmF3QTy2Q', from: 150.8, to: 156.1, src: 'Japanese in Japan · 夜', after: 'u6l2',
    es: 'Noche: mi comida favorita',
    paras: [[
      ['カレー は 私 の 好き な 食べ物 の 一つ です 。', 'El curry es una de mis comidas favoritas.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué dice del curry?', opts: ['好き な 食べ物', '嫌い な 食べ物', '好き な 飲み物'], a: 0,
        why: '好き es un adjetivo な: delante de un sustantivo lleva な (好きな食べ物). 〜の一つ = «uno de…».' },
    ],
  },
  {
    id: 'c101', yt: '6KMmF3QTy2Q', from: 294.2, to: 302.3, src: 'Japanese in Japan · 夜', after: 'u14l2',
    es: 'Noche: lentes de contacto',
    paras: [[
      ['私 は 目 が 悪い ので 、', 'Como tengo mala vista,'],
      ['外 に いる とき は いつも コンタクト を つけて=つける います=いる 。', 'cuando estoy afuera siempre uso lentes de contacto.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cuándo usa lentes de contacto?', opts: ['外 に いる とき', '家 に いる とき', '寝る とき'], a: 0,
        why: 'Frase + **とき** = cuando… 目が悪い = tener mala vista.' },
    ],
  },
  {
    id: 'c102', yt: '6KMmF3QTy2Q', from: 377.1, to: 382.7, src: 'Japanese in Japan · 夜', after: 'u12l3',
    es: 'Noche: un té',
    paras: [[
      ['勉強 が 終わった=終わる 後 は お茶 を 飲みます=飲む 。', 'Después de terminar de estudiar tomo té.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cuándo toma té?', opts: ['勉強 が 終わった=終わる 後', '勉強 が 終わる 前', '勉強 を して=する いる とき'], a: 0,
        why: 'Verbo en pasado simple (た) + **後** = después de…' },
    ],
  },
  {
    id: 'c103', yt: '6KMmF3QTy2Q', from: 457.6, to: 460.9, src: 'Japanese in Japan · 夜', after: 'u12l3',
    es: 'Noche: antes de dormir',
    paras: [[
      ['寝る 前 に 歯磨き を します=する 。', 'Antes de dormir me lavo los dientes.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cuándo se lava los dientes?', opts: ['寝る 前 に', '寝た=寝る 後 で', '起きて=起きる から'], a: 0,
        why: 'Verbo en forma diccionario + **前に** = antes de…' },
    ],
  },
  {
    id: 'c104', yt: 'K5RfTVZH-1g', from: 48.8, to: 51.6, src: 'Japanese with Shun · 一日', after: 'u5l4',
    es: 'Shun: recién despierto',
    paras: [[
      ['皆さん 、 おはようございます 。', 'Buenos días a todos.'],
      ['今 、 起きました=起きる 。', 'Me acabo de levantar.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué acaba de hacer Shun?', opts: ['起きました=起きる', '寝ました=寝る', '食べました=食べる'], a: 0,
        why: '今 + pasado = «acabo de…»: 今、起きました.' },
    ],
  },
  {
    id: 'c105', yt: 'K5RfTVZH-1g', from: 152.6, to: 155.8, src: 'Japanese with Shun · 一日', after: 'u5l5',
    es: 'Shun: ¿hacemos desayuno?',
    paras: [[
      ['お腹 空いた|すいた=空く#すく ？', '¿Tienes hambre?'],
      ['朝ごはん 作りましょう=作る か 。', '¿Hacemos el desayuno?'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué propone Shun?', opts: ['朝ごはん 作りましょう=作る か', '朝ごはん 作りました=作る か', '朝ごはん 食べません=食べる か'], a: 0,
        why: '〜ましょうか = «¿hacemos…?»: propone hacer algo juntos o por el otro.' },
    ],
  },
  {
    id: 'c106', yt: 'K5RfTVZH-1g', from: 199.9, to: 203.7, src: 'Japanese with Shun · 一日', after: 'u9l1',
    es: 'Shun: ¿quieres café?',
    paras: [[
      ['コーヒー 、 欲しい ？', '¿Quieres café?'],
      ['欲しい 。', 'Quiero.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le ofrece?', opts: ['コーヒー', 'お茶', '水'], a: 0,
        why: '欲しい (ほしい) = querer una cosa. En cortés: コーヒーが欲しいですか.' },
    ],
  },
  {
    id: 'c107', yt: 'K5RfTVZH-1g', from: 229, to: 235.9, src: 'Japanese with Shun · 一日', after: 'u5l1',
    es: 'Shun: café cada mañana',
    paras: [[
      ['私 は 毎朝 この ドリップコーヒー を 飲みます=飲む 。', 'Yo todas las mañanas tomo este café filtrado.'],
    ]],
    questions: [
      { t: 'mc', q: '¿Cuándo toma café?', opts: ['毎朝', '毎晩', '毎週'], a: 0,
        why: '毎朝 (まいあさ) = todas las mañanas. El presente ます sirve para las costumbres.' },
    ],
  },
];
