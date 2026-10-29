// Simulacro del JLPT N5: examen completo, una sección cronometrada, o práctica por tipo de problema.
//
// Como en el examen real: sin feedback hasta el final, opciones en orden fijo (1–4), sin furigana en
// los kanji del N5 y, en el 聴解, el audio suena una sola vez y no se puede volver atrás.
// En la práctica, en cambio, cada respuesta se corrige al instante y el audio se puede repetir.

import { BANK, SECTIONS, MONDAI, N5_KANJI, examScript } from './data/exam/index.js';
import { LESSONS, LESSON_INDEX } from './data/curriculum.js';
import { kanjiIn, spoken } from './dict.js';
import * as S from './state.js';
import { speak, stopSpeaking } from './tts.js';
import { esc, $, $$, jp, rich, shuffle, sfx, confetti, audioBtn } from './ui.js';

const N5 = new Set(N5_KANJI);
const examRuby = seg => kanjiIn(seg).some(k => !N5.has(k));
// Durante el examen el texto no es clicable (no hay diccionario); al revisar, sí.
const T = (text, o = {}) => jp(text, { plain: true, ruby: examRuby, ...o });
const TR = (text, o = {}) => jp(text, { ruby: examRuby, ...o });
const PRACTICE_N = { bunpo3: 2, dokkai4: 4, dokkai5: 2, dokkai6: 2 };
const PAREN = '<span class="paren">（　　　）</span>';
const isListen = type => type.startsWith('chokai');
const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const wait = ms => new Promise(r => setTimeout(r, ms));

// Un ítem del banco → una o más preguntas (los textos con varios huecos o preguntas)
function expand(type, it) {
  if (type === 'bunpo3') return it.gaps.map((g, k) => ({ type, it, k, opts: g.opts, a: g.a, why: g.why }));
  if (type.startsWith('dokkai')) return it.questions.map((q, k) => ({ type, it, k, opts: q.opts, a: q.a, why: q.why, q }));
  if (type === 'bunpo2') return [{ type, it, k: 0, opts: it.order.map(i => it.pieces[i]), a: it.order.indexOf(it.star), why: it.why }];
  return [{ type, it, k: 0, opts: it.opts, a: it.a, why: it.why }];
}
// Prefiere los ítems que menos has visto, para que cada simulacro sea distinto
function choose(type, n) {
  const seen = S.examSeen();
  return shuffle(BANK[type] || []).sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0)).slice(0, n);
}
function build(mode, arg) {
  const secs = mode === 'full' ? SECTIONS
    : mode === 'section' ? SECTIONS.filter(s => s.id === arg)
    : [{ ...SECTIONS.find(s => s.mondai.includes(arg)), mondai: [arg] }];
  return secs.map(sec => {
    const qs = [];
    for (const type of sec.mondai) {
      const n = mode === 'practice' ? PRACTICE_N[type] || 8 : MONDAI[type].n;
      let no = 0;
      for (const it of choose(type, n)) for (const q of expand(type, it)) qs.push({ ...q, no: ++no, ans: null });
    }
    return { ...sec, qs };
  }).filter(s => s.qs.length);
}

// Puntaje estimado en la escala del JLPT N5: 言語知識・読解 0–120, 聴解 0–60.
// Aprueba con 80/180 y al menos 38 y 19 en cada parte.
function score(secs) {
  const part = ids => { const qs = secs.filter(s => ids.includes(s.id)).flatMap(s => s.qs); return [qs.filter(q => q.ans === q.a).length, qs.length]; };
  const [aOk, aN] = part(['moji', 'bunpo']), [bOk, bN] = part(['chokai']);
  const A = aN ? Math.round(120 * aOk / aN) : null, B = bN ? Math.round(60 * bOk / bN) : null;
  const full = A !== null && B !== null;
  return { A, B, total: full ? A + B : null, pass: full ? A + B >= 80 && A >= 38 && B >= 19 : null, ok: aOk + bOk, n: aN + bN };
}

