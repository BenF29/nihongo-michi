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
import { ENTRIES, lookup, tokenize, toRomaji, normRomaji, toHira, isKana, sayWord, tokSay, voiceOf, checkAnswer, toKanaInput, textReading } from './dict.js';
import * as S from './state.js';
import { speak, stopSpeaking } from './tts.js';
import { esc, $, $$, shuffle, pick, hasJp, jp, rich, audioBtn, sayBtn, spoken, sfx, confetti, POS, romajiOf, closePop } from './ui.js';

// ───── Conjuntos de referencia según el currículo ─────
const wordsUpTo = (() => {
  const cache = {};
  return i => {
    if (cache[i]) return cache[i];
    const s = [];
    for (const l of LESSONS.slice(0, i + 1)) for (const w of l.words || []) { const e = lookup(w); if (e) s.push(e); }
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
function distractors(e, pool, n, field) {
  const same = pool.filter(x => x.id !== e.id && x.pos !== 'name' && x[field] !== e[field] && x.es !== e.es);
  const pref = same.filter(x => x.pos === e.pos);
  const out = []; const seen = new Set([e[field]]);
  for (const x of [...shuffle(pref), ...shuffle(same)]) {
    if (out.length >= n) break;
    if (!seen.has(x[field])) { seen.add(x[field]); out.push(x); }
  }
  return out;
}
const wordHtml = (e, big) => jp(e.w === e.r || /[゠-ヿ]/.test(e.w) ? e.r : e.w, { cls: big ? 'big' : '', plain: !big });

function qJpToEs(e, pool, srs) {
  const ds = distractors(e, pool, 3, 'es');
  return { kind: 'choice', srs, prompt: `<div class="qlabel">¿Qué significa?</div><div class="qjp">${wordHtml(e, true)} ${sayBtn(sayWord(e))}</div>`,
    say: sayWord(e), opts: shuffle([e, ...ds]).map(x => ({ key: x.id, html: esc(x.es) })), answer: e.id,
    why: `${esc(e.w)}${e.w !== e.r ? ` (${esc(e.r)})` : ''} = <b>${esc(e.es)}</b>` };
}
function qEsToJp(e, pool, srs) {
  const ds = distractors(e, pool, 3, 'r');
  return { kind: 'choice', srs, prompt: `<div class="qlabel">¿Cómo se dice?</div><div class="qes">«${esc(e.es)}»</div>`,
    opts: shuffle([e, ...ds]).map(x => ({ key: x.id, html: wordHtml(x), say: sayWord(x) })), answer: e.id,
    why: `«${esc(e.es)}» = <span lang="ja">${esc(e.w)}</span>${e.w !== e.r ? ` (${esc(e.r)})` : ''}`, after: sayWord(e) };
}
function qListenWord(e, pool, srs) {
  const ds = distractors(e, pool, 3, 'es');
  return { kind: 'choice', srs, listen: sayWord(e), prompt: `<div class="qlabel">Escucha y elige el significado</div>${listenBox(sayWord(e))}`,
    opts: shuffle([e, ...ds]).map(x => ({ key: x.id, html: esc(x.es) })), answer: e.id,
    why: `Era <span lang="ja">${esc(e.w)}</span> (${esc(e.r)}) = <b>${esc(e.es)}</b>` };
}
const listenBox = text => `<div class="listen"><button class="play big" data-say="${esc(text)}">🔊</button><button class="play slow" data-slow="${esc(text)}" title="Más lento">🐢</button></div>`;

function qKana(k, pool, type) {
  const r = KANA[k].r;
  const others = pick(pool.filter(x => x !== k && KANA[x].r !== r), 3);
  if (type === 'k2r') return { kind: 'choice', prompt: `<div class="qlabel">¿Cómo se lee?</div><div class="kana-big" lang="ja">${k}</div>`,
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
  return { kind: 'choice', prompt: `<div class="qlabel">¿Qué significa este kanji?</div><div class="kanji-big" lang="ja">${k}</div>`,
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
  return { kind: 'write', prompt: `<div class="qlabel">✍️ Escribe en japonés</div><div class="qes">«${rich(s.es)}»</div>`,
    targets: [s.jp, ...(s.alt || [])], jpText: s.jp, why: rich(s.why), after: spoken(s.jp), hint: buildItem({ ...s, extra: [] }) };
}
function qWriteWord(e, srs) {
  const shown = e.w === e.r || /[\u30a0-\u30ff]/.test(e.w) ? e.r : e.w;
  return { kind: 'write', srs, prompt: `<div class="qlabel">✍️ ¿Cómo se dice en japonés?</div><div class="qes">«${esc(e.es)}»</div>`,
    targets: [`${e.w}=${e.id}`], jpText: `${shown}=${e.id}`, after: sayWord(e),
    why: `«${esc(e.es)}» = <span lang="ja">${esc(e.w)}</span>${e.w !== e.r ? ` (${esc(e.r)})` : ''}` };
}
// Dictado: escuchar y escribir
function qDictation(text, es) {
  return { kind: 'write', listen: spoken(text), prompt: `<div class="qlabel">🎧 Dictado: escribe lo que escuchas</div>${listenBox(spoken(text))}`,
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
      return { kind: 'choice', prompt: `<div class="qlabel">${rich(s.q)}</div>${s.jp ? `<div class="qjp">${jp(s.jp, { cls: 'mid' })} ${audioBtn(s.jp)}</div>` : ''}`,
        say: s.jp ? spoken(s.jp) : null,
        opts: s.opts.map((o, i) => ({ key: i, html: optHtml(o), say: optsJp && !s.kana ? spoken(o) : null })), answer: s.a, why: rich(s.why), shuffle: s.shuffle !== false };
    }
    case 'listen':
      return { kind: 'choice', listen: spoken(s.jp), prompt: `<div class="qlabel">${rich(s.q || 'Escucha y elige qué significa')}</div>${listenBox(spoken(s.jp))}`,
        opts: s.opts.map((o, i) => ({ key: i, html: hasJp(o) ? jp(o, { plain: true }) : rich(o) })), answer: s.a,
        why: `${jp(s.jp)}${s.why ? '<br>' + rich(s.why) : ''}`, shuffle: true };
    case 'fill':
      return { kind: 'choice', fill: s.jp, prompt: `<div class="qlabel">${rich(s.q || 'Completa la oración')}</div><div class="qjp fillq">${jp(s.jp, { cls: 'mid', blank: '<span class="blank" data-blank>　</span>' })}</div>${s.es ? `<div class="qes small">${rich(s.es)}</div>` : ''}`,
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
  for (const s of steps) {
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
  return ids.map((id, i) => (p?.words[id]?.box >= 3 && i % 2 === 0 ? qWriteWord(ENTRIES[id], id) : gens[i % 3](ENTRIES[id], big, id)));
}

// ───── Reproductor ─────
export function play(root, { mode, lesson, unit, ids, onExit }) {
  let queue, title;
  if (mode === 'lesson') { queue = buildLessonQueue(lesson); title = lesson.title; }
  else if (mode === 'test') { queue = buildTestQueue(unit); title = `Prueba: ${unit.title}`; }
  else { queue = buildReviewQueue(ids); title = 'Repaso'; }

  const MAX_MISTAKES = 3;
  const st = { i: 0, combo: 0, best: 0, xp: 0, asked: new Set(), firstOk: 0, mistakes: 0, retried: new WeakSet() };
  const totalQ = queue.filter(isQ).length;
  root.innerHTML = `
    <div class="player">
      <header class="ph">
        <button class="icon close" aria-label="Salir">✕</button>
        <div class="bar"><i></i></div>
        <div class="combo" aria-live="polite"></div>
      </header>
      <main class="pbody" aria-live="polite"></main>
      <footer class="pfoot"><div class="fb"></div><button class="btn primary next" disabled>Comprobar</button></footer>
    </div>`;
  const body = $('.pbody', root), foot = $('.pfoot', root), btn = $('.next', root), fb = $('.fb', root);
  $('.close', root).onclick = () => { if (st.i === 0 || confirm('¿Salir? Perderás el avance de esta lección.')) { cleanup(); onExit(); } };

  let current = null; // { check(), ready }
  let phase = 'answer';
  const keyh = ev => {
    if (ev.target.tagName === 'INPUT' && ev.key !== 'Enter') return;
    if (ev.key === 'Enter') { ev.preventDefault(); if (!btn.disabled) btn.click(); return; }
    if (/^[1-9]$/.test(ev.key) && phase === 'answer') { const o = $$('.opt', body)[+ev.key - 1]; if (o) o.click(); }
  };
  document.addEventListener('keydown', keyh);
  const cleanup = () => { document.removeEventListener('keydown', keyh); stopSpeaking(); closePop(); };

  body.addEventListener('click', ev => {
    const slow = ev.target.closest('[data-slow]');
    if (slow) speak(slow.dataset.slow, 0.55);
  });

  function setProgress() {
    $('.bar i', root).style.width = Math.round(100 * st.i / queue.length) + '%';
    $('.combo', root).innerHTML = st.combo >= 3 ? `<span class="fire">🔥 ${st.combo}</span>` : '';
  }

  function next() {
    fb.innerHTML = ''; foot.className = 'pfoot';
    if (st.i >= queue.length) return finish();
    setProgress();
    const it = queue[st.i];
    phase = 'answer';
    body.classList.remove('enter'); void body.offsetWidth; body.classList.add('enter');
    current = RENDER[it.kind](it, body, ready => { btn.disabled = !ready; });
    if (isQ(it)) { btn.textContent = 'Comprobar'; btn.disabled = true; if (it.kind === 'match') btn.classList.add('hide'); else btn.classList.remove('hide'); }
    else { btn.textContent = current?.label || 'Continuar'; btn.disabled = false; btn.classList.remove('hide'); }
    if (it.say && S.settings().sound !== false) setTimeout(() => speak(it.say, S.settings().rate), 250);
    if (it.listen) setTimeout(() => speak(it.listen, S.settings().rate), 300);
    const f = body.querySelector('input'); if (f) setTimeout(() => f.focus(), 50);
  }

  function grade(ok, correctHtml, it, note) {
    phase = 'feedback';
    const first = !st.asked.has(it);
    st.asked.add(it);
    if (ok) {
      st.combo++; st.best = Math.max(st.best, st.combo);
      if (first) st.firstOk++;
      const gain = it.hinted ? 5 : first ? (st.combo >= 5 ? 15 : 10) : 5;
      st.xp += gain;
      sfx('ok');
    } else {
      st.combo = 0; st.mistakes++;
      sfx('bad');
      if (mode !== 'test' && !st.retried.has(it)) { st.retried.add(it); queue.push(it); }
    }
    if (it.srs && first) S.gradeWord(it.srs, ok);
    const praise = ['¡Bien!', '¡Excelente!', '¡Correcto!', '¡Eso es!', 'すごい！', 'いいね！'];
    foot.className = 'pfoot ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = `<div class="fb-t">${ok ? '✓ ' + praise[Math.floor(Math.random() * praise.length)] : '✗ No exactamente'}</div>
      ${!ok && correctHtml ? `<div class="fb-a">Respuesta correcta: ${correctHtml}</div>` : ''}
      ${note ? `<div class="fb-n">${note}</div>` : ''}
      ${it.why ? `<div class="fb-w">${it.why}</div>` : ''}`;
    btn.textContent = 'Continuar'; btn.disabled = false; btn.classList.remove('hide');
    if (it.after && S.settings().sound !== false) speak(it.after, S.settings().rate);
    setProgress();
    if (mode === 'test' && st.mistakes > MAX_MISTAKES) { btn.textContent = 'Ver resultado'; st.failed = true; }
  }

  btn.onclick = () => {
    const it = queue[st.i];
    if (phase === 'answer' && isQ(it) && current?.check) {
      const r = current.check();
      grade(r.ok, r.correct, it, r.note);
      return;
    }
    if (current?.advance && current.advance()) return; // p. ej. diálogo que revela líneas
    if (st.failed) return finish();
    st.i++; next();
  };
  // los ejercicios de unir pares se autocompletan
  body.addEventListener('match-done', ev => grade(ev.detail.ok, '', queue[st.i]));

  function finish() {
    cleanup();
    const acc = totalQ ? Math.round(100 * st.firstOk / totalQ) : 100;
    let html;
    if (mode === 'test') {
      const passed = !st.failed && st.mistakes <= MAX_MISTAKES;
      if (passed) { S.passUnitTest(unit.id, acc); S.addXP(st.xp + 30); confetti(); sfx('done'); }
      html = passed
        ? `<div class="done"><div class="done-ic">🏆</div><h2>¡Prueba superada!</h2><p>Marcamos como completadas <b>${esc(unit.title)}</b> y las unidades anteriores. Sus palabras pasan a tu repaso.</p>`
        : `<div class="done"><div class="done-ic">💪</div><h2>Casi…</h2><p>Tuviste más de ${MAX_MISTAKES} errores. Te recomendamos hacer las lecciones de esta unidad: ¡van rápido si ya sabes algo!</p>`;
    } else if (mode === 'lesson') {
      const already = S.lessonDone(lesson.id);
      S.completeLesson(lesson.id, acc);
      const bonus = 20 + (acc === 100 ? 10 : 0);
      S.addXP(st.xp + bonus); confetti(); sfx('done');
      const ws = entriesOf(lesson);
      html = `<div class="done"><div class="done-ic">${acc >= 90 ? '🌸' : acc >= 70 ? '⭐' : '👍'}</div><h2>${already ? '¡Lección repasada!' : '¡Lección completada!'}</h2>
        <div class="stats"><div><b>+${st.xp + bonus}</b><span>XP</span></div><div><b>${acc}%</b><span>precisión</span></div><div><b>${st.best}</b><span>mejor racha</span></div></div>
        ${ws.length ? `<h3>Palabras aprendidas (${ws.length})</h3><div class="wordchips">${ws.map(e => jp(e.w === e.r || /[゠-ヿ]/.test(e.w) ? e.r : e.w)).join('')}</div><p class="muted small">Entran a tu repaso espaciado: volverán justo antes de que las olvides.</p>` : ''}`;
    } else {
      S.addXP(st.xp); sfx('done');
      html = `<div class="done"><div class="done-ic">🧠</div><h2>¡Repaso terminado!</h2>
        <div class="stats"><div><b>+${st.xp}</b><span>XP</span></div><div><b>${acc}%</b><span>de memoria</span></div></div>
        <p class="muted">Las que fallaste volverán pronto; las que acertaste, en unos días.</p>`;
    }
    root.innerHTML = `<div class="player"><main class="pbody enter">${html}<button class="btn primary wide fin">Continuar</button></div></main></div>`;
    $('.fin', root).onclick = onExit;
    $('.fin', root).focus();
  }

  if (!queue.length) {
    root.innerHTML = `<div class="player"><main class="pbody"><div class="done"><h2>Nada por aquí</h2><p>Esta lección todavía no tiene contenido.</p><button class="btn primary fin">Volver</button></div></main></div>`;
    $('.fin', root).onclick = onExit; return;
  }
  next();
}

const isQ = it => ['choice', 'build', 'match', 'type', 'write'].includes(it.kind);

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
      label: s.lines.length > 1 ? 'Siguiente ▸' : 'Continuar',
      advance() {
        if (shown < s.lines.length) { addLine(); if (shown === s.lines.length) document.querySelector('.next').textContent = 'Continuar'; return true; }
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
    body.innerHTML = `<div class="q"><div class="qlabel">Traduce al japonés</div><div class="qes">«${rich(it.es)}»</div></div>
      <div class="answer-line" aria-label="Tu respuesta"></div><div class="tiles"></div>`;
    const line = $('.answer-line', body), bank = $('.tiles', body);
    const make = t => {
      const b = document.createElement('button');
      b.className = 'tile'; b.innerHTML = jp(t.raw, { plain: true }); b.dataset.i = t.i;
      b.onclick = () => {
        if (b.disabled) return;
        (b.parentElement === bank ? line : bank).appendChild(b);
        const tok = tokenize(t.raw)[0];
        if (b.parentElement === line && S.settings().sound !== false) speak(tokSay(tok, true), S.settings().rate + 0.2);
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
        const r = checkAnswer(inp.value, it.targets);
        inp.disabled = true; inp.classList.add(r ? 'good' : 'badl');
        const reading = textReading(tokenize(it.jpText));
        const correct = `${jp(it.jpText)}${/[\u4e00-\u9faf]/.test(it.jpText) ? ` <span class="muted" lang="ja">(${esc(reading)})</span>` : ''}`;
        return { ok: !!r, correct,
          note: r === 'close' ? `Casi perfecto: revisa las vocales largas. Se escribe ${correct}.` : r === 'exact' && /[a-z]/i.test(inp.value) ? `En japonés: <span lang="ja">${esc(toKanaInput(inp.value.trim()))}</span>` : '' };
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
