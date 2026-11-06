// Textos de la interfaz que pasan a japonés a medida que se aprenden sus palabras.
// Cada texto se muestra en japonés cuando está hecha la lección que introduce la última de sus
// palabras o formas (se calcula a partir del currículo, no se escribe a mano).
// jp usa la sintaxis de tokens de siempre (`surface=dictForm`, `kanji|lectura`).
// Ajuste `uiJp: false` → todo en español. Tocar un texto en japonés muestra el español.

import { LESSONS } from './data/curriculum.js';
import { UI, unlockIndex } from './data/uitext.js';
import * as S from './state.js';
import { esc, jp } from './ui.js';

const AT = Object.fromEntries(Object.entries(UI).map(([k, v]) => [k, unlockIndex(v.jp)]));

export function isJp(key) {
  const at = AT[key];
  return at >= 0 && S.settings().uiJp !== false && S.lessonDone(LESSONS[at].id);
}
export { UI };
// HTML del texto, en japonés o en español
export function t(key) {
  const u = UI[key];
  if (!u) return esc(key);
  return isJp(key) ? `<span class="ui-jp" title="${esc(u.es)}">${jp(u.jp, { plain: true })}</span>` : esc(u.es);
}
// Texto plano en español, para atributos (title, aria-label)
export const tEs = key => UI[key]?.es || key;

// Tocar un texto en japonés fuera de un botón o enlace muestra su traducción
document.addEventListener('click', ev => {
  const el = ev.target.closest?.('.ui-jp');
  if (!el || el.closest('button, a, label')) return;
  ev.stopPropagation();
  el.classList.toggle('show-es');
});
