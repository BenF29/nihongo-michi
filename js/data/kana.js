// Kana con romaji (Hepburn) y mnemotecnias visuales en español.
// [kana, romaji, mnemotecnia?]

const HIRA = [
  ['あ', 'a', 'Una persona con los brazos abiertos gritando "¡aaah!" al ver una cruz.'],
  ['い', 'i', 'Dos palitos verticales, como dos letras "i" juntas.'],
  ['う', 'u', 'Una oreja de perfil escuchando: "¿uh?"'],
  ['え', 'e', 'Un ave exótica con cresta: "¡eh, mira!"'],
  ['お', 'o', 'Un ovni (o) que choca contra un poste.'],
  ['か', 'ka', 'Un karateka dando una patada: "¡ka!"'],
  ['き', 'ki', 'Una llave (key) antigua con dos dientes.'],
  ['く', 'ku', 'El pico de un cuervo: "¡cu-cu!"'],
  ['け', 'ke', 'Un barril (keg) con una tapa al lado.'],
  ['こ', 'ko', 'Dos gusanitos de coco acostados.'],
  ['さ', 'sa', 'Un samurái con su espada cruzada.'],
  ['し', 'shi', 'Un anzuelo de pesca: "¡shhh!, que no se escape el pez".'],
  ['す', 'su', 'Un columpio con una persona dando la vuelta: "¡suuu!"'],
  ['せ', 'se', 'Una boca abierta diciendo "¡sé!" con un diente de oro.'],
  ['そ', 'so', 'Un zigzag como hilo de coser: "so-so".'],
  ['た', 'ta', 'Las letras "t" y "a" juntas: ta.'],
  ['ち', 'chi', 'Un número 5 al revés; "chi" como en chico.'],
  ['つ', 'tsu', 'Una ola de tsunami.'],
  ['て', 'te', 'Una mano (te = mano) que se extiende.'],
  ['と', 'to', 'Un dedo del pie (toe) con una astilla.'],
  ['な', 'na', 'Una monja (nun) rezando junto a una cruz.'],
  ['に', 'ni', 'Una rodilla (knee) al lado de dos rayas.'],
  ['ぬ', 'nu', 'Fideos (noodles) enrollados en palillos.'],
  ['ね', 'ne', 'Un gato (neko) con la cola enroscada.'],
  ['の', 'no', 'La señal de "no" (🚫).'],
  ['は', 'ha', 'Alguien riendo "¡ja-ja!" junto a una puerta.'],
  ['ひ', 'hi', 'Una sonrisa enorme: "¡ji, ji!"'],
  ['ふ', 'fu', 'Un monte Fuji con nubes alrededor.'],
  ['へ', 'he', 'Una montaña pequeña: se sube y se baja ("¡je!").'],
  ['ほ', 'ho', 'Un hombre de nieve tocando la puerta: "¡jo, jo!"'],
  ['ま', 'ma', 'Una mamá con un moño de pelo.'],
  ['み', 'mi', 'El número 21: "mi" cumpleaños.'],
  ['む', 'mu', 'Una vaca de perfil: "¡muuu!"'],
  ['め', 'me', 'Un ojo (me = ojo) con un lazo.'],
  ['も', 'mo', 'Un anzuelo con dos carnadas: "más" (more) peces.'],
  ['や', 'ya', 'Un yak con cuernos.'],
  ['ゆ', 'yu', 'Un pez nadando en U: "¡yu-ju!"'],
  ['よ', 'yo', 'Un yo-yo colgando de un dedo.'],
  ['ら', 'ra', 'Un rapero con la gorra al revés.'],
  ['り', 'ri', 'Dos juncos de río (río = ri).'],
  ['る', 'ru', 'Una ruta que termina en un rulo.'],
  ['れ', 're', 'Una persona arrodillada rezando: "re-zar".'],
  ['ろ', 'ro', 'Como る pero sin el rulo: un ro-bot sin cola.'],
  ['わ', 'wa', 'Una persona llorando en una cascada (water): "¡wa!"'],
  ['を', 'wo', 'Alguien comiendo un "wok" de fideos. Se pronuncia "o".'],
  ['ん', 'n', 'Una "n" minúscula escrita a la rápida.'],
];

