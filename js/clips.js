// Clips: frases cortas de anime y de japonés real en un video de YouTube. Se escucha, se responde y recién después se ve el texto.

import CLIPS from './data/clips.js';
import { LESSONS, LESSON_INDEX } from './data/curriculum.js';
import * as S from './state.js';
import { coverage, qHTML } from './reader.js';
import { esc, $, $$, jp, rich, sfx } from './ui.js';
import { t } from './uitext.js';

let api;   // la API de YouTube se carga una sola vez, al abrir el primer clip
const ytApi = () => api ||= new Promise((res, rej) => {
  window.onYouTubeIframeAPIReady = () => res(window.YT);
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  s.onerror = () => { api = null; rej(); };
  document.head.append(s);
});

const sorted = () => [...CLIPS].sort((a, b) => (LESSON_INDEX[a.after] ?? 99) - (LESSON_INDEX[b.after] ?? 99));

export function renderClipList(root) {
  root.innerHTML = `<section class="page">
    <h1>映 ${t('nav.clips')}</h1>
    <p class="lead">Frases cortas de anime y de japonés real, en videos de YouTube de sus propios canales. Escucha, responde y recién después mira el texto. El porcentaje indica cuántas palabras de la frase ya conoces.</p>
    <div class="rgrid">${sorted().map(card).join('')}</div>
  </section>`;
}

function card(c) {
  const cov = coverage(c), done = S.me()?.readings[c.id];
  return `<a class="rcard ${cov.pct >= 90 ? 'easy' : cov.pct >= 75 ? 'mid' : 'hard'}" href="#/clip/${c.id}">
    <div class="rc-top"><span class="rc-topic" lang="ja">${esc(c.src)}</span>${done ? `<span class="tag ok">✓ ${done.best}/${done.total}</span>` : ''}</div>
    <div class="rc-title">${esc(c.es)}</div>
    <div class="meter" title="Palabras que conoces"><i style="width:${cov.pct}%"></i></div>
    <div class="rc-foot"><span>${cov.pct}% conocidas</span><span>${Math.round(c.to - c.from)} s</span></div>
    ${cov.pct < 90 && !S.lessonDone(c.after) ? `<div class="rc-after">Ideal después de «${esc(LESSONS[LESSON_INDEX[c.after]].title)}»</div>` : ''}
  </a>`;
}

