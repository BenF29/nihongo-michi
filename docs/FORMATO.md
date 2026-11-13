# Formato del contenido

Todo el contenido vive en `js/data/`. Después de editar, ejecuta:

```sh
node tools/validate.mjs
```

## Texto japonés (tokens)

Todo texto japonés se escribe **tokenizado**: palabras separadas por un espacio. Al mostrarse, cada palabra es clicable y abre su significado.

```
わたし は アナ です 。
食べました=食べる で 三百|さんびゃく=百 円 じゃありません=です:negativo
```

Un token es `superficie[|lectura][=lema][:etiqueta]`:

| Parte | Uso | Ejemplo |
|---|---|---|
| superficie | lo que se ve | `たべます` |
| `\|lectura` | lectura si no se deduce sola (números con rendaku, 何 leído なん…) | `三百\|さんびゃく`, `何\|なん` |
| `=lema` | id/escritura/lectura de la entrada del diccionario cuando la superficie está conjugada o es ambigua | `たべます=食べる`, `に=二` |
| `:etiqueta` | explicación de la forma (si la heurística no basta) | `でした=です:pasado` |

- Puntuación (`。、？！「」…`) va como token aparte.
- `＿` es el hueco en ejercicios `fill`.
- Los compuestos se pueden partir: `チリ 人|じん=じん` se muestra 「チリ人」.
- La lectura de verbos/adjetivos conjugados con kanji se deduce del lema (`食べました=食べる` → たべました).
- Partículas ambiguas: `に` es la partícula; el número dos es `に=二` o `二`. `さん` es el sufijo; tres es `三`. `から` = "desde"; "porque" es `から=から#porque`. `なん` (qué) existe como id propio; con kanji: `何|なん=なん`.
- Nombres propios (`アナ`, `ケン`, `田中`…) están en el diccionario como `name` y siempre cuentan como conocidos.

**Regla de oro (i+1):** en una lección solo pueden aparecer palabras de su `words` o de lecciones anteriores (`words` o `later`); las `later` de la propia lección **no** (el validador lo comprueba). En las unidades de kana, solo kana ya aprendidos.

**Kanji:** escribe cada palabra como se ve en la vida real: con kanji si normalmente lo lleva (面白い, 病院, 時計), aunque sus kanji no se enseñen en el camino; la app muestra furigana automáticamente sobre los kanji que el usuario aún no aprendió. Las palabras que casi siempre van en kana (いい, できる, かばん) quedan en kana, y sus kanji se anotan en `kanji_alt.js` para que el corrector los acepte. En las unidades 1–3 escribe todo en kana. El simulacro del examen sigue la escritura del JLPT N5 (おもしろい en kana).

Si cambias la escritura de una palabra ya publicada, conserva su id (6.º campo de la entrada): es la clave del progreso guardado y, si el id es la lectura en kana, el audio se sigue buscando por el kana (no hay que regenerarlo).

## Lecciones (`js/data/lessons/uN.js`)

```js
export default {
  u3l2: [ paso, paso, ... ],
};
```

Lo que introduce cada lección (kana, kanji, palabras) está en `curriculum.js`:
- `words`: el núcleo (4–8 palabras, incluidas las gramaticales): lo que la lección enseña y usa en sus oraciones.
- `later`: palabras que **no** se ven en la lección; al terminarla entran al repaso como tarjetas nuevas (máx. 10 por sesión). Se pueden usar desde la lección siguiente.

### Estructura de una lección de gramática (unidades 3–15)

La lección enseña **gramática**, no listas de palabras. Modelo: `u5l1` en `lessons/u5.js`. Cuatro tramos (`part`), 25–35 pasos en total:

1. **Regla**: `teach` con la regla y ejemplos (`ex`); `kanji` si la lección tiene; `words` solo con las palabras del núcleo que sean de contenido (no partículas).
2. **Transformar**: `transform` (escribir la forma), `mc`/`fill` con distractores gramaticales y algún `error`. Es el corazón de la lección: practicar la regla aislada.
3. **Oraciones**: la regla dentro de oraciones (`fill`, `build`, `error`, un `teach` corto si hay un segundo punto).
4. **Producir**: `write`, `answer` (responder una pregunta en japonés, **sin** traducción), un `dialog` seguido de 1–2 `mc` de comprensión sobre el diálogo, y un `dictation`.

