// Lecturas graduadas: texto clicable, cobertura de vocabulario y preguntas de comprensión con feedback.

import READINGS from './data/readings.js';
import { LESSONS, LESSON_INDEX } from './data/curriculum.js';
import { tokenize, checkAnswer } from './dict.js';
import * as S from './state.js';
import { speak, stopSpeaking } from './tts.js';
import { esc, $, $$, jp, rich, spoken, sfx, confetti, romajiToHira, toast } from './ui.js';

export const LEVELS = {
  1: { name: 'Primeras lecturas', hint: 'tras «Primeros pasos»', color: '#1971c2' },
  2: { name: 'Principiante', hint: 'tras «Verbos»', color: '#7048e8' },
  3: { name: 'Básico', hint: 'tras «Lugares, cosas y personas»', color: '#0c8599' },
  4: { name: 'Pre-intermedio', hint: 'tras «Hablar con naturalidad»', color: '#9c36b5' },
  5: { name: 'Intermedio', hint: 'con vocabulario fuera del camino', color: '#e8590c' },
};

export const allReadings = () => READINGS;

// Porcentaje de palabras (ocurrencias) conocidas por el usuario
export function coverage(r) {
  let total = 0, ok = 0; const unknown = new Map();
  for (const [j] of r.paras.flat()) for (const t of tokenize(j)) {
    if (t.punct) continue;
    total++;
    if (!t.entry) continue;
    if (S.isKnown(t.entry.id)) ok++; else unknown.set(t.entry.id, t.entry);
  }
  return { pct: total ? Math.round(100 * ok / total) : 0, total, unknown: [...unknown.values()] };
}

export function renderList(root) {
  const byLevel = {};
  for (const r of READINGS) (byLevel[r.level] ||= []).push(r);
  const recs = READINGS.map(r => [r, coverage(r)]).filter(([r, c]) => !S.me()?.readings[r.id] && c.pct >= 90);
  root.innerHTML = `<section class="page">
    <h1>読 Lecturas</h1>
    <p class="lead">Textos graduados para practicar comprensión. El porcentaje indica cuántas palabras del texto ya conoces: con <b>más de 90 %</b> la lectura es cómoda y aprendes las palabras nuevas por contexto.</p>
    ${recs.length ? `<div class="callout">✨ Tienes <b>${recs.length}</b> lectura${recs.length > 1 ? 's' : ''} lista${recs.length > 1 ? 's' : ''} para ti.</div>` : `<div class="callout muted">Avanza en el camino para desbloquear más vocabulario: las lecturas se vuelven comprensibles a medida que aprendes.</div>`}
    ${Object.keys(byLevel).sort().map(lv => `
      <h2 class="lvl" style="--c:${LEVELS[lv]?.color}">Nivel ${lv} · ${esc(LEVELS[lv]?.name || '')} <small>${esc(LEVELS[lv]?.hint || '')}</small></h2>
      <div class="rgrid">${byLevel[lv].sort((a, b) => (LESSON_INDEX[a.after] ?? 99) - (LESSON_INDEX[b.after] ?? 99)).map(card).join('')}</div>`).join('')}
  </section>`;
}

function card(r) {
  const c = coverage(r);
  const done = S.me()?.readings[r.id];
  const cls = c.pct >= 90 ? 'easy' : c.pct >= 75 ? 'mid' : 'hard';
  const n = r.paras.flat().length;
  const badge = done ? `<span class="tag ok">${done.listened ? '🎧' : '✓'} ${done.best}/${done.total}</span>` : c.pct >= 90 ? '<span class="tag rec">Recomendada</span>' : c.pct < 75 ? '<span class="tag">Desafiante</span>' : '';
  return `<a class="rcard ${cls}" href="#/lectura/${r.id}">
    <div class="rc-top"><span class="rc-topic">${esc(r.topic || '')}</span>${badge}</div>
    <div class="rc-title">${jp(r.title, { plain: true })}</div>
    <div class="rc-es">${esc(r.es || '')}</div>
    <div class="meter" title="Palabras que conoces"><i style="width:${c.pct}%"></i></div>
    <div class="rc-foot"><span>${c.pct}% conocidas</span><span>${n} oraciones · ${r.questions.length} preguntas</span></div>
    ${c.pct < 90 && r.after && !S.lessonDone(r.after) ? `<div class="rc-after">Ideal después de «${esc(LESSONS[LESSON_INDEX[r.after]].title)}»</div>` : ''}
  </a>`;
}

