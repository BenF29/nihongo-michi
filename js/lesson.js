// Reproductor de lecciones, pruebas de unidad y sesiones de repaso.
//
// Principios aplicados (ver docs/METODOLOGIA.md):
//  - Recuperación activa con feedback inmediato y explicativo (testing effect).
//  - Presentación concentrada de palabras nuevas, luego práctica intercalada con repaso de lecciones previas.
//  - Los errores vuelven al final de la cola hasta acertarlos.

import { LESSONS, LESSON_INDEX, UNITS } from './data/curriculum.js';
import { STEPS } from './data/lessons/index.js';
import { KANA, splitKana } from './data/kana.js';
import { KANJI } from './data/kanji.js';
import { ENTRIES, lookup, tokenize, toRomaji, normRomaji, toHira, isKana, sayWord, tokSay, voiceOf, checkAnswer, toKanaInput, textReading, looseKana, answerForms, answerDiff, masuForm } from './dict.js';
import * as S from './state.js';
import READINGS from './data/readings.js';
import { speak, stopSpeaking } from './tts.js';
import { esc, diffHtml, $, $$, shuffle, pick, hasJp, jp, rich, audioBtn, sayBtn, spoken, sfx, POS, romajiOf, closePop } from './ui.js';
import { t } from './uitext.js';

// Enunciado de una pregunta: '@clave' usa una plantilla de uitext.js (pasa a japonés con el avance)
const qlab = (q, def) => q?.startsWith('@') ? t(q.slice(1)) : q ? rich(q) : t(def);

// ───── Conjuntos de referencia según el currículo ─────
const wordsUpTo = (() => {
  const cache = {};
  return i => {
    if (cache[i]) return cache[i];
    const s = [];
    for (const l of LESSONS.slice(0, i + 1)) for (const w of [...(l.words || []), ...(l.later || [])]) { const e = lookup(w); if (e) s.push(e); }
    return (cache[i] = s);
  };
})();
const kanaUpTo = (i, script) => {
  const out = [];
  for (const l of LESSONS.slice(0, i + 1)) for (const k of splitKana(l.kana || '')) if (KANA[k] && KANA[k].script === script && k !== 'ー' && !/^[っッ]$/.test(k)) out.push(k);
  return out;
};
const entriesOf = l => (l.words || []).map(lookup).filter(Boolean);

// ───── Generadores de preguntas ─────
// similar: preferir palabras parecidas en forma y sonido (買う／会う／言う), para que no se descarten a ojo
function distractors(e, pool, n, field, similar) {
  const same = pool.filter(x => x.id !== e.id && x.pos !== 'name' && x[field] !== e[field] && x.es !== e.es);
  const pref = same.filter(x => x.pos === e.pos);
  const kana = new Set(e.r);
  const score = x => (x.pos === e.pos ? 3 : 0) + (x.r.at(-1) === e.r.at(-1) ? 2 : 0) + [...new Set(x.r)].filter(c => kana.has(c)).length
    - Math.abs(x.r.length - e.r.length) / 2 + Math.random() * 1.5;
  const order = similar ? same.map(x => [x, score(x)]).sort((a, b) => b[1] - a[1]).map(x => x[0]) : [...shuffle(pref), ...shuffle(same)];
  const out = []; const seen = new Set([e[field]]);
  for (const x of order) {
    if (out.length >= n) break;
    if (!seen.has(x[field])) { seen.add(x[field]); out.push(x); }
  }
  return out;
}
const wordHtml = (e, big) => jp(e.w === e.r || /[゠-ヿ]/.test(e.w) ? e.r : e.w, { cls: big ? 'big' : '', plain: !big });

function qJpToEs(e, pool, srs, similar) {
  const ds = distractors(e, pool, 3, 'es', similar);
  return { kind: 'choice', srs, prompt: `<div class="qlabel">${t('q.meaning')}</div><div class="qjp">${wordHtml(e, true)} ${sayBtn(sayWord(e))}</div>`,
    say: sayWord(e), opts: shuffle([e, ...ds]).map(x => ({ key: x.id, html: esc(x.es) })), answer: e.id,
    why: `${esc(e.w)}${e.w !== e.r ? ` (${esc(e.r)})` : ''} = <b>${esc(e.es)}</b>` };
}
function qEsToJp(e, pool, srs, similar) {
  const ds = distractors(e, pool, 3, 'r', similar);
  return { kind: 'choice', srs, prompt: `<div class="qlabel">${t('q.say')}</div><div class="qes">«${esc(e.es)}»</div>`,
    opts: shuffle([e, ...ds]).map(x => ({ key: x.id, html: wordHtml(x), say: sayWord(x) })), answer: e.id,
    why: `«${esc(e.es)}» = <span lang="ja">${esc(e.w)}</span>${e.w !== e.r ? ` (${esc(e.r)})` : ''}`, after: sayWord(e) };
}
function qListenWord(e, pool, srs, similar) {
  // solo se escucha: excluir homófonos (語／五, 花／鼻), que suenan idéntico y harían la pregunta ambigua
  const ds = distractors(e, pool.filter(x => toHira(x.r) !== toHira(e.r)), 3, 'es', similar);
  return { kind: 'choice', srs, listen: sayWord(e), prompt: `<div class="qlabel">${t('q.listenMeaning')}</div>${listenBox(sayWord(e))}`,
    opts: shuffle([e, ...ds]).map(x => ({ key: x.id, html: esc(x.es) })), answer: e.id,
    why: `Era <span lang="ja">${esc(e.w)}</span> (${esc(e.r)}) = <b>${esc(e.es)}</b>` };
}
const listenBox = text => `<div class="listen"><button class="play big" data-say="${esc(text)}">🔊</button><button class="play slow" data-slow="${esc(text)}" title="Más lento">🐢</button></div>`;