No uses `auto` ni `match` de vocabulario: el vocabulario se practica en el repaso.

### Instrucciones que pasan a japonés

Los enunciados generados por la app (¿Qué significa?, Completa la oración, Responde en japonés…) pasan solos a japonés cuando el usuario aprende sus palabras. Para un paso escrito a mano:
- `q: '@clave'` usa una plantilla de `js/data/uitext.js` (p. ej. `@q.fill`, `@q.answer`) y se traduce con el avance. Un `q` libre queda en español.
- `qjp` (en `mc`): la pregunta escrita en japonés, p. ej. de comprensión de un diálogo (`qjp: 'ケン さん は 朝ごはん を 食べます=食べる か 。'`), con `q` como traducción. Úsalo desde la unidad 8, con palabras ya enseñadas.

Una lección típica (15–20 min, en tramos de ~5).

### Tipos de paso

```js
// Explicación. body admite **negrita**, saltos de línea y {texto japonés tokenizado} en línea.
{ t: 'teach', title: 'La partícula は', body: 'texto…', ex: [['わたし は アナ です 。', 'Yo soy Ana.']], tip: 'opcional' }

// Diálogo modelo (input comprensible, con audio por línea)
{ t: 'dialog', title: 'En la universidad', lines: [['アナ', 'はじめまして 。', 'Mucho gusto.'], ['ケン', '…', '…']] }

// Presenta las palabras nuevas de la lección (tarjetas + mini-quiz). ids opcional (por defecto: todas)
{ t: 'words', ids: ['猫', '犬'] }

// Presenta kana (por defecto los de la lección) / kanji
{ t: 'kana', chars: 'あいう' }
{ t: 'kanji', chars: '日月' }

// Prácticas generadas automáticamente
{ t: 'kanaquiz', n: 10 }   // reconocimiento y escritura en romaji de los kana de la lección + repaso
{ t: 'auto', n: 6 }        // vocabulario nuevo + repaso de palabras anteriores (MC, audio, pares)

// Opción múltiple. q en español; jp opcional (oración en japonés que se muestra).
// Las opciones con caracteres japoneses se renderizan como texto japonés tokenizado.
{ t: 'mc', q: '¿Qué significa?', jp: 'これ は ペン です 。', opts: ['Esto es un lápiz pasta.', 'Eso es un libro.'], a: 0, why: 'feedback' }

// kana: true → las opciones son solo kana (no palabras): p. ej. elegir la escritura correcta
{ t: 'mc', q: '¿Cómo se escribe «sushi»?', opts: ['すし', 'すさ', 'しす'], a: 0, kana: true }

// Completar el hueco ＿
{ t: 'fill', jp: 'わたし ＿ 学生 です 。', es: 'Yo soy estudiante.', opts: ['は', 'を', 'か'], a: 0, why: '…' }

// Ordenar fichas para formar la oración japonesa (alt: otras respuestas válidas)
{ t: 'build', es: 'Yo soy estudiante.', jp: 'わたし は 学生 です 。', extra: ['か', 'の'], alt: [] }

// Escribir la oración en japonés (kana, kanji o romaji); las fichas quedan como ayuda.
// Además, desde la unidad 4 la app convierte automáticamente parte de los 'build' en 'write'.
{ t: 'write', es: 'Yo soy estudiante.', jp: 'わたし は 学生 です 。', alt: [] }

// Dictado: escuchar y escribir (los pasos 'auto' ya agregan dictados con oraciones de la lección)
{ t: 'dictation', jp: 'わたし は 学生 です 。', es: 'Yo soy estudiante.' }

// Escuchar (TTS) y elegir el significado
{ t: 'listen', jp: 'おはようございます 。', opts: ['Buenos días.', 'Buenas noches.'], a: 0 }

// Unir pares (sin pairs: usa las palabras nuevas)
{ t: 'match', pairs: [['ねこ', 'gato'], ['いぬ', 'perro']] }

// Escribir la lectura en romaji
{ t: 'type', q: '¿Cómo se lee?', jp: 'さくら' }

// Tramo: divide la lección en partes de ~5 min; cada tramo terminado es un punto para salir y retomar.
// Sin pasos 'part', la app empieza un tramo en cada 'teach' (si el anterior tiene al menos 6 pasos).
{ t: 'part', title: 'Transformar' }

// Transformar: dada una forma, escribir otra (sin alternativas)
{ t: 'transform', q: 'Escribe la forma ます', jp: '飲む', a: '飲みます=飲む', alt: [], why: '…' }

// Encontrar el error: bad = la palabra que está mal (tal como aparece en jp); fix = la oración corregida
{ t: 'error', jp: 'わたし は 水 を 飲むます=飲む 。', bad: '飲むます', fix: 'わたし は 水 を 飲みます=飲む 。', es: 'Yo bebo agua.', why: '…' }

// Responder en japonés con palabras propias. Se acepta cualquier respuesta que termine en pat
// (texto o lista); a = respuestas modelo (la primera se muestra si falla). La pregunta no muestra traducción.
// pat debe ser el final obligado de la respuesta (verbo + partícula clave); nada puede ir después.
{ t: 'answer', jp: '毎日 なに を 飲みます=飲む か 。', pat: 'を 飲みます=飲む', a: ['コーヒー を 飲みます=飲む 。'], why: '…' }
```

