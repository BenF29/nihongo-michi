// Perfiles y progreso. Todo se guarda en localStorage del navegador, con exportar/importar.

import { LESSONS, UNITS, LESSON_INDEX } from './data/curriculum.js';
import { lookup, ENTRIES } from './dict.js';
import { splitKana } from './data/kana.js';

const KEY = 'michi:v1';
const DAY = 86400000;
// Intervalos del sistema de repetición espaciada (días) por "caja" (Leitner expandido)
export const SRS_DAYS = [0, 1, 3, 7, 16, 35, 80, 180];

const today = () => new Date().toISOString().slice(0, 10);

function defaults(name, avatar) {
  return {
    id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, avatar: avatar || '🦊', created: Date.now(),
    xp: 0, streak: { n: 0, last: null }, days: {},
    lessons: {}, tests: {}, words: {}, kana: {}, kanji: {}, readings: {},
    settings: { furigana: 'auto', spacing: true, romaji: true, rate: 0.85, sound: true, goal: 50, unlockAll: false, readMode: 'read' },
  };
}

let db = { current: null, profiles: {} };
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) db = JSON.parse(raw); } catch { /* almacenamiento no disponible */ }
  if (!db.profiles) db = { current: null, profiles: {} };
}
load();
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* sin almacenamiento: el progreso dura la sesión */ }
}

const listeners = new Set();
export const onChange = fn => listeners.add(fn);
const emit = () => { save(); listeners.forEach(fn => fn()); };

// ───── Perfiles ─────
export const profiles = () => Object.values(db.profiles).sort((a, b) => a.created - b.created);
export const me = () => db.profiles[db.current] || null;
export function createProfile(name, avatar) {
  const p = defaults(name.trim() || 'Estudiante', avatar);
  db.profiles[p.id] = p; db.current = p.id; emit(); return p;
}
export function selectProfile(id) { if (db.profiles[id]) { db.current = id; emit(); } }
export function logout() { db.current = null; emit(); }
export function deleteProfile(id) { delete db.profiles[id]; if (db.current === id) db.current = null; emit(); }
export function renameProfile(name, avatar) { const p = me(); if (!p) return; if (name) p.name = name; if (avatar) p.avatar = avatar; emit(); }
export function setSetting(k, v) { const p = me(); if (!p) return; p.settings[k] = v; emit(); }
export const settings = () => ({ ...defaults('').settings, ...(me()?.settings || {}) });

export function exportProfile() {
  const p = me(); if (!p) return '';
  return btoa(unescape(encodeURIComponent(JSON.stringify(p))));
}
export function importProfile(code) {
  let p;
  try { p = JSON.parse(code.trim().startsWith('{') ? code : decodeURIComponent(escape(atob(code.trim())))); }
  catch { throw new Error('El código no es válido.'); }
  if (!p || !p.id || !p.lessons) throw new Error('El código no contiene un perfil.');
  const base = defaults(p.name);
  p = { ...base, ...p, settings: { ...base.settings, ...p.settings } };
  db.profiles[p.id] = p; db.current = p.id; emit(); return p;
}

// ───── XP y racha ─────
export function addXP(n) {
  const p = me(); if (!p || !n) return;
  p.xp += n;
  const d = today();
  p.days[d] = (p.days[d] || 0) + n;
  if (p.streak.last !== d) {
    const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
    p.streak.n = p.streak.last === y ? p.streak.n + 1 : 1;
    p.streak.last = d;
  }
  emit();
}
export function streak() {
  const p = me(); if (!p || !p.streak.last) return 0;
  const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
  return (p.streak.last === today() || p.streak.last === y) ? p.streak.n : 0;
}
export const xpToday = () => me()?.days[today()] || 0;

// ───── Conocimiento ─────
export function knownWords() {
  const p = me(); const s = new Set(p ? Object.keys(p.words) : []);
  return s;
}
export function isKnown(id) {
  const e = ENTRIES[id]; if (!e) return false;
  return e.pos === 'name' || !!me()?.words[id];
}
export const knownKanji = () => new Set(Object.keys(me()?.kanji || {}));
export const knownKana = () => new Set(Object.keys(me()?.kana || {}));

function learnWord(id, src) {
  const p = me(); if (!p || p.words[id]) return false;
  p.words[id] = { box: 1, due: Date.now() + SRS_DAYS[1] * DAY, at: Date.now(), src };
  return true;
}
export function addWordToReview(id, src = 'lectura') { if (learnWord(id, src)) emit(); }
export function removeWord(id) { const p = me(); if (p) { delete p.words[id]; emit(); } }

function learnLessonContent(l, p) {
  for (const w of l.words || []) { const e = lookup(w); if (e) learnWord(e.id, l.id); }
  for (const k of splitKana(l.kana || '')) p.kana[k] = 1;
  for (const k of l.kanji || '') p.kanji[k] = 1;
}

// ───── Lecciones ─────
export const lessonDone = id => !!me()?.lessons[id]?.done;
export function completeLesson(id, acc) {
  const p = me(); const l = LESSONS[LESSON_INDEX[id]]; if (!p || !l) return;
  const prev = p.lessons[id];
  p.lessons[id] = { done: true, acc: Math.max(acc, prev?.acc || 0), at: Date.now(), n: (prev?.n || 0) + 1 };
  learnLessonContent(l, p);
  emit();
}
export function isUnlocked(id) {
  const p = me(); if (!p) return false;
  if (p.settings.unlockAll) return true;
  const i = LESSON_INDEX[id];
  return i === 0 || lessonDone(id) || lessonDone(LESSONS[i - 1].id);
}
export function nextLesson() {
  return LESSONS.find(l => !lessonDone(l.id)) || null;
}
// Aprobar la prueba de una unidad completa esa unidad y todas las anteriores
export function passUnitTest(unitId, acc) {
  const p = me(); if (!p) return;
  const ui = UNITS.findIndex(u => u.id === unitId);
  for (const u of UNITS.slice(0, ui + 1)) {
    for (const l of u.lessons) {
      if (!p.lessons[l.id]?.done) p.lessons[l.id] = { done: true, acc, at: Date.now(), n: 0, skipped: true };
      learnLessonContent(l, p);
    }
  }
  p.tests[unitId] = { acc, at: Date.now() };
  emit();
}

// ───── Repetición espaciada ─────
export function dueWords(limit = 999) {
  const p = me(); if (!p) return [];
  const now = Date.now();
  return Object.entries(p.words).filter(([id, w]) => ENTRIES[id] && w.due <= now)
    .sort((a, b) => a[1].due - b[1].due).slice(0, limit).map(([id]) => id);
}
export function gradeWord(id, ok) {
  const p = me(); const w = p?.words[id]; if (!w) return;
  w.box = ok ? Math.min(w.box + 1, SRS_DAYS.length - 1) : 1;
  // pequeño desorden para que no venzan todas juntas
  const jitter = 1 + (Math.random() * 0.2 - 0.1);
  w.due = Date.now() + (ok ? SRS_DAYS[w.box] * DAY * jitter : 10 * 60000);
  w.seen = (w.seen || 0) + 1; if (!ok) w.lapses = (w.lapses || 0) + 1;
  emit();
}

// ───── Lecturas ─────
// listened: respondió solo escuchando, sin mostrar el texto
export function saveReading(id, score, total, listened = false) {
  const p = me(); if (!p) return;
  const prev = p.readings[id];
  p.readings[id] = { best: Math.max(score, prev?.best || 0), total, at: Date.now(), tries: (prev?.tries || 0) + 1,
    listened: !!prev?.listened || (listened && score === total) };
  emit();
}