function qKana(k, pool, type) {
  const r = KANA[k].r;
  const others = pick(pool.filter(x => x !== k && KANA[x].r !== r), 3);
  if (type === 'k2r') return { kind: 'choice', prompt: `<div class="qlabel">${t('q.read')}</div><div class="kana-big" lang="ja">${k}</div>`,
    opts: shuffle([k, ...others]).map(x => ({ key: x, html: esc(KANA[x].r) })), answer: k, why: `${k} = <b>${r}</b>. ${esc(KANA[k].m || '')}`, after: k };
  if (type === 'r2k') return { kind: 'choice', prompt: `<div class="qlabel">¿Cuál es <b>${esc(r)}</b>?</div>`,
    opts: shuffle([k, ...others]).map(x => ({ key: x, html: `<span class="kana-opt" lang="ja">${x}</span>` })), answer: k, why: `${esc(r)} = ${k}. ${esc(KANA[k].m || '')}`, after: k };
  if (type === 'listen') return { kind: 'choice', listen: k, prompt: `<div class="qlabel">Escucha: ¿qué carácter es?</div>${listenBox(k)}`,
    opts: shuffle([k, ...others]).map(x => ({ key: x, html: `<span class="kana-opt" lang="ja">${x}</span>` })), answer: k, why: `Sonaba <b>${esc(r)}</b>: ${k}` };
  return { kind: 'type', prompt: `<div class="qlabel">Escribe en romaji</div><div class="kana-big" lang="ja">${k}</div>`, answers: [r], kanaAnswer: k, why: `${k} = <b>${r}</b>`, say: k };
}
function qTypeReading(text, why) {
  const toks = tokenize(text);
  const reading = toks.filter(t => !t.punct).map(t => t.reading || t.surface).join('');
  const roma = toks.filter(t => !t.punct).map(t => t.entry ? romajiOf(t.entry, t.reading) : toRomaji(t.surface)).join('');
  return { kind: 'type', prompt: `<div class="qlabel">¿Cómo se lee? Escríbelo en romaji</div><div class="qjp">${jp(text, { cls: 'big' })}</div>`,
    answers: [roma, toRomaji(reading)], kanaAnswer: reading, why: why || `Se lee <b>${esc(roma)}</b>`, say: spoken(text) };
}
function qKanji(k, pool) {
  const K = KANJI[k];
  const others = pick(pool.filter(x => x !== k && KANJI[x] && KANJI[x].es !== K.es), 3);
  return { kind: 'choice', prompt: `<div class="qlabel">${t('q.kanji')}</div><div class="kanji-big" lang="ja">${k}</div>`,
    opts: shuffle([k, ...others]).map(x => ({ key: x, html: esc(KANJI[x].es) })), answer: k, why: `${k} = <b>${esc(K.es)}</b>. ${esc(K.mn)}` };
}
function buildItem(s) {
  const ans = tokenize(s.jp).filter(t => !t.punct);
  const extra = (s.extra || []).map(x => tokenize(x)[0]);
  return { kind: 'build', es: s.es, target: ans.map(t => t.surface).join(''), alt: (s.alt || []).map(a => tokenize(a).filter(t => !t.punct).map(t => t.surface).join('')),
    tiles: shuffle([...ans, ...extra].map((t, i) => ({ i, raw: t.raw }))), jpText: s.jp, why: rich(s.why) };
}
// Producción: escribir la oración en japonés (kana, kanji o romaji). Las fichas quedan como ayuda.
function qWrite(s) {
  return { kind: 'write', prompt: `<div class="qlabel">✍️ ${t('q.write')}</div><div class="qes">«${rich(s.es)}»</div>`,
    targets: [s.jp, ...(s.alt || [])], jpText: s.jp, why: rich(s.why), after: spoken(s.jp), hint: buildItem({ ...s, extra: [] }) };
}
function qWriteWord(e, srs) {
  const shown = e.w === e.r || /[\u30a0-\u30ff]/.test(e.w) ? e.r : e.w;
  return { kind: 'write', srs, prompt: `<div class="qlabel">✍️ ${t('q.sayWrite')}</div><div class="qes">«${esc(e.es)}»</div>`,
    targets: [`${e.w}=${e.id}`], jpText: `${shown}=${e.id}`, after: sayWord(e),
    why: `«${esc(e.es)}» = <span lang="ja">${esc(e.w)}</span>${e.w !== e.r ? ` (${esc(e.r)})` : ''}` };
}
// Dictado: escuchar y escribir
function qDictation(text, es) {
  return { kind: 'write', listen: spoken(text), prompt: `<div class="qlabel">🎧 ${t('q.dictation')}</div>${listenBox(spoken(text))}`,
    targets: [text], jpText: text, why: es ? `«${rich(es)}»` : '', hint: buildItem({ jp: text, es: es || '' }) };
}
// Oraciones de una lección aptas para dictado (cortas y con traducción)
function sentencesOf(steps) {
  const out = [];
  const add = (j, es) => { if (j && es && !j.includes('＿')) { const n = tokenize(j).filter(t => !t.punct).length; if (n >= 2 && n <= 8) out.push([j, es]); } };
  for (const s of steps) {
    (s.ex || []).forEach(([j, es]) => add(j, es));
    (s.lines || []).forEach(([, j, es]) => add(j, es));
    if (s.t === 'build') add(s.jp, s.es);
  }
  return out;
}
// Desde la unidad 4 las fichas se van retirando: armar oraciones pasa a escribirlas
const U4 = LESSON_INDEX.u4l1, U6 = LESSON_INDEX.u6l1;
function produceRatio(li) { return li < U4 ? 0 : li < U6 ? 0.5 : 0.75; }

function qMatch(pairs) {
  return { kind: 'match', pairs: pairs.map(([a, b, say]) => ({ a, b, say })) };
}

