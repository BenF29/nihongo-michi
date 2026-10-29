// Lecturas graduadas. Formato: docs/FORMATO.md
// Nivel 1: tras la unidad 3 · 2: tras la unidad 5 · 3: tras la unidad 7 · 4: tras la unidad 9 · 5: intermedio · 6: N5 (tras las unidades 10–15).
// `ev` = índice global (desde 0) de la oración con la respuesta.

export default [
  // ═══════════════ NIVEL 1 ═══════════════
  {
    id: 'r01', level: 1, title: 'わたし の なまえ', es: 'Mi nombre', after: 'u3l3', topic: 'presentación',
    paras: [[
      ['はじめまして 。', 'Mucho gusto.'],                                   // 0
      ['わたし は アナ です 。', 'Yo soy Ana.'],                              // 1
      ['チリ じん です 。', 'Soy chilena.'],                                 // 2
      ['だいがく の がくせい です 。', 'Soy estudiante universitaria.'],      // 3
      ['ともだち の なまえ は ケン です 。', 'El nombre de mi amigo es Ken.'],  // 4
      ['ケン さん は にほん じん です 。', 'Ken es japonés.'],                // 5
      ['ケン さん も がくせい です 。', 'Ken también es estudiante.'],        // 6
    ]],
    questions: [
      { t: 'mc', q: '¿De dónde es Ana?', opts: ['De Chile', 'De Japón', 'De España'], a: 0, why: 'Ana dice 「チリじんです」: じん después de un país indica la nacionalidad.', ev: 2 },
      { t: 'tf', q: 'Ana es profesora.', a: false, why: 'Dice 「だいがくのがくせいです」: es estudiante de la universidad, no せんせい.', ev: 3 },
      { t: 'mc', q: '¿Quién es Ken?', opts: ['Un amigo de Ana', 'El profesor de Ana', 'El papá de Ana'], a: 0, why: '「ともだちのなまえはケンです」: el nombre de su amigo es Ken.', ev: 4 },
      { t: 'tf', q: 'Ken es japonés y también es estudiante.', a: true, why: '「にほんじんです」 (es japonés) y 「ケンさんもがくせいです」 (también es estudiante).', ev: [5, 6] },
      { t: 'mc', q: 'En 「ケンさんもがくせいです」, ¿qué significa も?', opts: ['también', 'no', 'de'], a: 0, why: 'も reemplaza a は y significa "también": Ken, igual que Ana, es estudiante.', ev: 6 },
      { t: 'text', q: '¿Cómo se dice "estudiante" en el texto? (escribe en hiragana)', accept: ['がくせい', '学生'], why: 'がくせい = estudiante. Aparece en 「だいがくのがくせいです」.', ev: 3 },
    ],
  },
  {
    id: 'r02', level: 1, title: 'これ は なん です か', es: '¿Qué es esto?', after: 'u3l4', topic: 'objetos',
    paras: [[
      ['アナ 「 ケン さん 、 これ は なん です か 。 」', 'Ana: —Ken, ¿qué es esto?'],                          // 0
      ['ケン 「 それ は にほん ご の じしょ です 。 」', 'Ken: —Eso es un diccionario de japonés.'],            // 1
      ['アナ 「 ケン さん の じしょ です か 。 」', 'Ana: —¿Es tu diccionario?'],                              // 2
      ['ケン 「 いいえ 、 わたし の じゃありません 。 せんせい の です 。 」', 'Ken: —No, no es mío. Es del profesor.'], // 3
      ['アナ 「 あれ も せんせい の です か 。 」', 'Ana: —¿Aquello también es del profesor?'],                // 4
      ['ケン 「 あの かさ です か 。 はい 、 そう です 。 」', 'Ken: —¿Aquel paraguas? Sí, así es.'],           // 5
      ['アナ 「 あの とけい は だれ の です か 。 」', 'Ana: —¿De quién es aquel reloj?'],                    // 6
      ['ケン 「 わたし の です 。 」', 'Ken: —Es mío.'],                                                    // 7
    ]],
    questions: [
      { t: 'mc', q: '¿Qué tipo de diccionario es?', opts: ['De japonés', 'De español', 'De inglés'], a: 0, why: '「にほんごのじしょ」 = diccionario de (idioma) japonés.', ev: 1 },
      { t: 'mc', q: '¿De quién es el diccionario?', opts: ['Del profesor', 'De Ken', 'De Ana'], a: 0, why: 'Ken dice 「わたしのじゃありません。せんせいのです」: no es suyo, es del profesor.', ev: 3 },
      { t: 'mc', q: 'En 「わたしのじゃありません」, ¿qué quiere decir Ken?', opts: ['No es mío.', 'No soy yo.', 'Es mío.'], a: 0, why: 'わたしの = "lo mío"; じゃありません lo niega: "no es mío".', ev: 3 },
      { t: 'tf', q: 'El paraguas es de Ken.', a: false, why: 'Ana pregunta si aquello también es del profesor, y Ken responde 「はい、そうです」: el paraguas es del profesor.', ev: [4, 5] },
      { t: 'mc', q: '¿De quién es el reloj?', opts: ['De Ken', 'Del profesor', 'De Ana'], a: 0, why: 'A 「だれのですか」 Ken responde 「わたしのです」: es suyo.', ev: [6, 7] },
      { t: 'text', q: '¿Con qué palabra pregunta Ana "¿de quién?"? (escribe en hiragana)', accept: ['だれの', 'だれ の', 'だれ'], why: 'だれ = quién; だれの = de quién: 「だれのですか」.', ev: 6 },
    ],
  },
  {
    id: 'r03', level: 1, title: 'わたし の ともだち', es: 'Mi amiga', after: 'u3l4', topic: 'personas',
    paras: [[
      ['わたし の ともだち は マリア さん です 。', 'Mi amiga es María.'],         // 0
      ['マリア さん は メキシコ じん です 。', 'María es mexicana.'],            // 1
      ['マリア さん は いしゃ です 。', 'María es médica.'],                  // 2
      ['マリア さん の おかあさん も いしゃ です 。', 'La mamá de María también es médica.'], // 3
      ['マリア さん の くるま は あかい です 。', 'El auto de María es rojo.'],   // 4
      ['マリア さん の ねこ の なまえ は ゆき です 。', 'El nombre de la gata de María es Yuki ("nieve").'], // 5
      ['ゆき は ちいさい ねこ です 。', 'Yuki es una gata pequeña.'],             // 6
    ]],
    questions: [
      { t: 'mc', q: '¿De dónde es María?', opts: ['De México', 'De Chile', 'De Japón'], a: 0, why: '「メキシコじんです」 = es mexicana.', ev: 1 },
      { t: 'mc', q: '¿Cuál es la profesión de María?', opts: ['Médica', 'Profesora', 'Estudiante'], a: 0, why: '「マリアさんはいしゃです」: いしゃ = médico/a.', ev: 2 },
      { t: 'tf', q: 'La mamá de María también es médica.', a: true, why: '「おかあさんもいしゃです」: も = también.', ev: 3 },
      { t: 'mc', q: '¿De qué color es el auto de María?', opts: ['Rojo', 'Azul', 'No se dice'], a: 0, why: '「くるまはあかいです」: あかい = rojo (あおい sería azul).', ev: 4 },
      { t: 'tf', q: 'Yuki es la hermana de María.', a: false, why: 'Yuki es el nombre de su gata: 「ねこのなまえはゆきです」.', ev: [5, 6] },
      { t: 'text', q: '¿Cómo se llama la gata? (escribe en hiragana)', accept: ['ゆき', '雪'], why: '「ねこのなまえはゆきです」. ゆき también significa "nieve".', ev: 5 },
    ],
  },
  {
    id: 'r04', level: 1, title: 'きょうしつ', es: 'La sala de clases', after: 'u3l4', topic: 'escuela',
    paras: [[
      ['これ は わたし の がっこう です 。', 'Esta es mi escuela.'],                // 0
      ['わたし は こうこうせい です 。', 'Soy estudiante de enseñanza media.'],     // 1
      ['この きょうしつ は ちいさい です 。', 'Esta sala de clases es pequeña.'],    // 2
      ['あの ひと は やまだ せんせい です 。', 'Aquella persona es el profesor Yamada.'], // 3
      ['やまだ せんせい は にほん ご の せんせい です 。', 'El profesor Yamada es profesor de japonés.'], // 4
      ['あの がくせい は ルイス さん です 。', 'Aquel estudiante es Luis.'],         // 5
      ['ルイス さん は こうこうせい じゃありません 。', 'Luis no es estudiante de enseñanza media.'], // 6
      ['だいがく の がくせい です 。', 'Es estudiante universitario.'],              // 7
    ]],
    questions: [
      { t: 'mc', q: '¿Qué es la persona que narra?', opts: ['Estudiante de enseñanza media', 'Profesor(a)', 'Estudiante universitario(a)'], a: 0, why: '「わたしはこうこうせいです」: こうこうせい = estudiante de enseñanza media (palabra nueva).', ev: 1 },
      { t: 'tf', q: 'La sala de clases es grande.', a: false, why: '「このきょうしつはちいさいです」: es pequeña.', ev: 2 },
      { t: 'mc', q: '¿Qué enseña el profesor Yamada?', opts: ['Japonés', 'Español', 'No se dice'], a: 0, why: '「にほんごのせんせいです」 = profesor de japonés.', ev: 4 },
      { t: 'mc', q: '¿Quién es Luis?', opts: ['Un estudiante universitario', 'Un compañero de curso', 'Un profesor'], a: 0, why: 'Luis no es こうこうせい: 「だいがくのがくせいです」.', ev: [6, 7] },
      { t: 'tf', q: 'El narrador y Luis estudian en el mismo tipo de institución.', a: false, why: 'El narrador está en enseñanza media (こうこうせい) y Luis en la universidad (だいがく).', ev: [1, 7] },
      { t: 'text', q: 'Escribe en hiragana la palabra que significa "sala de clases".', accept: ['きょうしつ', '教室'], why: 'きょうしつ = sala de clases: 「このきょうしつはちいさいです」.', ev: 2 },
    ],
  },

  // ═══════════════ NIVEL 2 ═══════════════
  {
    id: 'r05', level: 2, title: 'わたし の 一日', es: 'Mi día', after: 'u5l3', topic: 'rutina',
    paras: [[
      ['わたし は ケン です 。 がくせい です 。', 'Soy Ken. Soy estudiante.'],                         // 0
      ['毎日 七|しち 時 に あさごはん を 食べます=食べる 。', 'Todos los días desayuno a las siete.'],   // 1
      ['パン を 食べます=食べる 。 コーヒー を 飲みます=飲む 。', 'Como pan. Tomo café.'],             // 2
      ['八 時 に でんしゃ で 学校 へ 行きます=行く 。', 'A las ocho voy a la escuela en tren.'],        // 3
    ], [
      ['学校 は 九|く 時 から 三 時 まで です 。', 'Las clases son de nueve a tres.'],                  // 4
      ['ひるごはん は ともだち と 学校 で 食べます=食べる 。', 'Almuerzo en la escuela con mis amigos.'], // 5
      ['三 時 半 に としょかん へ 行きます=行く 。', 'A las tres y media voy a la biblioteca.'],          // 6
      ['六 時 まで べんきょう します=する 。', 'Estudio hasta las seis.'],                             // 7
      ['七|しち 時 に うち へ 帰ります=帰る 。', 'A las siete vuelvo a casa.'],                         // 8
      ['よる 、 テレビ を 見ます=見る 。', 'En la noche veo televisión.'],                              // 9
    ]],
    questions: [
      { t: 'mc', q: '¿A qué hora desayuna Ken?', opts: ['A las 7', 'A las 8', 'A las 9'], a: 0, why: '「七時にあさごはんを食べます」. Ojo: 七時 se lee しちじ.', ev: 1 },
      { t: 'mc', q: '¿Cómo va Ken a la escuela?', opts: ['En tren', 'En bus', 'En bicicleta'], a: 0, why: '「でんしゃで学校へ行きます」: で marca el medio de transporte.', ev: 3 },
      { t: 'tf', q: 'Ken almuerza solo.', a: false, why: '「ひるごはんはともだちと学校で食べます」: と = con. Almuerza con sus amigos.', ev: 5 },
      { t: 'mc', q: '¿Cuánto tiempo estudia en la biblioteca?', opts: ['Dos horas y media', 'Una hora', 'Cuatro horas'], a: 0, why: 'Llega a las 三時半 (3:30) y estudia 「六時まで」 (hasta las 6): dos horas y media.', ev: [6, 7] },
      { t: 'tf', q: 'Ken vuelve a casa antes de las seis.', a: false, why: '「七時にうちへ帰ります」: vuelve a las siete.', ev: 8 },
      { t: 'text', q: '¿Qué bebe Ken en el desayuno? (escribe en katakana)', accept: ['コーヒー'], why: '「コーヒーを飲みます」: を marca lo que bebe.', ev: 2 },
    ],
  },
  {
    id: 'r06', level: 2, title: 'しゅうまつ', es: 'El fin de semana', after: 'u5l5', topic: 'pasado',
    paras: [[
      ['先週 の 土曜日 、 わたし は ともだち と こうえん へ 行きました=行く 。', 'El sábado pasado fui al parque con mis amigos.'], // 0
      ['こうえん で サッカー を しました=する 。', 'Jugamos fútbol en el parque.'],                // 1
      ['それから 、 店 で ジュース を 買いました=買う 。', 'Después compré un jugo en una tienda.'],    // 2
    ], [
      ['日曜日 は うち で ほん を 読みました=読む 。', 'El domingo leí un libro en casa.'],          // 3
      ['午後 、 おかあさん と レストラン で ひるごはん を 食べました=食べる 。', 'En la tarde almorcé con mi mamá en un restaurante.'], // 4
      ['わたし は ラーメン を 食べました=食べる 。', 'Yo comí ramen.'],                             // 5
      ['おかあさん は すし を 食べました=食べる 。', 'Mi mamá comió sushi.'],                       // 6
      ['よる は テレビ を 見ませんでした=見る 。', 'En la noche no vi televisión.'],               // 7
      ['しゅくだい を しました=する 。', 'Hice la tarea.'],                                         // 8
      ['いい しゅうまつ でした=です:pasado 。', 'Fue un buen fin de semana.'],                      // 9
    ]],
    questions: [
      { t: 'mc', q: '¿Con quién fue al parque?', opts: ['Con sus amigos', 'Con su mamá', 'Solo/a'], a: 0, why: '「ともだちとこうえんへ行きました」: と = con.', ev: 0 },
      { t: 'mc', q: '¿Qué hizo en el parque?', opts: ['Jugó fútbol', 'Leyó un libro', 'Comió sushi'], a: 0, why: '「こうえんでサッカーをしました」: で marca el lugar de la acción.', ev: 1 },
      { t: 'tf', q: 'El domingo almorzó en casa.', a: false, why: 'En casa leyó un libro, pero almorzó 「レストランで」, en un restaurante.', ev: [3, 4] },
      { t: 'mc', q: '¿Qué comió la mamá?', opts: ['Sushi', 'Ramen', 'Pan'], a: 0, why: '「おかあさんはすしを食べました」. El narrador comió ラーメン.', ev: [5, 6] },
      { t: 'tf', q: 'El domingo en la noche vio televisión.', a: false, why: '「テレビを見ませんでした」: ませんでした = no (lo hizo) en pasado. Hizo la tarea.', ev: [7, 8] },
      { t: 'text', q: '¿Qué compró en la tienda? (escribe en katakana)', accept: ['ジュース'], why: '「店でジュースを買いました」.', ev: 2 },
    ],
  },
  {
    id: 'r07', level: 2, title: '映画 を 見ませんか=見る', es: '¿Vamos al cine?', after: 'u5l5', topic: 'invitación',
    paras: [[
      ['アナ さん 、 こんにちは 。', 'Hola, Ana.'],                                                         // 0
      ['来週 の 金曜日 、 いっしょに 映画 を 見ませんか=見る 。', '¿Vemos una película juntas el próximo viernes?'], // 1
      ['日本 の 映画 です 。', 'Es una película japonesa.'],                                               // 2
      ['映画 は 六 時 半 から です 。', 'La película es a las seis y media.'],                               // 3
      ['五 時 に えき で 会いませんか=会う 。', '¿Nos juntamos a las cinco en la estación?'],                 // 4
      ['九|く=九 時 に レストラン で ばんごはん を 食べましょう=食べる 。', 'A las nueve cenemos en un restaurante.'], // 5
      ['ゆい より', 'De Yui'],                                                                               // 6
    ], [
      ['ゆい さん 、 ありがとうございます 。', 'Yui, muchas gracias.'],                                     // 7
      ['金曜日 は ちょっと … 。', 'El viernes es un poco… (difícil).'],                                     // 8
      ['アルバイト です 。', 'Tengo trabajo de medio tiempo.'],                                            // 9
      ['土曜日 は いい です か 。', '¿Te parece bien el sábado?'],                                          // 10
      ['アナ より', 'De Ana'],                                                                               // 11
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le propone Yui a Ana?', opts: ['Ver una película juntas', 'Ir a la playa', 'Estudiar japonés'], a: 0, why: '「いっしょに映画を見ませんか」: 〜ませんか es una invitación ("¿por qué no…?").', ev: 1 },
      { t: 'mc', q: '¿Dónde quiere juntarse Yui?', opts: ['En la estación', 'En el cine', 'En el restaurante'], a: 0, why: '「五時にえきで会いませんか」.', ev: 4 },
      { t: 'mc', q: '¿A qué hora empieza la película?', opts: ['A las 6:30', 'A las 5:00', 'A las 9:00'], a: 0, why: '「映画は六時半からです」: 半 = y media; から = desde.', ev: 3 },
      { t: 'tf', q: 'Ana acepta ir el viernes.', a: false, why: '「金曜日はちょっと…」 es la forma amable de rechazar en japonés.', ev: 8 },
      { t: 'mc', q: '¿Por qué no puede Ana el viernes?', opts: ['Tiene trabajo de medio tiempo', 'Está enferma', 'Va a la playa'], a: 0, why: '「アルバイトです」: アルバイト = trabajo de medio tiempo.', ev: 9 },
      { t: 'text', q: '¿Qué día propone Ana? (escribe en japonés)', accept: ['土曜日', 'どようび', '土曜'], why: '「土曜日はいいですか」: propone el sábado.', ev: 10 },
    ],
  },
  {
    id: 'r08', level: 2, title: 'えき で', es: 'En la estación', after: 'u5l4', topic: 'viaje',
    paras: [[
      ['日曜日 、 ルイス さん は 京都 へ 行きます=行く 。', 'El domingo, Luis va a Kioto.'],                       // 0
      ['あさ 九|く 時 に 東京 えき へ 来ました=来る 。', 'A las nueve de la mañana llegó a la estación de Tokio.'], // 1
    ], [
      ['ルイス 「 すみません 。 京都 の でんしゃ は どこ です か 。 」', 'Luis: —Disculpe. ¿Dónde está el tren a Kioto?'], // 2
      ['えき の 人 「 あそこ です 。 十四|じゅうよん=十 ばんせん です 。 」', 'Funcionario de la estación: —Allá. Es el andén 14.'],         // 3
      ['ルイス 「 なん 時 の でんしゃ です か 。 」', 'Luis: —¿A qué hora sale el tren?'],                             // 4
      ['えき の 人 「 九|く 時 半 です 。 」', 'Funcionario: —A las nueve y media.'],                                    // 5
      ['ルイス 「 きっぷ は どこ で 買います=買う か 。 」', 'Luis: —¿Dónde se compra el boleto?'],                   // 6
      ['えき の 人 「 ここ です 。 一万|いちまん=万 四千|よんせん=千 円 です 。 」', 'Funcionario: —Aquí. Son 14.000 yenes.'], // 7
      ['ルイス 「 ありがとうございます 。 」', 'Luis: —Muchas gracias.'],                                             // 8
    ], [
      ['ルイス さん は きっぷ を 買いました=買う 。', 'Luis compró el boleto.'],                                      // 9
      ['それから 、 でんしゃ で 京都 へ 行きました=行く 。', 'Después fue a Kioto en tren.'],                          // 10
    ]],
    questions: [
      { t: 'mc', q: '¿Adónde va Luis?', opts: ['A Kioto', 'A Tokio', 'A Osaka'], a: 0, why: '「京都へ行きます」: está en Tokio y viaja a Kioto.', ev: 0 },
      { t: 'mc', q: '¿Por qué Luis dice すみません al principio?', opts: ['Para llamar la atención antes de preguntar', 'Porque llegó tarde', 'Para despedirse'], a: 0, why: 'すみません se usa como "disculpe" para dirigirse a alguien.', ev: 2 },
      { t: 'mc', q: '¿De qué andén sale el tren?', opts: ['Del 14', 'Del 4', 'Del 10'], a: 0, why: '「十四ばんせんです」: 十四 = 10 + 4.', ev: 3 },
      { t: 'tf', q: 'El tren sale a las nueve en punto.', a: false, why: '「九時半です」: sale a las nueve y media. Luis llegó a las nueve.', ev: [1, 5] },
      { t: 'mc', q: '¿Cuánto cuesta el boleto?', opts: ['14.000 yenes', '1.400 yenes', '4.000 yenes'], a: 0, why: '一万 = 10.000 y 四千 = 4.000: 一万四千円 = 14.000 yenes.', ev: 7 },
      { t: 'text', q: '¿Cómo se dice "boleto" en el texto? (escribe en hiragana)', accept: ['きっぷ', '切符'], why: 'きっぷ = boleto: 「きっぷはどこで買いますか」.', ev: 6 },
    ],
  },

  // ═══════════════ NIVEL 3 ═══════════════
  {
    id: 'r09', level: 3, title: 'わたし の 家族', es: 'Mi familia', after: 'u7l3', topic: 'familia',
    paras: [[
      ['わたし の 家族 は 五 人|にん=にん です 。', 'Mi familia somos cinco personas.'],               // 0
      ['父 と 母 と 兄 と 妹 と わたし です 。', 'Mi papá, mi mamá, mi hermano mayor, mi hermana menor y yo.'], // 1
    ], [
      ['父 は 五十|ごじゅう=十 さい です 。', 'Mi papá tiene cincuenta años.'],                       // 2
      ['父 は 会社員 です 。 毎日 とても いそがしい です 。', 'Mi papá es empleado de una empresa. Todos los días está muy ocupado.'], // 3
      ['母 は しょうがっこう の 先生 です 。', 'Mi mamá es profesora de primaria.'],               // 4
      ['母 は りょうり が とても 上手 です 。', 'Mi mamá cocina muy bien.'],                          // 5
      ['兄 は 二十三|にじゅうさん=三 さい です 。', 'Mi hermano mayor tiene veintitrés años.'],        // 6
      ['兄 は 大阪 の 大学 の 学生 です 。', 'Mi hermano es estudiante de una universidad de Osaka.'], // 7
      ['妹 は 十|じゅっ=十 さい です 。', 'Mi hermana menor tiene diez años.'],                      // 8
      ['妹 は ねこ が とても 好き です 。', 'A mi hermana le gustan mucho los gatos.'],              // 9
      ['うち に 小さい ねこ が います=いる 。', 'En casa hay un gato pequeño.'],                       // 10
    ], [
      ['わたし の 家族 は とても にぎやか です 。', 'Mi familia es muy animada.'],                     // 11
    ]],
    questions: [
      { t: 'mc', q: '¿Cuántas personas hay en la familia?', qjp: '家族 は 何|なん=なん 人|にん=にん です か 。', opts: ['Cinco', 'Cuatro', 'Seis'], a: 0, why: '「家族は五人です」: 人 se lee にん al contar personas desde tres.', ev: 0 },
      { t: 'mc', q: '¿Cuántos hijos tienen los padres?', opts: ['Tres', 'Dos', 'Uno'], a: 0, why: 'Los hijos son 兄, 妹 y el narrador (わたし): tres.', ev: 1 },
      { t: 'tf', q: 'La mamá es profesora de primaria.', qjp: 'お母さん は しょうがっこう の 先生 です か 。', a: true, why: '「母はしょうがっこうの先生です」. Para tu propia mamá se dice 母; para la de otros, お母さん.', ev: 4 },
      { t: 'mc', q: '¿Dónde estudia el hermano mayor?', qjp: 'お兄さん は どこ の 大学 の 学生 です か 。', opts: ['En una universidad de Osaka', 'En una universidad de Tokio', 'En una escuela primaria'], a: 0, why: '「兄は大阪の大学の学生です」.', ev: 7 },
      { t: 'tf', q: 'La hermana menor tiene diez años y le gustan los gatos.', a: true, why: '「妹は十さいです」 y 「ねこがとても好きです」. Ojo: 十歳 se lee じゅっさい.', ev: [8, 9] },
      { t: 'text', q: '¿Cómo describe el narrador a su familia? (una palabra en japonés)', qjp: 'わたし の 家族 は どんな 家族 です か 。', accept: ['にぎやか', 'にぎやかです', 'にぎやか です', 'とてもにぎやか'], why: '「わたしの家族はとてもにぎやかです」: にぎやか = animada, bulliciosa.', ev: 11 },
    ],
  },
  {
    id: 'r10', level: 3, title: 'わたし の 部屋', es: 'Mi pieza', after: 'u7l3', topic: 'casa',
    paras: [[
      ['これ は わたし の 部屋 です 。', 'Esta es mi pieza.'],                                                   // 0
      ['部屋 は あまり 大きくない=大きい です が 、 とても きれい です 。', 'La pieza no es muy grande, pero está muy limpia.'], // 1
      ['部屋 の 中 に 机 と いす と ベッド が あります=ある 。', 'En la pieza hay un escritorio, una silla y una cama.'],   // 2
      ['机 の 上 に パソコン が あります=ある 。', 'Sobre el escritorio hay un computador.'],                     // 3
      ['いす の 下 に ねこ が います=いる 。', 'Debajo de la silla hay un gato.'],                               // 4
      ['ねこ の 名前 は ミケ です 。', 'El gato se llama Mike.'],                                              // 5
    ], [
      ['ベッド の 右 に ほん が たくさん あります=ある 。', 'A la derecha de la cama hay muchos libros.'],         // 6
      ['わたし は 日本 の まんが が 好き です 。', 'Me gusta el manga japonés.'],                              // 7
      ['部屋 の 左 に 大きい テレビ が あります=ある 。', 'A la izquierda de la pieza hay una televisión grande.'],   // 8
      ['部屋 の となり は 兄 の 部屋 です 。', 'Al lado de mi pieza está la pieza de mi hermano mayor.'],        // 9
      ['兄 の 部屋 は きれい じゃありません 。', 'La pieza de mi hermano no está limpia.'],                      // 10
    ]],
    questions: [
      { t: 'tf', q: 'La pieza es grande.', qjp: '部屋 は 大きい です か 。', a: false, why: '「あまり大きくないです」: あまり + negativo = "no muy". Es pequeña, pero limpia.', ev: 1 },
      { t: 'mc', q: '¿Qué hay sobre el escritorio?', qjp: '机 の 上 に 何|なに が あります=ある か 。', opts: ['Un computador', 'Un gato', 'Libros'], a: 0, why: '「机の上にパソコンがあります」: 上 = sobre, encima.', ev: 3 },
      { t: 'mc', q: '¿Dónde está el gato?', qjp: 'ねこ は どこ に います=いる か 。', opts: ['Debajo de la silla', 'Sobre la cama', 'Al lado de la televisión'], a: 0, why: '「いすの下にねこがいます」. Para animales se usa います, no あります.', ev: 4 },
      { t: 'mc', q: '¿Qué hay a la derecha de la cama?', qjp: 'ベッド の 右 に 何|なに が あります=ある か 。', opts: ['Muchos libros', 'Una televisión', 'Un escritorio'], a: 0, why: '「ベッドの右にほんがたくさんあります」. La televisión está a la izquierda (左).', ev: [6, 8] },
      { t: 'tf', q: 'La pieza del hermano mayor está desordenada (no limpia).', qjp: '兄 の 部屋 は きれい です か 。', a: true, why: '「兄の部屋はきれいじゃありません」: no está limpia.', ev: 10 },
      { t: 'text', q: '¿Cómo se llama el gato? (escribe en katakana)', qjp: 'ねこ の 名前 は 何|なん=なん です か 。', accept: ['ミケ'], why: '「ねこの名前はミケです」. ミケ es un nombre típico de gato en Japón.', ev: 5 },
    ],
  },
  {
    id: 'r11', level: 3, title: '京都 旅行', es: 'Viaje a Kioto', after: 'u6l3', topic: 'viaje',
    paras: [[
      ['先週 の しゅうまつ 、 ともだち と 京都 へ 旅行 に 行きました=行く 。', 'El fin de semana pasado fui de viaje a Kioto con un amigo.'], // 0
      ['東京 から 京都 まで しんかんせん で 行きました=行く 。', 'Fuimos de Tokio a Kioto en shinkansen.'],                // 1
      ['京都 は とても きれい な 町 でした=です:pasado 。', 'Kioto era una ciudad muy bonita.'],                        // 2
      ['京都 の おてら は 古くて=古い 、 とても 有名 です 。', 'Los templos de Kioto son antiguos y muy famosos.'],        // 3
    ], [
      ['天気 は よかった=いい です 。', 'El clima estuvo bueno.'],                                                    // 4
      ['でも 、 とても 暑かった=暑い です 。', 'Pero hizo mucho calor.'],                                             // 5
      ['ひるごはん は 有名 な レストラン で 食べました=食べる 。', 'Almorzamos en un restaurante famoso.'],               // 6
      ['食べ物 は おいしかった=おいしい です が 、 少し 高かった=高い です 。', 'La comida estaba rica, pero un poco cara.'], // 7
      ['午後 、 大きい こうえん へ 行きました=行く 。', 'En la tarde fuimos a un parque grande.'],                       // 8
      ['こうえん は 静か でした=です:pasado 。', 'El parque estaba tranquilo.'],                                       // 9
      ['旅行 は とても 楽しかった=楽しい です 。', 'El viaje fue muy entretenido.'],                                  // 10
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo viajaron a Kioto?', qjp: '何|なに で 京都 へ 行きました=行く か 。', opts: ['En shinkansen', 'En auto', 'En avión'], a: 0, why: '「しんかんせんで行きました」: で marca el medio. しんかんせん = tren bala.', ev: 1 },
      { t: 'mc', q: '¿Cómo estuvo el clima?', qjp: '天気 は どう でした=です:pasado か 。', opts: ['Bueno, pero muy caluroso', 'Frío y lluvioso', 'Malo'], a: 0, why: '「天気はよかったです。でも、とても暑かったです」. よかった es el pasado irregular de いい.', ev: [4, 5] },
      { t: 'tf', q: 'La comida era barata.', qjp: '食べ物 は 安かった=安い です か 。', a: false, why: '「おいしかったですが、少し高かったです」: rica pero un poco cara.', ev: 7 },
      { t: 'mc', q: '¿Cómo son los templos de Kioto según el texto?', opts: ['Antiguos y famosos', 'Nuevos y pequeños', 'Ruidosos'], a: 0, why: '「古くて、とても有名です」: 古くて = son antiguos y….', ev: 3 },
      { t: 'text', q: '¿Cómo estaba el parque? (escribe el adjetivo en japonés)', qjp: 'こうえん は どう でした=です:pasado か 。', accept: ['しずか', '静か', 'しずかでした', '静かでした', 'しずか でした', '静か でした'], why: '「こうえんは静かでした」: 静か = tranquilo (adjetivo な, pasado con でした).', ev: 9 },
      { t: 'tf', q: 'El viaje fue entretenido.', a: true, why: '「旅行はとても楽しかったです」: 楽しかった es el pasado de 楽しい.', ev: 10 },
    ],
  },
  {
    id: 'r12', level: 3, title: '町 の カフェ', es: 'El café del barrio', after: 'u7l2', topic: 'ciudad',
    paras: [[
      ['わたし の 町 に 小さい カフェ が あります=ある 。', 'En mi barrio hay un café pequeño.'],                 // 0
      ['カフェ は えき の 近く に あります=ある 。', 'El café está cerca de la estación.'],                     // 1
      ['ぎんこう の となり です 。', 'Está al lado del banco.'],                                               // 2
      ['カフェ の 中 は 静か です 。', 'Adentro del café es tranquilo.'],                                      // 3
    ], [
      ['コーヒー は 三百|さんびゃく=百 円 です 。 安い です 。', 'El café cuesta 300 yenes. Es barato.'],       // 4
      ['ケーキ も あります=ある 。 ケーキ は とても おいしい です 。', 'También hay tortas. Las tortas son muy ricas.'], // 5
      ['カフェ の 人 は やさしい です 。', 'La gente del café es amable.'],                                     // 6
      ['わたし は ときどき 土曜日 に ここ で ほん を 読みます=読む 。', 'A veces los sábados leo libros aquí.'],     // 7
    ], [
      ['カフェ の 前 に 大きい 木 が あります=ある 。', 'Delante del café hay un árbol grande.'],               // 8
      ['木 の 下 に いぬ が います=いる 。 カフェ の いぬ です 。', 'Debajo del árbol hay un perro. Es el perro del café.'], // 9
    ]],
    questions: [
      { t: 'mc', q: '¿Dónde está el café?', qjp: 'カフェ は どこ に あります=ある か 。', opts: ['Cerca de la estación, al lado del banco', 'Dentro de la estación', 'Lejos del barrio'], a: 0, why: '「えきの近くにあります」 y 「ぎんこうのとなりです」.', ev: [1, 2] },
      { t: 'tf', q: 'El café es ruidoso.', qjp: 'カフェ の 中 は にぎやか です か 。', a: false, why: '「カフェの中は静かです」: es tranquilo (lo contrario de にぎやか).', ev: 3 },
      { t: 'mc', q: '¿Cuánto cuesta un café?', qjp: 'コーヒー は いくら です か 。', opts: ['300 yenes', '3.000 yenes', '100 yenes'], a: 0, why: '「三百円です」: 三百 se lee さんびゃく.', ev: 4 },
      { t: 'mc', q: '¿Qué hace el narrador a veces en el café?', opts: ['Lee libros los sábados', 'Trabaja los domingos', 'Estudia todos los días'], a: 0, why: '「ときどき土曜日にここでほんを読みます」: ときどき = a veces.', ev: 7 },
      { t: 'mc', q: '¿Qué hay delante del café?', qjp: 'カフェ の 前 に 何|なに が あります=ある か 。', opts: ['Un árbol grande con un perro debajo', 'Un banco', 'Una estación'], a: 0, why: '「カフェの前に大きい木があります」 y 「木の下にいぬがいます」.', ev: [8, 9] },
      { t: 'text', q: 'Además de café, ¿qué venden? (escribe en katakana)', qjp: 'カフェ に は コーヒー と 何|なに が あります=ある か 。', accept: ['ケーキ'], why: '「ケーキもあります」: も = también.', ev: 5 },
    ],
  },

  // ═══════════════ NIVEL 4 ═══════════════
  {
    id: 'r13', level: 4, title: '日曜日 の 日記', es: 'Diario del domingo', after: 'u8l3', topic: 'diario',
    paras: [[
      ['日曜日 、 雨 。', 'Domingo, lluvia.'],                                                                        // 0
      ['今日 は あさ から 雨 が ふって=ふる いました=いる 。', 'Hoy llovió desde la mañana.'],                       // 1
      ['わたし は 九|く 時 に 起きて=起きる 、 シャワー を あびました=あびる 。', 'Me levanté a las nueve y me duché.'], // 2
      ['それから 、 パン を 食べて=食べる 、 コーヒー を 飲みました=飲む 。', 'Luego comí pan y tomé café.'],          // 3
      ['午前 は うち で ほん を 読んで=読む 、 しゅくだい を しました=する 。', 'En la mañana leí un libro en casa e hice la tarea.'], // 4
    ], [
      ['午後 、 ともだち の ゆい さん が うち へ 来ました=来る 。', 'En la tarde vino a mi casa mi amiga Yui.'],          // 5
      ['ゆい さん は おいしい ケーキ を 買って=買う 来ました=来る 。', 'Yui trajo una torta rica (la compró y vino).'],     // 6
      ['二人 で ケーキ を 食べて=食べる 、 たくさん 話しました=話す 。', 'Entre las dos comimos torta y conversamos mucho.'], // 7
      ['ゆい さん は 来月 けっこん します=する 。', 'Yui se casa el próximo mes.'],                                      // 8
      ['わたし は ぜんぜん 知りませんでした=知る 。', 'Yo no tenía idea.'],                                              // 9
      ['ゆい さん の かれ の 写真 を 見ました=見る 。', 'Vi una foto del novio de Yui.'],                                   // 10
      ['かれ は 大きくて=大きい 、 やさしい 人 です 。', 'Él es alto (grande) y amable.'],                                // 11
    ], [
      ['よる 十一|じゅういち=十 時 に 寝ました=寝る 。', 'En la noche me acosté a las once.'],                              // 12
      ['いい 一日 でした=です:pasado 。', 'Fue un buen día.'],                                                          // 13
    ]],
    questions: [
      { t: 'mc', q: '¿Cómo estuvo el tiempo el domingo?', qjp: '日曜日 の 天気 は どう でした=です:pasado か 。', opts: ['Llovió desde la mañana', 'Hizo mucho calor', 'Nevó en la noche'], a: 0, why: '「あさから雨がふっていました」: ふっていました = estaba lloviendo.', ev: [0, 1] },
      { t: 'mc', q: '¿Qué hizo en la mañana?', qjp: '午前 は 何|なに を しました=する か 。', opts: ['Leyó un libro e hizo la tarea', 'Fue al parque', 'Compró una torta'], a: 0, why: '「ほんを読んで、しゅくだいをしました」: la forma て une acciones en secuencia.', ev: 4 },
      { t: 'tf', q: 'Yui preparó la torta ella misma.', qjp: 'ゆい さん は ケーキ を 作りました=作る か 。', a: false, why: '「ケーキを買って来ました」: la compró y la trajo (買って来る = comprar y venir con algo).', ev: 6 },
      { t: 'mc', q: '¿Qué noticia le dio Yui?', opts: ['Que se casa el próximo mes', 'Que se cambia de casa', 'Que viaja a Japón'], a: 0, why: '「来月けっこんします」: 来月 = el próximo mes.', ev: 8 },
      { t: 'tf', q: 'El narrador ya sabía la noticia.', a: false, why: '「ぜんぜん知りませんでした」: no tenía idea (ぜんぜん + negativo = para nada).', ev: 9 },
      { t: 'mc', q: '¿Cómo es el novio de Yui según la foto y la conversación?', qjp: 'かれ は どんな 人 です か 。', opts: ['Alto y amable', 'Pequeño y serio', 'Famoso y ocupado'], a: 0, why: '「大きくて、やさしい人です」: 大きくて = es grande y….', ev: 11 },
      { t: 'text', q: '¿A qué hora se acostó? (escribe en japonés, por ejemplo 〇時)', qjp: '何|なん=なん 時 に 寝ました=寝る か 。', accept: ['十一時', 'じゅういちじ', '11時', '十一時に', 'じゅういちじに'], why: '「十一時に寝ました」.', ev: 12 },
    ],
  },
  {
    id: 'r14', level: 4, title: '夏休み は 何|なに を する ？', es: '¿Qué harás en vacaciones?', after: 'u9l2', topic: 'habla casual',
    paras: [[
      ['ケン 「 ゆい 、 夏休み は 何|なに を する ？ 」', 'Ken: —Yui, ¿qué vas a hacer en las vacaciones?'],                // 0
      ['ゆい 「 何も ない よ 。 ケン は ？ 」', 'Yui: —Nada (no tengo planes). ¿Y tú, Ken?'],                             // 1
      ['ケン 「 ぼく は 家族 と 沖縄 へ 行く よ 。 」', 'Ken: —Voy a Okinawa con mi familia.'],                            // 2
      ['ゆい 「 本当 ？ すごい ね ！ 」', 'Yui: —¿En serio? ¡Qué genial!'],                                     // 3
      ['ケン 「 うん 。 海 で 泳ぎたい=泳ぐ 。 」', 'Ken: —Sí. Quiero nadar en el mar.'],                                  // 4
      ['ゆい 「 いい ね 。 でも 、 わたし は 泳げない=泳ぐ:potencial-negativo 。 」', 'Yui: —Qué bien. Pero yo no sé nadar.'], // 5
    ], [
      ['ケン 「 じゃあ 、 ぼく が 教える よ 。 」', 'Ken: —Entonces te enseño yo.'],                             // 6
      ['ゆい 「 ううん 、 大丈夫 。 」', 'Yui: —No, está bien (no te preocupes).'],                                       // 7
      ['ゆい 「 わたし は 夏休み 、 東京 で アルバイト を する 。 」', 'Yui: —Yo en vacaciones voy a trabajar medio tiempo en Tokio.'], // 8
      ['ゆい 「 おみやげ 、 よろしく ね ！ 」', 'Yui: —¡Cuento contigo para el souvenir!'],                                 // 9
      ['ケン 「 うん 。 何|なに が ほしい ？ 」', 'Ken: —Ya. ¿Qué quieres?'],                            // 10
      ['ゆい 「 かわいい もの が いい ！ 」', 'Yui: —¡Algo tierno!'],                                                     // 11
    ]],
    questions: [
      { t: 'mc', q: '¿Adónde irá Ken en las vacaciones?', qjp: 'ケン は 夏休み に どこ へ 行きます=行く か 。', opts: ['A Okinawa con su familia', 'A Tokio con Yui', 'A ninguna parte'], a: 0, why: '「ぼくは家族と沖縄へ行くよ」: 行く es la forma casual de 行きます.', ev: 2 },
      { t: 'mc', q: '¿Qué quiere hacer Ken allá?', opts: ['Nadar en el mar', 'Trabajar', 'Comprar ropa'], a: 0, why: '「海で泳ぎたい」: 〜たい = quiero….', ev: 4 },
      { t: 'tf', q: 'Yui sabe nadar.', qjp: 'ゆい は 泳げます=泳ぐ か 。', a: false, why: '「わたしは泳げない」: 泳げない = no puedo nadar.', ev: 5 },
      { t: 'mc', q: '¿Qué hará Yui en las vacaciones?', opts: ['Trabajar medio tiempo en Tokio', 'Ir a Okinawa', 'Aprender a nadar con Ken'], a: 0, why: '「東京でアルバイトをする」. Rechazó la ayuda de Ken con 「ううん、大丈夫」.', ev: [7, 8] },
      { t: 'mc', q: '¿Por qué en este texto se usa うん, 行く y 泳ぎたい en vez de はい, 行きます y 泳ぎたいです?', opts: ['Porque son amigos y hablan en registro casual', 'Porque están enojados', 'Porque hablan con un profesor'], a: 0, why: 'Entre amigos se usa la forma casual (forma diccionario, うん/ううん, sin です).', ev: [4, 10] },
      { t: 'text', q: '¿Qué tipo de souvenir quiere Yui? (escribe en japonés)', qjp: 'ゆい は 何|なに が ほしい です か 。', accept: ['かわいいもの', 'かわいい もの', 'かわいい物', 'かわいい'], why: '「かわいいものがいい！」: algo tierno.', ev: 11 },
    ],
  },
  {
    id: 'r15', level: 4, title: 'ホームステイ の メール', es: 'Correo a la familia anfitriona', after: 'u9l1', topic: 'correo',
    paras: [[
      ['田中 さん 、 はじめまして 。', 'Familia Tanaka, mucho gusto.'],                                                   // 0
      ['わたし は ルイス です 。 チリ の サンティアゴ に 住んで=住む います=いる 。', 'Soy Luis. Vivo en Santiago de Chile.'], // 1
      ['十九|じゅうきゅう=九 さい です 。', 'Tengo diecinueve años.'],                                                  // 2
      ['大学 で 日本 語 を 勉強 して=する います=いる 。', 'Estudio japonés en la universidad.'],                          // 3
    ], [
      ['来週 から 三 か月 、 田中 さん の うち に ホームステイ します=する 。', 'Desde la próxima semana me quedaré tres meses en su casa.'], // 4
      ['とても うれしい です 。', 'Estoy muy contento.'],                                                                // 5
      ['日本 で 日本 の 食べ物 を 作りたい=作る です 。', 'En Japón quiero preparar comida japonesa.'],                   // 6
      ['それから 、 京都 へ 行って=行く 、 古い おてら を 見たい=見る です 。', 'También quiero ir a Kioto a ver templos antiguos.'], // 7
      ['田中 さん の 町 は どんな 町 です か 。', '¿Cómo es su ciudad?'],                                                 // 8
      ['冬 は 寒い です か 。', '¿Hace frío en invierno?'],                                                                // 9
    ], [
      ['わたし は サッカー と 音楽 が 好き です 。', 'Me gustan el fútbol y la música.'],                                  // 10
      ['チリ の おみやげ を 持って=持つ 行きます=行く 。', 'Les llevaré un regalo de Chile.'],                             // 11
      ['よろしくおねがいします 。', 'Quedo atento. (Cuento con ustedes.)'],                                               // 12
      ['ルイス', 'Luis'],                                                                                               // 13
    ]],
    questions: [
      { t: 'mc', q: '¿Por qué escribe Luis?', qjp: 'ルイス さん は どうして メール を 書きました=書く か 。', opts: ['Porque se quedará con la familia Tanaka', 'Porque quiere trabajar en Japón', 'Porque los Tanaka visitarán Chile'], a: 0, why: '「田中さんのうちにホームステイします」: va a vivir con ellos.', ev: 4 },
      { t: 'mc', q: '¿Cuántos años tiene Luis?', opts: ['19', '9', '29'], a: 0, why: '「十九さいです」: 十九 = 10 + 9.', ev: 2 },
      { t: 'tf', q: 'Luis se quedará un año en Japón.', a: false, why: '「三か月」: se quedará tres meses.', ev: 4 },
      { t: 'mc', q: '¿Qué quiere hacer en Kioto?', qjp: 'ルイス さん は 京都 で 何|なに を 見たい=見る です か 。', opts: ['Ver templos antiguos', 'Jugar fútbol', 'Cocinar'], a: 0, why: '「京都へ行って、古いおてらを見たいです」.', ev: 7 },
      { t: 'mc', q: '¿Qué le pregunta Luis a la familia?', opts: ['Cómo es su ciudad y si hace frío en invierno', 'Cuántas personas son', 'Qué comida les gusta'], a: 0, why: '「どんな町ですか」 y 「冬は寒いですか」.', ev: [8, 9] },
      { t: 'text', q: '¿Qué les llevará Luis? (escribe en japonés)', qjp: 'ルイス さん は 何|なに を 持って=持つ 行きます=行く か 。', accept: ['おみやげ', 'チリのおみやげ', 'チリ の おみやげ', 'お土産'], why: '「チリのおみやげを持って行きます」: 持って行く = llevar.', ev: 11 },
    ],
  },
  {
    id: 'r16', level: 4, title: '日本 語 の 勉強', es: 'Estudiar japonés', after: 'u9l3', topic: 'opinión',
    paras: [[
      ['わたし は 一 年 前 から 日本 語 を 勉強 して=する います=いる 。', 'Estudio japonés desde hace un año.'],              // 0
      ['日本 語 は むずかしい と 思います=思う か 。', '¿Creen que el japonés es difícil?'],                                 // 1
      ['わたし は 少し むずかしい と 思います=思う 。', 'Yo creo que es un poco difícil.'],                                   // 2
      ['かんじ が たくさん ある から=から#porque です 。', 'Porque hay muchos kanji.'],                                       // 3
      ['でも 、 ひらがな と カタカナ は かんたん でした=です:pasado 。', 'Pero el hiragana y el katakana fueron fáciles.'],     // 4
    ], [
      ['日本 語 の 言葉 は おもしろい です 。', 'Las palabras del japonés son interesantes.'],                                // 5
      ['たとえば 、 「 いただきます 」 は スペイン 語 に ない 言葉 です 。', 'Por ejemplo, 「いただきます」 es una palabra que no existe en español.'], // 6
      ['ごはん の 前 に 言います=言う 。', 'Se dice antes de comer.'],                                                       // 7
      ['わたし は 毎日 三十|さんじゅっ=十 分|ぷん=分 日本 語 を 読みます=読む 。', 'Todos los días leo japonés treinta minutos.'], // 8
      ['意味 を 知らない=知る 言葉 は 、 じしょ で しらべます=しらべる 。', 'Las palabras que no entiendo las busco en el diccionario.'], // 9
    ], [
      ['日本 へ 行って=行く 、 日本 の 人 と 話したい=話す です 。', 'Quiero ir a Japón y hablar con japoneses.'], // 10
      ['いっしょに 勉強 しましょう=する ！', '¡Estudiemos juntos!'],                              // 11
    ]],
    questions: [
      { t: 'mc', q: '¿Desde cuándo estudia japonés?', qjp: 'いつ から 日本 語 を 勉強 して=する います=いる か 。', opts: ['Desde hace un año', 'Desde hace un mes', 'Desde niño'], a: 0, why: '「一年前から」: 前 = antes; から = desde.', ev: 0 },
      { t: 'mc', q: '¿Por qué cree que el japonés es un poco difícil?', qjp: 'どうして 日本 語 は 少し むずかしい です か 。', opts: ['Porque hay muchos kanji', 'Porque la pronunciación es difícil', 'Porque no tiene diccionario'], a: 0, why: '「かんじがたくさんあるからです」: から al final da la razón.', ev: [2, 3] },
      { t: 'tf', q: 'Le pareció difícil aprender hiragana.', a: false, why: '「ひらがなとカタカナはかんたんでした」: fueron fáciles.', ev: 4 },
      { t: 'mc', q: '¿Cuándo se dice いただきます?', qjp: '「 いただきます 」 は いつ 言います=言う か 。', opts: ['Antes de comer', 'Al despedirse', 'Al dormir'], a: 0, why: '「ごはんの前に言います」.', ev: 7 },
      { t: 'mc', q: '¿Qué hace con las palabras que no entiende?', opts: ['Las busca en el diccionario', 'Le pregunta al profesor', 'Las ignora'], a: 0, why: '「じしょでしらべます」: しらべる = buscar, investigar.', ev: 9 },
      { t: 'tf', q: 'Quiere ir a Japón para hablar con japoneses.', a: true, why: '「日本へ行って、日本の人と話したいです」.', ev: 10 },
      { t: 'text', q: '¿Cuántos minutos lee japonés al día? (en japonés o en cifras)', accept: ['三十分', 'さんじゅっぷん', 'さんじっぷん', '30分', '30', '三十'], why: '「毎日三十分日本語を読みます」.', ev: 8 },
    ],
  },

  // ═══════════════ NIVEL 5 ═══════════════
  {
    id: 'r17', level: 5, title: 'ももたろう', es: 'Momotaro, el niño durazno', after: 'u15l3', topic: 'cuento popular',
    paras: [[
      ['むかし むかし 、 おじいさん と おばあさん が いました=いる 。', 'Había una vez un abuelo y una abuela.'],          // 0
      ['二人 に は 子ども が いませんでした=いる 。', 'Ellos no tenían hijos.'],                                       // 1
      ['おじいさん は 山 へ 行きました=行く 。', 'El abuelo fue a la montaña.'],                                       // 2
      ['おばあさん は 川 へ 行きました=行く 。', 'La abuela fue al río.'],                                            // 3
      ['川 に 大きい もも が ありました=ある 。', 'En el río había un durazno enorme.'],                                // 4
      ['おばあさん は もも と いっしょに うち へ 帰りました=帰る 。', 'La abuela volvió a casa con el durazno.'],    // 5
      ['おじいさん も 山 から 帰りました=帰る 。', 'El abuelo también volvió de la montaña.'],                          // 6
    ], [
      ['おじいさん が もも を 切る と:cuando 、 中 から 子ども が 出て=出る 来ました=来る 。', 'Cuando el abuelo cortó el durazno, de adentro salió un niño.'], // 7
      ['二人 は とても よろこびました=よろこぶ 。', 'Los dos se alegraron mucho.'],                                    // 8
      ['二人 は 子ども の 名前 を 「 ももたろう 」 に しました=する 。', 'Al niño le pusieron de nombre "Momotaro".'],   // 9
      ['ももたろう は 毎日 たくさん 食べて=食べる 、 大きくて=大きい 強い 子ども に なりました=なる 。', 'Momotaro comía mucho todos los días y se convirtió en un niño grande y fuerte.'], // 10
    ], [
      ['それから 、 ももたろう は 「 おにがしま へ 行って=行く 、 おに を たいじ します=する 」 と 言いました=言う 。', 'Tiempo después, Momotaro dijo: "Iré a Onigashima a derrotar a los ogros".'], // 11
      ['おばあさん は きびだんご を 作りました=作る 。', 'La abuela le preparó kibidango.'],                            // 12
      ['ももたろう は 元気 に うち を 出ました=出る 。', 'Momotaro salió de casa lleno de energía.'], // 13
      ['ももたろう は 犬 と さる と きじ に 会いました=会う 。', 'Momotaro se encontró con un perro, un mono y un faisán.'], // 14
      ['犬 は 「 その きびだんご を ください 」 と 言いました=言う 。', 'El perro dijo: "Dame ese kibidango, por favor".'], // 15
      ['ももたろう は 「 いい です よ 。 いっしょに おにがしま へ 行きましょう=行く 」 と 言いました=言う 。', 'Momotaro dijo: "Claro. Vamos juntos a Onigashima".'], // 16
      ['ももたろう は みんな に きびだんご を あげました=あげる 。', 'Momotaro les dio kibidango a todos.'],          // 17
      ['みんな は ももたろう の なかま に なりました=なる 。', 'Todos se hicieron compañeros de Momotaro.'],          // 18
    ], [
      ['おにがしま で 、 みんな は おに と たたかいました=たたかう 。', 'En Onigashima, todos lucharon contra los ogros.'], // 19
      ['おに は とても 大きかった=大きい です 。 でも 、 みんな は とても 強かった=強い です 。', 'Los ogros eran muy grandes. Pero todos eran muy fuertes.'], // 20
      ['おに は 「 ごめんなさい 」 と 言って=言う 、 たからもの を 出しました=出す 。', 'Los ogros dijeron "perdón" y entregaron sus tesoros.'], // 21
      ['みんな は たからもの を 持って=持つ 帰りました=帰る 。', 'Todos volvieron con los tesoros.'],                  // 22
      ['おじいさん と おばあさん は ももたろう を 見て=見る 、 「 すごい ね 」 と 言いました=言う 。', 'El abuelo y la abuela vieron a Momotaro y dijeron: "¡Increíble!".'], // 23
      ['それから 、 みんな で いっしょに 楽しく=楽しい 住みました=住む 。', 'Y desde entonces vivieron todos juntos y felices.'], // 24
    ]],
    questions: [
      { t: 'tf', q: 'Antes de Momotaro, los abuelos tenían muchos hijos.', a: false, why: '「二人には子どもがいませんでした」: no tenían hijos; por eso se alegraron tanto.', ev: 1 },
      { t: 'mc', q: '¿Adónde fue la abuela?', qjp: 'おばあさん は どこ へ 行きました=行く か 。', opts: ['Al río', 'A la montaña', 'A la isla de los ogros'], a: 0, why: '「おばあさんは川へ行きました」: al río (el abuelo fue a la montaña).', ev: [2, 3] },
      { t: 'mc', q: '¿Qué salió del durazno?', qjp: 'もも の 中 から だれ が 出て=出る 来ました=来る か 。', opts: ['Un niño', 'Un ogro', 'Un tesoro'], a: 0, why: '「中から子どもが出て来ました」.', ev: 7 },
      { t: 'tf', q: 'Momotaro creció débil y pequeño.', a: false, why: '「大きくて強い子どもになりました」: grande y fuerte.', ev: 10 },
      { t: 'mc', q: '¿Qué le preparó la abuela para el viaje?', opts: ['Kibidango', 'Sushi', 'Un paraguas'], a: 0, why: '「おばあさんはきびだんごを作りました」.', ev: 12 },
      { t: 'mc', q: '¿Por qué los animales se unieron a Momotaro?', opts: ['Porque él les dio kibidango', 'Porque eran sus hermanos', 'Porque los ogros los atacaron'], a: 0, why: 'Momotaro 「みんなにきびだんごをあげました」 y entonces 「なかまになりました」.', ev: [17, 18] },
      { t: 'text', q: '¿Qué entregaron los ogros? (escribe en japonés)', qjp: 'おに は 何|なに を 出しました=出す か 。', accept: ['たからもの', '宝物', 'たから'], why: '「たからものを出しました」: たからもの = tesoro.', ev: 21 },
    ],
  },
  {
    id: 'r18', level: 5, title: '日本 の きせつ', es: 'Las estaciones en Japón', after: 'u11l3', topic: 'cultura',
    paras: [[
      ['日本 に は 四つ の きせつ が あります=ある 。 春 、 夏 、 秋 、 冬 です 。', 'Japón tiene cuatro estaciones: primavera, verano, otoño e invierno.'], // 0
      ['春 は 三 月 から 五 月 まで です 。', 'La primavera va de marzo a mayo.'],                                         // 1
      ['春 に は さくら の 花 が さきます=さく 。', 'En primavera florecen los cerezos.'],                                  // 2
      ['日本 の 人 は さくら の 木 の 下 で お花見 を します=する 。', 'Los japoneses hacen hanami bajo los cerezos.'],         // 3
      ['家族 や ともだち と いっしょに おべんとう を 食べたり=食べる:forma-たり 、 おさけ を 飲んだり=飲む:forma-たり します=する 。', 'Con la familia o los amigos comen bento, toman sake, etc.'], // 4
      ['さくら の 花 は 一|いっ=一 週間 ぐらい で ちります=ちる 。', 'Las flores de cerezo caen en más o menos una semana.'],          // 5
      ['みじかい から=から#porque 、 もっと きれい だ と 思う 人 が 多い です 。', 'Mucha gente piensa que, porque dura poco, es aún más bonita.'], // 6
    ], [
      ['夏 は とても 暑い です 。', 'El verano es muy caluroso.'],                                                       // 7
      ['夏 に は おまつり が あって=ある 、 花火 を 見ます=見る 。', 'En verano hay festivales y se ven fuegos artificiales.'], // 8
      ['秋 は すずしくて=すずしい 、 山 の 木 の 葉 が 赤く=赤い なります=なる 。', 'El otoño es fresco y las hojas de los árboles de las montañas se ponen rojas.'], // 9
      ['冬 は 寒くて=寒い 、 北 の 町 で は 雪 が たくさん ふります=ふる 。', 'El invierno es frío, y en las ciudades del norte nieva mucho.'], // 10
      ['あなた は どの きせつ が いちばん 好き です か 。', '¿Y a ti, qué estación te gusta más?'],                        // 11
    ]],
    questions: [
      { t: 'mc', q: '¿Cuándo es la primavera en Japón?', qjp: '日本 の 春 は いつ です か 。', opts: ['De marzo a mayo', 'De junio a agosto', 'De septiembre a noviembre'], a: 0, why: '「三月から五月までです」: 三月 = marzo (mes tres).', ev: 1 },
      { t: 'mc', q: '¿Qué se hace en お花見?', opts: ['Comer y beber bajo los cerezos con familia o amigos', 'Nadar en el mar', 'Ver fuegos artificiales'], a: 0, why: '「さくらの木の下で…おべんとうを食べたり、おさけを飲んだりします」. 〜たり〜たり = cosas como….', ev: [3, 4] },
      { t: 'tf', q: 'Las flores de cerezo duran unos tres meses.', a: false, why: '「一週間ぐらいでちります」: caen en más o menos una semana.', ev: 5 },
      { t: 'mc', q: '¿Por qué mucha gente piensa que el sakura es aún más bonito?', qjp: 'どうして さくら は もっと きれい です か 。', opts: ['Porque dura poco', 'Porque es rojo', 'Porque florece en invierno'], a: 0, why: '「みじかいから、もっときれいだと思う人が多いです」: から da la razón.', ev: 6 },
      { t: 'text', q: '¿Qué se ve en los festivales de verano? (escribe en japonés)', qjp: '夏 の おまつり で 何|なに を 見ます=見る か 。', accept: ['はなび', '花火'], why: '「花火を見ます」: 花火 = fuegos artificiales (literalmente "flores de fuego").', ev: 8 },
      { t: 'mc', q: '¿Qué pasa en otoño?', opts: ['Las hojas se ponen rojas', 'Florecen los cerezos', 'Nieva mucho en todo Japón'], a: 0, why: '「葉が赤くなります」: 〜くなる = volverse….', ev: 9 },
    ],
  },
  {
    id: 'r19', level: 5, title: '雨 の 日 の かさ', es: 'El paraguas de un día de lluvia', after: 'u14l2', topic: 'cuento',
    paras: [[
      ['ある=ある#cierto 雨 の 日 、 ゆい は えき の 前 で こまって=こまる いました=いる 。', 'Un día de lluvia, Yui no sabía qué hacer frente a la estación.'], // 0
      ['かさ を わすれました=わすれる 。', 'Había olvidado su paraguas.'],                                                 // 1
      ['雨 は とても 強く=強い ふって=ふる いました=いる 。', 'Llovía muy fuerte.'],                                       // 2
      ['その とき 、 知らない=知る おばあさん が 「 この かさ 、 どうぞ 」 と 言いました=言う 。', 'En ese momento, una señora mayor desconocida le dijo: "Toma este paraguas".'], // 3
      ['ゆい は 「 でも 、 おばあさん の かさ は ？ 」 と 聞きました=聞く 。', 'Yui preguntó: "¿Pero y su paraguas?".'],     // 4
      ['おばあさん は 「 うち は すぐ そこ だ から=から#porque 、 大丈夫 よ 」 と わらいました=わらう 。', 'La señora sonrió: "Mi casa está aquí mismo, así que no hay problema".'], // 5
      ['おばあさん の うち は えき の となり の 小さい 家 でした=です:pasado 。', 'La casa de la señora era una casa pequeña al lado de la estación.'], // 6
      ['ゆい は かさ を かりて=かりる 、 うち へ 帰りました=帰る 。', 'Yui tomó prestado el paraguas y volvió a casa.'],      // 7
    ], [
      ['つぎ の 日 、 ゆい は かさ と ケーキ を 持って=持つ 、 その 家 へ 行きました=行く 。', 'Al día siguiente, Yui fue a esa casa con el paraguas y una torta.'], // 8
      ['でも 、 だれ も いませんでした=いる 。', 'Pero no había nadie.'],                                                   // 9
      ['となり の 人 が 「 あの おばあさん は 先週 、 びょういん に 入りました=入る よ 」 と 言いました=言う 。', 'Un vecino le dijo: "Esa señora entró al hospital la semana pasada".'], // 10
      ['ゆい は びょういん へ 行きました=行く 。', 'Yui fue al hospital.'],                                                // 11
      ['おばあさん は ベッド で ほん を 読んで=読む いました=いる 。', 'La señora estaba leyendo un libro en la cama.'],         // 12
      ['「 かさ 、 ありがとうございました=ありがとうございます:pasado 。 」', '"Gracias por el paraguas."'],                  // 13
      ['おばあさん は ケーキ を 見て=見る 、 「 まあ 、 おいしそう=おいしい:parece 」 と 言いました=言う 。', 'La señora vio la torta y dijo: "¡Vaya, se ve rica!".'], // 14
    ], [
      ['二人 は いっしょに ケーキ を 食べて=食べる 、 たくさん 話しました=話す 。', 'Las dos comieron torta juntas y conversaron mucho.'], // 15
      ['それから 、 ゆい は ときどき おばあさん に 会い=会う:raíz-ます に 行きます=行く 。', 'Desde entonces, Yui va a veces a visitar a la señora.'], // 16
      ['雨 の 日 の かさ が 、 二人 を ともだち に しました=する 。', 'El paraguas de aquel día de lluvia las hizo amigas.'],  // 17
    ]],
    questions: [
      { t: 'mc', q: '¿Por qué Yui no sabía qué hacer?', qjp: 'ゆい は どうして こまって=こまる いました=いる か 。', opts: ['Había olvidado su paraguas', 'Había perdido el tren', 'No encontraba la estación'], a: 0, why: '「かさをわすれました」 y llovía muy fuerte.', ev: [1, 2] },
      { t: 'mc', q: '¿Qué hizo la señora?', opts: ['Le prestó su paraguas', 'La llevó en auto', 'Le compró un paraguas'], a: 0, why: '「このかさ、どうぞ」: le ofreció su propio paraguas.', ev: 3 },
      { t: 'tf', q: 'La señora vivía lejos de la estación.', qjp: 'おばあさん の うち は えき から 遠い=遠い です か 。', a: false, why: '「うちはすぐそこだから」 y su casa era 「えきのとなり」: al lado.', ev: [5, 6] },
      { t: 'mc', q: '¿Por qué no había nadie en la casa al día siguiente?', opts: ['La señora estaba en el hospital', 'La señora se había mudado', 'Yui fue a la casa equivocada'], a: 0, why: 'El vecino dice 「先週、びょういんに入りましたよ」.', ev: 10 },
      { t: 'text', q: '¿Qué llevó Yui además del paraguas? (escribe en katakana)', qjp: 'ゆい は かさ と 何|なに を 持って=持つ 行きました=行く か 。', accept: ['ケーキ'], why: '「かさとケーキを持って」.', ev: 8 },
      { t: 'tf', q: 'Después de eso, Yui no volvió a ver a la señora.', a: false, why: '「ときどきおばあさんに会いに行きます」: la visita a veces.', ev: 16 },
      { t: 'mc', q: '¿Cuál es la idea principal del final?', opts: ['Un pequeño gesto las hizo amigas', 'No hay que salir cuando llueve', 'Los hospitales son tranquilos'], a: 0, why: '「雨の日のかさが、二人をともだちにしました」.', ev: 17 },
    ],
  },
  // ═══════════════ NIVEL 6 · N5 ═══════════════
  {
    id: 'r20', level: 6, title: 'ケン から の メール', es: 'Un correo de Ken', after: 'u10l3', topic: 'invitación',
    paras: [[
      ['アナ さん 、 こんにちは 。', 'Hola, Ana.'],                                                                       // 0
      ['来週 の 土曜日 、 六 月 七日 は わたし の 誕生日 です 。', 'El próximo sábado, 7 de junio, es mi cumpleaños.'],          // 1
      ['うち で 小さい パーティー を します=する 。', 'Voy a hacer una pequeña fiesta en mi casa.'],                          // 2
      ['アナ さん も 来ませんか=来る 。', '¿No quieres venir tú también?'],                                                  // 3
    ], [
      ['パーティー は 午後 四|よ 時 から 八 時 ごろ まで です 。', 'La fiesta es desde las cuatro de la tarde hasta más o menos las ocho.'], // 4
      ['ともだち が 六人|ろくにん=にん 来ます=来る 。', 'Vienen seis amigos.'],                                              // 5
      ['母 が カレー と ケーキ を 作ります=作る 。', 'Mi mamá va a preparar curry y una torta.'],                             // 6
      ['飲み物 は ジュース や 紅茶 など が あります=ある 。', 'De bebidas hay jugo, té negro y otras cosas.'],                  // 7
    ], [
      ['わたし の うち は 駅 から 歩いて=歩く 十|じゅっ=十 分|ぷん=分 ぐらい です 。', 'Mi casa queda a unos diez minutos a pie de la estación.'], // 8
      ['駅 の 前 に 大きい デパート が あります=ある 。', 'Frente a la estación hay una tienda por departamentos grande.'],     // 9
      ['三 時 半 に デパート の 前 で 会いましょう=会う 。', 'Juntémonos a las tres y media frente a la tienda.'],             // 10
      ['ゆい さん と はると さん も 来ます=来る よ 。', 'Yui y Haruto también vienen.'],                                     // 11
      ['五日 まで に メール を ください 。', 'Mándame un correo a más tardar el día 5, por favor.'],                          // 12
      ['じゃあ 、 また 。 ケン', 'Bueno, nos vemos. Ken'],                                                                 // 13
    ]],
    questions: [
      { t: 'mc', q: '¿Cuándo es la fiesta?', qjp: 'パーティー は いつ です か 。', opts: ['El sábado 7 de junio', 'El domingo 8 de junio', 'El sábado 5 de junio'], a: 0, why: '「来週の土曜日、六月七日」: 七日 (なのか) = día 7. El día 5 (五日) es el plazo para responder.', ev: [1, 2] },
      { t: 'tf', q: 'La fiesta termina más o menos a las ocho.', qjp: 'パーティー は 八 時 ごろ まで です か 。', a: true, why: '「四時から八時ごろまで」: ごろ = alrededor de (hora aproximada).', ev: 4 },
      { t: 'mc', q: '¿Cuántos amigos vienen a la fiesta?', qjp: 'ともだち は 何人|なんにん=にん 来ます=来る か 。', opts: ['Seis', 'Cuatro', 'Ocho'], a: 0, why: '「ともだちが六人来ます」: 六人 = ろくにん.', ev: 5 },
      { t: 'mc', q: '¿Dónde y a qué hora se juntan Ken y Ana?', qjp: 'ケン さん と アナ さん は 何|なん=なん 時 に どこ で 会います=会う か 。', opts: ['A las 3:30, frente a la tienda por departamentos', 'A las 4:00, en la casa de Ken', 'A las 3:30, dentro de la estación'], a: 0, why: '「三時半にデパートの前で会いましょう」. La fiesta empieza a las cuatro y la casa queda a diez minutos.', ev: 10 },
      { t: 'tf', q: 'La casa de Ken queda lejos de la estación.', a: false, why: '「駅から歩いて十分ぐらいです」: a unos diez minutos a pie.', ev: 8 },
      { t: 'text', q: '¿Qué va a preparar la mamá de Ken además del curry? (escribe en katakana)', qjp: 'お母さん は カレー と 何|なに を 作ります=作る か 。', accept: ['ケーキ'], why: '「母がカレーとケーキを作ります」. Ken dice 母 porque habla de su propia mamá.', ev: 6 },
    ],
  },
  {
    id: 'r21', level: 6, title: 'サンティアゴ と 東京', es: 'Santiago y Tokio', after: 'u11l3', topic: 'comparación',
    paras: [[
      ['わたし の 名前 は アナ です 。', 'Me llamo Ana.'],                                                                   // 0
      ['チリ の サンティアゴ から 来ました=来る 。 今 は 東京 に 住んで=住む います=いる 。', 'Vengo de Santiago de Chile. Ahora vivo en Tokio.'], // 1
      ['東京 は サンティアゴ より 大きくて=大きい 、 人 も 多い です 。', 'Tokio es más grande que Santiago y además tiene más gente.'], // 2
      ['東京 の 電車 は とても 便利 です 。', 'Los trenes de Tokio son muy prácticos.'],                                      // 3
      ['でも 、 朝 は 人 が 多くて=多い 大変 です 。', 'Pero en la mañana hay mucha gente y es pesado.'],                      // 4
    ], [
      ['チリ と 日本 は 季節 が 違います=違う 。', 'En Chile y en Japón las estaciones son distintas.'],                       // 5
      ['日本 で は 、 八 月 は 夏 です 。', 'En Japón, agosto es verano.'],                                                // 6
      ['でも 、 チリ で は 冬 です 。', 'Pero en Chile es invierno.'],                                                    // 7
      ['東京 の 夏 は サンティアゴ の 夏 より 暑い です 。', 'El verano de Tokio es más caluroso que el de Santiago.'],          // 8
      ['サンティアゴ で は 、 夏 の 夜 は すずしい です 。', 'En Santiago, las noches de verano son frescas.'],                 // 9
    ], [
      ['わたし は 東京 の 秋 が いちばん 好き です 。', 'Lo que más me gusta de Tokio es el otoño.'],                          // 10
      ['十一|じゅういち=十 月 ごろ 、 木 の 葉 が 赤く=赤い なります=なる 。', 'Hacia noviembre, las hojas de los árboles se ponen rojas.'], // 11
      ['それから 、 だんだん 寒く=寒い なります=なる 。', 'Después, poco a poco empieza a hacer frío.'],                       // 12
      ['東京 の 冬 は よく 晴れて=晴れる 、 空 が きれい です 。', 'En invierno, en Tokio suele estar despejado y el cielo es bonito.'], // 13
      ['サンティアゴ と 東京 、 どちら も わたし の 好き な 町 です 。', 'Santiago y Tokio: las dos son ciudades que me gustan.'], // 14
    ]],
    questions: [
      { t: 'mc', q: '¿Qué ciudad es más grande?', qjp: 'サンティアゴ と 東京 と どちら が 大きい です か 。', opts: ['Tokio', 'Santiago', 'Son del mismo tamaño'], a: 0, why: '「東京はサンティアゴより大きくて」: A は B より 〜 = A es más 〜 que B.', ev: 2 },
      { t: 'mc', q: '¿Por qué los trenes de Tokio son pesados en la mañana?', qjp: 'どうして 朝 の 電車 は 大変 です か 。', opts: ['Porque hay mucha gente', 'Porque son lentos', 'Porque son caros'], a: 0, why: '「朝は人が多くて大変です」: 〜くて también puede dar la causa.', ev: 4 },
      { t: 'tf', q: 'En Chile, agosto es verano.', qjp: 'チリ で は 八 月 は 夏 です か 。', a: false, why: 'En Japón agosto es verano, 「でも、チリでは冬です」: las estaciones están al revés.', ev: [6, 7] },
      { t: 'tf', q: 'Según Ana, el verano de Santiago es más caluroso que el de Tokio.', a: false, why: '「東京の夏はサンティアゴの夏より暑いです」: es al revés. Además, en Santiago las noches son frescas.', ev: [8, 9] },
      { t: 'mc', q: '¿Qué estación de Tokio le gusta más a Ana?', qjp: 'アナ さん は 東京 の どの 季節 が いちばん 好き です か 。', opts: ['El otoño', 'El verano', 'El invierno'], a: 0, why: '「東京の秋がいちばん好きです」: いちばん = el más.', ev: 10 },
      { t: 'text', q: '¿De qué color se ponen las hojas en noviembre? (escribe en japonés)', qjp: '十一|じゅういち=十 月 ごろ 、 木 の 葉 は 何|なに 色 に なります=なる か 。', accept: ['あか', '赤', 'あかい', '赤い', 'あかく', '赤く'], why: '「木の葉が赤くなります」: 赤い → 赤く なる = volverse rojo.', ev: 11 },
    ],
  },
  {
    id: 'r22', level: 6, title: 'ゆい の 日記', es: 'El diario de Yui', after: 'u12l3', topic: 'diario',
    paras: [[
      ['六 月 八日 （ 日曜日 ） 晴れ', '8 de junio (domingo). Despejado.'],                                                // 0
      ['今日 は 朝 七|しち 時 に 起きた=起きる 。', 'Hoy me levanté a las siete de la mañana.'],                              // 1
      ['朝ごはん を 食べた=食べる 後 で 、 犬 と 公園 を 散歩 した=する 。', 'Después de desayunar, salí a pasear por el parque con el perro.'], // 2
      ['公園 で は 子ども が 遊んだり=遊ぶ:forma-たり 走ったり=走る:forma-たり して=する いた=いる 。', 'En el parque había niños jugando y corriendo.'], // 3
      ['天気 が よくて=いい 、 とても 暖かかった=暖かい 。', 'Hacía buen tiempo y estaba muy agradable.'],                    // 4
    ], [
      ['昼 は ケン と 映画館 で 映画 を 見た=見る 。', 'Al mediodía vi una película en el cine con Ken.'],                     // 5
      ['アメリカ の 古い 映画 だった=だ 。', 'Era una película estadounidense antigua.'],                                     // 6
      ['ケン は 「 おもしろかった=おもしろい 」 と 言った=言う 。', 'Ken dijo: "Estuvo entretenida".'],                       // 7
      ['でも 、 わたし は あまり おもしろくなかった=おもしろい 。', 'Pero a mí no me pareció muy entretenida.'],              // 8
      ['映画 の 後 で 、 二人 で ラーメン を 食べた=食べる 。 とても おいしかった=おいしい 。', 'Después de la película, comimos ramen los dos. Estaba muy rico.'], // 9
    ], [
      ['夕方 、 うち へ 帰って=帰る から 、 しゅくだい を した=する 。', 'En la tarde, después de volver a casa, hice la tarea.'], // 10
      ['でも 、 漢字 の しゅくだい は まだ 終わって=終わる いない=いる 。', 'Pero la tarea de kanji todavía no la termino.'],     // 11
      ['今日 は 少し 疲れた=疲れる 。', 'Hoy estoy un poco cansada.'],                                                     // 12
      ['明日 は 早く=早い 起きて=起きる 、 漢字 を 練習 する 。', 'Mañana me voy a levantar temprano y voy a practicar kanji.'], // 13
    ]],
    questions: [
      { t: 'mc', q: '¿Qué hizo Yui después de desayunar?', qjp: 'ゆい さん は 朝ごはん を 食べた=食べる 後 で 、 何|なに を しました=する か 。', opts: ['Paseó con el perro por el parque', 'Fue al cine con Ken', 'Hizo la tarea'], a: 0, why: '「朝ごはんを食べた後で、犬と公園を散歩した」: Verbo-た 後で = después de….', ev: 2 },
      { t: 'mc', q: '¿Qué hacían los niños en el parque?', qjp: '公園 で 子ども は 何|なに を して=する いました=いる か 。', opts: ['Jugaban y corrían', 'Cantaban y bailaban', 'Leían y dibujaban'], a: 0, why: '「遊んだり走ったりしていた」: 〜たり〜たり = cosas como….', ev: 3 },
      { t: 'tf', q: 'A Yui le gustó mucho la película.', qjp: 'ゆい さん は 映画 が おもしろかった=おもしろい です か 。', a: false, why: 'Ken dijo que estuvo entretenida, 「でも、わたしはあまりおもしろくなかった」: あまり + negativo = no mucho.', ev: [7, 8] },
      { t: 'text', q: '¿Qué comieron después de la película? (escribe en katakana)', qjp: '映画 の 後 で 、 何|なに を 食べました=食べる か 。', accept: ['ラーメン'], why: '「二人でラーメンを食べた」.', ev: 9 },
      { t: 'tf', q: 'Yui ya terminó toda la tarea.', qjp: 'ゆい さん は もう しゅくだい を 全部 しました=する か 。', a: false, why: '「漢字のしゅくだいはまだ終わっていない」: まだ〜ていない = todavía no….', ev: 11 },
    ],
  },
  {
    id: 'r23', level: 6, title: 'クラス の みなさん へ', es: 'A todos los de la clase', after: 'u13l3', topic: 'aviso',
    paras: [[
      ['日本 語 クラス の みなさん 、 先生 の 田中 です 。', 'A todos los de la clase de japonés: les escribe el profesor Tanaka.'], // 0
      ['来週 から 新しい 教室 で 授業 を します=する 。', 'Desde la próxima semana tendremos clases en una sala nueva.'],      // 1
      ['新しい 教室 は 三階|さんがい=階 の いちばん 右 の 部屋 です 。', 'La sala nueva es la que está más a la derecha en el tercer piso.'], // 2
      ['エレベーター は 小さい です から=から#porque 、 階段 を 使って=使う ください 。', 'El ascensor es pequeño, así que usen la escalera, por favor.'], // 3
    ], [
      ['教室 で は ごはん や お菓子 を 食べないで=食べる ください 。', 'En la sala, por favor, no coman comida ni dulces.'],      // 4
      ['飲み物 は 飲んで=飲む も いい です 。', 'Las bebidas sí se pueden tomar.'],                                           // 5
      ['となり の 教室 で も 授業 が あります=ある から=から#porque 、 廊下 で 大きい 声 で 話さないで=話す ください 。', 'En la sala de al lado también hay clases, así que no hablen fuerte en el pasillo, por favor.'], // 6
      ['帰る 前 に 、 まど を 閉めて=閉める 、 電気 を 消して=消す ください 。', 'Antes de irse, cierren las ventanas y apaguen la luz, por favor.'], // 7
    ], [
      ['毎日 、 授業 の 前 に しゅくだい を 出さなければなりません=出す 。', 'Todos los días tienen que entregar la tarea antes de la clase.'], // 8
      ['月曜日 に は 漢字 の テスト が あります=ある 。', 'Los lunes hay prueba de kanji.'],                                  // 9
      ['授業 を 休む 人 は 、 朝 九|く 時 まで に 学校 に 電話 を しなければなりません=する 。', 'Quienes falten a clases tienen que llamar a la escuela a más tardar a las nueve de la mañana.'], // 10
      ['質問 が ある 人 は 、 授業 の 後 で 先生 に 聞いて=聞く ください 。', 'Quienes tengan preguntas, háganlas al profesor después de clases.'], // 11
      ['よろしくおねがいします 。', 'Gracias por su colaboración.'],                                                      // 12
    ]],
    questions: [
      { t: 'mc', q: '¿Dónde está la sala nueva?', qjp: '新しい 教室 は どこ です か 。', opts: ['En el tercer piso, la de más a la derecha', 'En el tercer piso, la de más a la izquierda', 'En el primer piso, al lado de la escalera'], a: 0, why: '「三階のいちばん右の部屋です」: 三階 (さんがい) = tercer piso; いちばん右 = la de más a la derecha.', ev: 2 },
      { t: 'tf', q: 'En la sala se pueden tomar bebidas.', qjp: '教室 で 飲み物 を 飲んで=飲む も いい です か 。', a: true, why: '「飲み物は飲んでもいいです」. Lo que no se puede es comer: 「食べないでください」.', ev: [4, 5] },
      { t: 'tf', q: 'Se puede hablar fuerte en el pasillo porque no hay otras clases.', a: false, why: '「となりの教室でも授業がありますから、…大きい声で話さないでください」: 〜ないでください = por favor, no….', ev: 6 },
      { t: 'mc', q: '¿Qué hay que hacer antes de irse?', qjp: '帰る 前 に 何|なに を しなければなりません=する か 。', opts: ['Cerrar las ventanas y apagar la luz', 'Limpiar la sala', 'Entregar la tarea'], a: 0, why: '「まどを閉めて、電気を消してください」. La tarea se entrega antes de la clase, no al irse.', ev: 7 },
      { t: 'mc', q: '¿Qué tiene que hacer quien falta a clases?', qjp: '授業 を 休む 人 は 何|なに を しなければなりません=する か 。', opts: ['Llamar a la escuela antes de las nueve', 'Escribirle una carta al profesor', 'Dar la prueba de kanji el lunes'], a: 0, why: '「朝九時までに学校に電話をしなければなりません」: 〜なければなりません = tener que….', ev: 10 },
      { t: 'text', q: '¿Qué hay los lunes? (escribe en japonés)', qjp: '月曜日 に は 何|なに が あります=ある か 。', accept: ['かんじのテスト', '漢字のテスト', 'テスト', 'かんじ の テスト'], why: '「月曜日には漢字のテストがあります」.', ev: 9 },
    ],
  },
  {
    id: 'r24', level: 6, title: 'はじめまして 、 マリア です', es: 'Mucho gusto, soy María', after: 'u13l3', topic: 'presentación',
    paras: [[
      ['はじめまして 。 わたし は マリア です 。', 'Mucho gusto. Me llamo María.'],                                       // 0
      ['メキシコ 人|じん=じん の 留学生 です 。', 'Soy una estudiante extranjera mexicana.'],                                // 1
      ['去年 の 九|く=九 月 に 日本 へ 来ました=来る 。', 'Llegué a Japón en septiembre del año pasado.'],                          // 2
      ['今 は 京都 の 大学 で 日本 語 を 勉強 して=する います=いる 。', 'Ahora estudio japonés en una universidad de Kioto.'],   // 3
      ['メキシコ で は 英語 の 先生 でした=です:pasado 。', 'En México era profesora de inglés.'],                           // 4
      ['英語 と スペイン 語 が できます=できる 。', 'Sé inglés y español.'],                                               // 5
      ['でも 、 日本 語 は まだ 下手 です 。', 'Pero todavía soy mala para el japonés.'],                                    // 6
      ['ひらがな と カタカナ は わかります=わかる 。 漢字 は 二百|にひゃく=百 ぐらい 覚えました=覚える 。', 'Entiendo el hiragana y el katakana. De kanji, he aprendido unos doscientos.'], // 7
    ], [
      ['日本 に 来て=来る から 、 いろいろ な 町 へ 行きました=行く 。', 'Desde que llegué a Japón, he ido a varias ciudades.'], // 8
      ['東京 や 大阪 へ 行った=行く こと が あります=ある 。', 'He ido a Tokio, a Osaka y a otros lugares.'],                  // 9
      ['冬 に は 北 の 山 で 初めて スキー を しました=する 。', 'En invierno esquié por primera vez en una montaña del norte.'], // 10
      ['わたし の 町 は 暖かい から=から#porque 、 雪 が ふりません=ふる 。', 'Mi ciudad es cálida, así que no nieva.'],          // 11
      ['でも 、 日本 の お酒 は まだ 飲んだ=飲む こと が ありません=ある 。', 'Pero el sake japonés todavía no lo he probado nunca.'], // 12
    ], [
      ['わたし は 音楽 が 好き です 。 ギター が 少し できます=できる 。', 'Me gusta la música. Sé tocar un poco la guitarra.'], // 13
      ['日本 の 歌 も 弾きたい=弾く です 。', 'También quiero tocar canciones japonesas.'],                                   // 14
      ['どうぞ よろしくおねがいします 。', 'Encantada de conocerlos.'],                                                    // 15
    ]],
    questions: [
      { t: 'mc', q: '¿Qué idiomas sabe María?', qjp: 'マリア さん は 何|なに 語 が できます=できる か 。', opts: ['Inglés y español', 'Japonés y español', 'Solo español'], a: 0, why: '「英語とスペイン語ができます」: Sustantivo が できます = sé / puedo…. El japonés todavía es 下手.', ev: [5, 6] },
      { t: 'mc', q: '¿Qué hacía María en México?', qjp: 'マリア さん は メキシコ で 何|なん=なん の 先生 でした=です:pasado か 。', opts: ['Era profesora de inglés', 'Era profesora de japonés', 'Era estudiante de música'], a: 0, why: '「メキシコでは英語の先生でした」.', ev: 4 },
      { t: 'tf', q: 'María ya sabe todos los kanji.', a: false, why: '「漢字は二百ぐらい覚えました」: solo unos doscientos, y dice que todavía es 下手 (mala) para el japonés.', ev: [6, 7] },
      { t: 'mc', q: '¿Qué hizo por primera vez en invierno?', qjp: 'マリア さん は 冬 に 初めて 何|なに を しました=する か 。', opts: ['Esquiar', 'Ver el mar', 'Tocar la guitarra'], a: 0, why: '「冬には北の山で初めてスキーをしました」: 初めて = por primera vez.', ev: 10 },
      { t: 'tf', q: 'En la ciudad de María nieva mucho.', a: false, why: '「わたしの町は暖かいから、雪がふりません」.', ev: 11 },
      { t: 'text', q: '¿Qué cosa japonesa no ha probado nunca? (escribe en japonés)', qjp: 'マリア さん は 何|なに を 飲んだ=飲む こと が ありません=ある か 。', accept: ['おさけ', 'お酒', 'さけ', '酒', 'にほんのおさけ', '日本のお酒'], why: '「日本のお酒はまだ飲んだことがありません」: Verbo-た こと が ありません = nunca he….', ev: 12 },
    ],
  },
  {
    id: 'r25', level: 6, title: 'デパート で 買い物', es: 'De compras en la tienda', after: 'u14l3', topic: 'compras',
    paras: [[
      ['土曜日 、 ケン は ゆい と デパート へ 買い物 に 行きました=行く 。', 'El sábado, Ken fue de compras a una tienda por departamentos con Yui.'], // 0
      ['来月 は ケン の お父さん の 誕生日 です 。', 'El próximo mes es el cumpleaños del papá de Ken.'],                       // 1
      ['ケン は お父さん に ネクタイ を 買いたい=買う と 思って=思う いました=いる 。', 'Ken estaba pensando en comprarle una corbata a su papá.'], // 2
      ['ネクタイ の 店 は 四階|よんかい=階 に ありました=ある 。', 'La tienda de corbatas estaba en el cuarto piso.'],             // 3
    ], [
      ['青い ネクタイ は 一万|いちまん=万 二千|にせん=千 円 でした=です:pasado 。', 'La corbata azul costaba doce mil yenes.'], // 4
      ['ケン の 財布 に は 六千|ろくせん=千 円 しか ありませんでした=ある 。', 'En la billetera de Ken había solo seis mil yenes.'], // 5
      ['店 の 人 が 「 こちら は いかが です か 。 」 と 言いました=言う 。', 'El vendedor le dijo: "¿Qué le parece esta?".'],     // 6
      ['それ は 黒い ネクタイ で=だ 、 五千|ごせん=千 円 でした=です:pasado 。', 'Era una corbata negra de cinco mil yenes.'],     // 7
      ['ケン は その ネクタイ に しました=する 。', 'Ken se decidió por esa corbata.'],                                        // 8
    ], [
      ['それから 、 二人 は 七階|ななかい=階 の レストラン で 昼ごはん を 食べました=食べる 。', 'Después, los dos almorzaron en el restaurante del séptimo piso.'], // 9
      ['ゆい は カレー を 頼みました=頼む 。', 'Yui pidió curry.'],                                                          // 10
      ['ケン は お金 が 少し しか なかった=ない から=から#porque 、 コーヒー だけ 飲みました=飲む 。', 'Como a Ken le quedaba poco dinero, solo tomó un café.'], // 11
      ['ゆい は 「 わたし の カレー 、 半分 どうぞ 。 」 と 言いました=言う 。', 'Yui le dijo: "Toma, la mitad de mi curry".'], // 12
      ['ケン は 「 ありがとう=ありがとうございます:casual 」 と 言って=言う 、 いっしょに 食べました=食べる 。', 'Ken dijo "gracias" y comieron juntos.'], // 13
    ]],
    questions: [
      { t: 'mc', q: '¿Para quién era la corbata?', qjp: 'ケン さん は だれ に ネクタイ を 買いました=買う か 。', opts: ['Para el papá de Ken', 'Para Yui', 'Para el vendedor'], a: 0, why: '「お父さんにネクタイを買いたいと思っていました」: el próximo mes es el cumpleaños de su papá.', ev: [1, 2] },
      { t: 'mc', q: '¿Cuánto costaba la corbata azul?', qjp: '青い ネクタイ は いくら でした=です:pasado か 。', opts: ['12.000 yenes', '2.000 yenes', '5.000 yenes'], a: 0, why: '「一万二千円」: 一万 = 10.000 y 二千 = 2.000.', ev: 4 },
      { t: 'tf', q: 'Ken tenía suficiente dinero para la corbata azul.', a: false, why: '「六千円しかありませんでした」: しか + negativo = solo. 6.000 yenes no alcanzan para 12.000.', ev: [4, 5] },
      { t: 'mc', q: '¿Qué corbata compró al final?', qjp: 'ケン さん は どの ネクタイ に しました=する か 。', opts: ['Una negra de 5.000 yenes', 'Una azul de 12.000 yenes', 'Una negra de 6.000 yenes'], a: 0, why: '「黒いネクタイで、五千円でした」 y 「そのネクタイにしました」: に します = me decido por….', ev: [7, 8] },
      { t: 'text', q: '¿Qué tomó Ken en el restaurante? (escribe en katakana)', qjp: 'ケン さん は レストラン で 何|なに を 飲みました=飲む か 。', accept: ['コーヒー'], why: '「コーヒーだけ飲みました」: だけ = solo. Le quedaba poco dinero.', ev: 11 },
    ],
  },
  {
    id: 'r26', level: 6, title: 'なくした 財布', es: 'La billetera perdida', after: 'u15l1', topic: 'direcciones',
    paras: [[
      ['昨日 、 アナ は 地下鉄 の 中 で 財布 を なくしました=なくす 。', 'Ayer, Ana perdió su billetera en el metro.'],            // 0
      ['駅 を 出た=出る とき 、 かばん の 中 に 財布 が ありませんでした=ある 。', 'Cuando salió de la estación, la billetera no estaba en su bolso.'], // 1
      ['財布 に は お金 と 大切 な 写真 が 入って=入る いました=いる 。', 'En la billetera había dinero y una foto importante.'],   // 2
      ['アナ は とても 困って=困る 、 駅 の 前 の 交番 へ 行きました=行く 。', 'Ana no sabía qué hacer y fue a la caseta de policía frente a la estación.'], // 3
    ], [
      ['おまわりさん 「 どんな 財布 です か 。 」', 'Policía: —¿Cómo es la billetera?'],                                       // 4
      ['アナ 「 赤くて=赤い 小さい 財布 です 。 」', 'Ana: —Es una billetera roja y pequeña.'],                                // 5
      ['おまわりさん 「 三十|さんじゅっ=十 分|ぷん=分 前 に 、 公園 の 前 の 交番 から 電話 が ありました=ある 。 赤い 財布 が ある と 言って=言う いました=いる よ 。 」', 'Policía: —Hace treinta minutos llamaron de la caseta que está frente al parque. Dijeron que tienen una billetera roja.'], // 6
      ['おまわりさん 「 この 道 を まっすぐ 行って=行く 、 二つ目|ふたつめ=二つ:ordinal の 角 を 右 に 曲がって=曲がる ください 。 」', 'Policía: —Siga derecho por esta calle y doble a la derecha en la segunda esquina.'], // 7
      ['おまわりさん 「 それから 橋 を 渡る と:cuando 、 左 に 公園 が あります=ある 。 交番 は その 前 です 。 」', 'Policía: —Después, al cruzar el puente, a la izquierda hay un parque. La caseta está enfrente.'], // 8
    ], [
      ['アナ は 道 を まっすぐ 歩いて=歩く 、 二つ目|ふたつめ=二つ:ordinal の 角 を 右 に 曲がりました=曲がる 。', 'Ana caminó derecho por la calle y dobló a la derecha en la segunda esquina.'], // 9
      ['橋 を 渡る と:cuando 、 公園 の 前 に 小さい 交番 が ありました=ある 。', 'Al cruzar el puente, frente al parque había una caseta de policía pequeña.'], // 10
      ['そこ の おまわりさん が アナ の 赤い 財布 を 出しました=出す 。', 'El policía de ahí sacó la billetera roja de Ana.'],     // 11
      ['中 の お金 も 写真 も 大丈夫 でした=です:pasado 。', 'El dinero y la foto de adentro estaban bien.'],                    // 12
      ['アナ は 「 本当 に ありがとうございました=ありがとうございます:pasado 。 」 と 言いました=言う 。', 'Ana dijo: "Muchísimas gracias".'], // 13
    ]],
    questions: [
      { t: 'mc', q: '¿Dónde perdió Ana la billetera?', qjp: 'アナ さん は どこ で 財布 を なくしました=なくす か 。', opts: ['En el metro', 'En el parque', 'En el bus'], a: 0, why: '「地下鉄の中で財布をなくしました」: なくす = perder (algo).', ev: 0 },
      { t: 'mc', q: '¿Cómo es la billetera de Ana?', qjp: 'アナ さん の 財布 は どんな 財布 です か 。', opts: ['Roja y pequeña', 'Negra y pequeña', 'Roja y grande'], a: 0, why: '「赤くて小さい財布です」: 赤い → 赤くて (y…).', ev: 5 },
      { t: 'tf', q: 'La billetera estaba en la caseta frente a la estación.', a: false, why: 'Estaba en la caseta 「公園の前の交番」, frente al parque. Ana fue primero a la de la estación.', ev: [3, 6] },
      { t: 'mc', q: '¿Cómo se llega a la caseta del parque?', qjp: '公園 の 前 の 交番 へ は どう 行きます=行く か 。', opts: ['Derecho, a la derecha en la segunda esquina y luego cruzar el puente', 'A la izquierda en la primera esquina y luego cruzar el puente', 'Cruzar el puente y luego doblar a la derecha en la segunda esquina'], a: 0, why: '「まっすぐ行って、二つ目の角を右に曲がって」 y 「それから橋を渡ると…」. 角 を 曲がる: を marca el lugar por donde se pasa.', ev: [7, 8] },
      { t: 'text', q: '¿Qué había en la billetera además de dinero? (escribe en japonés)', qjp: '財布 に は お金 と 何|なに が 入って=入る いました=いる か 。', accept: ['しゃしん', '写真', 'たいせつなしゃしん', '大切な写真'], why: '「お金と大切な写真が入っていました」.', ev: 2 },
    ],
  },
  {
    id: 'r27', level: 6, title: '誕生日 の プレゼント', es: 'Los regalos de cumpleaños', after: 'u15l2', topic: 'regalos',
    paras: [[
      ['先週 の 金曜日 は わたし の 二十歳 の 誕生日 でした=です:pasado 。', 'El viernes pasado fue mi cumpleaños número veinte.'], // 0
      ['朝 、 両親 は わたし に 新しい とけい を くれました=くれる 。', 'En la mañana, mis papás me regalaron un reloj nuevo.'],  // 1
      ['白くて=白い 、 とても きれい な とけい です 。', 'Es un reloj blanco y muy bonito.'],                                   // 2
      ['兄 から は 本 を 二冊|にさつ=冊 もらいました=もらう 。', 'De mi hermano mayor recibí dos libros.'],                    // 3
      ['おばあさん から も きれい な はがき を もらいました=もらう 。', 'De mi abuela también recibí una postal bonita.'],         // 4
    ], [
      ['夜 、 友だち の アナ と ケン が うち に 来ました=来る 。', 'En la noche, mis amigos Ana y Ken vinieron a mi casa.'],    // 5
      ['アナ は 自分 で 作った=作る ケーキ を 持って=持つ 来ました=来る 。', 'Ana trajo una torta que hizo ella misma.'],       // 6
      ['ケン は 「 ゆい 、 おめでとう 」 と 言って=言う 、 わたし に 花 を くれました=くれる 。', 'Ken me dijo "Yui, felicidades" y me dio flores.'], // 7
      ['黄色い 花 が 十本|じゅっぽん=本#ctr ありました=ある 。', 'Eran diez flores amarillas.'],                                // 8
      ['みんな で ケーキ を 食べたり=食べる:forma-たり 、 歌 を 歌ったり=歌う:forma-たり しました=する 。', 'Todos juntos comimos torta, cantamos canciones y cosas así.'], // 9
    ], [
      ['ケン の 誕生日 は 来月 の 三日 です 。', 'El cumpleaños de Ken es el 3 del próximo mes.'],                                // 10
      ['わたし も ケン に 何か あげたい=あげる です 。', 'Yo también quiero regalarle algo a Ken.'],                            // 11
      ['ケン は ギター を 弾く の が 好き です から=から#porque 、 ギター の 本 が いい と 思います=思う 。', 'A Ken le gusta tocar guitarra, así que creo que un libro de guitarra estaría bien.'], // 12
      ['明日 、 アナ と いっしょに デパート へ 買い=買う:raíz-ます に 行きます=行く 。', 'Mañana voy a ir con Ana a la tienda a comprarlo.'], // 13
    ]],
    questions: [
      { t: 'mc', q: '¿Qué le regalaron sus papás a Yui?', qjp: '両親 は ゆい さん に 何|なに を くれました=くれる か 。', opts: ['Un reloj blanco', 'Dos libros', 'Diez flores'], a: 0, why: '「両親はわたしに新しいとけいをくれました」 y 「白くて、とてもきれいなとけいです」. くれる = alguien me da a mí.', ev: [1, 2] },
      { t: 'tf', q: 'Yui recibió dos libros de su hermano mayor.', qjp: 'ゆい さん は お兄さん から 本 を 二冊|にさつ=冊 もらいました=もらう か 。', a: true, why: '「兄から本を二冊もらいました」: Persona から もらう = recibir de…. Ella dice 兄 porque es su propio hermano.', ev: 3 },
      { t: 'mc', q: '¿Qué trajo Ana?', qjp: 'アナ さん は 何|なに を 持って=持つ 来ました=来る か 。', opts: ['Una torta que hizo ella misma', 'Diez flores amarillas', 'Un libro de guitarra'], a: 0, why: '「自分で作ったケーキを持って来ました」: 自分で作った modifica a ケーキ. Las flores fueron de Ken.', ev: [6, 7] },
      { t: 'tf', q: 'El cumpleaños de Ken ya pasó.', a: false, why: '「ケンの誕生日は来月の三日です」: es el día 3 del próximo mes.', ev: 10 },
      { t: 'text', q: '¿Qué le quiere regalar Yui a Ken? (escribe en japonés)', qjp: 'ゆい さん は ケン さん に 何|なに を あげたい=あげる です か 。', accept: ['ギターのほん', 'ギターの本', 'ギター の 本', 'ほん', '本'], why: '「ギターの本がいいと思います」: a Ken le gusta tocar guitarra. あげる = dar a otro.', ev: [11, 12] },
    ],
  },
];
