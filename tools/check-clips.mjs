// Revisa que los videos de los clips sigan en YouTube, se puedan incrustar y tengan una sola pista de audio:
//   node tools/check-clips.mjs
// shortcut: oEmbed no detecta bloqueos por país; si un clip falla solo en algunos países, probarlo en el navegador.

import CLIPS from '../js/data/clips.js';

let bad = 0;
for (const yt of new Set(CLIPS.map(c => c.yt))) {
  const ids = CLIPS.filter(c => c.yt === yt).map(c => c.id).join(' ');
  const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + yt));
  if (!r.ok) { bad++; console.log(`✗ ${yt} (${ids}): HTTP ${r.status} — borrado, privado o sin permiso para incrustar`); continue; }
  // con varias pistas (doblajes), el reproductor incrustado elige según el idioma del navegador y no deja cambiarla
  const page = await (await fetch('https://www.youtube.com/watch?v=' + yt, { headers: { 'Accept-Language': 'en' } })).text();
  const tracks = new Set([...page.matchAll(/"audioTrack":\{"displayName":"([^"]+)"/g)].map(m => m[1]));
  if (tracks.size > 1) { bad++; console.log(`✗ ${yt} (${ids}): ${tracks.size} pistas de audio (${[...tracks].join(', ')}) — puede sonar doblado`); }
  else console.log(`✓ ${yt} (${ids}): ${(await r.json()).title}`);
}
process.exit(bad ? 1 : 0);
