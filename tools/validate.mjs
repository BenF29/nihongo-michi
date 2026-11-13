// Valida el contenido: node tools/validate.mjs [--coverage]
// - todas las palabras existen en el diccionario
// - cada lección usa solo palabras ya introducidas (i+1) y, en unidades de kana, solo kana aprendidos
// - estructura de los pasos y preguntas
// - ninguna forma conjugada (買います, 食べて…) aparece antes de la lección que enseña cómo se forma
// - cobertura de vocabulario de cada lectura en el punto del camino indicado por `after`

import { ENTRIES, lookup, tokenize, isPunct, inflectionLabel, masuForm, formTaughtIn, checkAnswer, answerDiff, spoken, sayWord } from '../js/dict.js';
import { KANJI_ALT } from '../js/data/kanji_alt.js';
import { UNITS, LESSONS, LESSON_INDEX, FORM_TAUGHT } from '../js/data/curriculum.js';
import { KANJI } from '../js/data/kanji.js';
import { KANA } from '../js/data/kana.js';
import { STEPS } from '../js/data/lessons/index.js';
import READINGS from '../js/data/readings.js';
import CLIPS from '../js/data/clips.js';
import { BANK } from '../js/data/exam/index.js';
import { UI, unlockIndex } from '../js/data/uitext.js';

const errors = [], warns = [];
const err = (where, msg) => errors.push(`✗ ${where}: ${msg}`);
const warn = (where, msg) => warns.push(`! ${where}: ${msg}`);
const hasJp = s => /[぀-ヿ一-龯]/.test(s);

// ── Diccionario y currículo ──
for (const e of Object.values(ENTRIES)) if (e.dup) err('vocab', `id duplicado: ${e.id}`);
// la tarjeta de cada verbo muestra su forma ます: todos deben poder generarla
for (const e of Object.values(ENTRIES)) if (/^v[135]$/.test(e.pos) && !masuForm(e)) err('vocab', `no se puede formar el ます de ${e.w} (${e.pos})`);
console.assert(['買う', '食べる', '来る', 'する', '帰る'].map(w => masuForm(lookup(w))).join() === '買います,食べます,来ます,します,帰ります', 'masuForm');
// escrituras alternativas con kanji: el corrector las acepta, también conjugadas
for (const id of Object.keys(KANJI_ALT)) if (!ENTRIES[id]) err('kanji_alt', `no existe la entrada: ${id}`);
console.assert(checkAnswer('その映画は面白くないです', 'その 映画 は おもしろくない=おもしろい です 。') === 'exact'
  && checkAnswer('分かりません', 'わかりません=わかる') === 'exact' && checkAnswer('食べます', 'たべます=食べる') === 'exact'
  && !checkAnswer('面黒いです', 'おもしろい です'), 'kanji alternativo');
// error pequeño: marca solo lo que no calzó y dice qué faltó; si el error es grande, nada
{
  const T = 'わたし は がくせい です 。', red = d => d && d.segs.map(([s, b]) => b ? `[${s}]` : s).join('') + '|' + d.tips.join(' ');
  const got = [answerDiff('わたしがくせいです', T), answerDiff('watashi wa kakusei desu', T), answerDiff('きって', 'きっぷ'), answerDiff('がこう', 'がっこう'),
    answerDiff('わたしはがくせいです', T), answerDiff('ねこがすきです', T), answerDiff('<b>', T)].map(red);
  const want = ['わたし[＿]がくせいです|Te faltó «は».', 'わたしわ[か]くせいです|Revisa el dakuten (゛゜): «か» debería ser «が».', 'きっ[て]|«て» debería ser «ぷ».',
    'が[＿]こう|Te faltó la «っ» pequeña.', null, null, null];
  console.assert(got.join('\n') === want.join('\n'), 'answerDiff:\n' + got.join('\n'));
}
// las palabras que pasaron de kana a kanji conservan su audio (se pronuncian desde el kana)
console.assert(spoken('面白くない=おもしろい です') === 'おもしろくないです' && sayWord(lookup('時計')) === 'とけい', 'audio de palabras con id en kana');
const introducedIn = {};
for (const l of LESSONS) {
  if (l.later && (l.words?.length || 0) > 12) warn(l.id, `${l.words.length} palabras en el núcleo (el resto va en later)`);
  for (const w of [...(l.words || []), ...(l.later || [])]) {
    const e = lookup(w);
    if (!e) { err(l.id, `palabra del currículo no está en vocab: ${w}`); continue; }
    if (introducedIn[e.id]) err(l.id, `${w} ya se introduce en ${introducedIn[e.id]}`);
    introducedIn[e.id] = l.id;
  }
  for (const k of l.kanji || '') if (!KANJI[k]) err(l.id, `kanji sin datos en kanji.js: ${k}`);
  for (const k of l.kana || '') if (!KANA[k]) err(l.id, `kana desconocido: ${k}`);
  if (!STEPS[l.id]) warn(l.id, 'sin pasos todavía');
}

