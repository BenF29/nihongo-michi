# 道 Michi · Aprende japonés

Aplicación web interactiva para aprender japonés desde cero, en español.

**[Abrir la aplicación](https://benf29.github.io/nihongo-michi/)**

## Qué incluye

- **Camino de aprendizaje**: 9 unidades y 34 lecciones en orden. Empieza con hiragana y katakana, sigue con saludos y gramática básica (は・です, か, の, これ/それ/あれ), números, la hora, verbos en ます, partículas, el pasado, adjetivos い/な, あります/います, familia, forma て, 〜たい, habla casual y opiniones (〜と思います, 〜から). Hay unos 100 kanji repartidos a lo largo del camino.
  - Ejercicios variados: opción múltiple, completar partículas, armar oraciones con fichas, escuchar (voz sintetizada), unir pares, escribir en romaji y diálogos que se revelan línea a línea.
  - Feedback inmediato que explica *por qué* una respuesta es correcta o no. Las preguntas falladas vuelven al final de la lección.
  - Cada lección usa solo palabras ya enseñadas más las nuevas (i+1), y recicla vocabulario anterior.
  - **Producción**: desde la unidad 4 las fichas se van retirando y hay que escribir las oraciones en japonés (kana, kanji o romaji, que se convierte solo). Las fichas quedan como ayuda a cambio de menos XP. El corrector acepta kanji o kana y avisa si solo fallaste en una vocal larga.
  - **Dictados**: escuchar una oración y escribirla.
  - **⏩ Ya lo sé**: una prueba corta por unidad para saltar lo que ya sabes.
- **Lecturas graduadas**: 19 textos originales en 5 niveles, que se pueden leer o hacer en modo **🎧 Escuchar primero** (texto oculto, reproductor por oraciones), con preguntas de comprensión (opción múltiple, verdadero/falso y respuesta escrita en japonés o romaji). El feedback resalta la oración del texto donde está la respuesta. Cada lectura muestra qué porcentaje de sus palabras ya conoces.
- **Diccionario clicable**: toca cualquier palabra japonesa para ver su significado, lectura, romaji, forma gramatical (p. ej. 食べました ← 食べる, pasado cortés) y los kanji que la componen. La furigana aparece solo sobre los kanji que todavía no aprendes.
- **Repaso espaciado** (sistema Leitner: 1, 3, 7, 16, 35… días), tabla de kana, lista de kanji y vocabulario aprendido.
- **Perfiles**: varios usuarios por navegador, cada uno con su progreso, XP, racha diaria y meta. El progreso se guarda en `localStorage` y se puede exportar e importar con un código para cambiar de dispositivo.

En la app, la sección [Cómo funciona](https://benf29.github.io/nihongo-michi/#/metodo) explica la metodología y sus referencias.

## Voces

Los audios de pronunciación se generaron con [VOICEVOX](https://voicevox.hiroshiba.jp/): **VOICEVOX:春日部つむぎ** (voz principal) y **VOICEVOX:玄野武宏** (oraciones alternadas y personajes masculinos). Para regenerarlos después de cambiar el contenido:

```sh
docker run -d --rm --name voicevox -p 127.0.0.1:50021:50021 voicevox/voicevox_engine:cpu-latest
node tools/gen-audio.mjs   # crea solo los que faltan y borra los que ya no se usan
```

## Desarrollo

Es un sitio estático, sin dependencias ni paso de compilación (HTML, CSS y módulos de JavaScript).

```sh
python3 -m http.server 8000   # luego abre http://localhost:8000
node tools/validate.mjs       # valida el contenido (añade -w para ver advertencias)
```

El contenido vive en `js/data/`:

| Archivo | Contenido |
|---|---|
| `curriculum.js` | unidades y lecciones: qué kana, kanji y palabras introduce cada una |
| `vocab.js`, `vocab_extra.js` | diccionario |
| `kana.js`, `kanji.js` | caracteres con mnemotecnias |
| `lessons/uN.js` | los pasos de cada lección |
| `readings.js` | lecturas y preguntas |

El formato está documentado en [`docs/FORMATO.md`](docs/FORMATO.md). El validador comprueba que cada palabra exista en el diccionario, que cada lección use solo vocabulario y kana ya enseñados, y calcula la cobertura de vocabulario de cada lectura.
