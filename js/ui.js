// Utilidades de interfaz: texto japonés clicable, ventana de significado, avisos y sonidos.

import { tokenize, rubyParts, hasKanji, toRomaji, kanjiIn, ENTRIES, lookup, spoken, tokSay, romajiToHira } from './dict.js';
export { spoken, romajiToHira };
import { KANJI } from './data/kanji.js';
import { LESSONS } from './data/curriculum.js';
import * as S from './state.js';
import { speak } from './tts.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const pick = (a, n) => shuffle(a).slice(0, n);
export const hasJp = s => /[぀-ヿ一-龯]/.test(s || '');

export const POS = {
  n: 'sustantivo', pron: 'pronombre', v1: 'verbo · grupo 2 (-ru)', v5: 'verbo · grupo 1 (-u)', v3: 'verbo irregular',
  'adj-i': 'adjetivo い', 'adj-na': 'adjetivo な', adv: 'adverbio', prt: 'partícula', cop: 'cópula', exp: 'expresión',
  suf: 'sufijo', num: 'número', ctr: 'contador', q: 'interrogativo', conj: 'conector', name: 'nombre propio',
};

// Lección donde se enseña cada palabra
export const WORD_LESSON = {};
LESSONS.forEach((l, i) => (l.words || []).forEach(w => { const e = lookup(w); if (e) WORD_LESSON[e.id] = { l, i }; }));

export function romajiOf(e, reading) {
  return toRomaji(reading || e.r, { particle: e.pos === 'prt' });
}

// ¿Mostrar furigana sobre este segmento de kanji?
function wantRuby(seg) {
  const mode = S.settings().furigana;
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  const kk = S.knownKanji();
  return kanjiIn(seg).some(k => !kk.has(k));
}

// Texto japonés tokenizado → HTML con palabras clicables
export function jp(text, { cls = '', plain = false, mark = 'none', blank = '' } = {}) {
  const toks = tokenize(text);
  const spacing = S.settings().spacing;
  const out = toks.map((t, i) => {
    if (t.blank) return blank || '<span class="blank">　</span>';
    if (t.punct) return `<span class="pu">${esc(t.surface)}</span>`;
    const inner = rubyParts(t.surface, t.reading).map(([s, rt]) => rt && wantRuby(s) ? `<ruby>${esc(s)}<rt>${esc(rt)}</rt></ruby>` : esc(s)).join('');
    if (plain) return `<span class="wd">${inner}</span>`;
    const id = t.entry?.id || '';
    let st = '';
    if (mark !== 'none' && t.entry && t.entry.pos !== 'name') st = S.isKnown(id) ? '' : ' new';
    return `<span class="w${st}" tabindex="0" data-id="${esc(id)}" data-s="${esc(t.surface)}" data-r="${esc(t.reading)}" data-l="${esc(t.label)}" data-v="${esc(tokSay(t, true))}">${inner}</span>`;
  });
  return `<span class="jp${spacing ? ' sp' : ''} ${cls}" lang="ja">${out.join('')}</span>`;
}

// Marcado ligero para explicaciones: **negrita**, *cursiva*, {japonés}, saltos de línea
export function rich(s) {
  if (!s) return '';
  const parts = String(s).split(/(\{[^}]+\})/g);
  return parts.map(p => p.startsWith('{') && p.endsWith('}') ? jp(p.slice(1, -1)) :
    esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/\n/g, '<br>')).join('');
}

// Botón de audio para texto japonés tokenizado (voice: 'f' | 'm')
export const audioBtn = (text, label = '', voice = '') => sayBtn(spoken(text), label, voice);
// Botón de audio para un texto ya listo para pronunciar
export function sayBtn(say, label = '', voice = '') {
  return `<button class="audio" data-say="${esc(say)}"${voice ? ` data-voice="${voice}"` : ''} aria-label="Escuchar">🔊${label ? ' ' + esc(label) : ''}</button>`;
}