export function renderReading(root, id) {
  const r = READINGS.find(x => x.id === id);
  const listen = S.settings().readMode === 'listen';
  let revealed = !listen;
  if (!r) { root.innerHTML = '<section class="page"><p>Lectura no encontrada.</p><a href="#/lecturas">← Volver</a></section>'; return; }
  const c = coverage(r);
  const sents = r.paras.flat();
  let gi = 0;
  root.innerHTML = `<section class="page reader">
    <a class="back" href="#/lecturas">← Lecturas</a>
    <div class="r-head">
      <span class="tag" style="--c:${LEVELS[r.level]?.color}">Nivel ${r.level}</span> <span class="muted">${esc(r.topic || '')}</span>
      <h1>${jp(r.title)}</h1><div class="muted">${esc(r.es || '')}</div>
    </div>
    <div class="seg" role="tablist" aria-label="Modo">
      <button role="tab" data-mode="read" class="${listen ? '' : 'on'}">📖 Leer</button>
      <button role="tab" data-mode="listen" class="${listen ? 'on' : ''}">🎧 Escuchar primero</button>
    </div>
    ${listen ? `<div class="lplayer card">
      <div class="lp-info"><b>🎧 Comprensión auditiva</b><span class="muted small">Escucha el texto (las veces que quieras) y responde sin leerlo. Después puedes mostrarlo.</span></div>
      <div class="lp-ctrl">
        <button class="icon" id="lpPrev" aria-label="Oración anterior">⏮</button>
        <button class="play big" id="lpPlay" aria-label="Reproducir">▶</button>
        <button class="icon" id="lpNext" aria-label="Oración siguiente">⏭</button>
        <button class="icon" id="lpRep" aria-label="Repetir oración">🔁</button>
        <label class="sw"><input type="checkbox" id="lpSlow"> 🐢 Lento</label>
      </div>
      <div class="lp-prog"><div class="meter"><i style="width:0"></i></div><span id="lpN">Oración 1 de ${sents.length}</span></div>
    </div>` : ''}
    <div class="r-tools">
      ${listen ? '' : '<button class="btn sm ghost" id="playAll">▶ Escuchar</button>'}
      <label class="sw"><input type="checkbox" id="trT"> Traducción</label>
      <label class="sw"><input type="checkbox" id="newT" checked> Resaltar palabras nuevas</label>
      <select id="furi" aria-label="Furigana"><option value="auto">Furigana: kanji no aprendidos</option><option value="always">Furigana: siempre</option><option value="never">Furigana: nunca</option></select>
    </div>
    <div class="cov"><div class="meter"><i style="width:${c.pct}%"></i></div><span>Conoces el <b>${c.pct}%</b> de las palabras${c.unknown.length ? ` · ${c.unknown.length} nuevas (subrayadas)` : ''}</span></div>
    <article class="text marknew${listen ? ' veiled' : ''}">
      ${listen ? '<div class="veil"><p>El texto está oculto para practicar la escucha.</p><button class="btn sm" id="reveal">Mostrar texto</button></div>' : ''}
      ${r.paras.map(p => `<p>${p.map(([j, es]) => `<span class="sent" data-g="${gi++}"><span class="sj">${jp(j, { mark: 'known' })}</span><button class="sp-say" data-say="${esc(spoken(j))}" aria-label="Escuchar oración">🔈</button><span class="str">${rich(es)}</span></span>`).join(' ')}</p>`).join('')}
    </article>
    ${c.unknown.length ? `<details class="newwords"><summary>Palabras nuevas en este texto (${c.unknown.length})</summary>
      <div class="nwlist">${c.unknown.map(e => `<div class="nw">${jp(`${e.w}=${e.id}`)} <span class="muted">${esc(e.r)}</span> — ${esc(e.es)}</div>`).join('')}</div>
      <button class="btn sm" id="addAll">+ Añadir todas a mi repaso</button></details>` : ''}
    <section class="questions">
      <h2>Preguntas de comprensión</h2>
      <p class="muted small">${listen ? 'Responde a partir de lo que escuchaste. Si te equivocas, puedes volver a escuchar la parte clave.' : 'Responde cada una y presiona «Comprobar». Si te equivocas, te mostramos en qué parte del texto está la respuesta.'}</p>
      ${r.questions.map((q, i) => qHTML(q, i)).join('')}
      <div class="qscore hidden"></div>
    </section>
  </section>`;

  const text = $('.text', root);
  const furi = $('#furi', root);
  furi.value = S.settings().furigana;
  furi.onchange = () => { S.setSetting('furigana', furi.value); renderReading(root, id); };
  $('#trT', root).onchange = ev => text.classList.toggle('showtr', ev.target.checked);
  $('#newT', root).onchange = ev => text.classList.toggle('marknew', ev.target.checked);
  $$('.seg button', root).forEach(b => b.onclick = () => { stopSpeaking(); S.setSetting('readMode', b.dataset.mode); renderReading(root, id); });
  const reveal = () => { revealed = true; text.classList.remove('veiled'); $('.veil', text)?.remove(); };
  $('#reveal', root)?.addEventListener('click', reveal);

  // Reproductor por oraciones (modo escucha)
  const sentEls = $$('.sent', text);
  let idx = 0, run = 0;
  const rate = () => $('#lpSlow', root)?.checked ? 0.6 : S.settings().rate;
  const showIdx = () => {
    const n = $('#lpN', root); if (!n) return;
    n.textContent = `Oración ${idx + 1} de ${sentEls.length}`;
    $('.lp-prog i', root).style.width = Math.round(100 * idx / Math.max(1, sentEls.length - 1)) + '%';
  };
  async function playFrom(i, single = false) {
    const my = ++run;
    idx = Math.max(0, Math.min(i, sentEls.length - 1));
    $('#lpPlay', root).textContent = '⏸';
    while (idx < sentEls.length && my === run) {
      showIdx();
      sentEls.forEach(x => x.classList.remove('reading')); sentEls[idx].classList.add('reading');
      await speak(sentEls[idx].querySelector('.sp-say').dataset.say, rate());
      if (my !== run) return;
      sentEls[idx].classList.remove('reading');
      if (single || idx === sentEls.length - 1) break;
      idx++;
      await new Promise(res => setTimeout(res, 350));
    }
    if (my === run) $('#lpPlay', root).textContent = '▶';
  }
  const pause = () => { run++; stopSpeaking(); $('#lpPlay', root).textContent = '▶'; };
  $('#lpPlay', root)?.addEventListener('click', ev => ev.currentTarget.textContent === '⏸' ? pause() : playFrom(idx));
  $('#lpPrev', root)?.addEventListener('click', () => playFrom(idx - 1));
  $('#lpNext', root)?.addEventListener('click', () => playFrom(idx + 1));
  $('#lpRep', root)?.addEventListener('click', () => playFrom(idx, true));
  async function playEv(ev) { run++; for (const g of [].concat(ev ?? [])) { const el = sentEls[g]; if (el) await speak(el.querySelector('.sp-say').dataset.say, rate()); } }

  let playing = false;
  $('#playAll', root)?.addEventListener('click', async ev => {
    if (playing) { playing = false; stopSpeaking(); ev.target.textContent = '▶ Escuchar'; return; }
    playing = true; ev.target.textContent = '■ Detener';
    for (const s of $$('.sent', text)) {
      if (!playing) break;
      s.classList.add('reading');
      await speak(s.querySelector('.sp-say').dataset.say, S.settings().rate);
      s.classList.remove('reading');
    }
    playing = false; ev.target.textContent = '▶ Escuchar';
  });
  $('#addAll', root)?.addEventListener('click', () => { c.unknown.forEach(e => S.addWordToReview(e.id)); toast(`${c.unknown.length} palabras añadidas a tu repaso`); renderReading(root, id); });
  document.addEventListener('words-changed', function h() { if (location.hash === '#/lectura/' + id) renderReading(root, id); document.removeEventListener('words-changed', h); }, { once: true });

  const results = new Array(r.questions.length).fill(null);
  $$('.rq', root).forEach((box, i) => {
    const q = r.questions[i];
    const btn = $('.check', box);
    let sel = null;
    $$('.ro', box).forEach(o => o.onclick = () => { if (results[i] !== null) return; $$('.ro', box).forEach(x => x.classList.remove('sel')); o.classList.add('sel'); sel = o.dataset.v; btn.disabled = false; });
    const inp = $('input', box);
    if (inp) inp.oninput = () => { btn.disabled = !inp.value.trim(); const v = inp.value.trim(); $('.conv', box).textContent = /^[a-z' -]+$/i.test(v) ? '→ ' + romajiToHira(v) : ''; };
    btn.onclick = () => {
      if (results[i] !== null) return;
      let ok;
      if (q.t === 'mc') ok = +sel === q.a;
      else if (q.t === 'tf') ok = (sel === 'true') === q.a;
      else ok = !!checkAnswer(inp.value, q.accept);
      results[i] = ok;
      sfx(ok ? 'ok' : 'bad');
      box.classList.add(ok ? 'good' : 'bad');
      $$('.ro', box).forEach(o => {
        o.disabled = true;
        const right = q.t === 'mc' ? +o.dataset.v === q.a : (o.dataset.v === 'true') === q.a;
        if (right) o.classList.add('right'); else if (o.classList.contains('sel')) o.classList.add('wrong');
      });
      if (inp) inp.disabled = true;
      btn.remove();
      $('.rfb', box).innerHTML = `<b>${ok ? '✓ ¡Correcto!' : '✗ No es correcto.'}</b> ${q.t === 'text' && !ok ? `Respuesta aceptada: <span lang="ja">${esc(q.accept[0])}</span>. ` : ''}${rich(q.why || '')}
        ${q.ev !== undefined ? `${listen ? '<button class="btn sm ghost play-ev">🔊 Escuchar la parte clave</button>' : ''}<button class="btn sm ghost show-ev">Ver en el texto</button>` : ''}`;
      $('.show-ev', box)?.addEventListener('click', () => { reveal(); highlight(q.ev, true); });
      $('.play-ev', box)?.addEventListener('click', () => playEv(q.ev));
      if (!ok) highlight(q.ev, false);
      if (results.every(x => x !== null)) finish();
    };
  });

  function highlight(ev, scroll) {
    $$('.sent.ev', text).forEach(s => s.classList.remove('ev'));
    [].concat(ev ?? []).forEach(g => { const s = $(`.sent[data-g="${g}"]`, text); if (s) { s.classList.add('ev'); if (scroll) s.scrollIntoView({ behavior: 'smooth', block: 'center' }); } });
  }
  function finish() {
    const score = results.filter(Boolean).length;
    const byEar = listen && !revealed;
    S.saveReading(r.id, score, results.length, byEar);
    S.addXP(score * 10 + 10);
    const box = $('.qscore', root);
    box.classList.remove('hidden');
    const perfect = score === results.length;
    if (perfect) confetti();
    sfx('done');
    const nextR = READINGS.filter(x => x.id !== r.id && !S.me()?.readings[x.id]).map(x => [x, coverage(x).pct]).sort((a, b) => b[1] - a[1])[0];
    box.innerHTML = `<div class="done-ic">${perfect ? '🌸' : score >= results.length / 2 ? '⭐' : '📖'}</div>
      <h3>${score} de ${results.length} correctas · +${score * 10 + 10} XP</h3>
      <p>${perfect ? (byEar ? '¡Comprensión auditiva perfecta: lo entendiste sin leerlo!' : '¡Comprensión perfecta!') : byEar ? 'Muestra el texto y léelo mientras escuchas: luego inténtalo otra vez solo escuchando.' : 'Relee las oraciones resaltadas y vuelve a intentarlo cuando quieras.'}</p>
      <div class="row center"><button class="btn ghost" id="retry">Intentar de nuevo</button>${nextR ? `<a class="btn primary" href="#/lectura/${nextR[0].id}">Siguiente lectura →</a>` : ''}</div>`;
    $('#retry', box).onclick = () => { renderReading(root, id); scrollTo(0, 0); };
  }
}

function qHTML(q, i) {
  const head = `<div class="rq-q"><span class="qn">${i + 1}</span><div>${q.qjp ? `<div>${jp(q.qjp)}</div>` : ''}<div class="${q.qjp ? 'muted' : ''}">${rich(q.q)}</div></div></div>`;
  let body = '';
  if (q.t === 'mc') body = `<div class="ropts">${q.opts.map((o, k) => `<button class="ro" data-v="${k}">${/[぀-ヿ一-龯]/.test(o) ? jp(o) : rich(o)}</button>`).join('')}</div>`;
  else if (q.t === 'tf') body = `<div class="ropts tf"><button class="ro" data-v="true">Verdadero</button><button class="ro" data-v="false">Falso</button></div>`;
  else body = `<div class="rtext"><input placeholder="Escribe en japonés (o en romaji)" autocomplete="off" autocapitalize="off" spellcheck="false" lang="ja"><span class="conv muted small"></span></div>`;
  return `<div class="rq">${head}${body}<button class="btn sm primary check" disabled>Comprobar</button><div class="rfb"></div></div>`;
}
