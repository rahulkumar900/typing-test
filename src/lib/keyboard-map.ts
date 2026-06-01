export interface KeyMapping {
  default: string;
  shift: string;
}

export const inscriptMap: Record<string, KeyMapping> = {
  // Row 1 (Number row)
  Backquote: { default: "ऒ", shift: "ॊ" },
  Digit1: { default: "१", shift: "ऍ" },
  Digit2: { default: "२", shift: "ॅ" },
  Digit3: { default: "३", shift: "्र" },
  Digit4: { default: "४", shift: "र्" },
  Digit5: { default: "५", shift: "ज्ञ" },
  Digit6: { default: "६", shift: "त्र" },
  Digit7: { default: "७", shift: "क्ष" },
  Digit8: { default: "८", shift: "श्र" },
  Digit9: { default: "९", shift: "(" },
  Digit0: { default: "०", shift: ")" },
  Minus: { default: "-", shift: "ः" },
  Equal: { default: "ृ", shift: "ऋ" },

  // Row 2 (Top letter row)
  KeyQ: { default: "ौ", shift: "औ" },
  KeyW: { default: "ै", shift: "ऐ" },
  KeyE: { default: "ा", shift: "आ" },
  KeyR: { default: "ी", shift: "ई" },
  KeyT: { default: "ू", shift: "ऊ" },
  KeyY: { default: "ब", shift: "भ" },
  KeyU: { default: "ह", shift: "ङ" },
  KeyI: { default: "ग", shift: "घ" },
  KeyO: { default: "द", shift: "ध" },
  KeyP: { default: "ज", shift: "झ" },
  BracketLeft: { default: "ड", shift: "ढ" },
  BracketRight: { default: "़", shift: "ञ" },
  Backslash: { default: "ॉ", shift: "ऑ" },

  // Row 3 (Home letter row)
  KeyA: { default: "ो", shift: "ओ" },
  KeyS: { default: "े", shift: "ए" },
  KeyD: { default: "्", shift: "अ" },
  KeyF: { default: "ि", shift: "इ" },
  KeyG: { default: "ु", shift: "उ" },
  KeyH: { default: "प", shift: "फ" },
  KeyJ: { default: "र", shift: "ऱ" },
  KeyK: { default: "क", shift: "ख" },
  KeyL: { default: "त", shift: "थ" },
  Semicolon: { default: "च", shift: "छ" },
  Quote: { default: "ट", shift: "ठ" },

  // Row 4 (Bottom letter row)
  KeyZ: { default: "ॆ", shift: "ऎ" },
  KeyX: { default: "ं", shift: "ँ" },
  KeyC: { default: "म", shift: "ण" },
  KeyV: { default: "न", shift: "ऩ" },
  KeyB: { default: "व", shift: "ऴ" },
  KeyN: { default: "ल", shift: "ळ" },
  KeyM: { default: "स", shift: "श" },
  Comma: { default: "ष", shift: "," },
  Period: { default: "।", shift: "॥" },
  Slash: { default: "य", shift: "य़" },
  Space: { default: " ", shift: " " }
};

/**
 * Translates a QWERTY physical key code into the corresponding Devanagari character
 * based on the active Shift state.
 */
export function translateKey(code: string, isShifted: boolean): string | null {
  const mapping = inscriptMap[code];
  if (!mapping) return null;
  return isShifted ? mapping.shift : mapping.default;
}
