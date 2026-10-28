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

**Regla de oro (i+1):** en una lección solo pueden aparecer palabras introducidas en esa lección o antes (el validador lo comprueba). En las unidades de kana, solo kana ya aprendidos.

**Kanji:** escribe una palabra con kanji solo si sus kanji ya se enseñaron (`kanji` en el currículo) o si quieres exponer kanji nuevo: la app muestra furigana automáticamente sobre los kanji que el usuario aún no aprendió. En las unidades 1–3 escribe todo en kana.

## Lecciones (`js/data/lessons/uN.js`)

```js
export default {
  u3l2: [ paso, paso, ... ],
};
```

Lo que introduce cada lección (kana, kanji, palabras) está en `curriculum.js`. Una lección típica (8–15 min): enseñar → práctica guiada → producción → repaso.

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
```

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

- `level`: 1 (tras unidad 3) · 2 (tras unidad 5) · 3 (tras unidad 7) · 4 (tras unidad 9) · 5 (intermedio, con vocabulario extra).
- `after`: id de la lección tras la cual la lectura debería ser comprensible (≥ 90 % de palabras conocidas).
- `ev`: índice global (desde 0, contando todas las oraciones de todos los párrafos) de la oración que contiene la respuesta; se resalta en el feedback. Puede ser un número o una lista.
- `qjp` (opcional): la pregunta en japonés tokenizado (para niveles 3–5), además de `q` en español.
- Palabras que no están en `vocab.js` van a `vocab_extra.js`.