export function renderClip(root, id) {
  const c = CLIPS.find(x => x.id === id);
  if (!c) { root.innerHTML = '<section class="page"><p>Clip no encontrado.</p><a href="#/clips">← Volver</a></section>'; return; }
  const cov = coverage(c);
  root.innerHTML = `<section class="page reader">
    <a class="back" href="#/clips">← Clips</a>
    <div class="r-head"><span class="muted" lang="ja">${esc(c.src)}</span><h1>${esc(c.es)}</h1></div>
    <div class="clip-video"><div id="yt"></div></div>
    <div class="r-tools"><button class="btn primary" id="clipPlay" disabled>▶ Reproducir</button></div>
    <div class="cov"><div class="meter"><i style="width:${cov.pct}%"></i></div><span>Conoces el <b>${cov.pct}%</b> de las palabras</span></div>
    <section class="questions">
      <h2>${t('r.questions')}</h2>
      <p class="muted small">Responde a partir de lo que escuchaste. El texto aparece al terminar.</p>
      ${c.questions.map(qHTML).join('')}
      <div class="qscore hidden"></div>
    </section>
    <article class="text marknew showtr veiled">
      <div class="veil"><p>El texto está oculto para practicar la escucha.</p><button class="btn sm" id="reveal">Mostrar texto</button></div>
      <p>${c.paras.flat().map(([j, es]) => `<span class="sent"><span class="sj">${jp(j, { mark: 'known' })}</span><span class="str">${rich(es)}</span></span>`).join('')}</p>
      ${c.note ? `<p class="clip-note">${rich(c.note)}</p>` : ''}
    </article>
    <p class="muted small"><a href="https://www.youtube.com/watch?v=${c.yt}&t=${Math.floor(c.from)}s" target="_blank" rel="noopener">Ver el episodio en YouTube ↗</a></p>
  </section>`;

  // ── Video: solo suena el tramo from–to ──
  const btn = $('#clipPlay', root);
  const fail = msg => { $('.clip-video', root).innerHTML = `<p class="callout muted">${msg}</p>`; btn.remove(); };
  let player, tick;
  ytApi().then(YT => {
    if (!$('#yt', root)?.isConnected) return;   // ya se salió de la página
    player = new YT.Player($('#yt', root), {
      videoId: c.yt,
      playerVars: { start: Math.floor(c.from), controls: 0, disablekb: 1, rel: 0, playsinline: 1, iv_load_policy: 3 },
      events: {
        onReady: () => { btn.disabled = false; },
        onError: () => fail('Este clip ya no está disponible en YouTube.'),
        // sin subtítulos: regalarían la respuesta. YouTube avisa aquí cuando carga su módulo de subtítulos;
        // una pista vacía los apaga (unloadModule no tiene efecto)
        onApiChange: () => { if (player.getOptions().includes('captions')) player.setOption('captions', 'track', {}); },
        // el corte se hace aquí porque los parámetros start/end de YouTube solo aceptan segundos enteros
        onStateChange: ev => {
          clearInterval(tick);
          if (ev.data === YT.PlayerState.PLAYING) tick = setInterval(() => {
            if (!player.getIframe().isConnected) return clearInterval(tick);
            if (player.getCurrentTime() >= c.to) player.pauseVideo();
          }, 100);
        },
      },
    });
  }, () => fail('No se pudo cargar YouTube. Revisa tu conexión.'));
  btn.onclick = () => { player.seekTo(c.from, true); player.playVideo(); btn.textContent = '↻ Repetir'; };

  // ── Texto y preguntas ──
  const text = $('.text', root);
  let revealed = false;
  const reveal = () => { text.classList.remove('veiled'); $('.veil', text)?.remove(); };
  $('#reveal', root).onclick = () => { revealed = true; reveal(); };

  const results = new Array(c.questions.length).fill(null);
  $$('.rq', root).forEach((box, i) => {
    const q = c.questions[i], check = $('.check', box);
    let sel = null;
    $$('.ro', box).forEach(o => o.onclick = () => { $$('.ro', box).forEach(x => x.classList.remove('sel')); o.classList.add('sel'); sel = +o.dataset.v; check.disabled = false; });
    check.onclick = () => {
      const ok = results[i] = sel === q.a;
      sfx(ok ? 'ok' : 'bad');
      box.classList.add(ok ? 'good' : 'bad');
      $$('.ro', box).forEach(o => { o.disabled = true; if (+o.dataset.v === q.a) o.classList.add('right'); else if (o.classList.contains('sel')) o.classList.add('wrong'); });
      check.remove();
      $('.rfb', box).innerHTML = `<b>${ok ? '✓ ¡Correcto!' : '✗ No es correcto.'}</b> ${rich(q.why || '')}`;
      if (results.every(x => x !== null)) finish();
    };
  });

  function finish() {
    const score = results.filter(Boolean).length;
    // el progreso se guarda junto al de las lecturas (los ids de clip empiezan con «c»)
    S.saveReading(c.id, score, results.length, !revealed);
    S.addXP(score * 10 + 10);
    reveal();
    sfx('done');
    const list = sorted(), next = list[list.indexOf(c) + 1];
    const box = $('.qscore', root);
    box.classList.remove('hidden');
    box.innerHTML = `<h3>${score} de ${results.length} correctas · +${score * 10 + 10} XP</h3>
      <p>Ahora lee el texto y vuelve a escuchar el clip.</p>
      <div class="row center"><button class="btn ghost" id="retry">${t('prev.again')}</button>${next ? `<a class="btn primary" href="#/clip/${next.id}">Siguiente clip →</a>` : ''}</div>`;
    $('#retry', box).onclick = () => { renderClip(root, id); scrollTo(0, 0); };
  }
}
