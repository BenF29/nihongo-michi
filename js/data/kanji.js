// Kanji: [kanji, significado, lecturas on (katakana), lecturas kun (hiragana), mnemotecnia, ejemplos]
// Las mnemotecnias asocian forma y significado (método de imágenes, ver Quackenbush & Ohso 1983; Heisig).

const K = [
  // u4l1
  ['一', 'uno', 'イチ', 'ひと(つ)', 'Una sola raya: uno.', '一 一人'],
  ['二', 'dos', 'ニ', 'ふた(つ)', 'Dos rayas: dos.', '二 二人'],
  ['三', 'tres', 'サン', 'みっ(つ)', 'Tres rayas: tres.', '三'],
  ['四', 'cuatro', 'シ', 'よん・よ', 'Una ventana con cuatro lados y cortinas.', '四'],
  ['五', 'cinco', 'ゴ', 'いつ(つ)', 'Parece un 5 cuadrado con techo.', '五'],
  ['六', 'seis', 'ロク', 'むっ(つ)', 'Una persona con sombrero y piernas abiertas: seis.', '六'],
  ['七', 'siete', 'シチ', 'なな', 'Un 7 al revés con una raya que lo cruza.', '七'],
  ['八', 'ocho', 'ハチ', 'やっ(つ)', 'Dos trazos que se abren como un 8 cortado.', '八'],
  ['九', 'nueve', 'キュウ・ク', 'ここの(つ)', 'Un brazo flexionado que llega casi al 10.', '九'],
  ['十', 'diez', 'ジュウ', 'とお', 'Una cruz: el signo + (diez dedos juntos).', '十'],
  ['百', 'cien', 'ヒャク', '—', 'Un "uno" sobre "blanco" (白): cien.', '百'],
  ['千', 'mil', 'セン', 'ち', 'Un "diez" con un sombrerito: mil.', '千'],
  ['円', 'yen; círculo', 'エン', 'まる(い)', 'Una ventanilla de caja donde pagas en yenes.', '円'],
  // u4l2
  ['今', 'ahora', 'コン', 'いま', 'Un techo sobre la "ahora" que estás viviendo.', '今 今日'],
  ['時', 'hora, tiempo', 'ジ', 'とき', 'El sol (日) junto a un templo (寺) que marca las horas.', '時'],
  ['分', 'minuto; dividir', 'フン・ブン', 'わ(かる)', 'Un cuchillo (刀) divide algo en dos: los minutos dividen la hora.', '分'],
  ['半', 'mitad', 'ハン', 'なか(ば)', 'Una línea vertical corta todo por la mitad.', '半'],
  ['午', 'mediodía', 'ゴ', '—', 'Parece 牛 (vaca) sin cuerno: al mediodía la vaca descansa.', '午前 午後'],
  ['前', 'antes, delante', 'ゼン', 'まえ', 'Un barco con remos que va hacia adelante.', '午前 前 名前'],
  ['後', 'después, detrás', 'ゴ', 'うし(ろ)・あと', 'Pasos lentos que quedan atrás.', '午後'],
  // u4l3
  ['日', 'sol, día', 'ニチ・ニ', 'ひ・か', 'Una ventana con el sol dentro.', '日本 毎日 日曜日'],
  ['月', 'luna, mes', 'ゲツ・ガツ', 'つき', 'Una luna creciente con dos nubes.', '月曜日'],
  ['火', 'fuego', 'カ', 'ひ', 'Una fogata con chispas a los lados.', '火曜日'],
  ['水', 'agua', 'スイ', 'みず', 'Un río con salpicaduras a ambos lados.', '水 水曜日'],
  ['木', 'árbol', 'モク・ボク', 'き', 'Un árbol con ramas y raíces.', '木 木曜日'],
  ['金', 'oro, dinero', 'キン', 'かね', 'Pepitas de oro bajo un techo.', '金曜日'],
  ['土', 'tierra', 'ド', 'つち', 'Un brote saliendo de la tierra.', '土曜日'],
  ['曜', 'día de la semana', 'ヨウ', '—', 'El sol (日) y dos plumas: el día que vuela.', '曜日'],
  ['明', 'brillante', 'メイ', 'あか(るい)', 'Sol (日) + luna (月) = mucha luz.', '明日'],
  ['毎', 'cada', 'マイ', '—', 'Una madre (母) con sombrero que cocina cada día.', '毎日'],
  // u5l1
  ['食', 'comer', 'ショク', 'た(べる)', 'Un techo sobre un plato lleno: comer.', '食べる 食べ物'],
  ['飲', 'beber', 'イン', 'の(む)', 'Comida (食) + bostezo (欠): boca abierta para beber.', '飲む'],
  ['見', 'ver', 'ケン', 'み(る)', 'Un ojo (目) sobre piernas que caminan a mirar.', '見る'],
  ['読', 'leer', 'ドク', 'よ(む)', 'Palabras (言) + vender (売): leer en voz alta.', '読む'],
  ['聞', 'escuchar', 'ブン', 'き(く)', 'Una oreja (耳) asomada por una puerta (門).', '聞く'],
  // u5l2
  ['行', 'ir', 'コウ', 'い(く)', 'Un cruce de calles: por donde vas.', '行く 銀行 旅行'],
  ['来', 'venir', 'ライ', 'く(る)', 'Un árbol (木) con brazos que te llaman: ¡ven!', '来る 来週'],
  ['帰', 'volver', 'キ', 'かえ(る)', 'Una escoba: vuelves a casa a barrer.', '帰る'],
  ['学', 'aprender', 'ガク', 'まな(ぶ)', 'Un niño (子) bajo un techo con luz: aprendiendo.', '学生 学校 大学'],
  ['校', 'escuela', 'コウ', '—', 'Un árbol (木) junto a un edificio: la escuela.', '学校'],
  // u5l3
  ['店', 'tienda', 'テン', 'みせ', 'Un techo inclinado con un puesto debajo.', '店'],
  ['買', 'comprar', 'バイ', 'か(う)', 'Una red (罒) sobre conchas-dinero (貝): comprar.', '買う'],
  ['会', 'reunirse', 'カイ', 'あ(う)', 'Personas bajo un mismo techo: reunión.', '会う 会社員'],
  // u5l4
  ['先', 'antes, previo', 'セン', 'さき', 'Una persona que camina adelante.', '先生 先週'],
  ['週', 'semana', 'シュウ', '—', 'Un camino (辶) que da la vuelta: una semana.', '週末 先週 来週'],
  // u5l5
  ['山', 'montaña', 'サン', 'やま', 'Tres picos de montaña.', '山'],
  ['海', 'mar', 'カイ', 'うみ', 'Agua (氵) + cada (毎): el mar está en todas partes.', '海'],
  ['映', 'reflejar, proyectar', 'エイ', 'うつ(る)', 'El sol (日) proyecta una imagen.', '映画'],
  ['画', 'imagen', 'ガ', '—', 'Un marco con un dibujo dentro.', '映画'],
  // u6l1
  ['大', 'grande', 'ダイ・タイ', 'おお(きい)', 'Una persona con los brazos bien abiertos.', '大きい 大学'],
  ['小', 'pequeño', 'ショウ', 'ちい(さい)', 'Un palito con dos gotitas: algo pequeño.', '小さい'],
  ['高', 'alto, caro', 'コウ', 'たか(い)', 'Una torre alta con techo y ventanas.', '高い'],
  ['安', 'barato, tranquilo', 'アン', 'やす(い)', 'Una mujer (女) bajo un techo: tranquilidad.', '安い'],
  ['新', 'nuevo', 'シン', 'あたら(しい)', 'Un árbol recién cortado con hacha (斤).', '新しい'],
  ['古', 'viejo', 'コ', 'ふる(い)', 'Diez (十) bocas (口) han contado esta historia: es vieja.', '古い'],
  // u6l2
  ['好', 'gustar', 'コウ', 'す(き)', 'Una mujer (女) con su hijo (子): cariño.', '好き'],
  ['町', 'pueblo, ciudad', 'チョウ', 'まち', 'Arrozales (田) junto a una calle.', '町'],
  ['元', 'origen', 'ゲン', 'もと', 'Dos rayas sobre unas piernas: el comienzo.', '元気'],
  ['気', 'energía, espíritu', 'キ', '—', 'Vapor que sube de una olla de arroz.', '元気 天気'],
  // u6l3
  ['天', 'cielo', 'テン', 'あめ', 'Una persona grande (大) bajo una raya: el cielo.', '天気'],
  ['少', 'poco', 'ショウ', 'すこ(し)', 'Pequeño (小) con un trazo que se lleva un poco.', '少し'],
  ['物', 'cosa', 'ブツ・モツ', 'もの', 'Una vaca (牛) que cambias por cosas.', '物 食べ物'],
  // u7l1
  ['男', 'hombre', 'ダン', 'おとこ', 'Fuerza (力) en el arrozal (田): el hombre trabaja.', '男'],
  ['女', 'mujer', 'ジョ', 'おんな', 'Una figura arrodillada con elegancia.', '女'],
  ['子', 'niño', 'シ', 'こ', 'Un bebé con los brazos abiertos.', '子ども'],
  ['人', 'persona', 'ジン・ニン', 'ひと', 'Dos piernas caminando.', '人 一人'],
  // u7l2
  ['中', 'dentro, medio', 'チュウ', 'なか', 'Una flecha que atraviesa el centro de una caja.', '中'],
  ['右', 'derecha', 'ウ', 'みぎ', 'Una mano que lleva comida a la boca (口): la derecha.', '右'],
  ['左', 'izquierda', 'サ', 'ひだり', 'Una mano con una herramienta (工): la izquierda.', '左'],
  ['上', 'arriba', 'ジョウ', 'うえ', 'Una marca encima de la línea.', '上 上手'],
  ['下', 'abajo', 'カ', 'した', 'Una marca debajo de la línea.', '下'],
  // u7l3
  ['父', 'padre', 'フ', 'ちち', 'Dos palos cruzados: el papá cortando leña.', '父 お父さん'],
  ['母', 'madre', 'ボ', 'はは', 'Una figura con dos puntos: la mamá que amamanta.', '母 お母さん'],
  ['兄', 'hermano mayor', 'キョウ', 'あに', 'Una gran boca (口) sobre piernas: el que da órdenes.', '兄'],
  ['姉', 'hermana mayor', 'シ', 'あね', 'Mujer (女) + mercado (市): la que va de compras.', '姉'],
  ['弟', 'hermano menor', 'ダイ', 'おとうと', 'Un niño atado con una cuerda: el pequeño.', '弟'],
  ['妹', 'hermana menor', 'マイ', 'いもうと', 'Mujer (女) + todavía no (未): aún pequeña.', '妹'],
  // u8l1
  ['書', 'escribir', 'ショ', 'か(く)', 'Una mano que sostiene un pincel sobre un papel.', '書く'],
  ['話', 'hablar', 'ワ', 'はな(す)', 'Palabras (言) + lengua (舌).', '話す 電話'],
  ['待', 'esperar', 'タイ', 'ま(つ)', 'Pasos (彳) frente a un templo (寺): esperando.', '待つ'],
  ['教', 'enseñar', 'キョウ', 'おし(える)', 'Un niño y una mano con vara: enseñar.', '教える'],
  // u8l2
  ['雨', 'lluvia', 'ウ', 'あめ', 'Gotas cayendo desde una nube bajo el cielo.', '雨'],
  ['住', 'vivir, residir', 'ジュウ', 'す(む)', 'Una persona (亻) junto a su señor (主): donde vive.', '住む'],
  ['知', 'saber', 'チ', 'し(る)', 'Una flecha (矢) que llega directo a la boca (口).', '知る'],
  ['寝', 'dormir', 'シン', 'ね(る)', 'Un techo con una cama debajo.', '寝る'],
  ['起', 'levantarse', 'キ', 'お(きる)', 'Correr (走) + uno mismo (己): levantarse rápido.', '起きる'],
  // u8l3
  ['入', 'entrar', 'ニュウ', 'はい(る)', 'Una persona que se inclina para entrar.', '入る'],
  ['出', 'salir', 'シュツ', 'で(る)', 'Montañas que salen una sobre otra.', '出る'],
  ['写', 'copiar, fotografiar', 'シャ', 'うつ(す)', 'Una tapa sobre algo que se copia.', '写真'],
  ['真', 'verdad', 'シン', 'ま', 'Diez (十) ojos (目) miran: debe ser verdad.', '写真'],
  // u9l1
  ['休', 'descansar', 'キュウ', 'やす(む)', 'Una persona (亻) apoyada en un árbol (木).', '休み 夏休み'],
  ['冬', 'invierno', 'トウ', 'ふゆ', 'Dos gotas de hielo bajo un caminante.', '冬'],
  ['作', 'hacer, crear', 'サク', 'つく(る)', 'Una persona (亻) con una sierra.', '作る'],
  ['泳', 'nadar', 'エイ', 'およ(ぐ)', 'Agua (氵) + eterno (永): nadar sin parar.', '泳ぐ'],
  // u9l2
  ['本', 'libro; origen', 'ホン', 'もと', 'Un árbol (木) con una marca en su raíz.', '本 日本 本当'],
  ['当', 'acertar', 'トウ', 'あ(たる)', 'Tres chispas sobre una mano: ¡en el blanco!', '本当'],
  // u9l3
  ['思', 'pensar', 'シ', 'おも(う)', 'Un campo (田) sobre un corazón (心): pensar.', '思う'],
  ['言', 'decir', 'ゲン', 'い(う)', 'Palabras saliendo de una boca (口).', '言う 言葉'],
  ['意', 'idea', 'イ', '—', 'Un sonido (音) sobre el corazón (心).', '意味'],
  ['味', 'sabor', 'ミ', 'あじ', 'Una boca (口) + todavía no (未): probando el sabor.', '意味'],
  // u10l1
  ['万', 'diez mil', 'マン・バン', '—', 'Un "uno" (一) con un gancho que se dobla de tanto peso: diez mil.', '万 一万 万年筆'],
  // u10l2
  ['年', 'año', 'ネン', 'とし', 'Una persona cargando la cosecha de todo el año sobre los hombros.', '年 今年 去年 来年 毎年'],
  ['生', 'vida; nacer', 'セイ・ショウ', 'う(まれる)・い(きる)', 'Un brote que sale de la tierra (土) y crece: la vida.', '先生 学生 生まれる 誕生日'],
  // u10l3
  ['名', 'nombre', 'メイ', 'な', 'De noche (夕) no te ven, así que dices tu nombre con la boca (口).', '名前 有名'],
  // u11l1
  ['白', 'blanco', 'ハク', 'しろ(い)', 'El sol (日) con un rayo de luz encima: blanco brillante.', '白い'],
  ['長', 'largo; jefe', 'チョウ', 'なが(い)', 'Un anciano de pelo muy largo que flota al viento.', '長い'],
  // u11l2
  ['多', 'mucho', 'タ', 'おお(い)', 'Dos noches (夕) una encima de otra: muchas noches.', '多い'],
  ['国', 'país', 'コク', 'くに', 'Un rey con su joya (玉) dentro de las fronteras (囗): un país.', '国 外国 外国人'],
  // u11l3
  ['空', 'cielo; vacío', 'クウ', 'そら・あ(く)', 'Un agujero (穴) en el techo por donde se ve el trabajo (工) de las nubes: el cielo.', '空'],
  // u12l1
  ['友', 'amigo', 'ユウ', 'とも', 'Dos manos que se cruzan para saludarse: amigos.', '友だち'],
  // u12l2
  ['間', 'espacio, intervalo', 'カン', 'あいだ・ま', 'El sol (日) que se asoma entre las dos hojas de una puerta (門).', '時間 週間'],
  ['川', 'río', 'セン', 'かわ', 'Tres líneas de agua que corren: un río.', '川'],
  // u12l3
  ['何', 'qué', 'カ', 'なに・なん', 'Una persona (亻) que pregunta: ¿se puede (可)? ¿Qué?', '何 何か 何も'],
  ['外', 'afuera', 'ガイ', 'そと', 'De noche (夕) el adivino (卜) lee las estrellas afuera.', '外 外国'],
  // u13l1
  ['口', 'boca; abertura', 'コウ', 'くち', 'Una boca abierta, cuadrada.', '口 入口 出口'],
  ['立', 'pararse', 'リツ', 'た(つ)', 'Una persona de pie, bien parada sobre el suelo.', '立つ'],
  // u13l2
  ['足', 'pie, pierna', 'ソク', 'あし', 'Una rodilla (口) sobre una pierna que da un paso.', '足'],
  ['手', 'mano', 'シュ', 'て', 'Una mano con sus dedos extendidos.', '手 上手 下手 手紙 切手'],
  ['目', 'ojo', 'モク', 'め', 'Un ojo puesto de pie, con la pupila en medio.', '目'],
  ['耳', 'oreja', 'ジ', 'みみ', 'Una oreja con sus pliegues.', '耳'],
  // u13l3
  ['語', 'idioma, palabra', 'ゴ', 'かた(る)', 'Palabras (言) de mi (吾) gente: un idioma.', '日本語 英語 言語'],
  // u14l1
  ['花', 'flor', 'カ', 'はな', 'Una planta (艹) que cambia (化): la flor.', '花 花瓶'],
  ['魚', 'pez', 'ギョ', 'さかな', 'Cabeza arriba, escamas en medio (田) y la cola abajo: un pez.', '魚'],
  // u14l2
  ['駅', 'estación', 'エキ', '—', 'Antes las estaciones eran postas con caballos (馬).', '駅'],
  ['車', 'auto, carro', 'シャ', 'くるま', 'Un carro visto desde arriba: el eje y dos ruedas.', '車 電車 自転車 自動車'],
  ['電', 'electricidad', 'デン', '—', 'Lluvia (雨) y un rayo que cae: electricidad.', '電車 電話 電気'],
  // u14l3
  ['社', 'empresa; santuario', 'シャ', 'やしろ', 'Un altar (礻) sobre la tierra (土): un santuario, y luego la empresa.', '会社'],
  // u15l1
  ['東', 'este', 'トウ', 'ひがし', 'El sol (日) que sale detrás de un árbol (木): el este.', '東 東京'],
  ['西', 'oeste', 'セイ・サイ', 'にし', 'Un pájaro que vuelve a su nido al atardecer, cuando el sol se va al oeste.', '西'],
  ['南', 'sur', 'ナン', 'みなみ', 'Una carpa con techo (十) para el calor del sur.', '南'],
  ['北', 'norte', 'ホク', 'きた', 'Dos personas sentadas espalda con espalda, dándole la espalda al frío del norte.', '北'],
  ['道', 'camino', 'ドウ', 'みち', 'Una cabeza (首) que avanza (辶) por el camino.', '道'],
];

export const KANJI = Object.fromEntries(K.map(([k, es, on, kun, mn, ex]) => [k, { k, es, on, kun, mn, ex: ex.split(' ') }]));