for (const m of Object.values(FORM_TAUGHT)) for (const id of Object.values(m)) if (!(id in LESSON_INDEX)) err('validador', `FORM_TAUGHT apunta a una lección inexistente: ${id}`);
// Devuelve la lección donde se enseña la forma de este token, si todavía no se enseñó en `li`
function formNotYet(tok, li) {
  const at = formTaughtIn(tok);
  return at && LESSON_INDEX[at] > li ? [tok.label || inflectionLabel(tok.surface, tok.entry), at] : null;
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
  if (s.t === 'transform' || s.t === 'answer') [].concat(s.a ?? []).forEach(add);
  if (s.t === 'error') add(s.fix);
  if (s.t === 'answer') [].concat(s.pat ?? []).forEach(add);
  add(s.qjp);
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
    case 'transform': need('q', 'jp', 'a'); break;
    case 'error':
      need('jp', 'bad', 'fix');
      if (s.jp && s.bad && !tokenize(s.jp).some(t => t.surface === s.bad)) err(where, `"bad" «${s.bad}» no es un token de jp`);
      break;
    case 'answer':
      need('jp', 'pat', 'a');
      if (s.a && !Array.isArray(s.a)) err(where, '"a" debe ser una lista de respuestas modelo');
      break;
    case 'part': need('title'); break;
    case 'words': case 'kana': case 'kanji': case 'kanaquiz': case 'auto': break;
    default: err(where, `tipo de paso desconocido: ${s.t}`);
  }
  if (typeof s.q === 'string' && s.q.startsWith('@') && !UI[s.q.slice(1)]) err(where, `plantilla desconocida: ${s.q}`);
}

