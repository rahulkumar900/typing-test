"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { krutidevToUnicode, unicodeToKrutidev, getKrutidevCharForUnicode, getCodeFromKrutidev, getHindiWordGuide } from "@/lib/hindi-transliterator";
import { VisualKeyboard } from "@/components/visual-keyboard";
import { BookOpen, ChevronLeft, ShieldCheck, Star, Award, Check, Sparkles, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  description: string;
  keysText: string;
  expectedContent: string;
}

interface TypingLessonsProps {}

const ENGLISH_LESSONS: Lesson[] = [
  {
    id: "en-l1",
    title: "Lesson 1: Home Row Basics",
    description: "Practice the core home row keys: A, S, D, F, J, K, L, and Semicolon.",
    keysText: "a s d f j k l ;",
    expectedContent: "asdf jkl; asdf jkl; af sd jk l; af sd jk l; fads jkal fads jkal"
  },
  {
    id: "en-l2",
    title: "Lesson 2: Top Row keys E and I",
    description: "Practice your first top row extensions using middle fingers.",
    keysText: "e i",
    expectedContent: "deed kiik de ki de ki side line idle lies file life side line idle"
  },
  {
    id: "en-l3",
    title: "Lesson 3: Top Row keys R and U",
    description: "Extend your index fingers to practice top row keys R and U.",
    keysText: "r u",
    expectedContent: "frrf juuj fr ju fr ju rude user sure pure fuel ruler true rude user"
  },
  {
    id: "en-l4",
    title: "Lesson 4: Top Row keys T and Y",
    description: "Practice index finger stretch extensions for keys T and Y.",
    keysText: "t y",
    expectedContent: "fttf jyyj ft jy ft jy jury duty tiny city test study styler tray test"
  },
  {
    id: "en-l5",
    title: "Lesson 5: Top Row keys W and O",
    description: "Extend your ring fingers to master keys W and O on the top row.",
    keysText: "w o",
    expectedContent: "swws kool sw ko sw ko slow word look room tool flow wood look slow"
  },
  {
    id: "en-l6",
    title: "Lesson 6: Top Row keys Q and P",
    description: "Extend your pinky fingers to reach keys Q and P on the edges.",
    keysText: "q p",
    expectedContent: "aqqa lppl aq lp aq lp quiet loop quit pool pique layout quiet loop"
  },
  {
    id: "en-l7",
    title: "Lesson 7: Bottom Row keys V and M",
    description: "Practice bottom row extensions V and M using index and middle fingers.",
    keysText: "v m",
    expectedContent: "fvvf jmmj fv jm fv jm move view make small time valve move view"
  },
  {
    id: "en-l8",
    title: "Lesson 8: Bottom Row keys B and N",
    description: "Strengthen bottom row index finger stretches for B and N.",
    keysText: "b n",
    expectedContent: "fbbf jnnj fb jn fb jn band name bird hand thin brown band name"
  },
  {
    id: "en-l9",
    title: "Lesson 9: Bottom Row keys Z, X, C",
    description: "Master pinky, ring, and middle finger bottom row extensions.",
    keysText: "z x c",
    expectedContent: "card size exam zone copy zebra exact card size exam zone copy zebra"
  },
  {
    id: "en-l10",
    title: "Lesson 10: Shift & Capital Letters",
    description: "Practice opposite-hand Shift combinations for capital letters.",
    keysText: "Shift + Keys",
    expectedContent: "The Quick Brown Fox Jumps Over The Lazy Dog Java React Next JavaScript"
  }
];

