// 読解 del simulacro JLPT N5 (ver docs/FORMATO.md, sección «Simulacro»).
// dokkai4: textos cortos (notas, mensajes, diarios) · dokkai5: textos medianos · dokkai6: búsqueda de información.
// `ev` = índice de la oración (en paras) que contiene la respuesta.

export default {
  // ───────── 問題4 内容理解（短文） ─────────
  dokkai4: [
    {
      id: 'd4-01',
      paras: [
        ['（ 学校 で 、 アナ さん の 机 の 上 に 、 この 紙 が あります=ある 。 ）', '(En la escuela, sobre el escritorio de Ana, hay este papel.)'], // 0
        ['アナ さん へ', 'Para Ana:'],                                                               // 1
        ['明日 の 授業 は 九|く=九 時 から じゃありません 。', 'La clase de mañana no es a partir de las nueve.'], // 2
        ['十 時 から です 。', 'Es a partir de las diez.'],                                                   // 3
        ['それから 、 いつも の 教室 じゃありません 。', 'Además, no es en la sala de siempre.'],                // 4
        ['二 階 の 小さい 教室 です 。', 'Es en la sala pequeña del segundo piso.'],                            // 5
        ['じしょ を 持って=持つ 来て=来る ください 。', 'Por favor, trae tu diccionario.'],                     // 6
        ['山田', 'Yamada'],                                                                            // 7
      ],
      questions: [{
        qjp: 'アナ さん は 明日 何|なん=なん 時 に どこ へ 行きます=行く か 。',
        opts: ['九|く=九 時 に いつも の 教室 へ 行きます=行く 。', '十 時 に いつも の 教室 へ 行きます=行く 。', '九|く=九 時 に 二 階 の 教室 へ 行きます=行く 。', '十 時 に 二 階 の 教室 へ 行きます=行く 。'],
        a: 3, ev: [3, 5],
        why: 'La nota corrige dos cosas: la hora (「九時からじゃありません。十時からです」) y la sala (「いつもの教室じゃありません。二階の小さい教室です」).',
      }],
      ref: 'u4l2',
    },
    {
      id: 'd4-02',
      paras: [
        ['アナ さん 、 今日 の 夕方 、 いっしょに 映画 を 見ませんか=見る 。', 'Ana, ¿vamos a ver una película hoy en la tarde?'], // 0
        ['映画 は 六 時 半 から です 。', 'La película empieza a las seis y media.'],                                    // 1
        ['映画館 の 前 は 人 が 多い です から=から#porque 、 駅 の 前 で 会いましょう=会う 。', 'Como frente al cine hay mucha gente, juntémonos frente a la estación.'], // 2
        ['五 時 半 に 駅 で 待って=待つ います=いる 。', 'Te espero en la estación a las cinco y media.'],                // 3
        ['映画 の 前 に 、 駅 の 近く の 喫茶店 で コーヒー を 飲みましょう=飲む 。', 'Antes de la película, tomemos un café en la cafetería cerca de la estación.'], // 4
        ['ケン', 'Ken'],                                                                                            // 5
      ],
      questions: [{
        qjp: '二人 は 五 時 半 に どこ で 会います=会う か 。',
        opts: ['映画館 の 前', '駅 の 前', '喫茶店 の 中', 'ケン さん の うち'],
        a: 1, ev: [2, 3],
        why: '「映画館の前は人が多いですから、駅の前で会いましょう」. El cine y la cafetería se mencionan, pero el punto de encuentro es la estación.',
      }],
      ref: 'u5l5',
    },
    {
      id: 'd4-03',
      paras: [
        ['昨日 は 日曜日 でした=です 。', 'Ayer fue domingo.'],                                                                      // 0
        ['朝 は 雨 が ふって=ふる いました=いる から=から#porque 、 うち で 本 を 読みました=読む 。', 'En la mañana estaba lloviendo, así que leí un libro en casa.'], // 1
        ['昼ごはん の 後 で 、 天気 が よく=いい なりました=なる 。', 'Después del almuerzo, el tiempo mejoró.'],                    // 2
        ['それから 、 妹 と 公園 へ 行って=行く 、 自転車 に 乗りました=乗る 。', 'Entonces fui al parque con mi hermana menor y anduvimos en bicicleta.'], // 3
        ['夜 は 家族 と 晩ごはん を 食べて=食べる 、 早く=早い 寝ました=寝る 。', 'En la noche cené con mi familia y me acosté temprano.'], // 4
      ],
      questions: [{
        qjp: 'この 人 は 昨日 の 午後 、 何 を しました=する か 。',
        opts: ['うち で 本 を 読みました=読む 。', '妹 と 買い物 に 行きました=行く 。', '妹 と 公園 で 自転車 に 乗りました=乗る 。', '雨 の 中 を 歩きました=歩く 。'],
        a: 2, ev: [2, 3],
        why: 'Leyó en la mañana (朝は…本を読みました). En la tarde, después del almuerzo: 「妹と公園へ行って、自転車に乗りました」.',
      }],
      ref: 'u11l3',
    },
    {
      id: 'd4-04',
      paras: [
        ['留学生 の みなさん へ', 'A todos los estudiantes extranjeros:'],                                         // 0
        ['来週 の 金曜日 の 夜 、 教室 で パーティー を します=する 。', 'El viernes de la próxima semana en la noche haremos una fiesta en la sala.'], // 1
        ['六 時 から 八 時 まで です 。', 'Es de seis a ocho.'],                                                       // 2
        ['食べ物 は 学校 が 買います=買う 。', 'La comida la compra la escuela.'],                                     // 3
        ['みなさん は 飲み物 を 一本|いっぽん=本#ctr 持って=持つ 来て=来る ください 。', 'Ustedes traigan, por favor, una botella de bebida.'], // 4
        ['お金 は 持って=持つ 来なくても=来る いい です 。', 'No hace falta que traigan dinero.'],                    // 5
        ['山田', 'Yamada'],                                                                                       // 6
      ],
      questions: [{
        qjp: '留学生 は パーティー に 何 を 持って=持つ 行きます=行く か 。',
        opts: ['飲み物 を 一本|いっぽん=本#ctr', '食べ物 と 飲み物', 'お金', '何も 持って=持つ 行きません=行く'],
        a: 0, ev: 4,
        why: '「飲み物を一本持って来てください」. La comida la compra la escuela y el dinero no hace falta (持って来なくてもいいです).',
      }],
      ref: 'u13l1',
    },
    {
      id: 'd4-05',
      paras: [
        ['（ ゆい さん が 学校 から 帰りました=帰る 。 テーブル の 上 に 、 この 紙 が ありました=ある 。 ）', '(Yui volvió de la escuela. Sobre la mesa había este papel.)'], // 0
        ['ゆい へ', 'Para Yui:'],                                                                                   // 1
        ['お母さん は 買い物 に 行きます=行く 。', 'Mamá se va de compras.'],                                         // 2
        ['七|しち=七 時 ごろ 帰ります=帰る 。', 'Vuelvo alrededor de las siete.'],                                      // 3
        ['れいぞうこ に ケーキ が あります=ある が=が#pero 、 それ は 晩ごはん の 後 で 食べましょう=食べる 。', 'En el refrigerador hay una torta, pero comámosla después de la cena.'], // 4
        ['テーブル の 上 に パン が あります=ある から=から#porque 、 それ を 食べて=食べる ください 。', 'Sobre la mesa hay pan, así que come eso.'], // 5
        ['母', 'Mamá'],                                                                                              // 6
      ],
      questions: [{
        qjp: 'ゆい さん は 今 何 を 食べます=食べる か 。',
        opts: ['ケーキ', 'パン', '晩ごはん', 'ケーキ と パン'],
        a: 1, ev: [4, 5],
        why: 'La torta es para después de la cena (晩ごはんの後で食べましょう). Ahora debe comer el pan: 「パンがありますから、それを食べてください」.',
      }],
      ref: 'u12l3',
    },
    {
      id: 'd4-06',
      paras: [
        ['みなさん 、 今日 の しゅくだい です 。', 'A todos: esta es la tarea de hoy.'],                                  // 0
        ['本 の 二十|にじゅう=十 ページ から 二十五|にじゅうご=十 ページ まで 読んで=読む ください 。', 'Lean el libro desde la página 20 hasta la 25.'], // 1
        ['作文 は 今週 は 書かなくても=書く いい です 。', 'Esta semana no hace falta que escriban la composición.'],       // 2
        ['来週 の 月曜日 に 漢字 の テスト が あります=ある 。', 'El lunes de la próxima semana hay prueba de kanji.'],       // 3
        ['漢字 も 練習 して=する ください 。', 'Practiquen también los kanji.'],                                         // 4
        ['山田', 'Yamada'],                                                                                           // 5
      ],
      questions: [{
        qjp: '学生 は 何 を しなくても=する いい です か 。',
        opts: ['本 を 読みます=読む 。', 'テスト の 勉強 を します=する 。', '漢字 を 練習 します=する 。', '作文 を 書きます=書く 。'],
        a: 3, ev: 2,
        why: '〜なくてもいいです = no hace falta…: 「作文は今週は書かなくてもいいです」. Leer las páginas 20–25 y practicar kanji sí son tarea.',
      }],
      ref: 'u13l1',
    },
    {
      id: 'd4-07',
      paras: [
        ['（ 店 の 入口 に 、 この 紙 が あります=ある 。 ）', '(En la entrada de la tienda hay este papel.)'],        // 0
        ['この 店 は 毎日 午前 十 時 から 午後 八 時 まで です 。', 'Esta tienda atiende todos los días de 10 a.m. a 8 p.m.'], // 1
        ['でも 、 日曜日 は 午後 六 時 まで です 。', 'Pero los domingos es hasta las 6 p.m.'],                         // 2
        ['月曜日 は 午後 五 時 まで です 。', 'Los lunes es hasta las 5 p.m.'],                                        // 3
        ['水曜日 は 休み です 。', 'Los miércoles está cerrada.'],                                                    // 4
      ],
      questions: [{
        qjp: 'この 店 で 、 午後 七|しち=七 時 に 買い物 が できる=できる 曜日 は どれ です か 。',
        opts: ['日曜日', '月曜日', '金曜日', '水曜日'],
        a: 2, ev: [1, 2, 3, 4],
        why: 'El horario normal es hasta las 8 p.m. Pero el domingo cierra a las 6, el lunes a las 5 y el miércoles no abre. El viernes sigue el horario normal (十時から八時まで).',
      }],
      ref: 'u4l3',
    },
    {
      id: 'd4-08',
      paras: [
        ['アナ さん 、 元気 です か 。', 'Ana, ¿cómo estás?'],                                                         // 0
        ['わたし は 今 京都 に います=いる 。', 'Ahora estoy en Kioto.'],                                               // 1
        ['京都 は 古い 町 で 、 とても きれい です 。', 'Kioto es una ciudad antigua y muy bonita.'],                     // 2
        ['昨日 は 雨 でした=です から=から#porque 、 どこ へ も 行きませんでした=行く 。', 'Ayer llovió, así que no fui a ninguna parte.'], // 3
        ['今日 は いい 天気 です から=から#porque 、 古い 建物 を 見=見る に 行きます=行く 。', 'Hoy hace buen tiempo, así que voy a ir a ver edificios antiguos.'], // 4
        ['あさって 東京 へ 帰ります=帰る 。', 'Pasado mañana vuelvo a Tokio.'],                                         // 5
        ['ゆい', 'Yui'],                                                                                              // 6
      ],
      questions: [{
        qjp: 'ゆい さん は 今日 何 を します=する か 。',
        opts: ['古い 建物 を 見=見る に 行きます=行く 。', 'ホテル で 休みます=休む 。', '東京 へ 帰ります=帰る 。', 'どこ へ も 行きません=行く 。'],
        a: 0, ev: 4,
        why: '「今日はいい天気ですから、古い建物を見に行きます」. No salió ayer (昨日), y vuelve a Tokio pasado mañana (あさって).',
      }],
      ref: 'u15l3',
    },
    {
      id: 'd4-09',
      paras: [
        ['（ 図書館 の 入口 に 、 この 紙 が あります=ある 。 ）', '(En la entrada de la biblioteca hay este papel.)'],   // 0
        ['本 は 一人 五 冊 まで 借りても=借りる いい です 。', 'Cada persona puede sacar hasta cinco libros.'],           // 1
        ['二 週間 後|ご=後 に 返して=返す ください 。', 'Devuélvanlos a las dos semanas.'],                                    // 2
        ['新聞 と 雑誌 は 図書館 の 中 で 読んで=読む ください 。', 'Los diarios y revistas léanlos dentro de la biblioteca.'], // 3
        ['新聞 と 雑誌 は 借りないで=借りる ください 。', 'No saquen diarios ni revistas.'],                              // 4
        ['図書館 の 中 で 食べ物 を 食べないで=食べる ください 。', 'No coman dentro de la biblioteca.'],                   // 5
        ['飲み物 は 一階|いっかい=階 の 入口 の そば で 飲んでも=飲む いい です 。', 'Las bebidas se pueden tomar junto a la entrada del primer piso.'], // 6
      ],
      questions: [{
        qjp: 'この 図書館 で は 、 何 を しては=する いけません か 。',
        opts: ['本 を 五 冊 借ります=借りる 。', '図書館 の 中 で 新聞 を 読みます=読む 。', '入口 の そば で 飲み物 を 飲みます=飲む 。', '雑誌 を 借ります=借りる 。'],
        a: 3, ev: 4,
        why: '「新聞と雑誌は借りないでください」: las revistas solo se leen adentro. Cinco libros sí se permiten (五冊まで), y beber junto a la entrada también.',
      }],
      ref: 'u13l1',
    },
    {
      id: 'd4-10',
      paras: [
        ['田中 さん へ', 'Para el Sr. Tanaka:'],                                                                     // 0
        ['十一|じゅういち=十 時 ごろ 、 鈴木 さん から 電話 が ありました=ある 。', 'Cerca de las once llamó por teléfono la Sra. Suzuki.'], // 1
        ['鈴木 さん は 明日 の 午後 三 時 に 田中 さん の 会社 に 来ます=来る 。', 'La Sra. Suzuki vendrá a su empresa mañana a las 3 p.m.'], // 2
        ['でも 、 田中 さん が 明日 忙しい とき は 、 今日 鈴木 さん に 電話 を かけて=かける ください 。', 'Pero si usted está ocupado mañana, llámela hoy por favor.'], // 3
        ['鈴木 さん は 六 時 まで 会社 に います=いる 。', 'La Sra. Suzuki está en su oficina hasta las seis.'],         // 4
        ['山田', 'Yamada'],                                                                                           // 5
      ],
      questions: [{
        qjp: '田中 さん は 明日 忙しい とき 、 何 を しなければ=する なりません=なる か 。',
        opts: ['明日 の 三 時 に 鈴木 さん の 会社 へ 行きます=行く 。', '明日 の 三 時 に 鈴木 さん に 電話 を かけます=かける 。', '今日 、 鈴木 さん に 電話 を かけます=かける 。', '今日 の 六 時 に 鈴木 さん に 会います=会う 。'],
        a: 2, ev: 3,
        why: '「田中さんが明日忙しいときは、今日鈴木さんに電話をかけてください」. Las 3 es la hora de la visita y las 6 es hasta cuándo ella está en su oficina.',
      }],
      ref: 'u14l2',
    },
  ],

  // ───────── 問題5 内容理解（中文） ─────────
  dokkai5: [
    {
      id: 'd5-01', title: '初めて の 日本',
      paras: [
        ['私 は 去年 の 夏 、 初めて 日本 へ 行きました=行く 。', 'El verano pasado fui a Japón por primera vez.'],                       // 0
        ['東京 の 大学 で 一か月|いっかげつ=か月 日本 語 を 勉強 しました=する 。', 'Estudié japonés un mes en una universidad de Tokio.'], // 1
        ['毎朝 八 時 に 起きて=起きる 、 地下鉄 で 学校 へ 行きました=行く 。', 'Todas las mañanas me levantaba a las ocho e iba a la escuela en metro.'], // 2
        ['朝 の 地下鉄 は 人 が とても 多くて=多い 、 大変 でした=です 。', 'En la mañana el metro tenía muchísima gente y era agotador.'], // 3
        ['授業 は 九|く=九 時 から 十二|じゅうに=十 時 まで でした=です 。', 'Las clases eran de nueve a doce.'],                        // 4
        ['午後 は 友だち と いろいろ な ところ へ 行きました=行く 。', 'En las tardes iba a distintos lugares con mis amigos.'],          // 5
        ['いちばん 楽しかった=楽しい こと は 、 山 に 登った=登る こと です 。', 'Lo más divertido fue subir una montaña.'],             // 6
        ['高い 山 でした=です から=から#porque 、 とても 疲れました=疲れる 。', 'Era una montaña alta, así que me cansé mucho.'],           // 7
        ['でも 、 山 の 上 から 見た=見る 町 は とても きれい でした=です 。', 'Pero la ciudad vista desde la cima era muy bonita.'],       // 8
        ['日本 の 料理 も おいしかった=おいしい です 。', 'La comida japonesa también estaba rica.'],                                     // 9
        ['でも 、 私 は 魚 が あまり 好き じゃありません から=から#porque 、 すし は 一回|いっかい=回 も 食べませんでした=食べる 。', 'Pero como no me gusta mucho el pescado, no comí sushi ni una vez.'], // 10
        ['来年 は 京都 へ 行って=行く 、 古い 建物 を 見たい=見る です 。', 'El próximo año quiero ir a Kioto a ver edificios antiguos.'], // 11
        ['マリア', 'María'],                                                                                                         // 12
      ],
      questions: [
        {
          qjp: 'マリア さん は 日本 で 何 が いちばん 楽しかった=楽しい です か 。',
          opts: ['地下鉄 に 乗った=乗る こと', '山 に 登った=登る こと', '大学 の 授業', 'すし を 食べた=食べる こと'],
          a: 1, ev: 6,
          why: '「いちばん楽しかったことは、山に登ったことです」. El metro fue agotador (大変でした) y sushi no comió.',
        },
        {
          qjp: 'マリア さん が 日本 で しなかった=する こと は どれ です か 。',
          opts: ['地下鉄 で 学校 へ 行く=行く', '友だち と 出かける=出かける', '日本 語 を 勉強 する=する', 'すし を 食べる=食べる'],
          a: 3, ev: 10,
          why: '「すしは一回も食べませんでした」: 一回も + negativo = ni una vez. Lo demás sí lo hizo (oraciones 2, 5 y 1).',
        },
      ],
      ref: 'u12l2',
    },
    {
      id: 'd5-02',
      paras: [
        ['アナ さん 、 手紙 ありがとうございました=ありがとうございます 。', 'Ana, gracias por tu carta.'],                             // 0
        ['わたし は 先月 から 大阪 の 会社 に 勤めて=勤める います=いる 。', 'Desde el mes pasado trabajo en una empresa de Osaka.'],   // 1
        ['毎日 忙しい です が=が#pero 、 仕事 は おもしろい です 。', 'Todos los días estoy ocupada, pero el trabajo es interesante.'],   // 2
        ['会社 は 駅 から 近くて=近い 、 とても 便利 です 。', 'La empresa está cerca de la estación y es muy práctico.'],                // 3
        ['わたし の アパート は 小さい です が=が#pero 、 新しくて=新しい きれい です 。', 'Mi departamento es pequeño, pero es nuevo y bonito.'], // 4
        ['週末 は 近く の 公園 を 散歩 したり=する 、 図書館 で 本 を 読んだり=読む します=する 。', 'Los fines de semana paseo por el parque cercano, leo libros en la biblioteca, etc.'], // 5
        ['アナ さん は 来月 日本 へ 来ます=来る ね 。', 'Tú vienes a Japón el próximo mes, ¿verdad?'],                                  // 6
        ['大阪 に も 来て=来る ください 。', 'Ven también a Osaka, por favor.'],                                                       // 7
        ['わたし の アパート に いても=いる いい です よ 。', 'Puedes quedarte en mi departamento.'],                                   // 8
        ['いっしょに おいしい 料理 を 食べ=食べる に 行きましょう=行く 。', 'Vamos juntas a comer algo rico.'],                          // 9
        ['大阪 の 料理 は 安くて=安い おいしい です よ 。', 'La comida de Osaka es barata y rica.'],                                     // 10
        ['大阪 に 来る=来る とき は 、 電話 を ください 。', 'Cuando vengas a Osaka, llámame.'],                                         // 11
        ['それでは 、 また 。', 'Bueno, hasta pronto.'],                                                                              // 12
        ['ゆい', 'Yui'],                                                                                                             // 13
      ],
      questions: [
        {
          qjp: 'ゆい さん は 今 何 を して=する います=いる か 。',
          opts: ['大学 で 勉強 して=する います=いる 。', '図書館 で 働いて=働く います=いる 。', '大阪 の 会社 で 働いて=働く います=いる 。', '日本 語 を 教えて=教える います=いる 。'],
          a: 2, ev: 1,
          why: '「先月から大阪の会社に勤めています」: 勤める = trabajar para una empresa. A la biblioteca solo va a leer los fines de semana.',
        },
        {
          qjp: 'アナ さん は 大阪 に 行く=行く とき 、 何 を します=する か 。',
          opts: ['ゆい さん に 手紙 を 書きます=書く 。', 'ゆい さん に 電話 を かけます=かける 。', 'ゆい さん の 会社 へ 行きます=行く 。', '公園 を 散歩 します=する 。'],
          a: 1, ev: 11,
          why: '「大阪に来るときは、電話をください」: 電話をください = llámame (dame un llamado).',
        },
      ],
      ref: 'u14l2',
    },
    {
      id: 'd5-03', title: '私 の 好き な ところ',
      paras: [
        ['私 の うち の 近く に 大きな 公園 が あります=ある 。', 'Cerca de mi casa hay un parque grande.'],                                   // 0
        ['公園 の 中 に は 池 が あって=ある 、 魚 や 鳥 が たくさん います=いる 。', 'Dentro del parque hay un estanque, con muchos peces y pájaros.'], // 1
        ['私 は 毎朝 六 時 に 起きて=起きる 、 犬 と いっしょに 公園 を 散歩 します=する 。', 'Todas las mañanas me levanto a las seis y paseo por el parque con mi perro.'], // 2
        ['朝 の 公園 は 静か で 、 すずしい です 。', 'En la mañana el parque es tranquilo y fresco.'],                                         // 3
        ['日曜日 は 子ども が 大勢 来ます=来る から=から#porque 、 とても にぎやか です 。', 'Los domingos vienen muchos niños, así que es muy animado.'], // 4
        ['春 に なる=なる と 、 公園 の さくら が 咲きます=咲く 。', 'Cuando llega la primavera, florecen los cerezos del parque.'],              // 5
        ['その とき は 、 家族 と 木 の 下 で お弁当 を 食べます=食べる 。', 'En esa época, como un bento con mi familia bajo los árboles.'],        // 6
        ['でも 、 去年 の 春 は 雨 が 多くて=多い 、 家族 と 一回|いっかい=回 しか 行きませんでした=行く 。', 'Pero la primavera pasada llovió mucho y fui con mi familia solo una vez.'], // 7
        ['今年 は 何|なん=なん 回 も 行きたい=行く です 。', 'Este año quiero ir muchas veces.'],                                              // 8
        ['ルイス', 'Luis'],                                                                                                                 // 9
      ],
      questions: [
        {
          qjp: 'ルイス さん は 毎朝 何 を します=する か 。',
          opts: ['犬 と 公園 を 散歩 します=する 。', '池 で 魚 を 見ます=見る 。', '家族 と お弁当 を 食べます=食べる 。', '子ども と 公園 で 遊びます=遊ぶ 。'],
          a: 0, ev: 2,
          why: '「毎朝六時に起きて、犬といっしょに公園を散歩します」. El bento es en primavera y los niños vienen los domingos.',
        },
        {
          qjp: '去年 の 春 は どう でした=です か 。',
          opts: ['毎週 家族 と 公園 へ 行きました=行く 。', 'さくら が 咲きませんでした=咲く 。', '雨 が 多くて=多い 、 公園 へ あまり 行きませんでした=行く 。', '子ども が 大勢 来て=来る 、 にぎやか でした=です 。'],
          a: 2, ev: 7,
          why: '「去年の春は雨が多くて、家族と一回しか行きませんでした」: 〜しか + negativo = solo…',
        },
      ],
      ref: 'u14l3',
    },
  ],

  // ───────── 問題6 情報検索 ─────────
  dokkai6: [
    {
      id: 'd6-01', title: '日本 語 の クラス',
      paras: [
        ['アナ さん は 日本 語 の クラス に 入りたい=入る です 。', 'Ana quiere entrar a una clase de japonés.'],               // 0
        ['クラス は 土曜日 か 日曜日 が いい です 。', 'Prefiere una clase el sábado o el domingo.'],                             // 1
        ['でも 、 土曜日 と 日曜日 は 午後 一 時 まで 仕事 が あります=ある 。', 'Pero los sábados y domingos trabaja hasta la 1 p.m.'], // 2
        ['クラス の お金 は 千五百|せんごひゃく=千 円 まで が いい です 。', 'Quiere que la clase cueste como máximo 1500 yenes.'],    // 3
      ],
      table: {
        cols: ['先生', '曜日', '時間', 'お金 （ 一回|いっかい=回 ）'],
        rows: [
          ['山田 先生', '土曜日', '午前 十 時 〜 十二|じゅうに=十 時', '千 円'],
          ['田中 先生', '土曜日', '午後 一 時 〜 三 時', '千 円'],
          ['鈴木 先生', '日曜日', '午後 三 時 〜 五 時', '二千|にせん=千 円'],
          ['マリア 先生', '水曜日', '午後 六 時 〜 八 時', '千 円'],
          ['ルイス 先生', '日曜日', '午後 二 時 〜 四|よ=四 時', '千五百|せんごひゃく=千 円'],
        ],
      },
      questions: [{
        qjp: 'アナ さん は どの 先生 の クラス に 入ります=入る か 。',
        opts: ['田中 先生 の クラス', '鈴木 先生 の クラス', 'ルイス 先生 の クラス', 'マリア 先生 の クラス'],
        a: 2, ev: [1, 2, 3],
        why: 'Tiene que ser fin de semana, después de la 1 p.m. y costar 1500 yenes o menos. Yamada (mañana) y Tanaka (empieza a la 1, cuando ella aún trabaja) no sirven; Suzuki cuesta 2000 yenes; María es el miércoles. Solo queda Luis: domingo de 2 a 4, 1500 yenes.',
      }],
      ref: 'u4l3',
    },
    {
      id: 'd6-02', title: '食堂 の 料理',
      paras: [
        ['ケン さん は 大学 の 食堂 で 昼ごはん を 食べます=食べる 。', 'Ken va a almorzar en el casino de la universidad.'],       // 0
        ['食べ物 を 一つ と 飲み物 を 一つ 頼みます=頼む 。', 'Pide una comida y una bebida.'],                                  // 1
        ['ケン さん は 肉 が きらい です 。', 'A Ken no le gusta la carne.'],                                                  // 2
        ['お金 は 七百|ななひゃく=百 円 あります=ある 。', 'Tiene 700 yenes.'],                                                // 3
      ],
      table: {
        cols: ['料理', 'お金'],
        rows: [
          ['牛肉 の カレー', '五百五十|ごひゃくごじゅう=百 円'],
          ['野菜 の カレー', '四百五十|よんひゃくごじゅう=百 円'],
          ['魚 の お弁当', '六百|ろっぴゃく=百 円'],
          ['とりにく の ラーメン', '五百|ごひゃく=百 円'],
          ['コーヒー', '二百|にひゃく=百 円'],
          ['紅茶', '百五十|ひゃくごじゅう=百 円'],
          ['牛乳', '百 円'],
        ],
      },
      questions: [{
        qjp: 'ケン さん は 何 を 頼みます=頼む か 。',
        opts: ['野菜 の カレー と コーヒー', 'とりにく の ラーメン と 紅茶', '牛肉 の カレー と 牛乳', '魚 の お弁当 と コーヒー'],
        a: 0, ev: [2, 3],
        why: 'Sin carne y con 700 yenes: el ramen (pollo) y el curry de vacuno llevan carne; el bento de pescado con café suma 800 yenes. Curry de verduras + café = 450 + 200 = 650 yenes.',
      }],
      ref: 'u10l3',
    },
    {
      id: 'd6-03', title: '町 の プール',
      paras: [
        ['ケン さん は 日曜日 に 、 七 さい の 子ども と 二人 で 町 の プール へ 行きます=行く 。', 'Ken va el domingo a la piscina municipal con su hijo de siete años.'], // 0
        ['六 さい まで の 子ども は お金 が かかりません=かかる 。', 'Los niños de hasta seis años no pagan.'],                     // 1
      ],
      table: {
        cols: ['お金', '月曜日 〜 金曜日', '土曜日 ・ 日曜日'],
        rows: [
          ['大人', '五百|ごひゃく=百 円', '七百|ななひゃく=百 円'],
          ['子ども （ 七 さい 〜 十二|じゅうに=十 さい ）', '二百|にひゃく=百 円', '三百|さんびゃく=百 円'],
        ],
      },
      questions: [{
        qjp: 'ケン さん と 子ども は 二人 で いくら かかります=かかる か 。',
        opts: ['九百|きゅうひゃく=百 円', '千 円', '七百|ななひゃく=百 円', '千四百|せんよんひゃく=百 円'],
        a: 1, ev: [0, 1],
        why: 'Es domingo, así que se usa la columna 土曜日・日曜日: adulto 700 + niño de 7 años 300 = 1000 yenes. El niño sí paga porque tiene más de seis años.',
      }],
      ref: 'u10l2',
    },
  ],
};