Reglas para que las preguntas midan gramática y no se resuelvan descartando:
- Las alternativas de un `fill` o `mc` de gramática son **la misma palabra en formas distintas** (読みます／読むます／読みません), no palabras de significado distinto.
- Ninguna forma conjugada aparece antes de la lección que enseña cómo se forma: el validador lo comprueba (`FORM_TAUGHT` en `js/data/curriculum.js`). Las oraciones con error de los pasos `error` quedan excluidas.
- Antes de pedir una forma nueva (transform, fill, write), la lección tiene que haber explicado **cómo se forma**, no solo mostrarla.
- Un `error` tiene un solo error claro, de la gramática de la lección o de una anterior.

`why` (opcional pero recomendado) se muestra después de responder, acierte o no: explica *por qué*.
`a` es el índice (desde 0) de la opción correcta. La app baraja las opciones.

## Lecturas (`js/data/readings.js`)

```js
export default [
  {
    id: 'r01', level: 1, title: 'わたし の なまえ', es: 'Mi nombre', after: 'u3l3',
    topic: 'presentación',
    paras: [
      [['わたし は アナ です 。', 'Yo soy Ana.'], ['チリ 人|じん=じん です 。', 'Soy chilena.']],
      [ /* otro párrafo: lista de [jp, es] */ ],
    ],
    questions: [
      { t: 'mc', q: '¿De dónde es Ana?', opts: ['Chile', 'Japón', 'México'], a: 0, why: 'Dice チリ人です.', ev: 1 },
      { t: 'tf', q: 'Ana es profesora.', a: false, why: '…', ev: 0 },
      { t: 'text', q: '¿Cómo se dice "estudiante" en el texto? (escribe en kana)', accept: ['がくせい'], why: '…', ev: 2 },
    ],
  },
];
```

- `level`: 1 (tras unidad 3) · 2 (tras unidad 5) · 3 (tras unidad 7) · 4 (tras unidad 9) · 5 (intermedio, con vocabulario extra) · 6 (N5: tras las unidades 10–15, como el 読解 del examen).
- `after`: id de la lección tras la cual la lectura debería ser comprensible (≥ 90 % de palabras conocidas).
- `ev`: índice global (desde 0, contando todas las oraciones de todos los párrafos) de la oración que contiene la respuesta; se resalta en el feedback. Puede ser un número o una lista.
- `qjp` (opcional): la pregunta en japonés tokenizado (para niveles 3–5), además de `q` en español.
- Palabras que no están en `vocab.js` van a `vocab_extra.js`.