const HINDI_LESSONS: Lesson[] = [
  {
    id: "hi-l1",
    title: "पाठ १: होम रो अभ्यास (Home Row Basics)",
    description: "होम रो के बुनियादी अक्षरों का अभ्यास करें: ो े ् ि ु प र क त च ट",
    keysText: "ो े ् ि ु प र क त च ट",
    expectedContent: "केले पेले मेरे तेरे करते परते चटक पटक चटक पटक करते मटके रपटे केले मेरे"
  },
  {
    id: "hi-l2",
    title: "पाठ २: होम रो मात्रा अभ्यास (Home Row Shift)",
    description: "होम रो के साथ शिफ्ट मात्रा कुंजी-मानचित्रों का अभ्यास करें।",
    keysText: "ओ ए अ इ उ फ ऱ ख थ छ ठ",
    expectedContent: "कोमल तेल केतली चमकीले कोयल करेला चमेली टिकली केतली चमकीले कोमल तेल"
  },
  {
    id: "hi-l3",
    title: "पाठ ३: टॉप रो अभ्यास (Top Row Basics)",
    description: "टॉप रो के बुनियादी अक्षरों का अभ्यास करें: ौ ै ा ी ू ब ह ग द ज ड ़ ॉ",
    keysText: "ौ ै ा ी ू ब ह ग द ज",
    expectedContent: "बातें रातें गीतें मीतें कूदते हँसते गाते जाते कूदते हँसते बातें रातें गीतें मीतें"
  },
  {
    id: "hi-l4",
    title: "पाठ ४: टॉप रो मात्रा अभ्यास (Top Row Shift)",
    description: "टॉप रो शिफ्ट मात्रा कुंजियों (औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ) का अभ्यास करें।",
    keysText: "औ ऐ आ ई ऊ भ घ ध झ",
    expectedContent: "सौरभ हैदर गाजर दीपक बगुला कूदना हँसना गाते जाते सौरभ हैदर गाजर दीपक"
  },
  {
    id: "hi-l5",
    title: "पाठ ५: बॉटम रो अभ्यास (Bottom Row Basics)",
    description: "बॉटम रो के बुनियादी अक्षरों का अभ्यास करें: ॆ ं म न व ल स ष । य",
    keysText: "ॆ ं म न व ल स ष । य",
    expectedContent: "मनन नमन वनम लसन समन नमन मनन वनम लसन समन शमन नमन मनन वनम"
  },
  {
    id: "hi-l6",
    title: "पाठ ६: बॉटम रो मात्रा अभ्यास (Bottom Row Shift)",
    description: "बॉटम रो शिफ्ट अक्षरों (ऎ ँ ण ऩ ऴ ळ श ष) का अभ्यास करें।",
    keysText: "ऎ ँ ण ऩ ऴ ळ श",
    expectedContent: "शंकर शमशेर समय यमराज नमक महल लखन समय यमराज नमक महल लखन शंकर शमशेर"
  },
  {
    id: "hi-l7",
    title: "पाठ ७: संख्या पंक्ति अभ्यास (Number Row)",
    description: "संख्या पंक्ति कुंजियों के हिंदी प्रतीकों और मानों का अभ्यास करें।",
    keysText: "१ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ",
    expectedContent: "१२३ ४५६ ७८९ ०१२ ऋषि कृपा हृदय कृपा ऋषि कृपा हृदय १२३ ४५६ ७८९"
  },
  {
    id: "hi-l8",
    title: "पाठ ८: हलंत और आधा अक्षर अभ्यास (Conjuncts)",
    description: "आधे अक्षरों को हलंत (्) अथवा पूर्ण करने वाली कुंजी (k) के संयोजन से टाइप करना सीखें।",
    keysText: "हलंत (्) conjuncts",
    expectedContent: "सत्य न्याय क्या क्यों रक्त भक्त सत्य न्याय क्या क्यों रक्त भक्त कष्ट नष्ट"
  },
  {
    id: "hi-l9",
    title: "पाठ ९: रेफ और र-मात्रा अभ्यास (Reph & R-vowel)",
    description: "रेफ (र् - Shift+Z) और र-मात्रा अभ्यास (्र - Shift+3) का अभ्यास करें।",
    keysText: "र् (Shift+Z) ्र (Shift+3)",
    expectedContent: "धर्म कर्म वर्ष हर्ष प्रकाश प्रकार प्रमोद राष्ट्र धर्म कर्म वर्ष हर्ष प्रकाश प्रकार"
  },
  {
    id: "hi-l10",
    title: "पाठ १०: पूर्ण वाक्य और गति परीक्षण",
    description: "विराम चिन्हों सहित पूरे वाक्यों में Remington GAIL कुंजी लेआउट की गति का परीक्षण करें।",
    keysText: "मिश्रित कुंजी अभ्यास",
    expectedContent: "सफलता का मार्ग कठिन अवश्य है परंतु निरंतर अभ्यास और कठिन परिश्रम से सब संभव है"
  }
];

