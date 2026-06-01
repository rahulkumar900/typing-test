const fs = require('fs');

// Extract arrays and functions from src/lib/hindi-transliterator.ts
const content = fs.readFileSync('src/lib/hindi-transliterator.ts', 'utf8');

// We will construct a runnable JS block by extracting ARRAY_ONE, ARRAY_TWO, MATRAS, and krutidevToUnicode
const arrayOneMatch = content.match(/const ARRAY_ONE: string\[\] = (\[[\s\S]*?\]);/);
const arrayTwoMatch = content.match(/const ARRAY_TWO: string\[\] = (\[[\s\S]*?\]);/);
const matrasMatch = content.match(/const MATRAS = new Set<string>\((\[[\s\S]*?\])\);/);

if (!arrayOneMatch || !arrayTwoMatch) {
  console.error("Failed to parse ARRAY_ONE or ARRAY_TWO");
  process.exit(1);
}

const ARRAY_ONE = eval(arrayOneMatch[1]);
const ARRAY_TWO = eval(arrayTwoMatch[1]);
const MATRAS = new Set(matrasMatch ? eval(matrasMatch[1]) : [
  "‚", "k", "h", "q", "w", "`", "s", "S", "a", "¡", "%", "W", "·", "~"
]);

function krutidevToUnicode(text) {
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

    let insertBefore;
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

// Incorporate unicodeToKrutidev from test-typing.js
function unicodeToKrutidev(unicodeText) {
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
  const mappings = [];
  
  for (let i = 0; i < ARRAY_TWO.length; i++) {
    const unicode = ARRAY_TWO[i];
    const krutidev = ARRAY_ONE[i];
    if (!unicode || unicode === "Z") continue;
    
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
const testWords = ["कोई", "सफलता", "मार्ग", "गति", "कुंजीपटल", "ऋषि", "कठिन", "खि", "षि"];
for (const word of testWords) {
  const kr = unicodeToKrutidev(word);
  const back = krutidevToUnicode(kr);
  console.log(`Word: ${word} -> Krutidev: ${kr} -> Back to Unicode: ${back} [Match: ${word === back}]`);
}
