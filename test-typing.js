const ARRAY_ONE = [
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

const ARRAY_TWO = [
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

function unicodeToKrutidev(unicodeText) {
  if (!unicodeText) return "";
  
  let s = unicodeText;
  
  // 1. Reorder reph "र्" (\u0930\u094d)
  let pos_r = s.indexOf("र्");
  while (pos_r !== -1) {
    let i = pos_r + 2;
    if (i < s.length) {
      const matras = "ािीुूृेैोौँंः्";
      while (i < s.length && matras.includes(s.charAt(i))) {
        i++;
      }
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
  const mappings = [];
  
  for (let i = 0; i < ARRAY_TWO.length; i++) {
    const unicode = ARRAY_TWO[i];
    const krutidev = ARRAY_ONE[i];
    if (!unicode) continue;
    
    const isStandardAscii = (str) => {
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
    
  for (let m of mappings) {
    s = s.split(m.unicode).join(m.krutidev);
  }
  
  return s;
}

// Test cases
const testCases = ["कोई", "सफलता", "मार्ग", "गति", "कुंजीपटल", "ऋषि", "कठिन"];
testCases.forEach(tc => {
  console.log(`Unicode: ${tc} -> Krutidev: ${unicodeToKrutidev(tc)}`);
});