export function TypingLessons({}: TypingLessonsProps) {
  const [lessonLanguage, setLessonLanguage] = useState<"EN" | "HI">("EN");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // Lesson Practice state
  const [typedValue, setTypedValue] = useState("");
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [keyBuffer, setKeyBuffer] = useState<string[]>([]);
  const [errorsCount, setErrorsCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTextArea, setShowTextArea] = useState(true);
  
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const lessons = lessonLanguage === "EN" ? ENGLISH_LESSONS : HINDI_LESSONS;

  const expectedKrutidevContent = React.useMemo(() => {
    if (lessonLanguage === "HI" && selectedLesson) {
      return unicodeToKrutidev(selectedLesson.expectedContent);
    }
    return "";
  }, [selectedLesson, lessonLanguage]);

  const selectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setTypedValue("");
    setKeyBuffer([]);
    setErrorsCount(0);
    setAccuracy(100);
    setIsCompleted(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const updateStats = (currentVal: string, expectedText: string) => {
    let correct = 0;
    let errors = 0;

    for (let i = 0; i < currentVal.length; i++) {
      if (currentVal[i] === expectedText[i]) {
        correct++;
      } else {
        errors++;
      }
    }

    setErrorsCount(errors);
    const typedCount = currentVal.length;
    const calculatedAcc = typedCount > 0 ? Math.round((correct / typedCount) * 100) : 100;
    setAccuracy(calculatedAcc);

    // End lesson if complete
    if (currentVal.length >= expectedText.length) {
      setIsCompleted(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!selectedLesson || isCompleted) return;

    setActiveCode(e.code);
    setIsShiftActive(e.shiftKey);

    if (lessonLanguage === "HI") {
      if (e.ctrlKey || e.metaKey) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        setKeyBuffer((prev) => {
          const nextBuffer = prev.slice(0, -1);
          const unicodeText = krutidevToUnicode(nextBuffer.join(''));
          setTypedValue(unicodeText);
          updateStats(unicodeText, selectedLesson.expectedContent);
          return nextBuffer;
        });
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        setKeyBuffer((prev) => {
          const unicodeTextTemp = krutidevToUnicode(prev.join('') + e.key);
          if (unicodeTextTemp.length > selectedLesson.expectedContent.length) return prev;

          const nextBuffer = [...prev, e.key];
          const unicodeText = krutidevToUnicode(nextBuffer.join(''));
          setTypedValue(unicodeText);
          updateStats(unicodeText, selectedLesson.expectedContent);
          return nextBuffer;
        });
      }
    }
  };

  const handleKeyUp = () => {
    setActiveCode(null);
    setIsShiftActive(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedLesson || isCompleted) return;
    
    if (lessonLanguage === "EN") {
      const val = e.target.value;
      if (val.length > selectedLesson.expectedContent.length) return;
      setTypedValue(val);
      updateStats(val, selectedLesson.expectedContent);
    }
  };

  const getNextKeyCodeToType = (): string | null => {
    if (!selectedLesson) return null;
    
    if (lessonLanguage === "HI") {
      if (keyBuffer.length >= expectedKrutidevContent.length) return null;
      const nextKrutidevChar = expectedKrutidevContent[keyBuffer.length];
      return getCodeFromKrutidev(nextKrutidevChar);
    } else {
      if (typedValue.length >= selectedLesson.expectedContent.length) return null;
      const nextChar = selectedLesson.expectedContent[typedValue.length];
      return getCodeFromKrutidev(nextChar);
    }
  };

  const getNextCharToType = (): string | null => {
    if (!selectedLesson) return null;
    if (lessonLanguage === "HI") {
      if (keyBuffer.length >= expectedKrutidevContent.length) return null;
      return expectedKrutidevContent[keyBuffer.length];
    } else {
      if (typedValue.length >= selectedLesson.expectedContent.length) return null;
      return selectedLesson.expectedContent[typedValue.length];
    }
  };

  const getCurrentWord = (): string => {
    if (!selectedLesson) return "";
    const index = typedValue.length;
    const content = selectedLesson.expectedContent;
    if (index < 0 || index >= content.length) return "";

    let start = index;
    while (start > 0 && content[start - 1] !== " " && content[start - 1] !== "\n") {
      start--;
    }

    let end = index;
    while (end < content.length && content[end] !== " " && content[end] !== "\n") {
      end++;
    }

    return content.slice(start, end).trim();
  };

  const nextKeyCode = getNextKeyCodeToType();
  const currentWord = getCurrentWord();
  const wordGuide = lessonLanguage === "HI" && currentWord ? getHindiWordGuide(currentWord) : null;

  // Selection list
  if (!selectedLesson) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in font-sans">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Touch Typing Course</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Complete the interactive lessons to master finger placement and build muscle memory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 mt-4">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Select Lesson</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Choose a lesson module to learn key fingerings</p>
          </div>
          <div className="flex bg-zinc-100 border rounded-lg p-0.5 shadow-inner self-start sm:self-auto">
            <button
              onClick={() => setLessonLanguage("EN")}
              className={cn(
                "py-1 px-3 rounded-md text-xs font-bold transition-all duration-150",
                lessonLanguage === "EN" ? "bg-black text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              English Lessons
            </button>
            <button
              onClick={() => setLessonLanguage("HI")}
              className={cn(
                "py-1 px-3 rounded-md text-xs font-bold transition-all duration-150",
                lessonLanguage === "HI" ? "bg-black text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Hindi Lessons
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {lessons.map((lesson, idx) => (
            <Card
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              className="cursor-pointer transition-all duration-200 border bg-card/40 hover:bg-card hover:shadow-lg hover:border-primary/30 flex items-center justify-between"
            >
              <div className="p-5 flex gap-4 items-start">
                <div className="p-2 bg-primary/10 border border-primary/20 rounded-xl text-primary shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base">{lesson.title}</h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    {lesson.description}
                  </p>
                  <div className="text-[10px] uppercase font-bold text-primary tracking-wider pt-1.5 font-mono">
                    KEYS: {lesson.keysText}
                  </div>
                </div>
              </div>
              <div className="pr-5 shrink-0 text-muted-foreground/50">
                <Star className="w-5 h-5 fill-muted/10" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Active Lesson screen
  const progressPercent = selectedLesson.expectedContent.length > 0 
    ? (typedValue.length / selectedLesson.expectedContent.length) * 100 
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedLesson(null)}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Lessons
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTextArea(!showTextArea)}
            className="text-muted-foreground flex items-center gap-1.5 font-bold"
            title={showTextArea ? "Hide input box (Focus mode)" : "Show input box"}
          >
            {showTextArea ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showTextArea ? "Hide Input" : "Show Input"}</span>
          </Button>
          <h2 className="font-extrabold text-lg md:text-xl border-l pl-3 hidden md:block">{selectedLesson.title}</h2>
        </div>
        
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-bold tracking-wider">ACCURACY:</span>
            <span className={cn("font-black text-sm", accuracy >= 90 ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.2)]" : "text-rose-400")}>
              {accuracy}%
            </span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-bold tracking-wider">ERRORS:</span>
            <span className="font-black text-rose-500 text-sm drop-shadow-[0_0_6px_rgba(239,68,68,0.2)]">
              {errorsCount}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Practice prompt board */}
        <Card 
          onClick={() => textareaRef.current?.focus()}
          className="shadow-sm overflow-hidden select-none border-zinc-200/80 bg-white cursor-text hover:border-indigo-200 transition-colors"
        >
          <CardContent className="p-4 sm:p-6 font-sans text-lg md:text-2xl leading-relaxed text-zinc-400 dark:text-zinc-500 h-[110px] md:h-[150px] overflow-y-auto tracking-wide">
            {selectedLesson.expectedContent.split("").map((char, index) => {
              const isTyped = index < typedValue.length;
              const isCurrent = index === typedValue.length;
              const isCorrect = isTyped && typedValue[index] === char;

              return (
                <span
                  key={index}
                  className={cn(
                    "transition-all duration-75 rounded-[2px]",
                    isCurrent && "border-l-2 border-indigo-600 bg-indigo-50 text-zinc-950 font-semibold px-[1px] animate-[pulse_1.2s_infinite] shadow-sm",
                    isTyped && isCorrect && "text-zinc-800 bg-transparent dark:text-zinc-100",
                    isTyped && !isCorrect && "text-red-600 bg-red-50/70 border-b border-red-400/40 font-bold px-[1px]"
                  )}
                >
                  {char === " " && isTyped && !isCorrect ? "␣" : char}
                </span>
              );
            })}
          </CardContent>
          
          {/* Compact Keystroke Assistant footer inside prompt Card */}
          {wordGuide && wordGuide.length > 0 && (
            <div className="bg-zinc-50 border-t px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground font-sans select-none">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-indigo-500 font-mono">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>GAIL Guide ({currentWord}):</span>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                {wordGuide.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-white border px-1.5 py-0.5 rounded shadow-sm text-[10px]">
                    <span className="font-bold text-zinc-800">{item.char}</span>
                    <span className="text-[9px] text-muted-foreground">➔</span>
                    <span className="flex gap-0.5">
                      {item.keys.map((k, kidx) => {
                        const isMeta = k.includes("Shift") || k.includes("Alt");
                        return (
                          <kbd
                            key={kidx}
                            className={cn(
                              "px-1 py-0.2 font-mono font-bold rounded border text-[9px]",
                              isMeta ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-zinc-100 text-zinc-700 border-zinc-200"
                            )}
                          >
                            {k}
                          </kbd>
                        );
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Input box */}
        {!isCompleted ? (
          <Card className={cn(
            "shadow-inner border-2 focus-within:border-primary/50 transition-all duration-300 overflow-hidden",
            !showTextArea ? "opacity-0 h-0 border-0 pointer-events-none absolute w-0" : "opacity-100"
          )}>
            <textarea
              ref={textareaRef}
              rows={2}
              className="w-full p-3 sm:p-4 border-none bg-transparent resize-none text-sm md:text-lg focus:outline-none placeholder:text-muted-foreground/30 font-sans"
              placeholder={lessonLanguage === "HI" ? "अक्षरों को देखकर यहाँ टाइप करें..." : "Look at the keys and type here..."}
              value={typedValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
            />
          </Card>
        ) : (
          <Card className="bg-emerald-500/5 border-emerald-500/10 shadow-lg p-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
              <Award className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-emerald-400">Lesson Completed!</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Great job! You finished the practice set with an accuracy of{" "}
              <span className="font-bold text-foreground">{accuracy}%</span> and committed{" "}
              <span className="font-bold text-rose-500">{errorsCount}</span> total errors.
            </p>
            <div className="flex gap-4 mt-2">
              <Button size="sm" onClick={() => selectLesson(selectedLesson)}>
                Try Again
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedLesson(null)}>
                Next Lesson
              </Button>
            </div>
          </Card>
        )}

        {/* Keyboard Map Guide */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold uppercase px-1">
            <span>Keyboard Fingering Guide</span>
            <span>Active Layout: {lessonLanguage === "HI" ? "Hindi (Remington GAIL)" : "English (QWERTY)"}</span>
          </div>



          <div className="hidden sm:block">
            <VisualKeyboard
              activeLanguage={lessonLanguage}
              activeCode={activeCode}
              nextCode={nextKeyCode}
              nextChar={getNextCharToType()}
              isShiftActive={isShiftActive}
            />
          </div>
        </div>

        {lessonLanguage === "HI" && !isCompleted && (
          <div className="flex gap-2 p-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-[10px] text-emerald-400 max-w-max mx-auto">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Remington GAIL keyboard mapping active! Use QWERTY keys.</span>
          </div>
        )}
      </div>
    </div>
  );
}
