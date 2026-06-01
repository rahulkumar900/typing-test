"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { krutidevToUnicode, getKrutidevCharForUnicode } from "@/lib/hindi-transliterator";

interface KeyInfo {
  code: string;
  eng: string;
  engShift: string;
  hi?: string;
  hiShift?: string;
  width?: string;
  finger?: "pinky-l" | "ring-l" | "middle-l" | "index-l" | "thumb" | "index-r" | "middle-r" | "ring-r" | "pinky-r" | "special";
}

interface VisualKeyboardProps {
  activeLanguage: "EN" | "HI";
  activeCode?: string | null;
  nextCode?: string | null;
  nextChar?: string | null;
  isShiftActive?: boolean;
}

export function VisualKeyboard({
  activeLanguage,
  activeCode,
  nextCode,
  nextChar,
  isShiftActive = false,
}: VisualKeyboardProps) {
  // Define standard keyboard layout mapping rows
  const rows: KeyInfo[][] = [
    // Row 1 (Number row)
    [
      { code: "Backquote", eng: "`", engShift: "~", hi: "ऒ", hiShift: "ॊ", finger: "pinky-l" },
      { code: "Digit1", eng: "1", engShift: "!", hi: "१", hiShift: "ऍ", finger: "pinky-l" },
      { code: "Digit2", eng: "2", engShift: "@", hi: "२", hiShift: "ॅ", finger: "ring-l" },
      { code: "Digit3", eng: "3", engShift: "#", hi: "३", hiShift: "्र", finger: "middle-l" },
      { code: "Digit4", eng: "4", engShift: "$", hi: "४", hiShift: "र्", finger: "index-l" },
      { code: "Digit5", eng: "5", engShift: "%", hi: "५", hiShift: "ज्ञ", finger: "index-l" },
      { code: "Digit6", eng: "6", engShift: "^", hi: "६", hiShift: "त्र", finger: "index-r" },
      { code: "Digit7", eng: "7", engShift: "&", hi: "७", hiShift: "क्ष", finger: "index-r" },
      { code: "Digit8", eng: "8", engShift: "*", hi: "८", hiShift: "श्र", finger: "middle-r" },
      { code: "Digit9", eng: "9", engShift: "(", hi: "९", hiShift: "(", finger: "ring-r" },
      { code: "Digit0", eng: "0", engShift: ")", hi: "०", hiShift: ")", finger: "pinky-r" },
      { code: "Minus", eng: "-", engShift: "_", hi: "-", hiShift: "ः", finger: "pinky-r" },
      { code: "Equal", eng: "=", engShift: "+", hi: "ृ", hiShift: "ऋ", finger: "pinky-r" },
      { code: "Backspace", eng: "Backspace", engShift: "Backspace", width: "w-[90px] grow", finger: "special" },
    ],
    // Row 2 (Top row)
    [
      { code: "Tab", eng: "Tab", engShift: "Tab", width: "w-[75px]", finger: "special" },
      { code: "KeyQ", eng: "Q", engShift: "Q", hi: "ौ", hiShift: "औ", finger: "pinky-l" },
      { code: "KeyW", eng: "W", engShift: "W", hi: "ै", hiShift: "ऐ", finger: "ring-l" },
      { code: "KeyE", eng: "E", engShift: "E", hi: "ा", hiShift: "आ", finger: "middle-l" },
      { code: "KeyR", eng: "R", engShift: "R", hi: "ी", hiShift: "ई", finger: "index-l" },
      { code: "KeyT", eng: "T", engShift: "T", hi: "ू", hiShift: "ऊ", finger: "index-l" },
      { code: "KeyY", eng: "Y", engShift: "Y", hi: "ब", hiShift: "भ", finger: "index-r" },
      { code: "KeyU", eng: "U", engShift: "U", hi: "ह", hiShift: "ङ", finger: "index-r" },
      { code: "KeyI", eng: "I", engShift: "I", hi: "ग", hiShift: "घ", finger: "middle-r" },
      { code: "KeyO", eng: "O", engShift: "O", hi: "द", hiShift: "ध", finger: "ring-r" },
      { code: "KeyP", eng: "P", engShift: "P", hi: "ज", hiShift: "झ", finger: "pinky-r" },
      { code: "BracketLeft", eng: "[", engShift: "{", hi: "ड", hiShift: "ढ", finger: "pinky-r" },
      { code: "BracketRight", eng: "]", engShift: "}", hi: "़", hiShift: "ञ", finger: "pinky-r" },
      { code: "Backslash", eng: "\\", engShift: "|", hi: "ॉ", hiShift: "ऑ", width: "w-[50px] grow", finger: "pinky-r" },
    ],
    // Row 3 (Home row)
    [
      { code: "CapsLock", eng: "Caps", engShift: "Caps", width: "w-[85px]", finger: "special" },
      { code: "KeyA", eng: "A", engShift: "A", hi: "ो", hiShift: "ओ", finger: "pinky-l" },
      { code: "KeyS", eng: "S", engShift: "S", hi: "े", hiShift: "ए", finger: "ring-l" },
      { code: "KeyD", eng: "D", engShift: "D", hi: "्", hiShift: "अ", finger: "middle-l" },
      { code: "KeyF", eng: "F", engShift: "F", hi: "ि", hiShift: "इ", finger: "index-l" },
      { code: "KeyG", eng: "G", engShift: "G", hi: "ु", hiShift: "उ", finger: "index-l" },
      { code: "KeyH", eng: "H", engShift: "H", hi: "प", hiShift: "फ", finger: "index-r" },
      { code: "KeyJ", eng: "J", engShift: "J", hi: "र", hiShift: "ऱ", finger: "index-r" },
      { code: "KeyK", eng: "K", engShift: "K", hi: "क", hiShift: "ख", finger: "middle-r" },
      { code: "KeyL", eng: "L", engShift: "L", hi: "त", hiShift: "थ", finger: "ring-r" },
      { code: "Semicolon", eng: ";", engShift: ":", hi: "च", hiShift: "छ", finger: "pinky-r" },
      { code: "Quote", eng: "'", engShift: '"', hi: "ट", hiShift: "ठ", finger: "pinky-r" },
      { code: "Enter", eng: "Enter", engShift: "Enter", width: "w-[90px] grow", finger: "special" },
    ],
    // Row 4 (Bottom row)
    [
      { code: "ShiftLeft", eng: "Shift", engShift: "Shift", width: "w-[110px]", finger: "special" },
      { code: "KeyZ", eng: "Z", engShift: "Z", hi: "ॆ", hiShift: "ऎ", finger: "pinky-l" },
      { code: "KeyX", eng: "X", engShift: "X", hi: "ं", hiShift: "ँ", finger: "ring-l" },
      { code: "KeyC", eng: "C", engShift: "C", hi: "म", hiShift: "ण", finger: "middle-l" },
      { code: "KeyV", eng: "V", engShift: "V", hi: "न", hiShift: "ऩ", finger: "index-l" },
      { code: "KeyB", eng: "B", engShift: "B", hi: "व", hiShift: "ऴ", finger: "index-l" },
      { code: "KeyN", eng: "N", engShift: "N", hi: "ल", hiShift: "ळ", finger: "index-r" },
      { code: "KeyM", eng: "M", engShift: "M", hi: "स", hiShift: "श", finger: "middle-r" },
      { code: "Comma", eng: ",", engShift: "<", hi: "ष", hiShift: ",", finger: "ring-r" },
      { code: "Period", eng: ".", engShift: ">", hi: "।", hiShift: "॥", finger: "pinky-r" },
      { code: "Slash", eng: "/", engShift: "?", hi: "य", hiShift: "य़", finger: "pinky-r" },
      { code: "ShiftRight", eng: "Shift", engShift: "Shift", width: "w-[95px] grow", finger: "special" },
    ],
    // Row 5 (Space row)
    [
      { code: "ControlLeft", eng: "Ctrl", engShift: "Ctrl", width: "w-[60px]", finger: "special" },
      { code: "MetaLeft", eng: "Win", engShift: "Win", width: "w-[60px]", finger: "special" },
      { code: "AltLeft", eng: "Alt", engShift: "Alt", width: "w-[60px]", finger: "special" },
      { code: "Space", eng: "Space", engShift: "Space", width: "w-[350px] grow", finger: "thumb" },
      { code: "AltRight", eng: "AltGr", engShift: "AltGr", width: "w-[60px]", finger: "special" },
      { code: "MetaRight", eng: "Win", engShift: "Win", width: "w-[60px]", finger: "special" },
      { code: "ControlRight", eng: "Ctrl", engShift: "Ctrl", width: "w-[60px]", finger: "special" },
    ]
  ];

  // Helper to color keys by touch typing finger guidelines
  const getFingerClass = (finger?: string) => {
    switch (finger) {
      case "pinky-l":
        return "border-rose-200 bg-rose-50/40 text-rose-700 hover:bg-rose-100/50 shadow-[0_2px_0_0_rgba(244,63,94,0.15)]";
      case "ring-l":
        return "border-amber-200 bg-amber-50/40 text-amber-700 hover:bg-amber-100/50 shadow-[0_2px_0_0_rgba(245,158,11,0.15)]";
      case "middle-l":
        return "border-emerald-200 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-100/50 shadow-[0_2px_0_0_rgba(16,185,129,0.15)]";
      case "index-l":
        return "border-sky-200 bg-sky-50/40 text-sky-700 hover:bg-sky-100/50 shadow-[0_2px_0_0_rgba(14,165,233,0.15)]";
      case "index-r":
        return "border-sky-200 bg-sky-50/40 text-sky-700 hover:bg-sky-100/50 shadow-[0_2px_0_0_rgba(14,165,233,0.15)]";
      case "middle-r":
        return "border-emerald-200 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-100/50 shadow-[0_2px_0_0_rgba(16,185,129,0.15)]";
      case "ring-r":
        return "border-amber-200 bg-amber-50/40 text-amber-700 hover:bg-amber-100/50 shadow-[0_2px_0_0_rgba(245,158,11,0.15)]";
      case "pinky-r":
        return "border-rose-200 bg-rose-50/40 text-rose-700 hover:bg-rose-100/50 shadow-[0_2px_0_0_rgba(244,63,94,0.15)]";
      case "thumb":
        return "border-purple-200 bg-purple-50/40 text-purple-700 hover:bg-purple-100/50 shadow-[0_2px_0_0_rgba(168,85,247,0.15)]";
      default:
        return "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 shadow-[0_2px_0_0_rgba(0,0,0,0.05)]";
    }
  };

  // Helper to dynamically calculate Remington GAIL keycap labels
  const getRemingtonGailLabel = (key: KeyInfo, isShift: boolean): string | undefined => {
    if (
      key.code === "Backspace" || key.code === "Tab" || key.code === "CapsLock" || 
      key.code === "Enter" || key.code === "ShiftLeft" || key.code === "ShiftRight" || 
      key.code === "Space" || key.code.startsWith("Control") || key.code.startsWith("Alt") || 
      key.code.startsWith("Meta")
    ) {
      return undefined;
    }

    const inputChar = isShift ? key.engShift : key.eng;

    if (inputChar.length === 1) {
      let char = inputChar;
      if (key.code.startsWith("Key")) {
        char = isShift ? key.eng.toUpperCase() : key.eng.toLowerCase();
      }
      return krutidevToUnicode(char) || undefined;
    }

    return undefined;
  };

  return (
    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-card border shadow-inner max-w-full overflow-x-auto select-none font-sans">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 min-w-[700px] justify-between">
          {row.map((key) => {
            const isActive = activeCode === key.code || (key.code === "ShiftLeft" && isShiftActive && activeCode === "Key") || (key.code === "ShiftRight" && isShiftActive && activeCode === "Key");
            const isNext = nextCode === key.code;
            
            const isSpecialKey = 
              key.code === "Backspace" || key.code === "Tab" || key.code === "CapsLock" || 
              key.code === "Enter" || key.code === "ShiftLeft" || key.code === "ShiftRight" || 
              key.code === "Space" || key.code.startsWith("Control") || key.code.startsWith("Alt") || 
              key.code.startsWith("Meta");

            // Find if the target key requires shift
            let nextKeyRequiresShift = false;
            let targetIsLeftHand = false;
            
            if (nextChar) {
              const shiftSymbols = "~!@#$%^&*()_+{}|:\"<>?";
              const isQwertyShift = (c: string) => (c >= "A" && c <= "Z") || shiftSymbols.includes(c);
              
              if (activeLanguage === "EN") {
                nextKeyRequiresShift = isQwertyShift(nextChar);
              } else {
                const isAscii = nextChar.charCodeAt(0) < 128;
                const krutidev = isAscii ? nextChar : getKrutidevCharForUnicode(nextChar);
                nextKeyRequiresShift = krutidev ? isQwertyShift(krutidev) : false;
              }
            }

            // Find if the next target key is a left hand key (to decide which Shift to press)
            if (nextCode) {
              const targetKey = rows.flat().find((k) => k.code === nextCode);
              if (targetKey && targetKey.finger) {
                targetIsLeftHand = targetKey.finger.endsWith("-l");
              }
            }

            const isHighlighted = isActive;
            
            // A key is the target if it is the character key itself, 
            // OR if it is the correct Shift key matching the opposite hand.
            const isTarget = isNext || (
              nextKeyRequiresShift && (
                (targetIsLeftHand && key.code === "ShiftRight") ||
                (!targetIsLeftHand && key.code === "ShiftLeft")
              )
            );

            return (
              <div
                key={key.code}
                className={cn(
                  "relative flex flex-col justify-between p-1.5 h-11 border rounded-md transition-all duration-75 text-[10px] sm:text-xs",
                  key.width || "w-11",
                  getFingerClass(key.finger),
                  isTarget && "animate-pulse ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/60 scale-[1.02] shadow-[0_0_8px_rgba(99,102,241,0.5)]",
                  isHighlighted && "bg-indigo-600 text-white border-indigo-700 shadow-none translate-y-[2px] scale-100",
                  "cursor-default active:translate-y-[2px] active:shadow-none"
                )}
              >
                {isSpecialKey ? (
                  <span className={cn(
                    "absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-sans transition-all duration-75 select-none",
                    isHighlighted ? "text-white font-extrabold" : "text-zinc-700"
                  )}>
                    {key.eng}
                  </span>
                ) : (
                  <>
                    {/* Hindi Layer */}
                    {activeLanguage === "HI" && (
                      <div className="flex justify-between w-full h-full">
                        {/* Shifted Character */}
                        <span className={cn(
                          "absolute top-0.5 right-1.5 text-[11px] font-bold transition-all duration-75",
                          isShiftActive ? "text-indigo-600 font-extrabold scale-110" : "text-muted-foreground/50",
                          isHighlighted && (isShiftActive ? "text-white font-extrabold scale-110" : "text-indigo-200/50")
                        )}>
                          {getRemingtonGailLabel(key, true) || ""}
                        </span>
                        {/* Base Character */}
                        <span className={cn(
                          "absolute bottom-0.5 left-1.5 text-[14px] font-bold transition-all duration-75",
                          !isShiftActive ? "text-zinc-800 font-black scale-105" : "text-muted-foreground/50",
                          isHighlighted && (!isShiftActive ? "text-white font-black scale-105" : "text-indigo-200/50")
                        )}>
                          {getRemingtonGailLabel(key, false) || ""}
                        </span>
                      </div>
                    )}

                    {/* English Layout / Labels */}
                    {activeLanguage === "EN" ? (
                      <>
                        <span className={cn(
                          "absolute top-0.5 right-1.5 text-[9px] font-bold transition-all duration-75",
                          isShiftActive ? "text-indigo-600 scale-105" : "text-muted-foreground/45",
                          isHighlighted && (isShiftActive ? "text-white scale-105" : "text-indigo-200/40")
                        )}>
                          {key.engShift !== key.eng ? key.engShift : ""}
                        </span>
                        <span className={cn(
                          "absolute bottom-0.5 left-1.5 text-xs font-bold transition-all duration-75",
                          !isShiftActive ? "text-zinc-800 font-black scale-105" : "text-muted-foreground/45",
                          isHighlighted && (!isShiftActive ? "text-white font-black scale-105" : "text-indigo-200/40")
                        )}>
                          {key.eng}
                        </span>
                      </>
                    ) : (
                      // Small English index key reference on Hindi keyboard (only for character keys)
                      getRemingtonGailLabel(key, false) !== undefined && (
                        <span className={cn(
                          "absolute top-0.5 left-1 text-[9px] font-bold font-sans transition-all duration-75 leading-none px-1 py-0.5 rounded-[3px]",
                          isHighlighted 
                            ? "text-white bg-indigo-500/40" 
                            : "text-indigo-600 bg-indigo-50/90 border border-indigo-100/50 shadow-sm"
                        )}>
                          {key.eng}
                        </span>
                      )
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Keyboard Guide Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-3 pt-3 border-t text-[10px] text-muted-foreground font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-rose-300 bg-rose-50/50 shadow-sm"></span>
          <span>Pinky</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-amber-300 bg-amber-50/50 shadow-sm"></span>
          <span>Ring</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-emerald-300 bg-emerald-50/50 shadow-sm"></span>
          <span>Middle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-sky-300 bg-sky-50/50 shadow-sm"></span>
          <span>Index</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-purple-300 bg-purple-50/50 shadow-sm"></span>
          <span>Thumbs</span>
        </div>
        <div className="flex items-center gap-1.5 ml-4 border-l pl-4 font-semibold text-indigo-600">
          <span className="inline-block w-3.5 h-3.5 border border-indigo-500 bg-indigo-50/60 rounded animate-pulse shadow-sm"></span>
          <span>Next Key Guide</span>
        </div>
      </div>
    </div>
  );
}