## Clips (`js/data/clips.js`)

Frases cortas (5–20 s) de anime o de japonés real que se reproducen desde un video de YouTube incrustado. Un clip tiene la forma de una lectura más el video:

```js
{ id: 'c01', yt: '-dUOzVp6-Y0', from: 603.3, to: 617.9, src: 'ワンパンマン #01', after: 'u8l1',
  es: 'En la caja del supermercado',
  paras: [[ ['四百八十二|よんひゃくはちじゅうに=百 円 です 。', 'Son 482 yenes.'], /* … */ ]],
  questions: [{ t: 'mc', q: '¿Cuánto cuesta la compra?', opts: ['428 yenes', '482 yenes', '382 yenes'], a: 1, why: '…' }],
  note: 'opcional: lo casual o lo que el camino aún no enseña (admite {japonés} y **negrita**)' }
```

- `yt`: id del video. `from` / `to`: segundos (con decimales) del tramo que suena. `src`: serie y episodio.
- Solo videos que tengan **subtítulos en japonés hechos a mano** (no los generados automáticamente): el texto y los tiempos salen de ahí, no del oído de nadie. De preferencia, del canal oficial de la serie.
- Solo videos con **una sola pista de audio**. Muchos clips de Netflix Anime traen doblajes: el reproductor incrustado elige la pista según el idioma del navegador (inglés, español…) y no permite cambiarla, así que el clip sonaría doblado. `tools/check-clips.mjs` lo detecta.
- `from` = inicio de la primera línea − 0,3 s; `to` = fin de la última línea + 0,3 s (sin pisar la línea anterior ni la siguiente), con un mínimo de unos 2 s.
- `questions`: solo `mc`, respondibles de oído; las alternativas en japonés son la misma palabra en formas distintas. La app no las baraja: varía la posición de la correcta.
- El texto se escribe como en las lecturas (kanji como en la vida real, números en kanji). Las palabras que el camino no enseña van a `vocab_extra.js`.

Para bajar los subtítulos de un episodio (solo el texto, no el video) a `subs/`, que git ignora:

```sh
yt-dlp --skip-download --write-subs --sub-langs ja --sub-format json3 -P subs -o "%(id)s" -- "https://www.youtube.com/watch?v=ID"
node tools/check-clips.mjs   # ¿siguen en YouTube los videos y tienen una sola pista de audio?
```

Cada evento del archivo trae `tStartMs`, `dDurationMs` y el texto, con ruido que hay que quitar: `(quien habla)`, `＜pensamientos＞`, `ーー` y efectos de sonido.

## Simulacro JLPT N5 (`js/data/exam/`)

El banco está repartido en `gengo.js` (文字・語彙 y 文法), `dokkai.js` (読解) y `chokai.js` (聴解). Cada archivo exporta un objeto `{ tipo: [ítems] }`. Los textos se escriben tokenizados, igual que en las lecciones, y **solo pueden usar palabras que el camino enseña** (el validador lo comprueba). Las instrucciones y preguntas van en japonés, como en el examen real. `why` (en español) se muestra al revisar el resultado. `ref` es la lección que conviene repasar si fallas.

Todos los ítems llevan `id` único (p. ej. `'m1-07'`), `a` (índice de la respuesta correcta; la app **no** baraja las opciones, para que «1 2 3 4» funcione como en el examen), `why` y `ref`.

