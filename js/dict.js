// Lógica de diccionario y texto japonés. Sin DOM: también la usa tools/validate.mjs.
//
// Formato de texto: tokens separados por espacios. Cada token:
//   superficie[|lectura][=lema][:etiqueta]
//   - superficie: lo que se muestra (たべます, 食べました, 三百…)
//   - |lectura: lectura en kana si no se puede deducir (三百|さんびゃく)
//   - =lema: id/escritura/lectura de la entrada del diccionario (たべます=食べる)
//   - :etiqueta: explicación de la forma (じゃありません=です:negativo)
// Tokens de puntuación (。、？！「」…) y ＿ (espacio para rellenar) no son palabras.

import { VOCAB } from './data/vocab.js';
import { VOCAB_EXTRA } from './data/vocab_extra.js';

export const ENTRIES = {};          // id -> entrada
const BY_W = {}, BY_R = {};

export function addEntries(list, source) {
  for (const [w, r, es, pos, note, id0] of list) {
    const id = id0 || w;
    if (ENTRIES[id]) { ENTRIES[id].dup = true; continue; }
    const e = { id, w, r, es, pos, note: note || '', source };
    ENTRIES[id] = e;
    if (!BY_W[w]) BY_W[w] = e;
    if (!BY_R[r]) BY_R[r] = e;
  }
}
addEntries(VOCAB, 'core');
addEntries(VOCAB_EXTRA, 'extra');

export function lookup(key) {
  return ENTRIES[key] || BY_W[key] || BY_R[key] || null;
}

const PUNCT = /^[。、？！?!「」『』（）()…・〜ー～,.:;“”\-—]+$/;
export const isPunct = s => PUNCT.test(s);
export const BLANK = '＿';

export function parseToken(raw) {
  if (raw === BLANK) return { raw, surface: BLANK, blank: true };
  if (isPunct(raw)) return { raw, surface: raw, punct: true };
  let rest = raw, label = '', lemma = '', reading = '';
  const ci = rest.indexOf(':');
  if (ci > 0) { label = rest.slice(ci + 1); rest = rest.slice(0, ci); }
  const ei = rest.indexOf('=');
  if (ei > 0) { lemma = rest.slice(ei + 1); rest = rest.slice(0, ei); }
  const pi = rest.indexOf('|');
  if (pi > 0) { reading = rest.slice(pi + 1); rest = rest.slice(0, pi); }
  const surface = rest;
  const entry = lookup(lemma || surface);
  const tok = { raw, surface, reading, lemma, label, entry };
  if (entry && !tok.reading) tok.reading = surfaceReading(surface, entry);
  if (entry && !tok.label && surface !== entry.w && surface !== entry.r) tok.label = inflectionLabel(surface, entry);
  return tok;
}

export const tokenize = (text) => text.trim().split(/\s+/).filter(Boolean).map(parseToken);

// ───── Escritura ─────
export const hasKanji = s => /[一-龯々]/.test(s);
export const isKana = s => /^[぀-ヿー]+$/.test(s);
export const kanjiIn = s => [...s].filter(c => hasKanji(c));
export const toHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
export const toKata = s => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));

// Lectura de una superficie conjugada a partir de su entrada
export function surfaceReading(surface, e) {
  if (!hasKanji(surface)) return surface;
  if (surface === e.w) return e.r;
  if (e.w === '来る' && surface[0] === '来') {   // irregular: く(る), き(ます/て), こ(ない)
    const rest = surface.slice(1);
    return (/^(る|れ)/.test(rest) ? 'く' : /^(な|よう|られ|させ)/.test(rest) ? 'こ' : 'き') + rest;
  }
  // prefijo común entre superficie y escritura del lema (食べ de 食べました / 食べる)
  let i = 0;
  while (i < surface.length && i < e.w.length && surface[i] === e.w[i]) i++;
  const tailW = e.w.slice(i);              // る
  if (!e.r.endsWith(tailW)) return '';
  const stemR = e.r.slice(0, e.r.length - tailW.length);  // たべ
  const rest = surface.slice(i);           // ました
  if (hasKanji(rest)) return '';
  return stemR + rest;
}

