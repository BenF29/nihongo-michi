// Catálogo de textos de la interfaz que pasan a japonés (ver js/uitext.js).
// jp usa la sintaxis de tokens de siempre; debe usar solo palabras del camino (lo revisa el validador).

import { LESSONS } from './curriculum.js';
import { tokenize, lookup, formTaughtIn } from '../dict.js';

export const UI = {
  // navegación
  'nav.camino': { es: 'Camino', jp: '道' },
  'nav.lecturas': { es: 'Lecturas', jp: '読む' },
  'nav.repaso': { es: 'Repaso', jp: '練習' },
  'nav.palabras': { es: 'Palabras', jp: 'ことば' },
  'nav.examen': { es: 'Examen', jp: 'テスト' },
  // camino y vista previa
  'path.next': { es: 'Siguiente lección', jp: 'つぎ' },
  'path.go': { es: 'Continuar', jp: '行きましょう=行く' },
  'path.start': { es: 'Empezar', jp: '行きましょう=行く' },
  'path.here': { es: '¡Aquí!', jp: 'ここ' },
  'path.reading': { es: 'Lectura', jp: '読む' },
  'path.skip': { es: 'Ya lo sé', jp: 'もう 知っています=知る' },
  'prev.kanji': { es: 'Kanji', jp: '漢字' },
  'prev.words': { es: 'Palabras nuevas', jp: '新しい ことば' },
  'prev.again': { es: 'Repasar lección', jp: 'もう 一度' },
  'prev.continue': { es: 'Continuar', jp: '行きましょう=行く' },
  // reproductor
  'p.check': { es: 'Comprobar', jp: '答えます=答える' },
  'p.next': { es: 'Continuar', jp: 'つぎ' },
  'p.nextLine': { es: 'Siguiente', jp: 'つぎ' },
  'p.ok': { es: 'Correcto', jp: 'いい です ね' },
  'p.bad': { es: 'No exactamente', jp: 'ちがいます=ちがう' },
  'p.partDone': { es: 'Tramo terminado', jp: '終わりました=終わる' },
  'p.partNext': { es: 'Sigue', jp: 'つぎ は' },
  'p.exit': { es: 'Salir por ahora', jp: '今日 は ここ まで' },
  'p.reveal': { es: 'Ya lo pensé', jp: '見せて=見せる ください' },
  'p.canNow': { es: 'Ahora puedes', jp: 'できる こと' },
  'p.toReview': { es: 'Para revisar', jp: 'もう 一度 見ましょう=見る' },
  'p.reading': { es: 'Lectura recomendada', jp: '読みましょう=読む' },
  // lecturas
  'r.listen': { es: 'Escuchar', jp: '聞く' },
  'r.questions': { es: 'Preguntas de comprensión', jp: '質問' },
  'r.next': { es: 'Siguiente lectura', jp: 'つぎ' },
  'ex.prev': { es: 'Anterior', jp: '前' },
  // instrucciones de las preguntas
  'q.meaning': { es: '¿Qué significa?', jp: 'いみ は 何 です か' },
  'q.say': { es: '¿Cómo se dice?', jp: '日本 語 で 何 と 言います=言う か' },
  'q.listenMeaning': { es: 'Escucha y elige el significado', jp: '聞いて=聞く ください 。 いみ は 何 です か' },
  'q.read': { es: '¿Cómo se lee?', jp: 'どう 読みます=読む か' },
  'q.kanji': { es: '¿Qué significa este kanji?', jp: 'この 漢字 の いみ は 何 です か' },
  'q.write': { es: 'Escribe en japonés', jp: '日本 語 で 書いて=書く ください' },
  'q.sayWrite': { es: '¿Cómo se dice en japonés?', jp: '日本 語 で 何 と 言います=言う か' },
  'q.dictation': { es: 'Dictado: escribe lo que escuchas', jp: '聞いて=聞く 、 書いて=書く ください' },
  'q.fill': { es: 'Completa la oración', jp: '＿ に 何 を 入れます=入れる か' },
  'q.answer': { es: 'Responde en japonés', jp: '日本 語 で 答えて=答える ください' },
  'q.error': { es: 'Esta oración tiene un error. Toca dónde está.', jp: 'ちがう ところ は どこ です か' },
  'q.build': { es: 'Traduce al japonés', jp: '日本 語 に して=する ください' },
  'q.listen': { es: 'Escucha y elige qué significa', jp: '聞いて=聞く ください 。 いみ は 何 です か' },
};

// Índice de la lección que habilita cada texto (-1 = no se puede habilitar: palabra fuera del camino)
const INTRO = {};
LESSONS.forEach((l, i) => [...(l.words || []), ...(l.later || [])].forEach(w => { const e = lookup(w); if (e && !(e.id in INTRO)) INTRO[e.id] = i; }));
const LESSON_AT = Object.fromEntries(LESSONS.map((l, i) => [l.id, i]));
export function unlockIndex(text) {
  let at = 0;
  for (const t of tokenize(text)) {
    if (t.punct || t.blank) continue;
    if (!t.entry) return -1;
    if (t.entry.pos !== 'name') { if (!(t.entry.id in INTRO)) return -1; at = Math.max(at, INTRO[t.entry.id]); }
    const f = formTaughtIn(t); if (f) at = Math.max(at, LESSON_AT[f]);
  }
  return at;
}
