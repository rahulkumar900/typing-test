'use client';

/**
 * Krutidev / Remington GAIL Hindi Keyboard Transliteration Engine
 * ================================================================
 * Converts Remington GAIL keystrokes (typed on a standard US QWERTY keyboard)
 * into Unicode Devanagari. This is the keyboard layout bundled with the
 * Krutidev 010 font and used in official Hindi typing examinations (NIC/SSC).
 */

const ARRAY_ONE: string[] = [
  "ñ", "Q+Z", "sas", "aa", ")Z", "ZZ", "\u2018", "\u2019", "\u201c", "\u201d",
  "å", "ƒ", "„", "…", "†", "‡", "ˆ", "‰", "Š", "‹",
  "¶+", "d+", "[+k", "[+", "x+", "T+", "t+", "M+", "<+", "Q+", ";+", "j+", "u+",
  "Ùk", "Ù", "Dr", "–", "—", "é", "™", "=kk", "f=k",
  "à", "á", "â", "ã", "ºz", "º", "í", "{k", "{", "=", "«",
  "Nî", "Vî", "Bî", "Mî", "<î", "|", "K", "}",
  "J", "Vª", "Mª", "<ªª", "Nª", "Ø", "Ý", "nzZ", "æ", "ç", "Á", "xz", "#", ":",
  "v‚", "vks", "vkS", "vk", "v", "b±", "Ã", "bZ", "b", "m", "Å", ",s", ",", "_",
  "ô", "d", "Dk", "D", "[k", "[", "x", "Xk", "X", "Ä", "?k", "?", "³",
  "pkS", "p", "Pk", "P", "N", "t", "Tk", "T", ">", "÷", "¥",
  "ê", "ë", "V", "B", "ì", "ï", "M", "<", ".k", ".",
  "r", "Rk", "R", "Fk", "F", ")", "n", "/k", "èk", "/", "Ë", "è", "u", "Uk", "U",
  "i", "Ik", "I", "Q", "¶", "c", "Ck", "C", "Hk", "H", "e", "Ek", "E",
  ";", "¸", "j", "y", "Yk", "Y", "G", "o", "Ok", "O",
  "'k", "'", "\"k", "\"", "l", "Lk", "L", "g",
  "È", "z",
  "Ì", "Í", "Î", "Ï", "Ñ", "Ò", "Ó", "Ô", "Ö", "Ük", "Ü",
  "‚", "ks", "kS", "k", "h", "q", "w", "`", "s", "S",
  "a", "¡", "%", "W", "•", "·", "~j", "~", "\\", "+", " ः",
  "^", "*", "Þ", "ß", "(", "¼", "½", "¿", "À", "¾", "A", "-", "&", "Œ", "]", "~ ", "@",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "$", "!"
];

const ARRAY_TWO: string[] = [
  "॰", "QZ+", "sa", "a", "र्द्ध", "Z", "\u201c", "\u201d", "\u2018", "\u2019",
  "०", "१", "२", "३", "४", "५", "६", "७", "८", "९",
  "फ़्", "क़", "ख़", "ख़्", "ग़", "ज्", "ज़", "ड़", "ढ़", "फ़", "य़", "ऱ", "ऩ",
  "त्त", "त्त्", "क्त", "दृ", "कृ", "न्न", "न्न्", "=k", "f=",
  "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष", "क्ष्", "त्र", "त्र्",
  "छ्य", "ट्य", "ठ्य", "ड्य", "ढ्य", "द्य", "ज्ञ", "द्व",
  "श्र", "ट्र", "ड्र", "ढ्र", "छ्र", "क्र", "फ्र", "र्द्र", "द्र", "प्र", "प्र", "ग्र", "रु", "रू",
  "ऑ", "ओ", "औ", "आ", "अ", "ईं", "ई", "ई", "इ", "उ", "ऊ", "ऐ", "ए", "ऋ",
  "क्क", "क", "क", "क्", "ख", "ख्", "ग", "ग", "ग्", "घ", "घ", "घ्", "ङ",
  "चै", "च", "च", "च्", "छ", "ज", "ज", "ज्", "झ", "झ", "ञ",
  "ट्ट", "ट्ठ", "ट", "ठ", "ड्ड", "ड्ढ", "ड", "ढ", "ण", "ण्",
  "त", "त", "त्", "थ", "थ्", "द्ध", "द", "ध", "ध", "ध्", "ध्", "ध्", "न", "न", "न्",
  "प", "प", "प्", "फ", "फ्", "ब", "ब", "ब्", "भ", "भ्", "म", "म", "म्",
  "य", "य्", "र", "ल", "ल", "ल्", "ळ", "व", "व", "व्",
  "श", "श्", "ष", "ष्", "स", "स", "स्", "ह",
  "ीं", "्र",
  "द्द", "ट्ट", "ट्ठ", "ड्ड", "कृ", "भ", "्य", "ड्ढ", "झ", "श", "श्",
  "ॉ", "ो", "ौ", "ा", "ी", "ु", "ू", "ृ", "े", "ै",
  "ं", "ँ", "ः", "ॅ", "ऽ", "ऽ", "्र", "्", "?", "़", ":",
  "\u2018", "\u2019", "\u201c", "\u201d", ";", "(", ")", "{", "}", "=", "।", ".", "-", "॰", "॰", "् ", "ॉ",
  "०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "रू", "!"
];