// Pasos de contenido escritos a mano → elementos de la cola
function fromAuthored(s) {
  switch (s.t) {
    case 'mc': {
      const optsJp = s.opts.every(hasJp);
      const optHtml = o => s.kana ? `<span class="kana-opt" lang="ja">${esc(o)}</span>` : optsJp ? jp(o, { plain: true }) : rich(o);
      return { kind: 'choice', prompt: `<div class="qlabel">${s.qjp ? `<span title="${esc(s.q)}">${jp(s.qjp)}</span>` : qlab(s.q)}</div>${s.jp ? `<div class="qjp">${jp(s.jp, { cls: 'mid' })} ${audioBtn(s.jp)}</div>` : ''}`,
        say: s.jp ? spoken(s.jp) : null,
        opts: s.opts.map((o, i) => ({ key: i, html: optHtml(o), say: optsJp && !s.kana ? spoken(o) : null })), answer: s.a, why: rich(s.why), shuffle: s.shuffle !== false };
    }
    case 'listen':
      return { kind: 'choice', listen: spoken(s.jp), prompt: `<div class="qlabel">${qlab(s.q, 'q.listen')}</div>${listenBox(spoken(s.jp))}`,
        opts: s.opts.map((o, i) => ({ key: i, html: hasJp(o) ? jp(o, { plain: true }) : rich(o) })), answer: s.a,
        why: `${jp(s.jp)}${s.why ? '<br>' + rich(s.why) : ''}`, shuffle: true };
    case 'fill':
      return { kind: 'choice', fill: s.jp, prompt: `<div class="qlabel">${qlab(s.q, 'q.fill')}</div><div class="qjp fillq">${jp(s.jp, { cls: 'mid', blank: '<span class="blank" data-blank>　</span>' })}</div>${s.es ? `<div class="qes small">${rich(s.es)}</div>` : ''}`,
        opts: s.opts.map((o, i) => ({ key: i, html: jp(o, { plain: true }), raw: o })), answer: s.a, why: rich(s.why), shuffle: true,
        after: spoken(s.jp.replace('＿', s.opts[s.a])) };
    case 'build':
      return buildItem(s);
    case 'write':
      return qWrite(s);
    case 'dictation':
      return qDictation(s.jp, s.es);
    case 'match':
      return qMatch(s.pairs.map(([a, b]) => [a, b, spoken(a)]));
    case 'type':
      return qTypeReading(s.jp, s.why ? rich(s.why) : null);
    // Transformar: dada una forma, escribir otra (読む → 読みます)
    case 'transform':
      return { kind: 'write', prompt: `<div class="qlabel">✍️ ${qlab(s.q)}</div><div class="qjp">${jp(s.jp, { cls: 'big' })} ${audioBtn(s.jp)}</div>${s.es ? `<div class="qes small">${rich(s.es)}</div>` : ''}`,
        targets: [s.a, ...(s.alt || [])], jpText: s.a, why: rich(s.why), after: spoken(s.a) };
    case 'error':
      return { kind: 'pick', jpText: s.jp, bad: s.bad, fix: s.fix, es: s.es, why: rich(s.why), after: spoken(s.fix) };
    // Responder una pregunta en japonés con palabras propias; pat = estructura con la que debe terminar
    case 'answer':
      return { kind: 'write', prompt: `<div class="qlabel">💬 ${t('q.answer')}</div><div class="qjp">${jp(s.jp, { cls: 'mid' })} ${audioBtn(s.jp)}</div>`,
        say: spoken(s.jp), pat: s.pat, targets: s.a, jpText: s.a[0], why: rich(s.why) };
  }
  return null;
}

// Construye la cola completa de una lección
function buildLessonQueue(lesson) {
  const li = LESSON_INDEX[lesson.id];
  const steps = STEPS[lesson.id] || defaultSteps(lesson);
  const newE = entriesOf(lesson);
  const pool = wordsUpTo(li);
  const prior = wordsUpTo(li - 1);
  const script = lesson.unit === 'u2' ? 'kata' : 'hira';
  const lessonKana = splitKana(lesson.kana || '').filter(k => KANA[k] && k !== 'ー');
  const kanaPool = kanaUpTo(li, script);
  const q = [];
  let matched = false, builds = 0;
  const ratio = S.lessonDone(lesson.id) ? 1 : produceRatio(li);
  const dict = shuffle(sentencesOf(steps));
  // Tramos: los marca el autor con { t: 'part' }; si no, empieza uno en cada explicación (sin dejar tramos de menos de 6 pasos)
  const explicit = steps.some(s => s.t === 'part');
  const parts = [];
  for (const s of steps) {
    if (s.t === 'part') { parts.push({ at: q.length, title: s.title }); continue; }
    if (!explicit && s.t === 'teach' && (!parts.length || q.length - parts.at(-1).at >= 6)) parts.push({ at: q.length, title: s.title });
    if (s.t === 'build' && ratio > 0) {
      builds++;
      q.push((builds % 4) / 4 < ratio || ratio === 1 ? qWrite(s) : buildItem(s));
      continue;
    }
    if (s.t === 'teach' || s.t === 'dialog') { q.push({ kind: s.t, step: s }); continue; }
    if (s.t === 'kana') {
      const chars = s.chars ? splitKana(s.chars) : lessonKana;
      const simple = chars.filter(k => !/^[っッ]$/.test(k));
      for (let i = 0; i < chars.length; i += 3) {
        const grp = chars.slice(i, i + 3);
        grp.forEach(k => q.push({ kind: 'kanaCard', k }));
        grp.filter(k => simple.includes(k)).forEach(k => q.push(qKana(k, kanaPool, 'k2r')));
      }
      continue;
    }
    if (s.t === 'kanaquiz') {
      const n = s.n || 10;
      const olderK = kanaPool.filter(k => !lessonKana.includes(k));
      const lk = lessonKana.filter(k => !/^[っッ]$/.test(k));
      const types = ['k2r', 'r2k', 'type', 'listen', 'k2r', 'type'];
      for (let i = 0; i < n; i++) {
        const fromOld = olderK.length && Math.random() < 0.3;
        const k = fromOld ? pick(olderK, 1)[0] : lk[i % lk.length];
        q.push(qKana(k, kanaPool, types[i % types.length]));
      }
      // leer palabras de la lección
      for (const e of pick(newE, Math.min(3, newE.length))) q.push(qTypeReading(e.r, `<span lang="ja">${esc(e.r)}</span> = ${esc(toRomaji(e.r))} · «${esc(e.es)}»`));
      continue;
    }
    if (s.t === 'words') {
      const list = s.ids ? s.ids.map(lookup).filter(Boolean) : newE;
      for (let i = 0; i < list.length; i += 3) {
        const grp = list.slice(i, i + 3);
        grp.forEach(e => q.push({ kind: 'wordCard', e }));
        shuffle(grp).forEach(e => q.push(qJpToEs(e, pool)));
      }
      continue;
    }
    if (s.t === 'kanji') {
      const chars = [...(s.chars || lesson.kanji || '')].filter(k => KANJI[k]);
      const kpool = LESSONS.slice(0, li + 1).flatMap(l => [...(l.kanji || '')]).filter(k => KANJI[k]);
      for (let i = 0; i < chars.length; i += 3) {
        const grp = chars.slice(i, i + 3);
        grp.forEach(k => q.push({ kind: 'kanjiCard', k }));
        grp.forEach(k => q.push(qKanji(k, kpool)));
      }
      continue;
    }
    if (s.t === 'auto') {
      const n = s.n || 6;
      if (!matched && newE.length >= 4) { matched = true; q.push(qMatch(pick(newE, Math.min(5, newE.length)).map(e => [e.w === e.r || /[゠-ヿ]/.test(e.w) ? e.r : e.w, e.es, sayWord(e)]))); }
      const review = reviewCandidates(prior, 3);
      const gens = [qEsToJp, qListenWord, qJpToEs];
      let ni = 0, ri = 0;
      for (let i = 0; i < n; i++) {
        if (review.length && i % 3 === 2 && ri < review.length) q.push(gens[i % 3](review[ri++], pool));
        else if (newE.length) { const e = newE[(ni++ + Math.floor(Math.random() * newE.length)) % newE.length]; q.push(gens[i % 3](e, pool)); }
        else if (review.length) q.push(gens[i % 3](review[ri++ % review.length], pool));
      }
      // producción de vocabulario y dictado desde «Primeros pasos»
      if (li >= LESSON_INDEX.u3l1 && newE.length) q.push(qWriteWord(pick(newE, 1)[0]));
      if (li >= LESSON_INDEX.u3l2 && dict.length) { const [j, es] = dict.pop(); q.push(qDictation(j, es)); }
      continue;
    }
    const it = fromAuthored(s);
    if (it) q.push(it);
  }
  if (!parts.length || parts[0].at > 0) parts.unshift({ at: 0, title: lesson.title });
  q.forEach((it, i) => { it.part = parts.findLastIndex(p => p.at <= i); });
  q.parts = parts.map(p => p.title);
  return q;
}