const KATA = [
  ['ア', 'a', 'Un hacha (axe) vista de lado.'],
  ['イ', 'i', 'Una persona inclinada (es como 亻): "i".'],
  ['ウ', 'u', 'Como う con techo: una "u" con sombrero.'],
  ['エ', 'e', 'Una viga de construcción con forma de "I": elevador.'],
  ['オ', 'o', 'Una persona con brazos y un "oh" de sorpresa.'],
  ['カ', 'ka', 'Como か sin la rayita: kárate con una mano.'],
  ['キ', 'ki', 'Una llave (key) con más dientes.'],
  ['ク', 'ku', 'Un cuchillo de cocina (cook).'],
  ['ケ', 'ke', 'La letra "k" inclinada.'],
  ['コ', 'ko', 'Un rincón (corner) de una caja.'],
  ['サ', 'sa', 'Una mesa de sacrificio con dos patas.'],
  ['シ', 'shi', 'Una cara sonriendo con los ojos a la izquierda. Los trazos van hacia ARRIBA.'],
  ['ス', 'su', 'Una persona haciendo sumo con las piernas abiertas.'],
  ['セ', 'se', 'Como せ pero más angular: una "se-ñal".'],
  ['ソ', 'so', 'Una aguja cosiendo (sew). El trazo largo baja de ARRIBA.'],
  ['タ', 'ta', 'Una "ta-jada" de pan con mantequilla.'],
  ['チ', 'chi', 'Una persona chiquitita con los brazos abiertos.'],
  ['ツ', 'tsu', 'Una cara con los ojos arriba. Los trazos van hacia ABAJO.'],
  ['テ', 'te', 'Un poste de telégrafo.'],
  ['ト', 'to', 'Un tótem con una ramita.'],
  ['ナ', 'na', 'Una cruz como la de な, sin la monja.'],
  ['ニ', 'ni', 'Dos rayas como las de に.'],
  ['ヌ', 'nu', 'Unos palillos con fideos (noodles) cruzados.'],
  ['ネ', 'ne', 'Un gato (neko) parado en sus patas.'],
  ['ノ', 'no', 'Una sola diagonal: "no" pases.'],
  ['ハ', 'ha', 'Dos trazos como una risa: "ja, ja".'],
  ['ヒ', 'hi', 'Una persona sentada riendo "ji, ji".'],
  ['フ', 'fu', 'Como ふ de un solo trazo: un gancho.'],
  ['ヘ', 'he', 'Igual que へ en hiragana: una montañita.'],
  ['ホ', 'ho', 'Una cruz con dos patas: "jo, jo".'],
  ['マ', 'ma', 'Una mamá cerrando los brazos.'],
  ['ミ', 'mi', 'Tres rayas: "mi-mi-mi".'],
  ['ム', 'mu', 'Un codo de perfil de la vaca: "muu".'],
  ['メ', 'me', 'Una "X" que tacha: ¡meh!'],
  ['モ', 'mo', 'Como も pero más recto.'],
  ['ヤ', 'ya', 'Como や más recto: un yak de perfil.'],
  ['ユ', 'yu', 'Una "U" con base: ¡yu-ju!'],
  ['ヨ', 'yo', 'Una "E" al revés: "yo".'],
  ['ラ', 'ra', 'Un techo sobre un gancho: "ra-ya".'],
  ['リ', 'ri', 'Como り: dos juncos de río.'],
  ['ル', 'ru', 'Dos patitas, una con una "ru-eda".'],
  ['レ', 're', 'Una "L" inclinada: "re-gla".'],
  ['ロ', 'ro', 'Un cuadrado como una boca 口 de robot.'],
  ['ワ', 'wa', 'Un vaso de agua (water) visto de lado.'],
  ['ヲ', 'wo', 'Una "wo" casi nunca usada. Se pronuncia "o".'],
  ['ン', 'n', 'Como ソ pero el trazo largo sube desde ABAJO.'],
];

const DAKU = {
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
};
const SMALL = { 'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo', 'っ': '(pausa)', 'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o' };

const toKata = s => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));

export const KANA = {};
for (const [k, r, m] of HIRA) KANA[k] = { k, r, m, script: 'hira' };
for (const [k, r, m] of KATA) KANA[k] = { k, r, m, script: 'kata' };
for (const [k, r] of Object.entries(DAKU)) {
  KANA[k] = { k, r, script: 'hira', m: 'Con dakuten (゛) o handakuten (゜).' };
  KANA[toKata(k)] = { k: toKata(k), r, script: 'kata', m: 'Con dakuten (゛) o handakuten (゜).' };
}
for (const [k, r] of Object.entries(SMALL)) {
  KANA[k] = { k, r, script: 'hira', m: k === 'っ' ? 'Pequeña: duplica la consonante siguiente (una pausa breve).' : 'Versión pequeña: se combina con el carácter anterior.' };
  KANA[toKata(k)] = { k: toKata(k), r, script: 'kata', m: KANA[k].m };
}
KANA['ー'] = { k: 'ー', r: '(alarga)', script: 'kata', m: 'Raya de alargamiento: alarga la vocal anterior (コーヒー = koohii).' };

// Combinaciones (yōon) como unidades de estudio
const YOON = ['き', 'し', 'ち', 'に', 'ひ', 'み', 'り', 'ぎ', 'じ', 'び', 'ぴ'];
for (const base of YOON) {
  for (const [sm, v] of [['ゃ', 'a'], ['ゅ', 'u'], ['ょ', 'o']]) {
    const br = (KANA[base].r);
    let r = br === 'shi' ? 'sh' + v : br === 'chi' ? 'ch' + v : br === 'ji' ? 'j' + v : br.slice(0, -1) + 'y' + v;
    KANA[base + sm] = { k: base + sm, r, script: 'hira', m: `${base} (${br}) + ${sm} pequeña = ${r}` };
    KANA[toKata(base + sm)] = { k: toKata(base + sm), r, script: 'kata', m: `${toKata(base)} + ${toKata(sm)} pequeña = ${r}` };
  }
}
// Sonidos extranjeros en katakana
for (const [k, r] of [['ティ', 'ti'], ['ディ', 'di'], ['ファ', 'fa'], ['フィ', 'fi'], ['フェ', 'fe'], ['フォ', 'fo'], ['ジェ', 'je'], ['チェ', 'che'], ['ウィ', 'wi'], ['ウェ', 'we'], ['シェ', 'she'], ['ヴ', 'vu']]) {
  KANA[k] = { k, r, script: 'kata', m: 'Combinación para sonidos de otros idiomas.' };
}

// Divide una cadena de kana en unidades (combina ゃゅょ y ァィェ con el carácter anterior)
export function splitKana(s) {
  const out = [];
  for (const ch of s) {
    if (/[ゃゅょャュョァィゥェォ]/.test(ch) && out.length && KANA[out[out.length - 1] + ch]) out[out.length - 1] += ch;
    else out.push(ch);
  }
  return out;
}

export const HIRAGANA_BASIC = HIRA.map(h => h[0]);
export const KATAKANA_BASIC = KATA.map(h => h[0]);