// Sanity check
if (ARRAY_ONE.length !== ARRAY_TWO.length) {
  throw new Error(
    `krutidev: mapping table length mismatch — ARRAY_ONE=${ARRAY_ONE.length} ARRAY_TWO=${ARRAY_TWO.length}`
  );
}

const MATRAS = new Set<string>([
  "‚", "k", "h", "q", "w", "`", "s", "S", "a", "¡", "%", "W", "·", "~"
]);

/**
 * Transliterates a Remington GAIL / Krutidev 010 ASCII-typed string into
 * Hindi Unicode Devanagari.
 */
export function krutidevToUnicode(text: string): string {
  if (!text) return '';

  let s = "  " + text + "  ";

  // Step 1: reorder "f" (ि)
  let pos_f = s.lastIndexOf("f");
  while (pos_f !== -1) {
    const afterConsonant = s.charAt(pos_f + 2);
    const insertAt = (afterConsonant === "~" || afterConsonant === "k") ? pos_f + 3 : pos_f + 2;

    s = s.substring(0, pos_f) +
        s.substring(pos_f + 1, insertAt) +
        "f" +
        s.substring(insertAt);

    pos_f = s.lastIndexOf("f", pos_f - 1);
  }
  s = s.split("f").join("ि");

  // Step 2: reorder "Z" (र् / reph)
  let pos_z = s.indexOf("Z");
  while (pos_z !== -1) {
    // Exclude "bZ" (which maps to independent "ई")
    if (pos_z >= 1 && s.charAt(pos_z - 1) === 'b') {
      pos_z = s.indexOf("Z", pos_z + 1);
      continue;
    }

    let insertBefore: number;
    if (pos_z >= 2 && MATRAS.has(s.charAt(pos_z - 1))) {
      insertBefore = pos_z - 2;
    } else if (pos_z >= 1) {
      insertBefore = pos_z - 1;
    } else {
      s = s.substring(1);
      pos_z = s.indexOf("Z");
      continue;
    }

    s = s.substring(0, insertBefore) +
        "j~" +
        s.substring(insertBefore, pos_z) +
        s.substring(pos_z + 1);

    pos_z = s.indexOf("Z", insertBefore + 2);
  }

  s = s.substring(2, s.length - 2);

  // Step 3: map all sequences → Devanagari
  for (let i = 0; i < ARRAY_ONE.length; i++) {
    s = s.split(ARRAY_ONE[i]).join(ARRAY_TWO[i]);
  }

  return s;
}

/**
 * Transliterates Hindi Unicode Devanagari back to Remington GAIL / Krutidev 010 ASCII.
 */