// Lección sin pasos escritos: generar una a partir del currículo
function defaultSteps(l) {
  const st = [];
  if (l.kana) st.push({ t: 'kana' }, { t: 'kanaquiz', n: 10 });
  if (l.kanji) st.push({ t: 'kanji' });
  if (l.words?.length) st.push({ t: 'words' }, { t: 'auto', n: 8 });
  return st;
}

// Palabras de lecciones anteriores para repasar: prioriza las débiles del usuario
function reviewCandidates(prior, n) {
  const p = S.me();
  const scored = prior.filter(e => e.pos !== 'name').map(e => {
    const w = p?.words[e.id];
    return [e, w ? (w.box + (w.due > Date.now() ? 2 : 0)) + Math.random() * 2 : 1 + Math.random() * 3];
  });
  return scored.sort((a, b) => a[1] - b[1]).slice(0, n).map(x => x[0]);
}

// Prueba de unidad: muestra de preguntas de todas sus lecciones
function buildTestQueue(unit) {
  const ui = UNITS.indexOf(unit);
  const last = unit.lessons[unit.lessons.length - 1];
  const li = LESSON_INDEX[last.id];
  const pool = wordsUpTo(li);
  const q = [];
  for (const l of unit.lessons) {
    const steps = STEPS[l.id] || [];
    const auth = steps.filter(s => ['mc', 'fill', 'build', 'listen'].includes(s.t));
    pick(auth, 3).forEach(s => { const it = s.t === 'build' && LESSON_INDEX[l.id] >= U4 ? qWrite(s) : fromAuthored(s); if (it) q.push(it); });
    const es = entriesOf(l);
    pick(es, 2).forEach((e, i) => q.push((i ? qEsToJp : qJpToEs)(e, pool)));
    if (l.kana) {
      const script = unit.id === 'u2' ? 'kata' : 'hira';
      const kp = kanaUpTo(LESSON_INDEX[l.id], script);
      pick(splitKana(l.kana).filter(k => KANA[k] && !/^[っッー]$/.test(k)), 3).forEach((k, i) => q.push(qKana(k, kp, ['k2r', 'r2k', 'type'][i % 3])));
    }
    if (l.kanji) pick([...l.kanji], 1).forEach(k => q.push(qKanji(k, [...l.kanji])));
  }
  return pick(q, Math.min(16, q.length));
}

function buildReviewQueue(ids) {
  const pool = [...S.knownWords()].map(id => ENTRIES[id]).filter(Boolean);
  const big = pool.length >= 4 ? pool : [...pool, ...wordsUpTo(LESSONS.length - 1)];
  const gens = [qJpToEs, qEsToJp, qListenWord];
  const p = S.me();
  // Las alternativas se muestran solo después de pensar la respuesta, y se parecen a la correcta
  return ids.flatMap((id, i) => [
    ...(p?.words[id]?.fresh ? [{ kind: 'wordCard', e: ENTRIES[id] }] : []),
    // segundos para elegir una vez vistas las alternativas: leer cuatro opciones en kana toma más que en español
    p?.words[id]?.box >= 3 && i % 2 === 0 ? qWriteWord(ENTRIES[id], id) : { ...gens[i % 3](ENTRIES[id], big, id, true), think: true, secs: gens[i % 3] === qEsToJp ? 6 : 4 }]);
}

// ───── Reproductor ─────
// Huella del contenido: un avance guardado solo se retoma si la lección no cambió desde entonces
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);

// Lo que se guarda al salir a mitad de camino: la cola (con sus elementos únicos) y los contadores
const runId = (mode, lesson, unit) => mode === 'lesson' ? lesson.id : mode === 'test' ? 'test:' + unit.id : null;
export const savedRun = (mode, lesson, unit) => {
  const id = runId(mode, lesson, unit);
  const r = id && S.loadRun(id);
  return r && r.fp === fingerprint(mode, lesson, unit) ? r : null;
};
function fingerprint(mode, lesson, unit) {
  return hash(JSON.stringify(mode === 'lesson' ? [STEPS[lesson.id], lesson.words, lesson.later] : unit.lessons.map(l => STEPS[l.id])));
}

