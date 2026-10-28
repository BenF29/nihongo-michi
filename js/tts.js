// Pronunciación con la síntesis de voz del navegador (Web Speech API).

let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices().filter(v => /^ja/i.test(v.lang));
  // preferir voces de mejor calidad si existen
  voice = vs.find(v => /google|kyoko|o-ren|nanami|haruka|ayumi/i.test(v.name)) || vs[0] || null;
}
if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

export const ttsAvailable = () => 'speechSynthesis' in window;
export const hasJapaneseVoice = () => !!voice;

export function speak(text, rate = 0.85) {
  if (!ttsAvailable() || !text) return Promise.resolve();
  speechSynthesis.cancel();
  return new Promise(res => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP'; u.rate = rate;
    if (voice) u.voice = voice;
    u.onend = u.onerror = res;
    speechSynthesis.speak(u);
  });
}
export const stopSpeaking = () => ttsAvailable() && speechSynthesis.cancel();
