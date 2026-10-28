// Enrutador y vistas principales.

import { UNITS, LESSONS, LESSON_INDEX } from './data/curriculum.js';
import { KANA, HIRAGANA_BASIC, KATAKANA_BASIC, splitKana } from './data/kana.js';
import { KANJI } from './data/kanji.js';
import { ENTRIES, lookup } from './dict.js';
import * as S from './state.js';
import { play } from './lesson.js';
import { renderList, renderReading } from './reader.js';
import { ttsAvailable, hasJapaneseVoice } from './tts.js';
import { esc, $, $$, jp, rich, toast, POS, closePop, WORD_LESSON } from './ui.js';

const app = $('#app');
const AVATARS = ['🦊', '🐱', '🐼', '🐸', '🐧', '🦉', '🐙', '🌸', '🍙', '🗻', '🎏', '🐉'];

function shell(active, inner) {
  const p = S.me();
  const due = S.dueWords().length;
  const goal = S.settings().goal, today = S.xpToday();
  const pct = Math.min(100, Math.round(100 * today / goal));
  const nav = [['camino', '道', 'Camino'], ['lecturas', '読', 'Lecturas'], ['repaso', '復', 'Repaso'], ['palabras', '辞', 'Palabras']];
  return `<header class="top">
      <a class="logo" href="#/camino"><span lang="ja">道</span> Michi</a>
      <nav class="nav">${nav.map(([k, ic, t]) => `<a href="#/${k}" class="${active === k ? 'on' : ''}"><span class="nic" lang="ja">${ic}</span><span class="nt">${t}</span>${k === 'repaso' && due ? `<span class="badge">${due}</span>` : ''}</a>`).join('')}</nav>
      <div class="stats-top">
        <span class="st-streak" title="Racha de días">🔥 ${S.streak()}</span>
        <span class="ring" style="--p:${pct}" title="Meta diaria: ${today}/${goal} XP"><span>${pct >= 100 ? '✓' : today}</span></span>
        <a class="me" href="#/perfil" title="Perfil">${esc(p.avatar)}</a>
      </div>
    </header>
    <div id="view">${inner}</div>`;
}

// ───── Perfiles ─────
function viewProfiles() {
  const ps = S.profiles();
  app.innerHTML = `<section class="welcome">
    <div class="w-hero"><div class="w-logo" lang="ja">道</div><h1>Michi</h1><p>Aprende japonés paso a paso, desde el primer carácter hasta leer textos reales.</p></div>
    ${ps.length ? `<h2>¿Quién está aprendiendo?</h2><div class="plist">${ps.map(p => `<button class="pcard" data-id="${p.id}"><span class="pav">${esc(p.avatar)}</span><b>${esc(p.name)}</b><small>${p.xp} XP · ${Object.values(p.lessons).filter(l => l.done).length} lecciones</small></button>`).join('')}</div>` : ''}
    <form class="newp card">
      <h2>${ps.length ? 'Nuevo perfil' : 'Crea tu perfil'}</h2>
      <input name="name" placeholder="Tu nombre" maxlength="24" required autocomplete="nickname">
      <div class="avs">${AVATARS.map((a, i) => `<label><input type="radio" name="av" value="${a}" ${i ? '' : 'checked'}><span>${a}</span></label>`).join('')}</div>
      <button class="btn primary wide">Empezar</button>
      <details class="imp"><summary>¿Tienes un código de progreso? Impórtalo</summary><textarea placeholder="Pega aquí tu código"></textarea><button type="button" class="btn sm" id="impBtn">Importar</button></details>
    </form>
    <p class="muted small center">El progreso se guarda en este navegador. Puedes exportarlo desde tu perfil para usarlo en otro dispositivo.</p>
  </section>`;
  $$('.pcard', app).forEach(b => b.onclick = () => { S.selectProfile(b.dataset.id); go('#/camino'); });
  $('.newp', app).onsubmit = ev => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    S.createProfile(f.get('name'), f.get('av'));
    go('#/camino');
  };
  $('#impBtn', app).onclick = () => {
    try { S.importProfile($('.imp textarea', app).value); toast('Perfil importado'); go('#/camino'); }
    catch (e) { toast(e.message); }
  };
}