// Alinea furigana: devuelve [[texto, rt|null], ...]
export function rubyParts(surface, reading) {
  if (!hasKanji(surface) || !reading) return [[surface, null]];
  const segs = surface.match(/[一-龯々]+|[^一-龯々]+/g);
  const re = new RegExp('^' + segs.map(s => hasKanji(s) ? '(.+?)' : '(' + toHira(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')').join('') + '$');
  const m = toHira(reading).match(re);
  if (!m) return [[surface, reading]];
  return segs.map((s, i) => hasKanji(s) ? [s, m[i + 1]] : [s, null]);
}

// Etiqueta heurística de la forma conjugada
export function inflectionLabel(surface, e) {
  const s = surface, p = e.pos;
  if (!/^(v1|v5|v3|adj-i|adj-na|cop)$/.test(p)) return '';
  if (p === 'v1' || p === 'v5' || p === 'v3') {
    const rules = [
      ['ませんでした', 'pasado negativo cortés'], ['ました', 'pasado cortés'], ['ません', 'negativo cortés'],
      ['ましょう', '¡hagámoslo! (ましょう)'], ['ませんか', 'invitación (¿por qué no…?)'], ['ます', 'forma cortés (ます)'],
      ['たかった', 'quería… (たかった)'], ['たくない', 'no quiero… (たくない)'], ['たい', 'quiero… (たい)'],
      ['ています', 'forma て + います (en curso / estado)'], ['でいます', 'forma て + います (en curso / estado)'],
      ['ている', 'forma て + いる (en curso / estado)'], ['でいる', 'forma て + いる (en curso / estado)'],
      ['ていました', 'estaba …-ando'], ['でいました', 'estaba …-ando'],
      ['てください', 'forma て + ください (por favor)'], ['でください', 'forma て + ください (por favor)'],
      ['なかった', 'pasado negativo (informal)'], ['ない', 'negativo (informal)'],
      ['て', 'forma て'], ['で', 'forma て'], ['た', 'pasado (informal)'], ['だ', 'pasado (informal)'],
      ['よう', 'volitivo informal (hagamos…)'], ['ろう', 'volitivo informal (hagamos…)'],
    ];
    for (const [end, lab] of rules) if (s.endsWith(end)) return lab;
    return 'forma conjugada';
  }
  if (p === 'adj-i') {
    if (s.endsWith('くなかった')) return 'pasado negativo';
    if (s.endsWith('くない')) return 'negativo';
    if (s.endsWith('かった')) return 'pasado';
    if (s.endsWith('くて')) return 'forma て (y…)';
    if (s.endsWith('く')) return 'adverbio (〜く)';
  }
  if (p === 'adj-na' && s.endsWith('に')) return 'adverbio (〜に)';
  return 'forma conjugada';
}

// ───── Romaji (Hepburn) ─────
const R1 = {
  あ:'a',い:'i',う:'u',え:'e',お:'o',か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',
  た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',
  ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',や:'ya',ゆ:'yu',よ:'yo',ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',わ:'wa',を:'o',ん:'n',
  が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',
  ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',ぁ:'a',ぃ:'i',ぅ:'u',ぇ:'e',ぉ:'o',ゔ:'vu',
};
const R2 = {
  きゃ:'kya',きゅ:'kyu',きょ:'kyo',しゃ:'sha',しゅ:'shu',しょ:'sho',ちゃ:'cha',ちゅ:'chu',ちょ:'cho',にゃ:'nya',にゅ:'nyu',にょ:'nyo',
  ひゃ:'hya',ひゅ:'hyu',ひょ:'hyo',みゃ:'mya',みゅ:'myu',みょ:'myo',りゃ:'rya',りゅ:'ryu',りょ:'ryo',ぎゃ:'gya',ぎゅ:'gyu',ぎょ:'gyo',
  じゃ:'ja',じゅ:'ju',じょ:'jo',びゃ:'bya',びゅ:'byu',びょ:'byo',ぴゃ:'pya',ぴゅ:'pyu',ぴょ:'pyo',
  てぃ:'ti',でぃ:'di',ふぁ:'fa',ふぃ:'fi',ふぇ:'fe',ふぉ:'fo',じぇ:'je',ちぇ:'che',うぃ:'wi',うぇ:'we',しぇ:'she',でゅ:'dyu',
};
export function toRomaji(kana, { particle } = {}) {
  if (particle) { if (kana === 'は') return 'wa'; if (kana === 'へ') return 'e'; if (kana === 'を') return 'o'; }
  if (kana === 'こんにちは' || kana === 'こんばんは') return kana === 'こんにちは' ? 'konnichiwa' : 'konbanwa';
  const s = toHira(kana);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const two = s.slice(i, i + 2);
    if (R2[two]) { out += R2[two]; i++; continue; }
    const c = s[i];
    if (c === 'っ') {
      const nx = R2[s.slice(i + 1, i + 3)] || R1[s[i + 1]] || '';
      out += nx.startsWith('ch') ? 't' : (nx[0] || '');
      continue;
    }
    if (c === 'ー') { out += out.slice(-1); continue; }
    if (c === 'ん') { out += /^[aiueoy]/.test(R1[s[i + 1]] || '') ? "n'" : 'n'; continue; }
    out += R1[c] ?? c;
  }
  return out;
}

// Variantes aceptables al escribir romaji (shi/si, tsu/tu, ou/oo/ō…)
export function normRomaji(s) {
  return s.toLowerCase().trim()
    .replace(/[āâ]/g, 'aa').replace(/[īî]/g, 'ii').replace(/[ūû]/g, 'uu').replace(/[ēê]/g, 'ee').replace(/[ōô]/g, 'ou')
    .replace(/['’\s-]/g, '')
    .replace(/si/g, 'shi').replace(/hhi/g, 'hi').replace(/ti/g, 'chi').replace(/cchi/g, 'tchi').replace(/tu/g, 'tsu').replace(/tssu/g, 'tsu')
    .replace(/(?<![sc])hu/g, 'fu').replace(/zi/g, 'ji').replace(/jy/g, 'j').replace(/sy/g, 'sh').replace(/ty/g, 'ch').replace(/cy/g, 'ch')
    .replace(/nn/g, 'n').replace(/wo/g, 'o').replace(/oo/g, 'ou');
}

// Lectura completa (en hiragana) de un texto tokenizado, para comparar respuestas
export const textReading = toks => toks.filter(t => !t.punct).map(t => t.reading || t.surface).join('');

// Clave de palabra para seguimiento (los nombres propios y la puntuación no cuentan)
export function wordKey(tok) {
  if (!tok || tok.punct || tok.blank || !tok.entry) return null;
  return tok.entry.id;
}
