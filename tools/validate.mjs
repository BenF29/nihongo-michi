// Valida el contenido: node tools/validate.mjs [--coverage]
// - todas las palabras existen en el diccionario
// - cada lección usa solo palabras ya introducidas (i+1) y, en unidades de kana, solo kana aprendidos
// - estructura de los pasos y preguntas
// - cobertura de vocabulario de cada lectura en el punto del camino indicado por `after`

import { ENTRIES, lookup, tokenize, isPunct } from '../js/dict.js';
import { UNITS, LESSONS, LESSON_INDEX } from '../js/data/curriculum.js';
import { KANJI } from '../js/data/kanji.js';
import { KANA } from '../js/data/kana.js';
import { STEPS } from '../js/data/lessons/index.js';
import READINGS from '../js/data/readings.js';

const errors = [], warns = [];
const err = (where, msg) => errors.push(`✗ ${where}: ${msg}`);
const warn = (where, msg) => warns.push(`! ${where}: ${msg}`);
const hasJp = s => /[぀-ヿ一-龯]/.test(s);

// ── Diccionario y currículo ──
for (const e of Object.values(ENTRIES)) if (e.dup) err('vocab', `id duplicado: ${e.id}`);
const introducedIn = {};
for (const l of LESSONS) {
  for (const w of l.words || []) {
    const e = lookup(w);
    if (!e) { err(l.id, `palabra del currículo no está en vocab: ${w}`); continue; }
    if (introducedIn[e.id]) err(l.id, `${w} ya se introduce en ${introducedIn[e.id]}`);
    introducedIn[e.id] = l.id;
  }
  for (const k of l.kanji || '') if (!KANJI[k]) err(l.id, `kanji sin datos en kanji.js: ${k}`);
  for (const k of l.kana || '') if (!KANA[k]) err(l.id, `kana desconocido: ${k}`);
  if (!STEPS[l.id]) warn(l.id, 'sin pasos todavía');
}

// ── Recolectar textos japoneses de un paso ──
function jpTexts(s) {
  const out = [];
  const add = x => { if (typeof x === 'string' && x.trim()) out.push(x); };
  add(s.jp);
  if (s.ex) s.ex.forEach(e => add(e[0]));
  if (s.lines) s.lines.forEach(l => add(l[1]));
  if (s.body) for (const m of s.body.matchAll(/\{([^}]+)\}/g)) add(m[1]);
  if (s.tip) for (const m of s.tip.matchAll(/\{([^}]+)\}/g)) add(m[1]);
  if (s.opts && !s.kana && (s.t === 'fill' || s.opts.every(hasJp))) s.opts.forEach(add);
  if (s.extra) s.extra.forEach(add);
  if (s.alt) s.alt.forEach(add);
  if (s.pairs) s.pairs.forEach(p => add(p[0]));
  return out;
}

function checkStep(where, s) {
  const need = (...ks) => ks.forEach(k => { if (s[k] === undefined) err(where, `falta "${k}" en paso ${s.t}`); });
  switch (s.t) {
    case 'teach': need('title', 'body'); break;
    case 'dialog': need('lines'); break;
    case 'mc': case 'listen':
      need('opts', 'a'); if (s.t === 'mc') need('q');
      if (s.opts && (s.a < 0 || s.a >= s.opts.length)) err(where, `"a" fuera de rango`);
      if (s.opts && new Set(s.opts).size !== s.opts.length) err(where, 'opciones repetidas');
      break;
    case 'fill':
      need('jp', 'opts', 'a');
      if (s.jp && !s.jp.split(/\s+/).includes('＿')) err(where, 'fill sin ＿');
      if (s.opts && (s.a < 0 || s.a >= s.opts.length)) err(where, `"a" fuera de rango`);
      break;
    case 'build': case 'write': need('es', 'jp'); break;
    case 'dictation': need('jp'); break;
    case 'match': if (s.pairs && s.pairs.length < 3) warn(where, 'match con menos de 3 pares'); break;
    case 'type': need('jp'); break;
    case 'words': case 'kana': case 'kanji': case 'kanaquiz': case 'auto': break;
    default: err(where, `tipo de paso desconocido: ${s.t}`);
  }
}