// ───── Camino ─────
function viewPath() {
  const nx = S.nextLesson();
  const due = S.dueWords().length;
  const doneN = LESSONS.filter(l => S.lessonDone(l.id)).length;
  let html = `<section class="page path">
    <div class="hero card">
      ${nx ? `<div><div class="kicker">Siguiente lección · ${esc(UNITS.find(u => u.id === nx.unit).title)}</div><h2>${esc(nx.icon)} ${esc(nx.title)}</h2><p class="muted">${esc(nx.goal || '')}</p></div>
        <a class="btn primary big" href="#/leccion/${nx.id}">${doneN ? 'Continuar' : 'Empezar'} ▸</a>`
      : `<div><h2>🎉 ¡Completaste el camino!</h2><p class="muted">Sigue con las lecturas y el repaso diario.</p></div><a class="btn primary big" href="#/lecturas">Ir a lecturas</a>`}
    </div>
    ${due ? `<a class="callout link" href="#/repaso">🧠 Tienes <b>${due}</b> palabra${due > 1 ? 's' : ''} para repasar hoy — ¡el repaso a tiempo es lo que fija la memoria!</a>` : ''}
    <div class="progress-line"><span>${doneN}/${LESSONS.length} lecciones</span><div class="meter"><i style="width:${Math.round(100 * doneN / LESSONS.length)}%"></i></div></div>`;
  for (const u of UNITS) {
    const done = u.lessons.filter(l => S.lessonDone(l.id)).length;
    const complete = done === u.lessons.length;
    html += `<div class="unit" style="--c:${u.color}">
      <div class="uhead"><div class="uic" lang="ja">${esc(u.icon)}</div><div class="ut"><h2>${esc(u.title)}</h2><p>${esc(u.sub)}</p></div>
        <div class="uside"><span class="uprog">${done}/${u.lessons.length}</span>${complete ? '<span class="tag ok">✓</span>' : `<button class="btn sm ghost skip" data-unit="${u.id}" title="Si ya sabes esto, demuéstralo y salta">⏩ Ya lo sé</button>`}</div></div>
      <div class="nodes">${u.lessons.map((l, i) => {
        const d = S.lessonDone(l.id), un = S.isUnlocked(l.id), cur = nx && nx.id === l.id;
        const off = [0, 1, 2, 1, 0, -1, -2, -1][i % 8];
        return `<button class="node ${d ? 'done' : ''} ${un ? '' : 'locked'} ${cur ? 'cur' : ''}" style="--o:${off}" data-l="${l.id}" aria-label="${esc(l.title)}">
          <span class="nb" lang="ja">${d ? '✓' : un ? esc(l.icon) : '🔒'}</span><span class="nl">${esc(l.title)}</span>${cur ? '<span class="here">¡Aquí!</span>' : ''}</button>`;
      }).join('')}</div></div>`;
  }
  html += `<p class="center muted small"><a href="#/metodo">¿Cómo funciona este método?</a></p></section>`;
  app.innerHTML = shell('camino', html);
  $$('.node', app).forEach(b => b.onclick = () => preview(LESSONS[LESSON_INDEX[b.dataset.l]]));
  $$('.skip', app).forEach(b => b.onclick = () => skipDialog(UNITS.find(u => u.id === b.dataset.unit)));
  const cur = $('.node.cur', app); if (cur && doneN) cur.scrollIntoView({ block: 'center' });
}