export function unicodeToKrutidev(unicodeText: string): string {
  if (!unicodeText) return "";
  
  let s = unicodeText;
  
  // 1. Reorder reph "र्" (\u0930\u094d)
  let pos_r = s.indexOf("र्");
  while (pos_r !== -1) {
    let i = pos_r + 2;
    // Scan past consonant block (consonants and halants)
    const DevanagariConsonants = "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळक्षत्रज्ञश्र";
    while (i < s.length) {
      const char = s.charAt(i);
      if (DevanagariConsonants.includes(char) || char === "्") {
        i++;
      } else {
        break;
      }
    }
    // Scan past any matras
    const matras = "ािीुूृेैोौँंः";
    while (i < s.length && matras.includes(s.charAt(i))) {
      i++;
    }
    s = s.substring(0, pos_r) + 
        s.substring(pos_r + 2, i) + 
        "Z" + 
        s.substring(i);
        
    pos_r = s.indexOf("र्", pos_r + 1);
  }
  
  // 2. Reorder vowel sign "ि" (\u093f)
  let pos_i = s.indexOf("ि");
  while (pos_i !== -1) {
    if (pos_i >= 1) {
      let start = pos_i - 1;
      if (start > 0 && s.charAt(start) === "्") {
        start -= 2; // skip halant and preceding consonant
      }
      s = s.substring(0, start) + 
          "f" + 
          s.substring(start, pos_i) + 
          s.substring(pos_i + 1);
    }
    pos_i = s.indexOf("ि", pos_i + 2);
  }
  
  // 3. Map characters prioritizing standard QWERTY keys
  interface MappingItem {
    unicode: string;
    krutidev: string;
  }
  const mappings: MappingItem[] = [];
  
  for (let i = 0; i < ARRAY_TWO.length; i++) {
    const unicode = ARRAY_TWO[i];
    const krutidev = ARRAY_ONE[i];
    if (!unicode || unicode === "Z") continue;
    
    const isStandardAscii = (str: string) => {
      for (let j = 0; j < str.length; j++) {
        const code = str.charCodeAt(j);
        if (code < 32 || code > 126) return false;
      }
      return true;
    };
    
    const existingIdx = mappings.findIndex(m => m.unicode === unicode);
    if (existingIdx !== -1) {
      const existing = mappings[existingIdx];
      if (isStandardAscii(krutidev) && !isStandardAscii(existing.krutidev)) {
        mappings[existingIdx] = { unicode, krutidev };
      }
    } else {
      mappings.push({ unicode, krutidev });
    }
  }
  
  mappings.sort((a, b) => b.unicode.length - a.unicode.length);
    
  for (const m of mappings) {
    s = s.split(m.unicode).join(m.krutidev);
  }
  
  return s;
}

export function needsTransliteration(languageId: string): boolean {
  return [
    'hindi', 'marathi', 'gujarati', 'punjabi', 'bengali',
    'odia', 'assamese', 'manipuri', 'kannada', 'telugu',
    'tamil', 'malayalam', 'urdu',
  ].includes(languageId.toLowerCase());
}

export class HindiTransliterator {
  private rawBuffer: string[] = [];

  reset(): void {
    this.rawBuffer = [];
  }

  getOutput(): string {
    return krutidevToUnicode(this.rawBuffer.join(''));
  }

  processKey(key: string): string {
    if (key === 'Backspace') {
      this.rawBuffer.pop();
    } else if (key.length === 1) {
      this.rawBuffer.push(...Array.from(key));
    }
    return krutidevToUnicode(this.rawBuffer.join(''));
  }
}

/**
 * Finds the Krutidev ASCII key character that maps to a given Unicode Devanagari character
 */
export function getKrutidevCharForUnicode(unicodeChar: string): string | null {
  // Try exact match first
  const idx = ARRAY_TWO.indexOf(unicodeChar);
  if (idx !== -1) {
    return ARRAY_ONE[idx];
  }
  
  // Try substring match for conjuncts
  for (let i = 0; i < ARRAY_TWO.length; i++) {
    if (ARRAY_TWO[i] && unicodeChar.includes(ARRAY_TWO[i])) {
      return ARRAY_ONE[i];
    }
  }
  return null;
}

/**
 * Maps a Krutidev key character to a standard KeyboardEvent.code scancode
 */