// ── Lecciones ──
const known = new Set();
const knownKana = new Set();
let wordUses = {};
for (const l of LESSONS) {
  for (const w of l.words || []) { const e = lookup(w); if (e) known.add(e.id); }
  for (const k of l.kana || '') knownKana.add(k);
  const kanaUnit = l.unit === 'u1' || l.unit === 'u2';
  const steps = STEPS[l.id] || [];
  steps.forEach((s, i) => {
    const where = `${l.id}#${i}(${s.t})`;
    checkStep(where, s);
    for (const text of jpTexts(s)) {
      for (const tok of tokenize(text)) {
        if (tok.punct || tok.blank) continue;
        if (!tok.entry) { err(where, `palabra desconocida «${tok.raw}» en: ${text}`); continue; }
        if (tok.entry.pos !== 'name' && !known.has(tok.entry.id)) {
          const at = introducedIn[tok.entry.id];
          err(where, `«${tok.raw}» aún no se enseña${at ? ` (se introduce en ${at})` : ' (no está en ninguna lección)'}`);
        }
        if (kanaUnit) for (const ch of tok.surface) if (!knownKana.has(ch) && ch !== 'ー') err(where, `kana «${ch}» aún no aprendido en «${tok.surface}»`);
        if (!tok.reading && /[一-龯]/.test(tok.surface)) warn(where, `no se pudo deducir la lectura de «${tok.raw}» (usa |lectura)`);
        wordUses[tok.entry.id] = (wordUses[tok.entry.id] || 0) + 1;
      }
    }
    if (s.kana && s.opts) for (const o of s.opts) for (const ch of o) if (!knownKana.has(ch)) err(where, `kana «${ch}» aún no aprendido en opción «${o}»`);
  });
}

// ── Lecturas ──
const knownAt = {};
{
  const acc = new Set();
  for (const l of LESSONS) { for (const w of l.words || []) { const e = lookup(w); if (e) acc.add(e.id); } knownAt[l.id] = new Set(acc); }
}
const cov = [];
const ids = new Set();
for (const r of READINGS.length ? READINGS : []) {
  const where = `lectura ${r.id}`;
  if (ids.has(r.id)) err(where, 'id duplicado'); ids.add(r.id);
  if (!r.paras || !r.questions) { err(where, 'faltan paras o questions'); continue; }
  if (r.after && !(r.after in LESSON_INDEX)) err(where, `after desconocido: ${r.after}`);
  const kset = knownAt[r.after] || new Set();
  let total = 0, ok = 0; const unknown = new Set();
  const sentences = r.paras.flat();
  for (const [jp, es] of sentences) {
    if (!es) warn(where, `oración sin traducción: ${jp}`);
    for (const tok of tokenize(jp)) {
      if (tok.punct) continue;
      if (!tok.entry) { err(where, `palabra desconocida «${tok.raw}» en: ${jp}`); continue; }
      if (!tok.reading && /[一-龯]/.test(tok.surface)) warn(where, `sin lectura: «${tok.raw}»`);
      total++;
      if (tok.entry.pos === 'name' || kset.has(tok.entry.id)) ok++; else unknown.add(tok.entry.w);
    }
  }
  r.questions.forEach((q, i) => {
    const w = `${where} P${i + 1}`;
    if (!['mc', 'tf', 'text'].includes(q.t)) err(w, `tipo desconocido ${q.t}`);
    if (q.t === 'mc' && (q.a < 0 || q.a >= q.opts.length)) err(w, '"a" fuera de rango');
    if (q.t === 'tf' && typeof q.a !== 'boolean') err(w, 'tf necesita a: true/false');
    if (q.t === 'text' && !(q.accept && q.accept.length)) err(w, 'text necesita accept');
    for (const e of [].concat(q.ev ?? [])) if (e < 0 || e >= sentences.length) err(w, `ev ${e} fuera de rango (${sentences.length} oraciones)`);
    for (const t of [q.qjp, ...(q.opts && q.opts.every(hasJp) ? q.opts : [])].filter(Boolean))
      for (const tok of tokenize(t)) if (!tok.punct && !tok.entry) err(w, `palabra desconocida «${tok.raw}»`);
  });
  cov.push([r.id, r.level, r.after, total ? Math.round(100 * ok / total) : 0, total, [...unknown].slice(0, 12).join(' ')]);
}

if (process.argv.includes('--coverage') || cov.length) {
  console.log('\nCobertura de lecturas (palabras conocidas al terminar `after`):');
  for (const [id, lv, after, pct, n, unk] of cov) console.log(`  ${id} N${lv} tras ${after}: ${pct}% de ${n} palabras${unk ? `  · nuevas: ${unk}` : ''}`);
}
const unused = Object.keys(introducedIn).filter(id => !wordUses[id] && ENTRIES[id].pos !== 'name');
if (unused.length) warn('vocab', `palabras introducidas que no aparecen en ningún texto de lección: ${unused.join(' ')}`);

console.log(`\nLecciones con pasos: ${LESSONS.filter(l => STEPS[l.id]).length}/${LESSONS.length} · Lecturas: ${cov.length} · Palabras: ${Object.keys(ENTRIES).length}`);
if (process.argv.includes('-w') || process.argv.includes('--warn')) warns.forEach(w => console.log(w));
else if (warns.length) console.log(`${warns.length} advertencias (usa -w para verlas)`);
errors.forEach(e => console.log(e));
console.log(errors.length ? `\n${errors.length} errores` : '\n✓ Sin errores');
process.exit(errors.length ? 1 : 0);