function modal(html) {
  closePop();
  const m = document.createElement('div');
  m.className = 'modal';
  m.innerHTML = `<div class="sheet card" role="dialog" aria-modal="true"><button class="icon mclose" aria-label="Cerrar">✕</button>${html}</div>`;
  document.body.appendChild(m);
  const close = () => m.remove();
  m.onclick = ev => { if (ev.target === m || ev.target.closest('.mclose')) close(); };
  document.addEventListener('keydown', function k(ev) { if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
  return { el: m, close };
}

function preview(l) {
  const un = S.isUnlocked(l.id), d = S.lessonDone(l.id);
  const words = (l.words || []).map(lookup).filter(Boolean);
  const kana = splitKana(l.kana || '').filter(k => KANA[k]);
  const m = modal(`<div class="kicker">${esc(UNITS.find(u => u.id === l.unit).title)} · Lección ${LESSON_INDEX[l.id] + 1}</div>
    <h2>${esc(l.icon)} ${esc(l.title)}</h2><p>${esc(l.goal || '')}</p>
    ${kana.length ? `<h4>Caracteres</h4><div class="chips kana">${kana.map(k => `<span lang="ja">${k}</span>`).join('')}</div>` : ''}
    ${l.kanji ? `<h4>Kanji</h4><div class="chips kana">${[...l.kanji].map(k => `<span lang="ja" title="${esc(KANJI[k]?.es)}">${k}</span>`).join('')}</div>` : ''}
    ${l.grammar?.length ? `<h4>Gramática</h4><ul class="gram">${l.grammar.map(g => `<li>${rich(g)}</li>`).join('')}</ul>` : ''}
    ${words.length ? `<h4>Palabras nuevas (${words.length})</h4><div class="chips">${words.map(e => `<span>${jp(e.w === e.r || /[゠-ヿ]/.test(e.w) || l.unit <= 'u3' ? e.r : e.w)} <small>${esc(e.es)}</small></span>`).join('')}</div>` : ''}
    <div class="row">${un ? `<a class="btn primary wide" href="#/leccion/${l.id}">${d ? 'Repasar lección' : 'Empezar'}</a>`
      : `<p class="muted">🔒 Completa la lección anterior, o usa «⏩ Ya lo sé» en la unidad para saltar con una prueba.</p>`}</div>`);
  $$('a', m.el).forEach(a => a.addEventListener('click', m.close));
}

function skipDialog(u) {
  const ui = UNITS.indexOf(u);
  const m = modal(`<h2>⏩ Saltar «${esc(u.title)}»</h2>
    <p>Responde una prueba corta con preguntas de todas sus lecciones. Si tienes <b>3 errores o menos</b>, marcamos como completada esta unidad${ui ? ' <b>y todas las anteriores</b>' : ''}, y sus palabras entran a tu repaso.</p>
    <a class="btn primary wide" href="#/prueba/${u.id}">Hacer la prueba</a>`);
  $('a', m.el).addEventListener('click', m.close);
}

// ───── Reproductor (pantalla completa) ─────
function viewPlayer(opts) {
  app.innerHTML = '<div id="player"></div>';
  play($('#player'), { ...opts, onExit: () => go(opts.mode === 'review' ? '#/repaso' : '#/camino') });
}

// ───── Repaso ─────
function viewReview() {
  const p = S.me();
  const all = Object.entries(p.words).filter(([id]) => ENTRIES[id]);
  const due = S.dueWords();
  const boxes = [0, 0, 0, 0];
  for (const [, w] of all) boxes[w.box <= 1 ? 0 : w.box <= 3 ? 1 : w.box <= 5 ? 2 : 3]++;
  const nextDue = all.filter(([, w]) => w.due > Date.now()).sort((a, b) => a[1].due - b[1].due)[0];
  const when = nextDue ? relTime(nextDue[1].due) : '';
  app.innerHTML = shell('repaso', `<section class="page">
    <h1>復習 Repaso</h1>
    <p class="lead">Repetición espaciada: cada palabra vuelve justo cuando estás por olvidarla. Si la recuerdas, el intervalo crece (1, 3, 7, 16, 35… días); si no, vuelve pronto.</p>
    <div class="card review-hero">
      ${due.length ? `<div><div class="big-n">${due.length}</div><div>palabra${due.length > 1 ? 's' : ''} para repasar</div></div><a class="btn primary big" href="#/repasar">Repasar ${Math.min(20, due.length)} ▸</a>`
        : all.length ? `<div><div class="big-n">✓</div><div>¡Todo al día!${when ? ` Próximo repaso ${when}.` : ''}</div></div><a class="btn ghost" href="#/repasar/libre">Practicar igual</a>`
        : `<div><div>Aún no tienes palabras. Completa tu primera lección en el camino.</div></div><a class="btn primary" href="#/camino">Ir al camino</a>`}
    </div>
    ${all.length ? `<div class="boxes">
      <div><b>${boxes[0]}</b><span>Nuevas</span></div><div><b>${boxes[1]}</b><span>Aprendiendo</span></div>
      <div><b>${boxes[2]}</b><span>Firmes</span></div><div><b>${boxes[3]}</b><span>Dominadas</span></div></div>` : ''}
  </section>`);
}
function relTime(t) {
  const m = Math.round((t - Date.now()) / 60000);
  if (m < 60) return `en ${Math.max(1, m)} min`;
  const h = Math.round(m / 60); if (h < 24) return `en ${h} h`;
  const d = Math.round(h / 24); return d === 1 ? 'mañana' : `en ${d} días`;
}

// ───── Palabras / Kana / Kanji ─────
function viewWords(tab = 'vocab') {
  const p = S.me();
  const tabs = `<div class="tabs"><a href="#/palabras" class="${tab === 'vocab' ? 'on' : ''}">Vocabulario</a><a href="#/palabras/kana" class="${tab === 'kana' ? 'on' : ''}">Tabla de kana</a><a href="#/palabras/kanji" class="${tab === 'kanji' ? 'on' : ''}">Kanji</a></div>`;
  let inner = '';
  if (tab === 'vocab') {
    const list = Object.entries(p.words).filter(([id]) => ENTRIES[id]).sort((a, b) => b[1].at - a[1].at);
    inner = `<p class="lead">Has aprendido <b>${list.length}</b> palabras. Toca una para ver su detalle.</p>
      <input class="search" placeholder="Buscar en japonés o español…" aria-label="Buscar">
      <div class="wlist">${list.map(([id, w]) => { const e = ENTRIES[id]; return `<div class="wrow" data-q="${esc((e.w + ' ' + e.r + ' ' + e.es).toLowerCase())}">
        <div class="wj">${jp(`${e.w}=${e.id}`)}</div><div class="wr" lang="ja">${e.w !== e.r ? esc(e.r) : ''}</div><div class="we">${esc(e.es)}</div>
        <div class="lvl-dots" title="Nivel de memoria ${w.box}/7">${[1, 2, 3, 4, 5, 6, 7].map(i => `<i class="${i <= w.box ? 'on' : ''}"></i>`).join('')}</div>
        ${!WORD_LESSON[id] || w.src === 'lectura' ? `<button class="icon rm" data-rm="${esc(id)}" title="Quitar del repaso">✕</button>` : '<span></span>'}</div>`; }).join('') || '<p class="muted">Aún no hay palabras.</p>'}</div>`;
  } else if (tab === 'kana') {
    const kk = S.knownKana();
    const grid = (base, title) => `<h3>${title}</h3><div class="kgrid">${base.map(k => `<button class="kc ${kk.has(k) ? 'on' : ''}" data-say="${k}"><span lang="ja">${k}</span><small>${KANA[k].r}</small></button>`).join('')}</div>`;
    const dak = Object.values(KANA).filter(x => x.script === 'hira' && /^[がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ]$/.test(x.k)).map(x => x.k);
    inner = `<p class="lead">Toca un carácter para escucharlo. Los que ya aprendiste aparecen destacados.</p>
      ${grid(HIRAGANA_BASIC, 'Hiragana')}${grid(dak, 'Hiragana con dakuten')}${grid(KATAKANA_BASIC, 'Katakana')}`;
  } else {
    const kk = S.knownKanji();
    const all = LESSONS.flatMap(l => [...(l.kanji || '')]);
    inner = `<p class="lead">${kk.size} de ${all.length} kanji aprendidos.</p><div class="kjgrid">${all.map(k => { const K = KANJI[k]; return `<div class="kj ${kk.has(k) ? 'on' : ''}" title="${esc(K?.mn || '')}"><span lang="ja">${k}</span><small>${esc(K?.es || '')}</small><small class="muted" lang="ja">${esc(K?.kun || '')}</small></div>`; }).join('')}</div>`;
  }
  app.innerHTML = shell('palabras', `<section class="page"><h1>辞書 Mis palabras</h1>${tabs}${inner}</section>`);
  const s = $('.search', app);
  if (s) s.oninput = () => { const v = s.value.toLowerCase().trim(); $$('.wrow', app).forEach(r => r.style.display = !v || r.dataset.q.includes(v) ? '' : 'none'); };
  $$('[data-rm]', app).forEach(b => b.onclick = () => { S.removeWord(b.dataset.rm); viewWords(tab); });
}

// ───── Perfil y ajustes ─────
function viewProfile() {
  const p = S.me(), st = S.settings();
  const lessons = Object.values(p.lessons).filter(l => l.done).length;
  const reads = Object.keys(p.readings).length;
  const days = Object.keys(p.days).sort().slice(-28);
  const opt = (k, v, t) => `<option value="${v}" ${String(st[k]) === String(v) ? 'selected' : ''}>${t}</option>`;
  app.innerHTML = shell('perfil', `<section class="page">
    <div class="prof-head"><span class="pav big">${esc(p.avatar)}</span><div><h1>${esc(p.name)}</h1><p class="muted">Aprendiendo desde ${new Date(p.created).toLocaleDateString('es-CL')}</p></div></div>
    <div class="boxes">
      <div><b>${p.xp}</b><span>XP total</span></div><div><b>🔥 ${S.streak()}</b><span>días de racha</span></div>
      <div><b>${lessons}</b><span>lecciones</span></div><div><b>${Object.keys(p.words).length}</b><span>palabras</span></div>
      <div><b>${Object.keys(p.kanji).length}</b><span>kanji</span></div><div><b>${reads}</b><span>lecturas</span></div>
    </div>
    ${days.length ? `<div class="spark" title="XP por día">${days.map(d => `<i style="height:${Math.min(100, 10 + p.days[d])}%" title="${d}: ${p.days[d]} XP"></i>`).join('')}</div>` : ''}
    <h2>Ajustes</h2>
    <div class="settings card">
      <label>Furigana (lectura sobre los kanji)<select data-set="furigana">${opt('furigana', 'auto', 'Solo en kanji que no he aprendido')}${opt('furigana', 'always', 'Siempre')}${opt('furigana', 'never', 'Nunca')}</select></label>
      <label>Espacio entre palabras<select data-set="spacing">${opt('spacing', true, 'Sí (recomendado al principio)')}${opt('spacing', false, 'No (como en japonés real)')}</select></label>
      <label>Romaji en el diccionario<select data-set="romaji">${opt('romaji', true, 'Mostrar')}${opt('romaji', false, 'Ocultar')}</select></label>
      <label>Sonido y voz<select data-set="sound">${opt('sound', true, 'Activado')}${opt('sound', false, 'Desactivado')}</select></label>
      <label>Velocidad de la voz<select data-set="rate">${opt('rate', 0.65, 'Lenta')}${opt('rate', 0.85, 'Normal')}${opt('rate', 1, 'Natural')}</select></label>
      <label>Meta diaria<select data-set="goal">${opt('goal', 30, '30 XP · relajada')}${opt('goal', 50, '50 XP · normal')}${opt('goal', 100, '100 XP · intensa')}</select></label>
      <label>Desbloquear todo el camino<select data-set="unlockAll">${opt('unlockAll', false, 'No (en orden)')}${opt('unlockAll', true, 'Sí (elegir libremente)')}</select></label>
      ${ttsAvailable() && !hasJapaneseVoice() ? '<p class="muted small">⚠️ Tu navegador no tiene una voz japonesa instalada; la pronunciación puede no funcionar. Prueba con Chrome o Edge, o instala una voz japonesa en tu sistema.</p>' : ''}
    </div>
    <h2>Guardar y mover tu progreso</h2>
    <div class="card">
      <p class="small">Tu progreso vive en este navegador. Copia este código para respaldarlo o llevarlo a otro dispositivo (impórtalo en la pantalla de perfiles).</p>
      <textarea class="code" readonly>${S.exportProfile()}</textarea>
      <div class="row"><button class="btn sm" id="copy">Copiar código</button><button class="btn sm ghost" id="dl">Descargar archivo</button></div>
    </div>
    <div class="row wrap">
      <button class="btn ghost" id="switch">Cambiar de perfil</button>
      <button class="btn ghost" id="rename">Cambiar nombre</button>
      <a class="btn ghost" href="#/metodo">Cómo funciona el método</a>
      <button class="btn danger" id="del">Borrar este perfil</button>
    </div>
  </section>`);
  $$('[data-set]', app).forEach(s => s.onchange = () => {
    const v = s.value; S.setSetting(s.dataset.set, v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v);
    toast('Guardado');
  });
  $('#copy', app).onclick = () => { navigator.clipboard?.writeText($('.code', app).value).then(() => toast('Código copiado'), () => { $('.code', app).select(); }); };
  $('#dl', app).onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([$('.code', app).value], { type: 'text/plain' }));
    a.download = `michi-${p.name}.txt`; a.click();
  };
  $('#switch', app).onclick = () => { S.logout(); go('#/perfiles'); };
  $('#rename', app).onclick = () => { const n = prompt('Nuevo nombre', p.name); if (n) { S.renameProfile(n); viewProfile(); } };
  $('#del', app).onclick = () => { if (confirm(`¿Borrar el perfil «${p.name}» y todo su progreso? No se puede deshacer.`)) { S.deleteProfile(p.id); go('#/perfiles'); } };
}