// ───── Portada de la sección «Examen» ─────
export function renderExamHome(root) {
  const hist = S.exams().slice(-6).reverse();
  const nx = S.nextLesson();
  const count = type => (BANK[type] || []).reduce((n, it) => n + expand(type, it).length, 0);
  const total = Object.keys(MONDAI).reduce((n, t) => n + count(t), 0);
  root.innerHTML = `<section class="page exam-home">
    <h1><span lang="ja">試験</span> Simulacro JLPT N5</h1>
    <p class="lead">Practica con preguntas en el formato del examen real: las mismas secciones, los mismos tipos de problema y el mismo tiempo. Al final ves tu puntaje estimado, qué fallaste y qué lecciones repasar.</p>
    ${nx ? `<a class="callout link" href="#/camino">💡 Te recomendamos terminar el camino primero (te falta «${esc(nx.title)}»). Igual puedes intentarlo cuando quieras.</a>` : ''}
    <div class="ex-cards">
      <div class="card ex-full">
        <div class="kicker">Examen completo · ~90 min</div>
        <h2>Simulacro completo</h2>
        <ol class="ex-secs">${SECTIONS.map(s => `<li><b lang="ja">${esc(s.jp)}</b> <span class="muted">${esc(s.es)} · ${s.id === 'chokai' ? 'lo marca el audio' : s.min + ' min'} · ${s.mondai.reduce((n, t) => n + (MONDAI[t].n * (t === 'bunpo3' ? 5 : t === 'dokkai5' ? 2 : 1)), 0)} preguntas</span></li>`).join('')}</ol>
        <p class="small muted">Sin ayudas: no hay diccionario ni furigana en los kanji del N5, y el audio suena una sola vez.</p>
        <a class="btn primary big" href="#/simulacro/completo">Empezar el simulacro</a>
      </div>
      <div class="card">
        <div class="kicker">Una sección</div>
        <h2>Por sección</h2>
        <p class="small muted">Con el tiempo real de cada sección.</p>
        <div class="ex-secbtns">${SECTIONS.map(s => `<a class="btn ghost wide" href="#/simulacro/${s.id}"><span lang="ja">${esc(s.jp)}</span></a>`).join('')}</div>
      </div>
    </div>
    <h2>Práctica por tipo de problema</h2>
    <p class="muted small">Sin tiempo y con corrección inmediata. Hay ${total} preguntas en el banco.</p>
    ${SECTIONS.map(s => `<h3 lang="ja">${esc(s.jp)}</h3><div class="ex-practice">${s.mondai.map(t => `
      <a class="card ex-p" href="#/practica/${t}"><span class="ex-no" lang="ja">もんだい${MONDAI[t].no}</span>
        <b lang="ja">${esc(MONDAI[t].name)}</b><span class="muted small">${esc(MONDAI[t].es)} · ${count(t)}</span></a>`).join('')}</div>`).join('')}
    ${hist.length ? `<h2>Tus intentos</h2><div class="card ex-hist">${hist.map(h => `<div class="ex-h">
        <span>${new Date(h.at).toLocaleDateString('es-CL')}</span>
        <span>${esc(h.label)}</span>
        <b>${h.total != null ? `${h.total}/180 ${h.pass ? '<span class="tag ok">aprobado</span>' : '<span class="tag new">no aprobado</span>'}` : `${h.ok}/${h.n}`}</b>
      </div>`).join('')}</div>` : ''}
  </section>`;
}

