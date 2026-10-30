// Genera los audios de pronunciación con VOICEVOX (https://voicevox.hiroshiba.jp/).
//
//   docker run -d --rm --name voicevox -p 127.0.0.1:50021:50021 voicevox/voicevox_engine:cpu-latest
//   node tools/gen-audio.mjs            # genera los que falten y actualiza audio/index.json
//   node tools/gen-audio.mjs --list     # solo cuenta los textos
//
// Cada texto se guarda como audio/<audioKey>.mp3; la app consulta audio/index.json y, si falta
// un archivo, usa la voz del navegador. La lectura que estima el motor se compara con la del
// diccionario; si no coinciden (p. ej. 日本人 → ニッポンジン), se sintetiza desde la kana.

import { mkdirSync, existsSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ENTRIES, tokenize, spoken, tokSay, sayWord, audioKey, voiceOf, autoVoice, readingVoice, toRomaji, toHira, toKata } from '../js/dict.js';
import { KANA } from '../js/data/kana.js';
import { STEPS } from '../js/data/lessons/index.js';
import READINGS from '../js/data/readings.js';
import { BANK, examScript } from '../js/data/exam/index.js';

const ENGINE = process.env.VOICEVOX || 'http://127.0.0.1:50021';
const SPEAKER = { f: 8, m: 11 };   // 春日部つむぎ, 玄野武宏
const OUT = fileURLToPath(new URL('../audio/', import.meta.url));
const PRT = { 'は': 'わ', 'へ': 'え', 'を': 'お' };

// ───── Reunir todos los textos que la app puede pronunciar ─────
const items = new Map();   // key -> { text, voice, reading }
function add(text, voice = null, reading = null) {
  voice = voice || autoVoice(text);
  if (!text || !text.replace(/[。、！？…「」]/g, '')) return;
  const key = audioKey(text, voice);
  if (!items.has(key)) items.set(key, { key, text, voice, reading });
}
const expected = toks => toks.filter(t => !t.punct && !t.blank).map(t => t.raw?.includes('|') ? t.reading
  : t.entry?.pos === 'prt' && PRT[t.surface] ? PRT[t.surface] : (t.reading || t.surface)).join('');
function addJp(text, voice = null) {
  const toks = tokenize(text);
  add(spoken(text), voice, expected(toks));
  for (const t of toks) if (!t.punct && !t.blank) add(tokSay(t, true), 'f', t.entry?.pos === 'prt' && PRT[t.surface] ? PRT[t.surface] : (t.reading || t.surface));
}
for (const e of Object.values(ENTRIES)) add(sayWord(e), 'f', e.pos === 'prt' && PRT[e.r] ? PRT[e.r] : e.r);
for (const e of Object.values(ENTRIES)) for (const f of [e.w, e.r]) { const [t] = tokenize(f); if (t?.entry) add(tokSay(t, true), 'f', t.entry.pos === 'prt' && PRT[t.surface] ? PRT[t.surface] : t.reading || t.surface); }
for (const k of Object.keys(KANA)) if (!/^[ーっッ]$/.test(k)) add(k, 'f', k);
const hasJp = s => /[぀-ヿ一-龯]/.test(s || '');
for (const steps of Object.values(STEPS)) for (const s of steps) {
  if (s.jp) addJp(s.t === 'fill' ? s.jp.replace('＿', s.opts[s.a]) : s.jp);
  for (const [j] of s.ex || []) addJp(j);
  for (const [who, j] of s.lines || []) addJp(j, voiceOf(who));
  for (const m of `${s.body || ''} ${s.tip || ''} ${s.title || ''}`.matchAll(/\{([^}]+)\}/g)) addJp(m[1]);
  if (s.opts && !s.kana && (s.t === 'fill' || s.opts.every(hasJp))) s.opts.forEach(o => addJp(o));
  for (const x of [...(s.extra || []), ...(s.alt || [])]) addJp(x);
  for (const [a] of s.pairs || []) if (hasJp(a)) addJp(a);
}
for (const r of READINGS) {
  addJp(r.title);
  for (const [j] of r.paras.flat()) addJp(j, readingVoice(r.id));
  for (const q of r.questions) {
    if (q.qjp) addJp(q.qjp);
    if (q.opts?.every(hasJp)) q.opts.forEach(o => addJp(o));
  }
}