// ───── Metodología ─────
function viewMethod() {
  app.innerHTML = shell('', `<section class="page prose">
    <h1>Cómo funciona Michi</h1>
    <p class="lead">El diseño se basa en investigación sobre adquisición de segundas lenguas y psicología de la memoria.</p>
    <h3>Un camino en orden coherente</h3>
    <p>Primero hiragana, luego katakana, y recién entonces gramática y kanji, como en los cursos universitarios más usados (p. ej. <i>Genki</i>, donde se dominan los kana en las lecciones 1 y 2 antes de introducir kanji). Cada lección introduce pocas cosas nuevas y solo usa lo que ya viste: input "i+1" (Krashen), comprensible pero con un pequeño desafío.</p>
    <h3>Recuperar, no releer</h3>
    <p>Responder preguntas fortalece la memoria mucho más que volver a leer (efecto de la práctica de recuperación; Roediger y Karpicke, 2006). Por eso cada lección es casi toda ejercicios activos, con <b>feedback inmediato que explica el porqué</b>. Las preguntas que fallas vuelven al final de la lección.</p>
    <h3>Repetición espaciada</h3>
    <p>Un meta-análisis de 48 experimentos (Kim y Webb, 2022, <i>Language Learning</i>) encontró un efecto medio-grande del espaciado en el aprendizaje de vocabulario, mejor con intervalos largos en pruebas diferidas. Las palabras nuevas se practican en bloque al aprenderlas y luego en intervalos crecientes (1, 3, 7, 16, 35… días) en la sección Repaso.</p>
    <h3>Producir, no solo reconocer</h3>
    <p>Reconocer la respuesta entre opciones es más fácil que producirla, y producir obliga a notar lo que aún no sabes (hipótesis del output, Swain, 1985). Recordar algo sin pistas también fortalece más la memoria que reconocerlo. Por eso las fichas se van retirando: desde la unidad 4 muchas oraciones hay que <b>escribirlas</b> (en kana, kanji o romaji). Si te trabas, puedes pedir las fichas a cambio de menos XP. En el repaso, una palabra pasa a pedirse escrita cuando ya la reconoces bien.</p>
    <h3>Entrenar el oído</h3>
    <p>Entender japonés hablado es una habilidad distinta de leerlo. Las lecciones incluyen <b>dictados</b>: escuchas una oración y la escribes. Las lecturas tienen el modo <b>🎧 Escuchar primero</b>: respondes las preguntas solo escuchando, oración por oración, y recién después ves el texto. Si te equivocas, puedes volver a escuchar justo la parte que contiene la respuesta.</p>
    <h3>Mnemotecnias para kana y kanji</h3>
    <p>Asociar la forma de un carácter con una imagen y su sonido acelera mucho su aprendizaje (método de <i>Hiragana in 48 minutes</i>, Quackenbush y Ohso, 1983; Heisig). Cada kana y kanji trae su imagen mental.</p>
    <h3>Lectura con 95–98 % de palabras conocidas</h3>
    <p>La comprensión cómoda de un texto se asocia a conocer alrededor del 98 % de sus palabras (Hu y Nation, 2000), aunque estudios posteriores muestran una curva más que un umbral exacto (Schmitt, Jiang y Grabe, 2011). Cada lectura te muestra qué porcentaje ya conoces y te recomienda las que están en tu zona; las palabras nuevas quedan subrayadas y puedes añadirlas a tu repaso.</p>
    <h3>Siempre puedes consultar</h3>
    <p>Todas las palabras japonesas son clicables: significado, lectura, forma del verbo y kanji que la componen. La furigana aparece solo sobre los kanji que aún no aprendes, para que poco a poco leas sin ayuda.</p>
    <h3>Saltar lo que ya sabes</h3>
    <p>Si ya conoces una unidad, "⏩ Ya lo sé" te da una prueba corta: si la apruebas, avanzas directamente.</p>
    <h3>Voces</h3>
    <p>Los audios se generaron con <a href="https://voicevox.hiroshiba.jp/" target="_blank" rel="noopener">VOICEVOX</a>: <b>VOICEVOX:春日部つむぎ</b> y <b>VOICEVOX:玄野武宏</b>. Las palabras y los kana usan siempre la misma voz, como referencia; las oraciones se reparten entre las dos, porque escuchar a distintos hablantes entrena mejor el oído. En los diálogos, cada personaje tiene su voz. Si falta algún audio, se usa la voz japonesa de tu navegador.</p>
    <h3>Referencias</h3>
    <ul class="refs small">
      <li>Hu, M., & Nation, P. (2000). Unknown vocabulary density and reading comprehension. <i>Reading in a Foreign Language</i>, 13(1).</li>
      <li>Kim, S. K., & Webb, S. (2022). The effects of spaced practice on second language learning: A meta-analysis. <i>Language Learning</i>, 72(1), 269–319.</li>
      <li>Krashen, S. (1982). <i>Principles and Practice in Second Language Acquisition</i>. Pergamon.</li>
      <li>Nation, I. S. P. (2006). How large a vocabulary is needed for reading and listening? <i>Canadian Modern Language Review</i>, 63(1).</li>
      <li>Quackenbush, H., & Ohso, M. (1983). <i>Hiragana in 48 Minutes</i>. Curriculum Development Centre.</li>
      <li>Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. <i>Psychological Science</i>, 17(3).</li>
      <li>Swain, M. (1985). Communicative competence: Some roles of comprehensible input and comprehensible output in its development. En Gass & Madden (eds.), <i>Input in Second Language Acquisition</i>. Newbury House.</li>
      <li>Schmitt, N., Jiang, X., & Grabe, W. (2011). The percentage of words known in a text and reading comprehension. <i>The Modern Language Journal</i>, 95(1).</li>
      <li>Banno, E. et al. <i>Genki: An Integrated Course in Elementary Japanese</i> (3ª ed.). The Japan Times.</li>
      <li>Kremmel, B., Indrarathne, B., Kormos, J., & Suzuki, S. (replicación de Hu & Nation 2000), <i>Language Learning</i>.</li>
    </ul>
  </section>`);
}