export function play(root, { mode, lesson, unit, ids, onExit, fresh }) {
  const rid = runId(mode, lesson, unit);
  if (rid && fresh) S.clearRun(rid);
  const saved = rid && !fresh ? savedRun(mode, lesson, unit) : null;
  let queue;
  if (saved) queue = saved.order.map(k => saved.items[k]);
  else if (mode === 'lesson') queue = buildLessonQueue(lesson);
  else if (mode === 'test') queue = buildTestQueue(unit);
  else queue = buildReviewQueue(ids);
  const parts = saved ? saved.parts : queue.parts || [];

  const MAX_MISTAKES = 3;
  const st = { i: 0, xp: 0, asked: new Set(), firstOk: 0, mistakes: 0, retried: new Set(), missed: [], totalQ: queue.filter(isQ).length };
  if (saved) {
    Object.assign(st, saved.st);
    st.asked = new Set(saved.asked.map(k => saved.items[k]));
    st.retried = new Set(saved.retried.map(k => saved.items[k]));
  }
  function persist() {
    if (!rid) return;
    const items = [...new Set(queue)], ix = new Map(items.map((x, k) => [x, k]));
    const { asked, retried, ...rest } = st;
    S.saveRun(rid, { fp: fingerprint(mode, lesson, unit), at: Date.now(), items, order: queue.map(x => ix.get(x)), parts,
      asked: [...asked].map(x => ix.get(x)), retried: [...retried].map(x => ix.get(x)), st: rest });
  }

  root.innerHTML = `
    <div class="player">
      <header class="ph">
        <button class="icon close" aria-label="Salir">✕</button>
        <div class="bar"><i></i></div>
        <div class="ptag" aria-live="polite"></div>
      </header>
      <main class="pbody" aria-live="polite"></main>
      <footer class="pfoot"><div class="fb"></div><button class="btn primary next" disabled></button></footer>
    </div>`;
  const body = $('.pbody', root), foot = $('.pfoot', root), btn = $('.next', root), fb = $('.fb', root);
  // el avance de lecciones y pruebas queda guardado; el del repaso ya se registró pregunta a pregunta
  $('.close', root).onclick = () => { cleanup(); onExit(); };

  let current = null; // { check(), ready }
  let phase = 'answer';
  const keyh = ev => {
    if (ev.target.tagName === 'INPUT' && ev.key !== 'Enter') return;
    if (ev.key === 'Enter') { ev.preventDefault(); const r = $('.reveal', body); if (r) return r.click(); if (!btn.disabled) btn.click(); return; }
    if (/^[1-9]$/.test(ev.key) && phase === 'answer') { const o = $$('.opt', body)[+ev.key - 1]; if (o) o.click(); }
  };
  document.addEventListener('keydown', keyh);
  const cleanup = () => { document.removeEventListener('keydown', keyh); stopSpeaking(); closePop(); };

  body.addEventListener('click', ev => {
    const slow = ev.target.closest('[data-slow]');
    if (slow) speak(slow.dataset.slow, 0.55);
  });

  // La barra mide el tramo actual, no la lección entera
  function setProgress() {
    const p = queue[Math.min(st.i, queue.length - 1)]?.part;
    const from = parts.length > 1 ? queue.findIndex(x => x.part === p) : 0;
    const to = parts.length > 1 ? queue.findLastIndex(x => x.part === p) + 1 : queue.length;
    $('.bar i', root).style.width = Math.round(100 * (st.i - from) / (to - from)) + '%';
    $('.ptag', root).textContent = parts.length > 1 ? `Tramo ${p + 1}/${parts.length}` : '';
  }

  function next() {
    fb.innerHTML = ''; foot.className = 'pfoot';
    if (st.i >= queue.length) return finish();
    persist();
    setProgress();
    const it = queue[st.i];
    phase = 'answer';
    body.classList.remove('enter'); void body.offsetWidth; body.classList.add('enter');
    current = RENDER[it.kind](it, body, ready => { btn.disabled = !ready; });
    if (isQ(it)) { setBtn('check', 'p.check'); btn.disabled = true; if (it.kind === 'match') btn.classList.add('hide'); else btn.classList.remove('hide'); }
    else { setBtn('next', current?.label || 'p.next'); btn.disabled = false; btn.classList.remove('hide'); }
    if (it.say && S.settings().sound !== false) setTimeout(() => speak(it.say, S.settings().rate), 250);
    if (it.listen) setTimeout(() => speak(it.listen, S.settings().rate), 300);
    const f = body.querySelector('input'); if (f) setTimeout(() => f.focus(), 50);
  }

  function setBtn(act, key) { btn.dataset.act = act; btn.innerHTML = t(key); }

  // Pausa entre tramos: buen momento para dejarlo, el avance queda guardado
  function partBreak() {
    persist();
    phase = 'break'; fb.innerHTML = ''; foot.className = 'pfoot';
    const p = queue[st.i].part;
    $('.bar i', root).style.width = '100%';
    body.innerHTML = `<article class="card teach pbreak"><div class="kicker">✓ ${t('p.partDone')} · ${p}/${parts.length}</div>
      <h2>${t('p.partNext')}: ${rich(parts[p])}</h2><p class="muted">Puedes seguir ahora o salir: retomarás aquí mismo.</p>
      <button class="btn ghost pexit">${t('p.exit')}</button></article>`;
    $('.pexit', body).onclick = () => { cleanup(); onExit(); };
    setBtn('next', 'p.next'); btn.disabled = false; btn.classList.remove('hide');
  }

  function grade(ok, correctHtml, it, note) {
    phase = 'feedback';
    const first = !st.asked.has(it);
    st.asked.add(it);
    if (ok) {
      if (first) st.firstOk++;
      st.xp += it.hinted || !first ? 5 : 10;
      sfx('ok');
    } else {
      st.mistakes++;
      sfx('bad');
      if (first && (correctHtml || it.why) && st.missed.length < 8) st.missed.push({ c: correctHtml || '', w: it.why || '' });
      // el error vuelve al final del tramo actual, no de la lección
      if (mode !== 'test' && !st.retried.has(it)) {
        st.retried.add(it);
        let j = queue.length;
        while (j > st.i + 1 && queue[j - 1].part !== it.part) j--;
        queue.splice(j, 0, it);
      }
    }
    if (it.srs && first) S.gradeWord(it.srs, ok);
    foot.className = 'pfoot ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = `<div class="fb-t">${ok ? '✓ ' + t('p.ok') : '✗ ' + t('p.bad')}</div>
      ${!ok && correctHtml ? `<div class="fb-a">Respuesta correcta: ${correctHtml}</div>` : ''}
      ${note ? `<div class="fb-n">${note}</div>` : ''}
      ${it.why ? `<div class="fb-w">${it.why}</div>` : ''}`;
    setBtn('next', 'p.next'); btn.disabled = false; btn.classList.remove('hide');
    if (it.after && S.settings().sound !== false) speak(it.after, S.settings().rate);
    setProgress();
    persist();
    if (mode === 'test' && st.mistakes > MAX_MISTAKES) { btn.dataset.act = 'next'; btn.textContent = 'Ver resultado'; st.failed = true; }
  }

  btn.onclick = () => {
    if (phase === 'break') return next();
    const it = queue[st.i];
    if (phase === 'answer' && isQ(it) && current?.check) {
      const r = current.check();
      grade(r.ok, r.correct, it, r.note);
      return;
    }
    if (current?.advance && current.advance()) return; // p. ej. diálogo que revela líneas
    if (st.failed) return finish();
    st.i++;
    if (parts.length > 1 && queue[st.i] && queue[st.i].part !== it.part) return partBreak();
    next();
  };
  // los ejercicios de unir pares se autocompletan
  body.addEventListener('match-done', ev => grade(ev.detail.ok, '', queue[st.i]));
  // si saliste del repaso antes de que venciera el tiempo, no se califica
  body.addEventListener('timed-done', () => { if (phase === 'answer' && body.isConnected) btn.onclick(); });

  function finish() {
    cleanup();
    if (rid) S.clearRun(rid);
    const acc = st.totalQ ? Math.round(100 * st.firstOk / st.totalQ) : 100;
    const missed = st.missed.length ? `<div class="recap"><h3>${t('p.toReview')}</h3><ul>${st.missed.map(m => `<li>${m.c ? `<div>${m.c}</div>` : ''}${m.w ? `<div class="muted small">${m.w}</div>` : ''}</li>`).join('')}</ul></div>` : '';
    let html;
    if (mode === 'test') {
      const passed = !st.failed && st.mistakes <= MAX_MISTAKES;
      if (passed) { S.passUnitTest(unit.id, acc); S.addXP(st.xp + 30); sfx('done'); }
      html = passed
        ? `<div class="done"><h2>Prueba superada</h2><p>Marcamos como completadas <b>${esc(unit.title)}</b> y las unidades anteriores. Sus palabras pasan a tu repaso.</p>`
        : `<div class="done"><h2>Todavía no</h2><p>Tuviste más de ${MAX_MISTAKES} errores. Te conviene hacer las lecciones de esta unidad: van rápido si ya sabes algo.</p>${missed}`;
    } else if (mode === 'lesson') {
      const already = S.lessonDone(lesson.id);
      S.completeLesson(lesson.id, acc);
      S.addXP(st.xp + 20); sfx('done');
      const ws = entriesOf(lesson);
      const reads = READINGS.filter(r => r.after === lesson.id && !S.me()?.readings[r.id]);
      html = `<div class="done"><h2>${already ? 'Lección repasada' : 'Lección completada'}</h2>
        <p class="muted">${acc}% a la primera · +${st.xp + 20} XP</p>
        <div class="recap"><h3>${t('p.canNow')}</h3>${lesson.goal ? `<p>${rich(lesson.goal)}</p>` : ''}${lesson.grammar?.length ? `<ul class="gram">${lesson.grammar.map(g => `<li>${rich(g)}</li>`).join('')}</ul>` : ''}</div>
        ${missed}
        ${ws.length ? `<h3>Palabras nuevas (${ws.length})</h3><div class="wordchips">${ws.map(e => jp(e.w === e.r || /[゠-ヿ]/.test(e.w) ? e.r : e.w)).join('')}</div><p class="muted small">Entran a tu repaso espaciado.</p>` : ''}
        ${reads.map(r => `<a class="callout link rrec" href="#/lectura/${r.id}">📖 <b>${t('p.reading')}:</b> <span lang="ja">${jp(r.title, { plain: true })}</span> · ${esc(r.es)}</a>`).join('')}`;
    } else {
      S.addXP(st.xp); sfx('done');
      html = `<div class="done"><h2>Repaso terminado</h2>
        <p class="muted">${acc}% de memoria · +${st.xp} XP</p>
        <p class="muted">Las que fallaste volverán pronto; las que acertaste, en unos días.</p>${missed}`;
    }
    root.innerHTML = `<div class="player"><main class="pbody enter">${html}<button class="btn primary wide fin">${t('p.next')}</button></div></main></div>`;
    $('.fin', root).onclick = onExit;
    $('.fin', root).focus();
  }

  if (!queue.length) {
    root.innerHTML = `<div class="player"><main class="pbody"><div class="done"><h2>Nada por aquí</h2><p>Esta lección todavía no tiene contenido.</p><button class="btn primary fin">Volver</button></div></main></div>`;
    $('.fin', root).onclick = onExit; return;
  }
  next();
}

const isQ = it => ['choice', 'build', 'match', 'type', 'write', 'pick'].includes(it.kind);

// ───── Renderizadores ─────
const RENDER = {
  teach(it, body) {
    const s = it.step;
    body.innerHTML = `<article class="card teach">
      <div class="kicker">📘 Aprende</div><h2>${rich(s.title)}</h2>
      <div class="tbody">${rich(s.body)}</div>
      ${s.ex?.length ? `<ul class="examples">${s.ex.map(([j, e]) => `<li><div>${jp(j, { cls: 'mid' })} ${audioBtn(j)}</div><div class="tr">${rich(e)}</div></li>`).join('')}</ul>` : ''}
      ${s.tip ? `<div class="tip">💡 ${rich(s.tip)}</div>` : ''}
      <p class="hint">Toca cualquier palabra japonesa para ver su significado.</p>
    </article>`;
  },
  dialog(it, body) {
    const s = it.step;
    const names = [...new Set(s.lines.map(l => l[0]))];
    const av = ['🧑🏻', '👩🏽', '👨🏻‍🏫', '👧🏻', '🧑🏽‍💼'];
    body.innerHTML = `<article class="card dialog"><div class="kicker">💬 Diálogo</div><h2>${rich(s.title || 'Escucha la conversación')}</h2>
      <div class="lines"></div>
      <div class="dl-tools"><button class="btn sm ghost tr-all">Mostrar traducciones</button><button class="btn sm ghost play-all">▶ Escuchar todo</button></div></article>`;
    const box = $('.lines', body);
    let shown = 0;
    const addLine = () => {
      const [who, j, es] = s.lines[shown];
      const side = names.indexOf(who) % 2 ? 'r' : 'l';
      const div = document.createElement('div');
      div.className = 'line ' + side;
      div.innerHTML = `<div class="av" title="${esc(who)}">${av[names.indexOf(who) % av.length]}</div><div class="bubble"><div class="who">${esc(who)}</div>${jp(j, { cls: 'mid' })} ${audioBtn(j, '', voiceOf(who))}<div class="tr hidden">${rich(es)}</div><button class="show-tr" aria-label="Ver traducción">ES</button></div>`;
      box.appendChild(div);
      $('.show-tr', div).onclick = () => $('.tr', div).classList.toggle('hidden');
      if (S.settings().sound !== false) speak(spoken(j), S.settings().rate, voiceOf(who));
      shown++;
      div.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    addLine();
    $('.tr-all', body).onclick = () => $$('.tr', box).forEach(t => t.classList.remove('hidden'));
    $('.play-all', body).onclick = async () => { for (const l of s.lines.slice(0, shown)) await speak(spoken(l[1]), S.settings().rate, voiceOf(l[0])); };
    const api = {
      label: s.lines.length > 1 ? 'p.nextLine' : 'p.next',
      advance() {
        if (shown < s.lines.length) { addLine(); if (shown === s.lines.length) document.querySelector('.next').innerHTML = t('p.next'); return true; }
        return false;
      },
    };
    return api;
  },
  kanaCard(it, body) {
    const K = KANA[it.k];
    const twin = K.script === 'hira' ? toKata(it.k) : toHira(it.k);
    body.innerHTML = `<article class="card kcard"><div class="kicker">✍️ Nuevo carácter</div>
      <div class="kana-hero" lang="ja">${it.k}</div>
      <div class="kana-r">${esc(K.r)}</div>
      ${K.m ? `<p class="mn">${esc(K.m)}</p>` : ''}
      <div class="row center">${sayBtn(it.k, 'Escuchar')}</div>
      ${KANA[twin] && twin !== it.k ? `<p class="muted small">En ${K.script === 'hira' ? 'katakana' : 'hiragana'}: <span lang="ja" class="twin">${twin}</span></p>` : ''}
    </article>`;
    if (S.settings().sound !== false) setTimeout(() => speak(it.k, S.settings().rate), 200);
  },
  wordCard(it, body) {
    const e = it.e;
    const shown = e.w === e.r || /[゠-ヿ]/.test(e.w) ? e.r : e.w;
    const kanaOnly = shown === e.r;
    body.innerHTML = `<article class="card wcard"><div class="kicker">🆕 Palabra nueva</div>
      <div class="word-hero">${jp(shown, { cls: 'hero' })}</div>
      ${!kanaOnly ? `<div class="word-r" lang="ja">${esc(e.r)}</div>` : ''}
      <div class="word-ro">${esc(romajiOf(e))}</div>
      <div class="word-es">${esc(e.es)}</div>
      <div class="muted small">${esc(POS[e.pos] || '')}</div>
      ${masuForm(e) ? `<div class="vforms"><span lang="ja">${esc(e.w)}</span> → ${jp(`${masuForm(e)}=${e.id}`, { plain: true })} <small class="muted">(forma ます)</small></div>` : ''}
      ${e.note ? `<div class="tip">💡 ${rich(e.note)}</div>` : ''}
      ${!kanaOnly || e.w === e.r ? '' : ''}
      ${kanaOnly && e.w !== e.r && !/[゠-ヿ]/.test(e.w) ? `<p class="muted small">Con kanji se escribe <span lang="ja">${esc(e.w)}</span> (lo verás más adelante).</p>` : ''}
      <div class="row center">${sayBtn(sayWord(e), 'Escuchar')}</div></article>`;
    if (S.settings().sound !== false) setTimeout(() => speak(sayWord(e), S.settings().rate), 200);
  },
  kanjiCard(it, body) {
    const K = KANJI[it.k];
    const exs = K.ex.map(w => lookup(w)).filter(Boolean);
    body.innerHTML = `<article class="card kcard"><div class="kicker">🈁 Nuevo kanji</div>
      <div class="kanji-hero" lang="ja">${it.k}</div>
      <div class="kanji-es">${esc(K.es)}</div>
      <div class="readings"><span><small>on</small> <span lang="ja">${esc(K.on)}</span></span><span><small>kun</small> <span lang="ja">${esc(K.kun)}</span></span></div>
      <p class="mn">🧠 ${esc(K.mn)}</p>
      ${exs.length ? `<div class="kex">${exs.map(e => `<div>${jp(`${e.w}=${e.id}`)} <span class="muted">${esc(e.r)} · ${esc(e.es)}</span></div>`).join('')}</div>` : ''}
    </article>`;
  },

  choice(it, body, setReady) {
    // Repaso: primero pensar la respuesta, después ver las alternativas
    if (it.think) {
      let inner = null;
      body.innerHTML = `<div class="q">${it.prompt}</div><div class="think"><p class="muted">Piensa la respuesta antes de ver las alternativas.</p><button class="btn primary reveal">${t('p.reveal')}</button></div>`;
      const r = $('.reveal', body);
      r.onclick = () => {
        inner = RENDER.choice({ ...it, think: false }, body, setReady);
        if (!it.secs || S.settings().timer === false) return;
        // con tiempo límite, elegir ya es responder; si se acaba, se corrige lo que haya (nada = error)
        body.insertAdjacentHTML('beforeend', `<div class="tbar" style="--secs:${it.secs}s"><i></i></div>`);
        const done = () => { clearTimeout(tm); body.dispatchEvent(new Event('timed-done')); };
        const tm = setTimeout(done, it.secs * 1000);
        $$('.opt', body).forEach(b => b.addEventListener('click', done));
      };
      setTimeout(() => r.focus(), 60);
      return { check: () => inner.check() };
    }
    const opts = it.shuffle === false ? it.opts : (it.shuffle ? shuffle(it.opts) : it.opts);
    body.innerHTML = `<div class="q">${it.prompt}</div><div class="opts ${opts.some(o => /kana-opt/.test(o.html)) ? 'grid4' : ''}">${opts.map((o, i) => `<button class="opt" data-k="${esc(o.key)}"><span class="num">${i + 1}</span><span class="ot">${o.html}</span></button>`).join('')}</div>`;
    let sel = null;
    $$('.opt', body).forEach((b, i) => b.onclick = () => {
      if (b.disabled) return;
      $$('.opt', body).forEach(x => x.classList.remove('sel'));
      b.classList.add('sel'); sel = b.dataset.k;
      const o = opts[i];
      if (o.say && S.settings().sound !== false) speak(o.say, S.settings().rate);
      if (it.fill) { const bl = $('[data-blank]', body); if (bl) bl.innerHTML = o.html; bl?.classList.add('filled'); }
      sfx('tap'); setReady(true);
    });
    return {
      check() {
        const ok = String(sel) === String(it.answer);
        $$('.opt', body).forEach(b => { b.disabled = true; if (b.dataset.k === String(it.answer)) b.classList.add('right'); else if (b.classList.contains('sel')) b.classList.add('wrong'); });
        const right = opts.find(o => String(o.key) === String(it.answer));
        if (it.fill) { const bl = $('[data-blank]', body); if (bl) { bl.innerHTML = right.html; bl.classList.add(ok ? 'good' : 'fixed'); } }
        return { ok, correct: right?.html };
      },
    };
  },

  build(it, body, setReady) {
    body.innerHTML = `<div class="q"><div class="qlabel">${t('q.build')}</div><div class="qes">«${rich(it.es)}»</div></div>
      <div class="answer-line" aria-label="Tu respuesta"></div><div class="tiles"></div>`;
    const line = $('.answer-line', body), bank = $('.tiles', body);
    const make = t => {
      const b = document.createElement('button');
      b.className = 'tile'; b.innerHTML = jp(t.raw, { plain: true }); b.dataset.i = t.i;
      b.onclick = () => {
        if (b.disabled) return;
        (b.parentElement === bank ? line : bank).appendChild(b);
        const tok = tokenize(t.raw)[0];
        if (b.parentElement === line && S.settings().sound !== false) speak(tokSay(tok, true), S.settings().rate + 0.2, 'f');
        setReady(line.children.length > 0); sfx('tap');
      };
      return b;
    };
    it.tiles.forEach(t => bank.appendChild(make(t)));
    return {
      check() {
        const ans = $$('.tile', line).map(b => tokenize(it.tiles.find(t => String(t.i) === b.dataset.i).raw)[0].surface).join('');
        const ok = ans === it.target || it.alt.includes(ans);
        $$('.tile', body).forEach(b => b.disabled = true);
        line.classList.add(ok ? 'good' : 'badl');
        if (S.settings().sound !== false) speak(spoken(it.jpText), S.settings().rate);
        return { ok, correct: `${jp(it.jpText)}` };
      },
    };
  },

  match(it, body) {
    const left = shuffle(it.pairs.map((p, i) => ({ i, html: hasJp(p.a) ? jp(p.a, { plain: true }) : esc(p.a), say: p.say })));
    const right = shuffle(it.pairs.map((p, i) => ({ i, html: esc(p.b) })));
    body.innerHTML = `<div class="q"><div class="qlabel">Une cada palabra con su significado</div></div>
      <div class="match"><div class="col">${left.map(x => `<button class="mt" data-side="a" data-i="${x.i}">${x.html}</button>`).join('')}</div>
      <div class="col">${right.map(x => `<button class="mt" data-side="b" data-i="${x.i}">${x.html}</button>`).join('')}</div></div>`;
    let selA = null, selB = null, done = 0, errs = 0;
    const tryPair = () => {
      if (!selA || !selB) return;
      const a = selA, b = selB; selA = selB = null;
      if (a.dataset.i === b.dataset.i) {
        [a, b].forEach(x => { x.classList.remove('sel'); x.classList.add('paired'); x.disabled = true; });
        done++; sfx('ok');
        if (done === it.pairs.length) setTimeout(() => body.dispatchEvent(new CustomEvent('match-done', { detail: { ok: errs <= 1 } })), 250);
      } else {
        errs++; sfx('bad');
        [a, b].forEach(x => { x.classList.add('shake'); setTimeout(() => x.classList.remove('shake', 'sel'), 400); });
      }
    };
    $$('.mt', body).forEach(b => b.onclick = () => {
      if (b.dataset.side === 'a') {
        $$('.mt[data-side=a]', body).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); selA = b;
        const p = left.find(x => String(x.i) === b.dataset.i); if (p.say && S.settings().sound !== false) speak(p.say, S.settings().rate);
      } else { $$('.mt[data-side=b]', body).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); selB = b; }
      tryPair();
    });
    return {};
  },

  write(it, body, setReady) {
    it.hinted = false;
    body.innerHTML = `<div class="q">${it.prompt}</div>
      <div class="write-box"><input class="type-in jp-in" lang="ja" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="en kana, kanji o romaji…" aria-label="Tu respuesta">
      <div class="preview" lang="ja" aria-live="polite"></div></div>
      <div class="row center">${it.hint ? '<button class="btn sm ghost use-tiles">🧩 Usar fichas (menos XP)</button>' : ''}</div>
      <p class="hint">Sin teclado japonés: escribe en romaji (<i>watashi wa…</i>) y se convierte solo.</p>`;
    const inp = $('input', body), prev = $('.preview', body);
    let inner = null;
    inp.oninput = () => {
      const v = inp.value;
      prev.textContent = /[a-z]/i.test(v) ? toKanaInput(v) : '';
      setReady(v.trim().length > 0);
    };
    const tilesBtn = $('.use-tiles', body);
    if (tilesBtn) tilesBtn.onclick = () => {
      it.hinted = true;
      const box = document.createElement('div');
      body.querySelector('.write-box').replaceWith(box);
      tilesBtn.parentElement.remove(); body.querySelector('.hint')?.remove();
      inner = RENDER.build({ ...it.hint, tiles: shuffle(it.hint.tiles) }, box, setReady);
      box.querySelector('.qlabel')?.parentElement.remove();   // el enunciado ya está arriba
      setReady(false);
    };
    return {
      check() {
        if (inner) return inner.check();
        // Respuesta libre: basta con que termine en la estructura pedida y tenga algo antes
        const r = it.pat ? (() => { const k = looseKana(toKanaInput(inp.value)); return [].concat(it.pat).some(pt => [...answerForms(pt)].some(f => k.endsWith(f))) && 'exact'; })()
          : checkAnswer(inp.value, it.targets);
        inp.disabled = true; inp.classList.add(r ? 'good' : 'badl');
        const reading = textReading(tokenize(it.jpText));
        const correct = `${jp(it.jpText)}${/[\u4e00-\u9faf]/.test(it.jpText) ? ` <span class="muted" lang="ja">(${esc(reading)})</span>` : ''}`;
        return { ok: !!r, correct,
          note: !r ? (it.pat ? '' : diffHtml(answerDiff(inp.value, it.targets))) : r === 'close' ? `Casi perfecto: revisa las vocales largas. Se escribe ${correct}.` : r === 'exact' && /[a-z]/i.test(inp.value) ? `En japonés: <span lang="ja">${esc(toKanaInput(inp.value.trim()))}</span>` : '' };
      },
    };
  },
  // Encontrar el error: tocar la palabra que está mal
  pick(it, body, setReady) {
    const toks = tokenize(it.jpText);
    body.innerHTML = `<div class="q"><div class="qlabel">🔎 ${t('q.error')}</div>${it.es ? `<div class="qes small">«${rich(it.es)}»</div>` : ''}</div>
      <div class="err-line">${toks.map((t, k) => t.punct ? `<span lang="ja">${esc(t.surface)}</span>` : `<button class="tile etok" data-k="${k}">${jp(t.raw, { plain: true })}</button>`).join('')}</div>`;
    let sel = null;
    $$('.etok', body).forEach(b => b.onclick = () => {
      if (b.disabled) return;
      $$('.etok', body).forEach(x => x.classList.remove('sel'));
      b.classList.add('sel'); sel = +b.dataset.k; sfx('tap'); setReady(true);
    });
    return {
      check() {
        const ok = toks[sel]?.surface === it.bad;
        $$('.etok', body).forEach(b => { b.disabled = true; if (toks[+b.dataset.k].surface === it.bad) b.classList.add('right'); else if (b.classList.contains('sel')) b.classList.add('wrong'); });
        return { ok, correct: jp(it.fix) };
      },
    };
  },
  type(it, body, setReady) {
    body.innerHTML = `<div class="q">${it.prompt}</div>
      <input class="type-in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="escribe aquí…" aria-label="Respuesta">`;
    const inp = $('input', body);
    inp.oninput = () => setReady(inp.value.trim().length > 0);
    return {
      check() {
        const v = inp.value.trim();
        const okR = it.answers.some(a => normRomaji(a) === normRomaji(v));
        const okK = it.kanaAnswer && isKana(v.replace(/\s/g, '')) && toHira(v.replace(/\s/g, '')) === toHira(it.kanaAnswer);
        const ok = okR || okK;
        inp.disabled = true; inp.classList.add(ok ? 'good' : 'badl');
        if (it.say && S.settings().sound !== false) speak(it.say, S.settings().rate);
        return { ok, correct: `<b>${esc(it.answers[0])}</b>` };
      },
    };
  },
};

const toKata = s => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