// ───── Examen ─────
export function playExam(root, { mode, arg, onExit }) {
  const practice = mode === 'practice';
  if ((practice && !MONDAI[arg]) || (mode === 'section' && !SECTIONS.some(s => s.id === arg))) { onExit(); return; }
  const secs = build(mode, arg);
  if (!secs.length) { onExit(); return; }
  const label = mode === 'full' ? 'Simulacro completo' : practice ? `Práctica: ${MONDAI[arg].name}` : SECTIONS.find(s => s.id === arg).jp;
  const st = { si: 0, qi: 0, deadline: 0, played: new Set(), playing: 0, done: false };
  const sec = () => secs[st.si];
  const cur = () => sec().qs[st.qi];
  const timed = () => !practice && sec().id !== 'chokai';
  const linear = () => !practice && sec().id === 'chokai';

  root.innerHTML = `<div class="player exam">
      <header class="ph"><button class="icon close" aria-label="Salir">✕</button>
        <div class="ex-title"><b lang="ja"></b><span class="muted small"></span></div>
        <div class="ex-timer" aria-live="off"></div></header>
      <nav class="ex-nav" aria-label="Preguntas"></nav>
      <main class="pbody" aria-live="polite"></main>
      <footer class="pfoot ex-foot"><button class="btn ghost prev">← Anterior</button><button class="btn ghost flag" title="Marcar para revisar">🚩</button><button class="btn primary next">Siguiente →</button></footer>
    </div>`;
  const body = $('.pbody', root), nav = $('.ex-nav', root), timer = $('.ex-timer', root);
  const alive = () => document.body.contains(root);
  const cleanup = () => { clearInterval(tick); document.removeEventListener('keydown', keyh); st.playing++; stopSpeaking(); };
  $('.close', root).onclick = () => { if (st.done || confirm('¿Salir del examen? Se perderán tus respuestas.')) { cleanup(); onExit(); } };

  const tick = setInterval(() => {
    if (!alive()) return cleanup();
    if (!timed() || st.done || !st.deadline) { timer.textContent = ''; return; }
    const left = st.deadline - Date.now();
    timer.textContent = '⏱ ' + fmt(left);
    timer.classList.toggle('low', left < 3 * 60000);
    if (left <= 0) endSection(true);
  }, 500);
  const keyh = ev => {
    if (!alive()) return cleanup();
    if (st.done || ev.target.tagName === 'INPUT') return;
    if (/^[1-4]$/.test(ev.key)) { const o = $$('.opt', body)[+ev.key - 1]; if (o) o.click(); }
    if (ev.key === 'ArrowRight' || ev.key === 'Enter') $('.next', root).click();
    if (ev.key === 'ArrowLeft' && !$('.prev', root).disabled) $('.prev', root).click();
  };
  document.addEventListener('keydown', keyh);

  function startSection() {
    st.qi = 0;
    st.deadline = timed() && sec().min ? Date.now() + sec().min * 60000 : 0;
    $('.ex-title b', root).textContent = sec().jp;
    $('.ex-title span', root).textContent = practice ? label : `${sec().es}${secs.length > 1 ? ` · sección ${st.si + 1} de ${secs.length}` : ''}`;
    show();
  }

  function renderNav() {
    nav.innerHTML = sec().qs.map((q, i) => {
      const prevT = i && sec().qs[i - 1].type;
      const cls = [i === st.qi ? 'cur' : '', q.ans !== null ? 'ans' : '', q.flag ? 'flag' : '',
        practice && q.ans !== null ? (q.ans === q.a ? 'right' : 'wrong') : ''].join(' ');
      return `${prevT !== q.type ? `<span class="ex-nm" lang="ja">${MONDAI[q.type].no}</span>` : ''}<button class="${cls}" data-i="${i}" ${linear() ? 'disabled' : ''} aria-label="Pregunta ${i + 1}">${q.no}</button>`;
    }).join('');
    $$('button', nav).forEach(b => b.onclick = () => { st.qi = +b.dataset.i; show(); });
    nav.querySelector('.cur')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function show() {
    st.playing++; stopSpeaking();
    const q = cur();
    const answered = practice && q.ans !== null;
    body.innerHTML = questionHtml(q, { reveal: answered, review: false });
    body.classList.remove('enter'); void body.offsetWidth; body.classList.add('enter');
    $$('.opt', body).forEach(o => o.onclick = () => choose(+o.dataset.i));
    if (answered) markOpts(body, q);
    const pb = $('.ex-play', body);
    if (pb) {
      pb.onclick = () => playQ(q);
      if (!practice && st.played.has(q)) { pb.disabled = true; pb.textContent = '✓ Ya se reprodujo'; }
      else if (!practice) playQ(q);
    }
    $('.prev', root).disabled = st.qi === 0 || linear();
    $('.flag', root).classList.toggle('on', !!q.flag);
    $('.flag', root).hidden = practice || linear();
    const last = st.qi === sec().qs.length - 1;
    $('.next', root).textContent = last ? (st.si < secs.length - 1 ? 'Terminar sección' : practice ? 'Ver resultado' : 'Terminar examen') : 'Siguiente →';
    renderNav();
  }

  function choose(i) {
    const q = cur();
    if (practice && q.ans !== null) return;
    if (isListen(q.type) && !practice && !st.played.has(q)) return;   // primero hay que escuchar
    q.ans = i;
    $$('.opt', body).forEach(o => o.classList.toggle('sel', +o.dataset.i === i));
    if (practice) {
      sfx(i === q.a ? 'ok' : 'bad');
      markOpts(body, q);
      body.insertAdjacentHTML('beforeend', feedbackHtml(q));
      // en la práctica, al responder se muestran los textos de las opciones que solo se escuchaban
      $$('.opt', body).forEach((o, k) => { const t = $('.ex-hidden', o); if (t) t.outerHTML = T(q.opts[k]); });
    }
    renderNav();
  }

  async function playQ(q) {
    const id = ++st.playing;
    st.played.add(q);
    const pb = $('.ex-play', body);
    if (pb && !practice) { pb.disabled = true; pb.textContent = '🔊 Escuchando…'; }
    const rate = S.settings().rate;
    for (const [text, voice, role] of examScript(q.type, q.it)) {
      if (id !== st.playing) return;
      const o = role.startsWith('opt') ? $$('.opt', body)[+role.slice(3)] : null;
      o?.classList.add('speaking');
      await speak(spoken(text), rate, voice);
      o?.classList.remove('speaking');
      await wait(role === 'q' ? 900 : 500);
    }
    if (id === st.playing && pb) { pb.disabled = !practice; pb.textContent = practice ? '🔊 Escuchar otra vez' : '✓ Ya se reprodujo'; }
  }

  $('.prev', root).onclick = () => { if (st.qi > 0) { st.qi--; show(); } };
  $('.flag', root).onclick = () => { const q = cur(); q.flag = !q.flag; show(); };
  $('.next', root).onclick = () => {
    if (st.done) return;
    if (st.qi < sec().qs.length - 1) { st.qi++; show(); return; }
    const missing = sec().qs.filter(q => q.ans === null).length;
    if (!practice && missing && !confirm(`Te quedan ${missing} preguntas sin responder. ¿Terminar la sección?`)) return;
    endSection(false);
  };

  function endSection(timeout) {
    st.playing++; stopSpeaking();
    if (st.si < secs.length - 1) {
      const nextSec = secs[st.si + 1];
      st.deadline = 0;
      body.innerHTML = `<div class="done"><div class="done-ic">${timeout ? '⏰' : '✅'}</div>
        <h2>${timeout ? 'Se acabó el tiempo' : 'Sección terminada'}</h2>
        <p>Siguiente: <b lang="ja">${esc(nextSec.jp)}</b> · ${esc(nextSec.es)}${nextSec.id === 'chokai' ? '' : ` · ${nextSec.min} min`}.</p>
        ${nextSec.id === 'chokai' ? '<p class="muted small">🎧 Usa audífonos. Cada audio suena una sola vez y no se puede volver a la pregunta anterior.</p>' : ''}
        <button class="btn primary big" id="go">Empezar</button></div>`;
      nav.innerHTML = '';
      $('.ex-foot', root).hidden = true;
      $('#go', body).onclick = () => { st.si++; $('.ex-foot', root).hidden = false; startSection(); };
      return;
    }
    finish();
  }

  function finish() {
    st.done = true; clearInterval(tick);
    const sc = score(secs);
    const all = secs.flatMap(s => s.qs);
    S.saveExam({ at: Date.now(), mode, arg: arg || '', label, A: sc.A, B: sc.B, total: sc.total, pass: sc.pass, ok: sc.ok, n: sc.n },
      [...new Set(all.map(q => q.it.id))]);
    const xp = Math.round(sc.ok * (practice ? 1 : 2));
    S.addXP(xp);
    if (sc.pass || (sc.n && sc.ok / sc.n >= 0.8)) { sfx('done'); confetti(); }
    root.querySelector('.ex-foot').hidden = true;
    nav.innerHTML = ''; timer.textContent = '';
    body.innerHTML = resultsHtml(secs, sc, { practice, xp });
    body.scrollTop = 0; window.scrollTo(0, 0);
    $$('details.exr', body).forEach((d, i) => markOpts(d, all[i]));
    $('#again', body)?.addEventListener('click', () => { cleanup(); playExam(root, { mode, arg, onExit }); });
    $('#out', body)?.addEventListener('click', () => { cleanup(); onExit(); });
  }

  startSection();
}

function markOpts(scope, q) {
  $$('.opt', scope).forEach(o => {
    const i = +o.dataset.i;
    o.disabled = true;
    o.classList.toggle('right', i === q.a);
    o.classList.toggle('wrong', i === q.ans && i !== q.a);
  });
}

// ───── Render de una pregunta ─────
// reveal: mostrar el texto de las opciones que solo se escuchan; review: texto clicable y transcripción
function questionHtml(q, { reveal, review }) {
  const it = q.it, M = MONDAI[q.type];
  const t = review ? TR : T;
  let stem = '';
  switch (q.type) {
    case 'moji1': case 'moji2': case 'goi4':
      stem = `<div class="ex-sent">${t(it.jp, { under: it.u || '' })}</div>`; break;
    case 'goi3': case 'bunpo1':
      stem = `<div class="ex-sent">${t(it.jp, { blank: PAREN })}</div>`; break;
    case 'bunpo2': {
      const slots = [0, 1, 2, 3].map(i => i === it.star ? '<span class="slot star">★</span>' : '<span class="slot"></span>').join('');
      stem = `<div class="ex-sent">${it.pre ? t(it.pre) : ''} ${slots} ${it.post ? t(it.post) : ''}</div>`;
      if (review) stem += `<p class="small">Orden correcto: ${t(it.pieces.join(' '))}</p>`;
      break;
    }
    case 'bunpo3': {
      let g = 0;   // los huecos se numeran a lo largo de todo el texto, no por párrafo
      const gap = () => { const n = g++; return `<span class="gap${n === q.k ? ' cur' : ''}">［${n + 1}］</span>`; };
      stem = `<div class="ex-text">${it.title ? `<h3 class="center">${t(it.title)}</h3>` : ''}${(it.paras || []).map(p => `<p>${t(p, { blank: gap })}</p>`).join('')}</div>
        <div class="ex-q"><span class="gap cur">［${q.k + 1}］</span></div>`;
      if (review && it.es) stem += `<details class="small"><summary>Traducción del texto</summary><p>${rich(it.es)}</p></details>`;
      break;
    }
    case 'dokkai4': case 'dokkai5': case 'dokkai6': {
      const sents = it.paras.map(([j], i) => `<span class="${review && [].concat(q.q.ev ?? []).includes(i) ? 'ev' : ''}">${t(j)}</span>`);
      stem = `<div class="ex-text">${it.title ? `<h3 class="center">${t(it.title)}</h3>` : ''}<p>${sents.join(' ')}</p>
        ${it.table ? `<div class="ex-table"><table><thead><tr>${it.table.cols.map(c => `<th>${t(c)}</th>`).join('')}</tr></thead>
          <tbody>${it.table.rows.map(r => `<tr>${r.map(c => `<td>${t(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}</div>
        <div class="ex-q">${t(q.q.qjp)}</div>`;
      if (review) stem += `<details class="small"><summary>Traducción del texto</summary><p>${it.paras.map(([, es]) => esc(es)).join(' ')}</p></details>`;
      break;
    }
    default: {   // 聴解
      const play = review ? '' : `<button class="btn ex-play">▶ Escuchar</button>`;
      stem = `${q.type === 'chokai3' ? `<div class="ex-scene">${esc(it.scene)}</div>` : ''}<div class="ex-listen">${play}</div>`;
      if (review) {
        const lines = [...(it.intro ? [['🎙️', it.intro]] : []), ...(it.lines || []), ...(it.qjp && q.type !== 'chokai4' ? [['🎙️', it.qjp]] : [])];
        stem += `<div class="ex-script">${lines.map(([who, j]) => `<div><b>${esc(who)}</b> ${TR(j)} ${audioBtn(j)}</div>`).join('')}</div>
          ${it.es ? `<details class="small"><summary>Traducción</summary><p>${rich(it.es)}</p></details>` : ''}`;
      }
    }
  }
  const hidden = (q.type === 'chokai3' || q.type === 'chokai4') && !reveal && !review;
  const plainOpts = q.type === 'moji1' || q.type === 'moji2';
  const opts = q.opts.map((o, i) => `<button class="opt${q.ans === i ? ' sel' : ''}" data-i="${i}"><span class="num">${i + 1}</span>${
    hidden ? '<span class="ex-hidden">♪</span>' : plainOpts ? `<span class="jopt" lang="ja">${esc(o)}</span>` : t(o)}</button>`).join('');
  return `<div class="q ex-qq">
    <div class="ex-mondai"><b lang="ja">もんだい${M.no}</b> <span lang="ja">${esc(M.ins)}</span><div class="muted small">${esc(M.ins_es)}</div></div>
    ${stem}
    <div class="opts${plainOpts ? ' grid4' : ''}">${opts}</div>
  </div>`;
}

function feedbackHtml(q) {
  const ok = q.ans === q.a;
  const ref = LESSONS[LESSON_INDEX[q.it.ref]];
  return `<div class="ex-fb ${ok ? 'ok' : 'bad'}"><b>${ok ? '¡Correcto!' : `Era la ${q.a + 1}.`}</b> ${rich(q.why || '')}
    ${ref ? `<div class="muted small">Se ve en «${esc(ref.title)}».</div>` : ''}</div>`;
}

// ───── Resultados ─────
function resultsHtml(secs, sc, { practice, xp }) {
  const all = secs.flatMap(s => s.qs);
  const wrong = all.filter(q => q.ans !== q.a);
  const refs = {};
  for (const q of wrong) if (q.it.ref) refs[q.it.ref] = (refs[q.it.ref] || 0) + 1;
  const recs = Object.entries(refs).sort((a, b) => b[1] - a[1] || LESSON_INDEX[a[0]] - LESSON_INDEX[b[0]]).slice(0, 6)
    .map(([id, n]) => ({ l: LESSONS[LESSON_INDEX[id]], n })).filter(x => x.l);
  const bar = (ok, n) => `<div class="meter"><i style="width:${n ? Math.round(100 * ok / n) : 0}%"></i></div>`;
  const byMondai = secs.map(s => `<h3 lang="ja">${esc(s.jp)}</h3>${[...new Set(s.qs.map(q => q.type))].map(t => {
    const qs = s.qs.filter(q => q.type === t), ok = qs.filter(q => q.ans === q.a).length;
    return `<div class="ex-row"><span><b lang="ja">もんだい${MONDAI[t].no}</b> ${esc(MONDAI[t].es)}</span>${bar(ok, qs.length)}<b>${ok}/${qs.length}</b></div>`;
  }).join('')}`).join('');
  const head = sc.total != null
    ? `<div class="done-ic">${sc.pass ? '🏆' : '📚'}</div><h2>${sc.pass ? '¡Aprobarías el N5!' : 'Todavía no alcanza'}</h2>
       <div class="ex-score"><div><b>${sc.total}</b><span>/ 180</span></div></div>
       <div class="ex-parts"><div><span lang="ja">言語知識・読解</span><b>${sc.A}/120</b>${sc.A < 38 ? '<span class="tag new">mín. 38</span>' : ''}</div>
         <div><span lang="ja">聴解</span><b>${sc.B}/60</b>${sc.B < 19 ? '<span class="tag new">mín. 19</span>' : ''}</div></div>
       <p class="muted small">Para aprobar se necesitan 80 puntos y al menos 38 y 19 en cada parte. Es una estimación: el JLPT real usa una escala ajustada estadísticamente.</p>`
    : `<div class="done-ic">${sc.ok / sc.n >= 0.8 ? '🎉' : '💪'}</div><h2>${sc.ok} de ${sc.n} correctas</h2>
       ${!practice && sc.A != null ? `<p>Equivale a unos <b>${sc.A}/120</b> en <span lang="ja">言語知識・読解</span> (mínimo 38).</p>` : ''}
       ${!practice && sc.B != null ? `<p>Equivale a unos <b>${sc.B}/60</b> en <span lang="ja">聴解</span> (mínimo 19).</p>` : ''}`;
  return `<div class="done ex-res">${head}<p class="xp">+${xp} XP</p></div>
    <div class="card">${byMondai}</div>
    ${recs.length ? `<h2>Qué repasar</h2><div class="ex-recs">${recs.map(({ l, n }) => `<a class="card ex-rec" href="#/leccion/${l.id}"><span>${esc(l.icon)}</span><b>${esc(l.title)}</b><span class="muted small">${n} error${n > 1 ? 'es' : ''}</span></a>`).join('')}</div>` : ''}
    <h2>Revisa tus respuestas</h2>
    <div class="ex-review">${all.map((q, i) => `<details class="exr ${q.ans === q.a ? 'ok' : 'bad'}"${q.ans !== q.a && wrong.length <= 12 ? ' open' : ''}>
      <summary><span>${q.ans === q.a ? '✓' : q.ans === null ? '–' : '✗'}</span> <span lang="ja">もんだい${MONDAI[q.type].no}</span> · ${q.no} <span class="muted small">${esc(MONDAI[q.type].es)}</span></summary>
      ${questionHtml(q, { reveal: true, review: true })}
      <div class="ex-fb ${q.ans === q.a ? 'ok' : 'bad'}">${q.ans === null ? '<b>Sin responder.</b> ' : ''}${q.ans !== q.a ? `<b>Respuesta: ${q.a + 1}.</b> ` : ''}${rich(q.why || '')}</div>
    </details>`).join('')}</div>
    <div class="row center wrap"><button class="btn primary" id="again">Otra vez</button><button class="btn ghost" id="out">Volver</button></div>`;
}