// Simulacro: los guiones de 聴解 con la voz de cada parte; del resto, solo las palabras (para el diccionario al revisar)
const addToks = text => { for (const t of tokenize(text)) if (!t.punct && !t.blank && t.entry) add(tokSay(t, true), 'f', t.entry.pos === 'prt' && PRT[t.surface] ? PRT[t.surface] : (t.reading || t.surface)); };
for (const [type, list] of Object.entries(BANK)) for (const it of list) {
  if (type.startsWith('chokai')) { for (const [j, v] of examScript(type, it)) addJp(j, v); continue; }
  const texts = [it.jp, it.pre, it.post, it.title, ...(it.pieces || []), ...(it.paras || []).map(p => Array.isArray(p) ? p[0] : p),
    ...(it.table ? [...it.table.cols, ...it.table.rows.flat()] : []), ...(it.questions || []).flatMap(q => [q.qjp, ...q.opts]),
    ...(it.gaps || []).flatMap(g => g.opts), ...(type === 'moji1' || type === 'moji2' ? [] : it.opts || [])];
  texts.filter(Boolean).forEach(t => addToks(t.replace(/＿/g, ' ')));
}

const all = [...items.values()];
console.log(`${all.length} textos (${all.filter(i => i.voice === 'm').length} con voz masculina)`);
if (process.argv.includes('--list')) process.exit(0);

// ───── Síntesis ─────
const norm = s => toRomaji(toHira(s.replace(/['/_、。？！「」]/g, ''))).replace(/ou/g, 'oo').replace(/ei/g, 'ee')
  .replace(/konnichiha/g, 'konnichiwa').replace(/konbanha/g, 'konbanwa').replace(/[^a-z]/g, '');
async function query(text, speaker) {
  const r = await fetch(`${ENGINE}/audio_query?speaker=${speaker}&text=${encodeURIComponent(text)}`, { method: 'POST' });
  if (!r.ok) throw new Error(`audio_query ${r.status}: ${text}`);
  return r.json();
}
async function synth(item) {
  const speaker = SPEAKER[item.voice];
  // 1) texto original  2) lectura en hiragana  3) lectura en katakana (ハ nunca se lee como la partícula わ)
  let q = await query(item.text, speaker);
  let fixed = false;
  if (item.reading && norm(q.kana) !== norm(item.reading)) {
    let ok = false;
    for (const alt of [toHira(item.reading), toKata(item.reading)]) {
      const q2 = await query(alt, speaker);
      if (norm(q2.kana) === norm(item.reading)) { q = q2; fixed = ok = true; break; }
    }
    if (!ok) mismatches.push(`${item.text}  esperado ${item.reading}  motor ${q.kana}`);
  }
  // sin alargar vocales: いえ y いいえ tienen que sonar distintos
  Object.assign(q, { speedScale: 0.95, prePhonemeLength: 0.08, postPhonemeLength: 0.15 });
  const r = await fetch(`${ENGINE}/synthesis?speaker=${speaker}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q) });
  if (!r.ok) throw new Error(`synthesis ${r.status}: ${item.text}`);
  const wav = join(tmpdir(), `michi-${item.key}.wav`);
  writeFileSync(wav, Buffer.from(await r.arrayBuffer()));
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', wav, '-ac', '1', '-ar', '24000', '-codec:a', 'libmp3lame', '-b:a', '40k', join(OUT, item.key + '.mp3')]);
  unlinkSync(wav);
  return fixed;
}

mkdirSync(OUT, { recursive: true });
// --recheck: vuelve a generar los audios cuya lectura estimada no coincide con el diccionario
if (process.argv.includes('--recheck')) {
  let n = 0;
  for (const it of all) {
    const f = join(OUT, it.key + '.mp3');
    if (!it.reading || !existsSync(f)) continue;
    const q = await query(it.text, SPEAKER[it.voice]);
    if (norm(q.kana) !== norm(it.reading)) { unlinkSync(f); n++; }
  }
  console.log(`${n} audios a regenerar por lectura distinta`);
}
const todo = all.filter(i => !existsSync(join(OUT, i.key + '.mp3')));
console.log(`${todo.length} por generar`);
const mismatches = [];
let done = 0, fixedN = 0;
async function worker() {
  while (todo.length) {
    const it = todo.shift();
    try { if (await synth(it)) fixedN++; } catch (e) { console.error('✗', e.message); }
    if (++done % 100 === 0) console.log(`  ${done}…`);
  }
}
await Promise.all([worker(), worker(), worker()]);

// Índice y limpieza de archivos que ya no se usan
const keys = new Set(all.map(i => i.key));
for (const f of readdirSync(OUT)) if (f.endsWith('.mp3') && !keys.has(f.slice(0, -4))) unlinkSync(join(OUT, f));
const present = all.filter(i => existsSync(join(OUT, i.key + '.mp3'))).map(i => i.key).sort();
writeFileSync(join(OUT, 'index.json'), JSON.stringify(present));
console.log(`✓ ${present.length} audios en audio/ · ${fixedN} leídos desde kana por lectura distinta`);
if (mismatches.length) console.log(`Lecturas que no se pudieron verificar (${mismatches.length}):\n` + mismatches.join('\n'));