// ───── Enrutador ─────
export function go(h) { if (location.hash === h) route(); else location.hash = h; }
function route() {
  closePop();
  document.querySelectorAll('.modal').forEach(m => m.remove());
  const [, view, arg] = (location.hash || '#/camino').split('/');
  if (!S.me() && view !== 'perfiles') return go('#/perfiles');
  document.body.dataset.view = view || 'camino';
  window.scrollTo(0, 0);
  switch (view) {
    case 'perfiles': return viewProfiles();
    case 'leccion': {
      const l = LESSONS[LESSON_INDEX[arg]];
      if (!l || !S.isUnlocked(l.id)) return go('#/camino');
      return viewPlayer({ mode: 'lesson', lesson: l });
    }
    case 'prueba': { const u = UNITS.find(x => x.id === arg); return u ? viewPlayer({ mode: 'test', unit: u }) : go('#/camino'); }
    case 'repasar': {
      let ids = S.dueWords(20);
      if (arg === 'libre' || !ids.length) ids = [...S.knownWords()].filter(id => ENTRIES[id]).sort(() => Math.random() - 0.5).slice(0, 15);
      return ids.length ? viewPlayer({ mode: 'review', ids }) : go('#/repaso');
    }
    case 'lecturas': app.innerHTML = shell('lecturas', '<div id="rl"></div>'); return renderList($('#rl'));
    case 'lectura': app.innerHTML = shell('lecturas', '<div id="rd"></div>'); return renderReading($('#rd'), arg);
    case 'repaso': return viewReview();
    case 'palabras': return viewWords(arg || 'vocab');
    case 'perfil': return viewProfile();
    case 'metodo': return viewMethod();
    default: return viewPath();
  }
}
addEventListener('hashchange', route);
route();