// ───── Ventana de significado ─────
let pop = null;
export function closePop() { if (pop) { pop.remove(); pop = null; } }
function showWord(el) {
  closePop();
  const e = ENTRIES[el.dataset.id];
  const surface = el.dataset.s, reading = el.dataset.r, label = el.dataset.l;
  pop = document.createElement('div');
  pop.className = 'pop';
  pop.setAttribute('role', 'dialog');
  if (!e) {
    pop.innerHTML = `<div class="pop-w" lang="ja">${esc(surface)}</div><p class="muted">Sin entrada en el diccionario.</p>`;
  } else {
    const known = S.isKnown(e.id);
    const wl = WORD_LESSON[e.id];
    const kanjiChips = kanjiIn(e.w + surface).filter((k, i, a) => a.indexOf(k) === i).map(k => KANJI[k]
      ? `<span class="kchip" title="${esc(KANJI[k].on)} · ${esc(KANJI[k].kun)}"><b lang="ja">${k}</b> ${esc(KANJI[k].es)}</span>` : '').join('');
    const lemma = (surface !== e.w && surface !== e.r)
      ? `<div class="pop-form">Forma de <b lang="ja">${esc(e.w)}</b>${e.w !== e.r ? ` (<span lang="ja">${esc(e.r)}</span>)` : ''}${label ? ` · ${esc(label)}` : ''}</div>` : '';
    const ruby = rubyParts(surface, reading).map(([s, rt]) => rt ? `<ruby>${esc(s)}<rt>${esc(rt)}</rt></ruby>` : esc(s)).join('');
    let status;
    if (e.pos === 'name') status = '<span class="tag">nombre propio</span>';
    else if (known) status = '<span class="tag ok">✓ ya la aprendiste</span>';
    else status = `<span class="tag new">nueva</span>${wl ? ` <span class="muted small">se enseña en «${esc(wl.l.title)}»</span>` : ''} <button class="btn sm" data-addword="${esc(e.id)}">+ Añadir a repaso</button>`;
    pop.innerHTML = `
      <div class="pop-head"><div class="pop-w" lang="ja">${ruby}</div>${sayBtn(el.dataset.v, '', 'f')}</div>
      ${hasKanji(surface) || /[゠-ヿ]/.test(surface) ? `<div class="pop-r" lang="ja">${esc(reading)}</div>` : ''}
      ${S.settings().romaji ? `<div class="pop-ro">${esc(romajiOf(e, reading))}</div>` : ''}
      <div class="pop-es">${esc(e.es)}</div>
      ${lemma}
      <div class="pop-pos">${esc(POS[e.pos] || e.pos)}${e.w !== surface && !lemma ? ` · se escribe <span lang="ja">${esc(e.w)}</span>` : ''}</div>
      ${e.note ? `<div class="pop-note">💡 ${rich(e.note)}</div>` : ''}
      ${kanjiChips ? `<div class="pop-k">${kanjiChips}</div>` : ''}
      <div class="pop-st">${status}</div>`;
  }
  document.body.appendChild(pop);
  const r = el.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
  let x = r.left + r.width / 2 - pw / 2; x = Math.max(8, Math.min(x, innerWidth - pw - 8));
  let y = r.bottom + 8; if (y + ph > innerHeight - 8) y = Math.max(8, r.top - ph - 8);
  pop.style.left = x + 'px'; pop.style.top = y + 'px';
  if (S.settings().sound !== false && e) speak(el.dataset.v, S.settings().rate, 'f');
}

document.addEventListener('click', ev => {
  const say = ev.target.closest('[data-say]');
  if (say) { ev.stopPropagation(); speak(say.dataset.say, S.settings().rate, say.dataset.voice); return; }
  const add = ev.target.closest('[data-addword]');
  if (add) { S.addWordToReview(add.dataset.addword); toast('Añadida a tu repaso'); closePop(); document.dispatchEvent(new CustomEvent('words-changed')); return; }
  const w = ev.target.closest('.w');
  if (w && !w.closest('.tile') && !w.closest('.opt')) { ev.stopPropagation(); showWord(w); return; }
  if (pop && !ev.target.closest('.pop')) closePop();
});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape') closePop();
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList?.contains('w')) { ev.preventDefault(); showWord(ev.target); }
});
addEventListener('scroll', closePop, true);
addEventListener('resize', closePop);

// ───── Avisos ─────
export function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('out'), 1800);
  setTimeout(() => t.remove(), 2300);
}

// ───── Sonidos cortos (WebAudio, sin archivos) ─────
let ac = null;
export function sfx(kind) {
  if (S.settings().sound === false) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [660, 880], bad: [220, 180], done: [523, 659, 784, 1047], tap: [440] }[kind] || [440];
    notes.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = kind === 'bad' ? 'triangle' : 'sine'; o.frequency.value = f;
      const t0 = ac.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + 0.25);
    });
  } catch { /* sin audio */ }
}

export function confetti() {
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = ['#e8590c', '#1971c2', '#2f9e44', '#f59f00', '#c2255c', '#7048e8'];
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('i');
    s.style.left = Math.random() * 100 + '%';
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = Math.random() * 0.6 + 's';
    s.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3200);
}

