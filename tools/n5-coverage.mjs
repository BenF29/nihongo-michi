// Cobertura del JLPT N5: node tools/n5-coverage.mjs [-v]
// Compara lo que enseña el camino (curriculum.js) con la lista de referencia de tools/data/n5.js.

import { lookup } from '../js/dict.js';
import { LESSONS } from '../js/data/curriculum.js';
import { N5_KANJI, N5_VOCAB } from './data/n5.js';

const taughtWords = new Set();
let taughtKanji = '';
for (const l of LESSONS) {
  for (const w of l.words || []) { const e = lookup(w); if (e) taughtWords.add(e.id); }
  taughtKanji += l.kanji || '';
}
const missK = [...N5_KANJI].filter(k => !taughtKanji.includes(k));
const seen = new Set(), missW = [];
let ok = 0, total = 0;
for (const { w, r } of N5_VOCAB) {
  if (seen.has(w + r)) continue; seen.add(w + r); total++;
  const e = lookup(w) || lookup(r);
  if (e && taughtWords.has(e.id)) ok++; else missW.push(w === r ? w : `${w}(${r})`);
}
console.log(`Kanji N5 enseñados: ${N5_KANJI.length - missK.length}/${N5_KANJI.length}${missK.length ? `  · faltan: ${missK.join('')}` : ''}`);
console.log(`Vocabulario N5 enseñado: ${ok}/${total} (${Math.round(100 * ok / total)} %)`);
if (missW.length && (process.argv.includes('-v') || missW.length <= 60)) console.log(`Faltan: ${missW.join(' ')}`);
else if (missW.length) console.log(`${missW.length} palabras faltan (usa -v para verlas)`);
