// Banco de preguntas del simulacro JLPT N5 (ver docs/FORMATO.md, sección «Simulacro»).
import GENGO from './gengo.js';
import DOKKAI from './dokkai.js';
import CHOKAI from './chokai.js';
import { voiceOf } from '../../dict.js';

export const BANK = { ...GENGO, ...DOKKAI, ...CHOKAI };

// Kanji del N5: en el examen real aparecen sin furigana; los demás la llevan.
export const N5_KANJI = '一二三四五六七八九十百千万円日月火水木金土曜年時分半午前後今先生学校毎週人子女男父母友名何上下中外右左東西南北大小高安長新古多少白山川天気雨電車国語本書読話言聞見食飲行来出入休会買立道社店駅足手目口耳花魚空間';

const PICK = '１・２・３・４から いちばん いい ものを 一つ えらんで ください。';
// Secciones del examen real, con su tiempo (min; el 聴解 lo marca el audio) y sus problemas.
export const SECTIONS = [
  { id: 'moji', jp: '言語知識（文字・語彙）', es: 'Vocabulario y kanji', min: 20, mondai: ['moji1', 'moji2', 'goi3', 'goi4'] },
  { id: 'bunpo', jp: '言語知識（文法）・読解', es: 'Gramática y lectura', min: 40, mondai: ['bunpo1', 'bunpo2', 'bunpo3', 'dokkai4', 'dokkai5', 'dokkai6'] },
  { id: 'chokai', jp: '聴解', es: 'Comprensión auditiva', min: 30, mondai: ['chokai1', 'chokai2', 'chokai3', 'chokai4'] },
];
// n = cuántos ítems entran en un simulacro completo (como el examen real)
export const MONDAI = {
  moji1: { sec: 'moji', no: 1, n: 12, name: '漢字読み', es: 'Lectura de kanji', ins: `＿＿＿の ことばは ひらがなで どう かきますか。${PICK}`, ins_es: '¿Cómo se lee la palabra subrayada?' },
  moji2: { sec: 'moji', no: 2, n: 8, name: '表記', es: 'Escritura', ins: `＿＿＿の ことばは どう かきますか。${PICK}`, ins_es: '¿Cómo se escribe la palabra subrayada?' },
  goi3: { sec: 'moji', no: 3, n: 10, name: '文脈規定', es: 'Vocabulario en contexto', ins: `（　　）に なにが はいりますか。${PICK}`, ins_es: '¿Qué palabra va en el paréntesis?' },
  goi4: { sec: 'moji', no: 4, n: 5, name: '言い換え類義', es: 'Paráfrasis', ins: `＿＿＿の ぶんと だいたい おなじ いみの ぶんが あります。${PICK}`, ins_es: 'Elige la oración que significa casi lo mismo.' },
  bunpo1: { sec: 'bunpo', no: 1, n: 16, name: '文の文法１', es: 'Gramática de la oración', ins: `（　　）に 何を 入れますか。${PICK}`, ins_es: '¿Qué va en el paréntesis?' },
  bunpo2: { sec: 'bunpo', no: 2, n: 5, name: '文の文法２（★）', es: 'Ordenar la oración', ins: `★ に 入る ものは どれですか。${PICK}`, ins_es: 'Ordena las piezas: ¿cuál va en la posición ★?' },
  bunpo3: { sec: 'bunpo', no: 3, n: 1, name: '文章の文法', es: 'Gramática del texto', ins: `［１］から［５］に 何を 入れますか。ぶんしょうの いみを かんがえて、${PICK}`, ins_es: 'Completa los huecos del texto según su sentido.' },
  dokkai4: { sec: 'bunpo', no: 4, n: 3, name: '内容理解（短文）', es: 'Textos cortos', ins: `つぎの ぶんしょうを 読んで、しつもんに こたえて ください。こたえは、${PICK}`, ins_es: 'Lee el texto y responde.' },
  dokkai5: { sec: 'bunpo', no: 5, n: 1, name: '内容理解（中文）', es: 'Texto mediano', ins: `つぎの ぶんしょうを 読んで、しつもんに こたえて ください。こたえは、${PICK}`, ins_es: 'Lee el texto y responde.' },
  dokkai6: { sec: 'bunpo', no: 6, n: 1, name: '情報検索', es: 'Buscar información', ins: `つぎの ページを 見て、下の しつもんに こたえて ください。こたえは、${PICK}`, ins_es: 'Busca la información en el aviso y responde.' },
  chokai1: { sec: 'chokai', no: 1, n: 7, name: '課題理解', es: 'Qué hay que hacer', ins: 'はじめに しつもんを 聞いて ください。それから 話を 聞いて、１から４の 中から、いちばん いい ものを 一つ えらんで ください。', ins_es: 'Escucha la pregunta y luego la conversación.' },
  chokai2: { sec: 'chokai', no: 2, n: 6, name: 'ポイント理解', es: 'Puntos clave', ins: 'はじめに しつもんを 聞いて ください。そのあと、こたえを 読んで ください。それから 話を 聞いて、１から４の 中から、いちばん いい ものを 一つ えらんで ください。', ins_es: 'Lee las opciones antes de escuchar; atento a los cambios de idea.' },
  chokai3: { sec: 'chokai', no: 3, n: 5, name: '発話表現', es: '¿Qué se dice?', ins: 'えを 見ながら しつもんを 聞いて ください。➡の 人は 何と 言いますか。１から３の 中から、いちばん いい ものを 一つ えらんで ください。', ins_es: 'Mira la situación: ¿qué dice la persona? Las opciones solo se escuchan.' },
  chokai4: { sec: 'chokai', no: 4, n: 6, name: '即時応答', es: 'Respuesta rápida', ins: 'えなどが ありません。ぶんを 聞いて、１から３の 中から、いちばん いい ものを 一つ えらんで ください。', ins_es: 'Escucha la frase y elige la respuesta natural. Solo se escucha.' },
};

// Lo que se escucha en un ítem de 聴解, en orden: [texto japonés tokenizado, voz, rol].
// Lo usan la app (js/exam.js) y tools/gen-audio.mjs, así cada parte tiene su audio pregenerado.
export function examScript(type, it) {
  const out = [];
  const other = v => (v === 'm' ? 'f' : 'm');
  if (it.intro) out.push([it.intro, 'f', 'q']);
  for (const [who, j] of it.lines || []) out.push([j, voiceOf(who), 'line']);
  if (it.qjp && type !== 'chokai4') out.push([it.qjp, 'f', 'q']);
  if (type === 'chokai3' || type === 'chokai4') {
    const v = type === 'chokai4' ? other(voiceOf(it.lines?.[0]?.[0])) : (it.voice || 'f');
    it.opts.forEach((o, i) => out.push([o, v, 'opt' + i]));
  }
  return out;
}