```js
// 問題1 (moji1): lectura del kanji subrayado. u = token de jp que se subraya (tal cual).
// Las opciones son kana sueltas (no se tokenizan).
{ id: 'm1-01', jp: '毎朝 七時 に 起きます=起きる 。', u: '起きます=起きる', opts: ['おきます', 'あきます', 'いきます', 'おぎます'], a: 0, why: '…', ref: 'u8l2' }

// 問題2 (moji2): cómo se escribe la palabra subrayada (que va en kana). Opciones: escrituras sueltas.
{ id: 'm2-01', jp: 'あした は やすみ です 。', u: 'やすみ=休み', opts: ['休み', '体み', '木み', '本み'], a: 0, why: '…', ref: 'u9l1' }

// 問題3 (goi3): palabra que va en （　）. 問題1 de 文法 (bunpo1) usa el mismo formato.
{ id: 'g3-01', jp: 'のど が かわいた から 、 ＿ を 飲みます=飲む 。', opts: ['水', 'パン', '本', 'くつ'], a: 0, why: '…', ref: 'u5l1' }

// 問題4 (goi4): oración de significado más parecido. u (opcional) subraya la parte clave.
{ id: 'g4-01', jp: 'この 部屋 は 暗い です 。', u: '暗い', opts: ['この 部屋 は 明るくない=明るい です 。', '…', '…', '…'], a: 0, why: '…', ref: 'u11l3' }

// 文法 問題2 (bunpo2): ★ — pieces en el orden correcto; star = posición (0–3) del ★ (en el examen real suele ser 2).
// order (obligatorio) = orden en que se muestran las piezas como opciones 1–4 (índices de pieces); no puede ser el orden correcto.
// La respuesta es la opción que muestra pieces[star] (no lleva `a`).
{ id: 'b2-01', pre: 'わたし は', pieces: ['ケーキ', 'を', '食べた=食べる', 'こと'], post: 'が あります=ある 。', star: 2, order: [2, 0, 3, 1], why: '…', ref: 'u12l2' }

// 文法 問題3 (bunpo3): texto con huecos ＿ (en orden); gaps[i] es el hueco i.
{ id: 'b3-01', title: 'わたし の 町', paras: ['わたし は タルカ に 住んで=住む います=いる 。 ＿ 町 は …', '…'], es: 'Traducción…',
  gaps: [{ opts: ['この', 'その', 'あの', 'どの'], a: 1, why: '…' }], ref: 'u14l1' }

// 読解 (dokkai4 corto · dokkai5 mediano · dokkai6 búsqueda de información)
{ id: 'd4-01', paras: [['jp', 'es'], ['jp', 'es']], questions: [{ qjp: 'jp', opts: ['jp', '…'], a: 0, why: '…', ev: 1 }], ref: 'u12l1' }
// dokkai6 además puede llevar una tabla (celdas en japonés tokenizado):
{ id: 'd6-01', paras: [['…', '…']], table: { cols: ['じかん', 'クラス'], rows: [['九時|くじ=九 〜', 'えいご']] }, questions: [ … ], ref: 'u10l2' }

// 聴解: el audio se genera desde estos textos. Los hablantes son '男の人' / '女の人' (o nombres de MALE en dict.js).
// chokai1 (tareas) y chokai2 (puntos clave): intro y qjp los dice la narradora antes y después del diálogo; 4 opciones escritas.
{ id: 'c1-01', intro: '女 の 人 と 男 の 人 が 話して=話す います=いる 。 男 の 人 は 何 を 買います=買う か 。',
  lines: [['女の人', '…'], ['男の人', '…']], qjp: '男 の 人 は 何 を 買います=買う か 。', opts: ['jp', '…'], a: 0, es: 'traducción del diálogo', why: '…', ref: 'u10l3' }
// chokai3 (qué decir): scene = descripción breve de la ilustración (en español, con emoji); 3 opciones que solo se escuchan.
{ id: 'c3-01', scene: '🍽️ Terminas de comer en casa de una amiga.', qjp: 'ごはん を 食べました=食べる 。 何 と 言います=言う か 。',
  opts: ['ごちそうさまでした 。', 'いただきます 。', 'いってきます 。'], a: 0, why: '…', ref: 'u15l3' }
// chokai4 (respuesta rápida): una frase y 3 respuestas que solo se escuchan.
{ id: 'c4-01', lines: [['男の人', 'こんにちは 。 元気 です か 。']], opts: ['はい 、 元気 です 。', '…', '…'], a: 0, why: '…', ref: 'u6l2' }
```