// ── Lecciones ──
const known = new Set();
const knownKana = new Set();
let wordUses = {}, laterPrev = [];
for (const l of LESSONS) {
  for (const w of [...(l.words || []), ...laterPrev]) { const e = lookup(w); if (e) known.add(e.id); }
  laterPrev = l.later || [];
  for (const k of l.kana || '') knownKana.add(k);
  const kanaUnit = l.unit === 'u1' || l.unit === 'u2';
  const steps = STEPS[l.id] || [];
  steps.forEach((s, i) => {
    const where = `${l.id}#${i}(${s.t})`;
    checkStep(where, s);
    for (const text of jpTexts(s)) {
      const isError = s.t === 'error' && text === s.jp;
      for (const tok of tokenize(text)) {
        if (tok.punct || tok.blank) continue;
        if (!tok.entry) { err(where, `palabra desconocida «${tok.raw}» en: ${text}`); continue; }
        const nf = !isError && formNotYet(tok, LESSON_INDEX[l.id]);
        if (nf) err(where, `«${tok.surface}» (${nf[0]}) se usa antes de enseñar cómo se forma (${nf[1]})`);
        if (tok.entry.pos !== 'name' && !known.has(tok.entry.id)) {
          const at = introducedIn[tok.entry.id];
          const lat = LESSONS[LESSON_INDEX[at]]?.later?.some(w => lookup(w)?.id === tok.entry.id);
          err(where, `«${tok.raw}» aún no se enseña${at ? lat ? ` (está en later de ${at}: solo se puede usar desde la lección siguiente)` : ` (se introduce en ${at})` : ' (no está en ninguna lección)'}`);
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
  for (const l of LESSONS) { for (const w of [...(l.words || []), ...(l.later || [])]) { const e = lookup(w); if (e) acc.add(e.id); } knownAt[l.id] = new Set(acc); }
}
const cov = [];
const ids = new Set();
for (const r of [...READINGS, ...CLIPS]) {
  const clip = CLIPS.includes(r);
  const where = `${clip ? 'clip' : 'lectura'} ${r.id}`;
  if (ids.has(r.id)) err(where, 'id duplicado'); ids.add(r.id);
  if (!r.paras || !r.questions) { err(where, 'faltan paras o questions'); continue; }
  if (r.after && !(r.after in LESSON_INDEX)) err(where, `after desconocido: ${r.after}`);
  if (clip) {
    if (!/^[\w-]{11}$/.test(r.yt || '')) err(where, `yt no es un id de video de YouTube: ${r.yt}`);
    if (!(r.from >= 0 && r.from < r.to)) err(where, 'from y to deben ser segundos, con from < to');
    if (!r.after || !r.src || !r.es) err(where, 'faltan after, src o es');
    if (r.questions.some(q => q.t !== 'mc')) err(where, 'los clips solo admiten preguntas mc');
  }
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

// ── Simulacro ──
const EXAM_TYPES = { moji1: 4, moji2: 4, goi3: 4, goi4: 4, bunpo1: 4, bunpo2: 0, bunpo3: 0, dokkai4: 0, dokkai5: 0, dokkai6: 0, chokai1: 4, chokai2: 4, chokai3: 3, chokai4: 3 };
const PLAIN_OPTS = new Set(['moji1', 'moji2']);
const examIds = new Set();
let examN = 0;
function examText(where, text) {
  if (typeof text !== 'string' || !text.trim()) { err(where, 'texto vacío'); return []; }
  const toks = tokenize(text);
  for (const tok of toks) {
    if (tok.punct || tok.blank) continue;
    if (!tok.entry) { err(where, `palabra desconocida «${tok.raw}» en: ${text}`); continue; }
    if (tok.entry.pos !== 'name' && !introducedIn[tok.entry.id]) err(where, `«${tok.raw}» no se enseña en el camino`);
    if (!tok.reading && /[一-龯]/.test(tok.surface)) warn(where, `sin lectura: «${tok.raw}»`);
  }
  return toks;
}
function examChoice(where, q, n, plain) {
  if (!Array.isArray(q.opts)) { err(where, 'faltan opts'); return; }
  if (n && q.opts.length !== n) err(where, `se esperaban ${n} opciones, hay ${q.opts.length}`);
  if (new Set(q.opts).size !== q.opts.length) err(where, 'opciones repetidas');
  if (!(q.a >= 0 && q.a < q.opts.length)) err(where, '"a" fuera de rango');
  if (!plain) q.opts.forEach(o => examText(where, o));
  if (!q.why) warn(where, 'sin why');
}
for (const [type, items] of Object.entries(BANK)) {
  if (!(type in EXAM_TYPES)) { err('examen', `tipo desconocido ${type}`); continue; }
  for (const it of items) {
    examN++;
    const where = `examen ${it.id || type}`;
    if (!it.id) err(where, 'falta id');
    else if (examIds.has(it.id)) err(where, 'id duplicado'); else examIds.add(it.id);
    if (!it.ref || !(it.ref in LESSON_INDEX)) err(where, `ref inválido: ${it.ref}`);
    switch (type) {
      case 'moji1': case 'moji2': case 'goi3': case 'goi4': case 'bunpo1': {
        const toks = examText(where, it.jp);
        if (it.u && !toks.some(t => t.raw === it.u)) err(where, `u «${it.u}» no es un token de jp`);
        if ((type === 'moji1' || type === 'moji2') && !it.u) err(where, 'falta u (palabra subrayada)');
        if ((type === 'goi3' || type === 'bunpo1') && !toks.some(t => t.blank)) err(where, 'falta ＿');
        examChoice(where, it, EXAM_TYPES[type], PLAIN_OPTS.has(type));
        break;
      }
      case 'bunpo2': {
        if (!Array.isArray(it.pieces) || it.pieces.length !== 4) { err(where, 'pieces debe tener 4 elementos'); break; }
        [it.pre, it.post, ...it.pieces].filter(Boolean).forEach(t => examText(where, t));
        if (!(it.star >= 0 && it.star < 4)) err(where, 'star fuera de rango');
        const o = it.order || [];
        if (o.length !== 4 || [...o].sort().join() !== '0,1,2,3') err(where, 'order debe ser una permutación de 0–3');
        else if (o.join() === '0,1,2,3') err(where, 'order no puede ser el orden correcto');
        if (new Set(it.pieces).size !== 4) err(where, 'piezas repetidas');
        break;
      }
      case 'bunpo3': {
        const blanks = (it.paras || []).reduce((n, p) => n + examText(where, p).filter(t => t.blank).length, 0);
        if (!it.gaps || blanks !== it.gaps.length) err(where, `${blanks} huecos y ${it.gaps?.length || 0} gaps`);
        (it.gaps || []).forEach((g, i) => examChoice(`${where} hueco ${i + 1}`, g, 4));
        if (!it.es) warn(where, 'sin traducción');
        break;
      }
      case 'dokkai4': case 'dokkai5': case 'dokkai6': {
        const sents = (it.paras || []).map(([j, es]) => { examText(where, j); if (!es) warn(where, `oración sin traducción: ${j}`); return j; });
        if (it.title) examText(where, it.title);
        if (it.table) { (it.table.cols || []).forEach(c => examText(where, c)); (it.table.rows || []).forEach(r => r.forEach(c => examText(where, c))); }
        if (!it.questions?.length) err(where, 'sin preguntas');
        (it.questions || []).forEach((q, i) => {
          const w = `${where} P${i + 1}`;
          examText(w, q.qjp);
          examChoice(w, q, 4);
          for (const e of [].concat(q.ev ?? [])) if (e < 0 || e >= sents.length) err(w, `ev ${e} fuera de rango`);
        });
        break;
      }
      case 'chokai1': case 'chokai2': case 'chokai3': case 'chokai4': {
        if (it.intro) examText(where, it.intro);
        if (it.qjp) examText(where, it.qjp); else if (type !== 'chokai4') err(where, 'falta qjp');
        if (type !== 'chokai3' && !it.lines?.length) err(where, 'falta lines');
        (it.lines || []).forEach(([who, j]) => { if (!who) err(where, 'línea sin hablante'); examText(where, j); });
        if (type === 'chokai3' && !it.scene) err(where, 'falta scene');
        if ((type === 'chokai1' || type === 'chokai2') && !it.es) warn(where, 'sin traducción del diálogo');
        examChoice(where, it, EXAM_TYPES[type]);
        break;
      }
    }
  }
}

if (process.argv.includes('--coverage') || cov.length) {
  console.log('\nCobertura de lecturas (palabras conocidas al terminar `after`):');
  for (const [id, lv, after, pct, n, unk] of cov) console.log(`  ${id} ${lv ? 'N' + lv : 'clip'} tras ${after}: ${pct}% de ${n} palabras${unk ? `  · nuevas: ${unk}` : ''}`);
}
// las `later` se aprenden en el repaso: no hace falta que aparezcan en las lecciones
const laterIds = new Set(LESSONS.flatMap(l => (l.later || []).map(w => lookup(w)?.id)));
const unused = Object.keys(introducedIn).filter(id => !wordUses[id] && ENTRIES[id].pos !== 'name' && !laterIds.has(id));
if (unused.length) warn('vocab', `palabras introducidas que no aparecen en ningún texto de lección: ${unused.join(' ')}`);

console.log(`\nLecciones con pasos: ${LESSONS.filter(l => STEPS[l.id]).length}/${LESSONS.length} · Lecturas: ${READINGS.length} · Clips: ${CLIPS.length} · Palabras: ${Object.keys(ENTRIES).length} · Preguntas de examen: ${examN}`);
// ── Textos de la interfaz: todos deben poder pasar a japonés ──
const uiAt = Object.entries(UI).map(([k, u]) => [k, u, unlockIndex(u.jp)]);
for (const [k, u, at] of uiAt) if (at < 0) err('interfaz', `${k}: «${u.jp}» usa palabras que no están en el camino`);
if (process.argv.includes('--ui')) {
  console.log('\nCuándo pasa a japonés cada texto de la interfaz:');
  for (const [k, u, at] of uiAt.sort((a, b) => a[2] - b[2])) console.log(`  ${at < 0 ? '—' : LESSONS[at].id.padEnd(6)}  ${k.padEnd(18)} ${u.es}  →  ${u.jp}`);
}
if (process.argv.includes('-w') || process.argv.includes('--warn')) warns.forEach(w => console.log(w));
else if (warns.length) console.log(`${warns.length} advertencias (usa -w para verlas)`);
errors.forEach(e => console.log(e));
console.log(errors.length ? `\n${errors.length} errores` : '\n✓ Sin errores');
process.exit(errors.length ? 1 : 0);
