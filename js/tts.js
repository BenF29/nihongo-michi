// Pronunciación: audios pregenerados con VOICEVOX (audio/*.mp3, ver tools/gen-audio.mjs).
// Si un texto no tiene audio, se usa la síntesis de voz del navegador (Web Speech API).

import { audioKey, autoVoice } from './dict.js';

let manifest = new Set();
const ready = fetch('audio/index.json').then(r => r.ok ? r.json() : []).then(a => { manifest = new Set(a); }).catch(() => {});

let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices().filter(v => /^ja/i.test(v.lang));
  voice = vs.find(v => /google|kyoko|o-ren|nanami|haruka|ayumi/i.test(v.name)) || vs[0] || null;
}
if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

export const ttsAvailable = () => manifest.size > 0 || 'speechSynthesis' in window;
export const hasJapaneseVoice = () => manifest.size > 0 || !!voice;

let current = null;
// rate: 0.85 = velocidad normal de los audios
export async function speak(text, rate = 0.85, v) {
  if (!text || /^[っッー]$/.test(text)) return;   // pausas y alargamientos no tienen sonido propio
  stopSpeaking();
  await ready;
  v = v || autoVoice(text);
  const key = [v, 'f', 'm'].map(x => audioKey(text, x)).find(k => manifest.has(k));
  if (key) {
    const a = new Audio(`audio/${key}.mp3`);
    a.playbackRate = Math.min(2, Math.max(0.5, rate / 0.85));
    a.preservesPitch = true;
    current = a;
    return new Promise(res => { a.onended = a.onerror = a.onpause = res; a.play().catch(res); });
  }
  if (!('speechSynthesis' in window)) return;
  return new Promise(res => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP'; u.rate = rate;
    if (voice) u.voice = voice;
    u.onend = u.onerror = res;
    speechSynthesis.speak(u);
  });
}
export function stopSpeaking() {
  if (current) { current.pause(); current = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