export function getCodeFromKrutidev(char: string): string | null {
  if (!char) return null;
  const first = char[0];
  
  // Standard letters
  if (first >= 'a' && first <= 'z') {
    return `Key${first.toUpperCase()}`;
  }
  if (first >= 'A' && first <= 'Z') {
    return `Key${first}`;
  }
  
  // Digits
  if (first >= '0' && first <= '9') {
    return `Digit${first}`;
  }
  
  // Punctuation maps
  const punctuationMap: Record<string, string> = {
    "`": "Backquote", "~": "Backquote",
    "!": "Digit1", "@": "Digit2", "#": "Digit3", "$": "Digit4", "%": "Digit5",
    "^": "Digit6", "&": "Digit7", "*": "Digit8", "(": "Digit9", ")": "Digit0",
    "-": "Minus", "_": "Minus",
    "=": "Equal", "+": "Equal",
    "[": "BracketLeft", "{": "BracketLeft",
    "]": "BracketRight", "}": "BracketRight",
    "\\": "Backslash", "|": "Backslash",
    ";": "Semicolon", ":": "Semicolon",
    "'": "Quote", '"': "Quote",
    ",": "Comma", "<": "Comma",
    ".": "Period", ">": "Period",
    "/": "Slash", "?": "Slash",
    " ": "Space"
  };
  
  return punctuationMap[first] || null;
}

export const HINDI_KEY_EXPLANATIONS: Record<string, string[]> = {
  "क": ["d"],
  "ख": ["Shift + ]"],
  "ग": ["x"],
  "घ": ["Shift + ?"],
  "ङ": ["Shift + U"],
  "च": ["p"],
  "छ": ["Shift + N"],
  "ज": ["t"],
  "झ": ["Shift + E"],
  "ञ": ["Shift + }"],
  "ट": ["v"],
  "ठ": ["Shift + V"],
  "ड": ["[", "(or Shift + Alt + BracketLeft)"],
  "ढ": ["Shift + [", "(or Shift + Alt + BracketRight)"],
  "ण": ["Shift + C"],
  "त": ["r"],
  "थ": ["Shift + F"],
  "द": ["n"],
  "ध": ["Shift + /"],
  "न": ["u"],
  "प": ["i"],
  "फ": ["Shift + Q"],
  "ब": ["c"],
  "भ": ["Shift + H"],
  "म": ["e"],
  "य": [";"],
  "र": ["j"],
  "ल": ["y"],
  "व": ["o"],
  "श": ["Shift + '"],
  "ष": ["Shift + \""],
  "स": ["l"],
  "ह": ["g"],
  "क्ष": ["Shift + 7"],
  "त्र": ["Shift + 6"],
  "ज्ञ": ["Shift + 5"],
  "श्र": ["Shift + 8"],
  
  // Independent Vowels
  "अ": ["v"],
  "आ": ["v", "k"],
  "इ": ["b"],
  "ई": ["b", "Shift + Z"],
  "उ": ["m"],
  "ऊ": ["Shift + M"],
  "ऋ": ["Shift + ="],
  "ए": [","],
  "ऐ": [",", "s"],
  "ओ": ["v", "k", "s"],
  "औ": ["v", "k", "Shift + S"],
  
  // Matras (Vowel Signs)
  "ा": ["k"],
  "ि": ["f", "(Type BEFORE the letter)"],
  "ी": ["h"],
  "ु": ["q"],
  "ू": ["w"],
  "ृ": ["`"],
  "े": ["s"],
  "ै": ["Shift + S"],
  "ो": ["k", "s"],
  "ौ": ["k", "Shift + S"],
  "ं": ["Shift + X"],
  "ः": ["Shift + %"],
  "ॅ": ["Shift + W"],
  "ॉ": ["Shift + \\"],
  "्": ["Shift + D"],
  "्र": ["z"],
  "र्": ["Shift + Z", "(Type AFTER the letter)"],
};

export interface WordGuideItem {
  char: string;
  keys: string[];
}

export function getHindiWordGuide(word: string): WordGuideItem[] {
  const guide: WordGuideItem[] = [];
  let i = 0;
  
  while (i < word.length) {
    if (i + 1 < word.length) {
      const doubleChar = word.slice(i, i + 2);
      if (HINDI_KEY_EXPLANATIONS[doubleChar]) {
        guide.push({ char: doubleChar, keys: HINDI_KEY_EXPLANATIONS[doubleChar] });
        i += 2;
        continue;
      }
    }
    
    const singleChar = word[i];
    if (HINDI_KEY_EXPLANATIONS[singleChar]) {
      guide.push({ char: singleChar, keys: HINDI_KEY_EXPLANATIONS[singleChar] });
    } else {
      guide.push({ char: singleChar, keys: [singleChar] });
    }
    i++;
  }
  
  return guide;
}


