"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { translateKey } from "@/lib/keyboard-map";
import { krutidevToUnicode, unicodeToKrutidev, getKrutidevCharForUnicode, getCodeFromKrutidev, getHindiWordGuide } from "@/lib/hindi-transliterator";
import { englishStories, hindiStories, Story } from "@/lib/stories";
import { VisualKeyboard } from "@/components/visual-keyboard";
import { ChevronLeft, Clock, ShieldCheck, Flame, Timer, Sparkles, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypingTestProps {
  onTestComplete: (data: {
    storyTitle: string;
    wpm: number;
    accuracy: number;
    timeSpent: number;
    errorsCount: number;
    totalCharacters: number;
    charactersTyped: number;
    speedHistory: { time: number; wpm: number }[];
    weakCharacters: Record<string, number>;
  }) => void;
}

export function TypingTest({ onTestComplete }: TypingTestProps) {
  const [testLanguage, setTestLanguage] = useState<"EN" | "HI">("EN");
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // default 1 min (60s)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeStoryId, setActiveStoryId] = useState<string>("");

  const stories = testLanguage === "EN" ? englishStories : hindiStories;

  // Auto-initialize selected story id when language or list changes
  useEffect(() => {
    if (stories.length > 0) {
      setActiveStoryId(stories[0].id);
    }
  }, [testLanguage, stories]);
  
  // Test State
  const [isTestActive, setIsTestActive] = useState(false);
  const [typedValue, setTypedValue] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [keyBuffer, setKeyBuffer] = useState<string[]>([]);
  
  // Highlighting active keys
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [showTextArea, setShowTextArea] = useState(true);

  // Refs for tracking performance history
  const speedHistoryRef = useRef<{ time: number; wpm: number }[]>([]);
  const weakCharactersRef = useRef<Record<string, number>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);


  const expectedKrutidevContent = React.useMemo(() => {
    if (testLanguage === "HI" && selectedStory) {
      return unicodeToKrutidev(selectedStory.content);
    }
    return "";
  }, [selectedStory, testLanguage]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update timeRemaining when duration is changed
  useEffect(() => {
    setTimeRemaining(selectedDuration);
  }, [selectedDuration]);

  // Start test
  const startTest = (story: Story) => {
    setSelectedStory(story);
    setTypedValue("");
    setKeyBuffer([]);
    setIsTestActive(true);
    setTimeRemaining(selectedDuration);
    setTimeElapsed(0);
    setErrorsCount(0);
    setCorrectCount(0);
    setWpm(0);
    setAccuracy(100);
    speedHistoryRef.current = [];
    weakCharactersRef.current = {};
    
    // Clear and start timer on first keypress or start immediately?
    // Let's start immediately to follow the screenshot timer look.
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const endTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTestActive(false);

    if (selectedStory) {
      onTestComplete({
        storyTitle: selectedStory.title,
        wpm,
        accuracy,
        timeSpent: timeElapsed === 0 ? selectedDuration - timeRemaining : timeElapsed,
        errorsCount,
        totalCharacters: selectedStory.content.length,
        charactersTyped: typedValue.length,
        speedHistory: speedHistoryRef.current.length > 0 ? speedHistoryRef.current : [{ time: timeElapsed || 1, wpm }],
        weakCharacters: weakCharactersRef.current,
      });
    }
  };

  // Timer loop
  useEffect(() => {
    if (!isTestActive) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const nextTime = prev - 1;
        const elapsed = timeElapsed + 1;
        setTimeElapsed(elapsed);

        // Update WPM history point every 5 seconds
        if (elapsed % 5 === 0 || nextTime <= 0) {
          speedHistoryRef.current.push({
            time: elapsed,
            wpm: calculateWPM(elapsed, typedValue.length - errorsCount),
          });
        }

        if (nextTime <= 0) {
          endTest();
          return 0;
        }
        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestActive, timeElapsed, typedValue, errorsCount]);

  // WPM and Accuracy formulas
  const calculateWPM = (seconds: number, netCorrectChars: number) => {
    if (seconds <= 0) return 0;
    const minutes = seconds / 60;
    const words = netCorrectChars / 5;
    return Math.max(0, Math.round(words / minutes));
  };

  const updateStats = (currentVal: string, expectedText: string) => {
    let correct = 0;
    let errors = 0;
    const localWeakChars: Record<string, number> = { ...weakCharactersRef.current };

    for (let i = 0; i < currentVal.length; i++) {
      if (currentVal[i] === expectedText[i]) {
        correct++;
      } else {
        errors++;
        // Track the expected character that was missed
        const targetChar = expectedText[i];
        localWeakChars[targetChar] = (localWeakChars[targetChar] || 0) + 1;
      }
    }

    setCorrectCount(correct);
    setErrorsCount(errors);
    weakCharactersRef.current = localWeakChars;

    // Calculate real-time speed and accuracy
    const calculatedWPM = calculateWPM(timeElapsed || 1, correct);
    setWpm(calculatedWPM);

    const typedCount = currentVal.length;
    const calculatedAcc = typedCount > 0 ? Math.round((correct / typedCount) * 100) : 100;
    setAccuracy(calculatedAcc);

    // End test early if they finish typing the whole text
    if (currentVal.length >= expectedText.length) {
      endTest();
    }
  };

  // Catch physical keypresses for virtual keyboard highlighting and Hindi transliteration
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!selectedStory) return;

    setActiveCode(e.code);
    setIsShiftActive(e.shiftKey);

    if (testLanguage === "HI") {
      if (e.ctrlKey || e.metaKey) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        setKeyBuffer((prev) => {
          const nextBuffer = prev.slice(0, -1);
          const unicodeText = krutidevToUnicode(nextBuffer.join(''));
          setTypedValue(unicodeText);
          updateStats(unicodeText, selectedStory.content);
          return nextBuffer;
        });
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        setKeyBuffer((prev) => {
          const unicodeTextTemp = krutidevToUnicode(prev.join('') + e.key);
          if (unicodeTextTemp.length > selectedStory.content.length) return prev;

          const nextBuffer = [...prev, e.key];
          const unicodeText = krutidevToUnicode(nextBuffer.join(''));
          setTypedValue(unicodeText);
          updateStats(unicodeText, selectedStory.content);
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
    if (!selectedStory) return;
    
    // For English layout, we let standard inputs pass through directly
    if (testLanguage === "EN") {
      const val = e.target.value;
      if (val.length > selectedStory.content.length) return;
      setTypedValue(val);
      updateStats(val, selectedStory.content);
    }
  };

  // Find standard next key code for virtual keyboard typing guides
  const getNextKeyCodeToType = (): string | null => {
    if (!selectedStory) return null;
    
    if (testLanguage === "HI") {
      if (keyBuffer.length >= expectedKrutidevContent.length) return null;
      const nextKrutidevChar = expectedKrutidevContent[keyBuffer.length];
      return getCodeFromKrutidev(nextKrutidevChar);
    } else {
      if (typedValue.length >= selectedStory.content.length) return null;
      const nextChar = selectedStory.content[typedValue.length];
      return getCodeFromKrutidev(nextChar);
    }
  };

  const getNextCharToType = (): string | null => {
    if (!selectedStory) return null;
    if (testLanguage === "HI") {
      if (keyBuffer.length >= expectedKrutidevContent.length) return null;
      return expectedKrutidevContent[keyBuffer.length];
    } else {
      if (typedValue.length >= selectedStory.content.length) return null;
      return selectedStory.content[typedValue.length];
    }
  };

  // Helper to format remaining timer: ss -> m:ss
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getCurrentWord = (): string => {
    if (!selectedStory) return "";
    const index = typedValue.length;
    const content = selectedStory.content;
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
  const wordGuide = testLanguage === "HI" && currentWord ? getHindiWordGuide(currentWord) : null;

  // If no story is selected, show Dashboard Selection Screen
  if (!selectedStory) {
    const activeStory = stories.find(s => s.id === activeStoryId) || stories[0];

    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in font-sans">
        {/* Header Title */}
        <div className="border-b border-zinc-200 pb-4">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Typing Test</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Select a paragraph and set test parameters on the right to start your evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Select Test Text */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">1. Select Test Text</h2>
              <span className="text-xs text-muted-foreground">{stories.length} available texts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {stories.map((story) => {
                const isSelected = activeStoryId === story.id || (!activeStoryId && stories[0]?.id === story.id);
                return (
                  <div
                    key={story.id}
                    onClick={() => setActiveStoryId(story.id)}
                    className={cn(
                      "cursor-pointer p-4 border rounded-xl transition-all duration-200 flex flex-col justify-between h-[150px] relative select-none",
                      isSelected
                        ? "bg-white border-teal-500 ring-2 ring-teal-500 shadow-md scale-[1.01]"
                        : "bg-white/60 border-zinc-200 hover:bg-white hover:shadow hover:border-zinc-300"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                          story.difficulty === "Beginner" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                          story.difficulty === "Intermediate" && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                          story.difficulty === "Advanced" && "bg-purple-500/10 text-purple-600 border-purple-500/20"
                        )}>
                          {story.difficulty}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">{story.category}</span>
                      </div>
                      <h3 className="font-bold text-sm text-zinc-800 line-clamp-1">{story.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {story.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Test Settings Dashboard */}
          <div className="space-y-6">
            <div className="border-b pb-2">
              <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">2. Test Settings</h2>
            </div>

            <Card className="border border-zinc-200 shadow-lg bg-white overflow-hidden rounded-xl">
              <div className="p-5 space-y-5">
                {/* Language Select */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block">Language</label>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-100 p-0.5 border rounded-lg shadow-inner">
                    <button
                      onClick={() => setTestLanguage("EN")}
                      className={cn(
                        "py-1.5 px-3 rounded-md text-xs font-bold transition-all duration-150 text-center",
                        testLanguage === "EN" ? "bg-white text-zinc-800 shadow" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setTestLanguage("HI")}
                      className={cn(
                        "py-1.5 px-3 rounded-md text-xs font-bold transition-all duration-150 text-center",
                        testLanguage === "HI" ? "bg-white text-zinc-800 shadow" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Hindi (GAIL)
                    </button>
                  </div>
                </div>

                {/* Duration Select */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block">Duration</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "1 Min", seconds: 60 },
                      { label: "3 Min", seconds: 180 },
                      { label: "5 Min", seconds: 300 },
                      { label: "10 Min", seconds: 600 },
                    ].map((d) => (
                      <button
                        key={d.seconds}
                        onClick={() => setSelectedDuration(d.seconds)}
                        className={cn(
                          "py-2 px-3 border text-xs font-bold rounded-lg transition-all text-center",
                          selectedDuration === d.seconds
                            ? "bg-teal-50 border-teal-500 text-teal-700 font-extrabold ring-1 ring-teal-500"
                            : "bg-white border-zinc-200 text-muted-foreground hover:bg-zinc-50 hover:border-zinc-300"
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Text Details */}
                {activeStory && (
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 space-y-1.5 text-xs text-zinc-600">
                    <div className="flex justify-between font-semibold border-b border-zinc-100 pb-1">
                      <span>Selected Text:</span>
                      <span className="text-teal-600 font-bold max-w-[120px] truncate">{activeStory.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span className="font-bold text-zinc-700">{activeStory.content.length} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Duration:</span>
                      <span className="font-bold text-zinc-700">{activeStory.duration} minutes</span>
                    </div>
                  </div>
                )}

                {/* Start Button */}
                <Button
                  onClick={() => activeStory && startTest(activeStory)}
                  disabled={!activeStory}
                  className="w-full py-6 text-sm font-extrabold tracking-wide uppercase shadow-md shadow-teal-500/10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all duration-150"
                >
                  Start Typing Test &rarr;
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Active Typing Test screen
  const progressPercent = selectedStory.content.length > 0 
    ? (typedValue.length / selectedStory.content.length) * 100 
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedStory(null)}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
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
          <h2 className="font-extrabold text-lg md:text-xl line-clamp-1 border-l pl-3 hidden md:block">{selectedStory.title}</h2>
        </div>
        
        {/* Simple Top stats dashboard */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono">
          <div className="flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-blue-500" />
            <span>TIME: <span className="font-bold text-blue-400">{formatTimer(timeRemaining)}</span></span>
          </div>
          <div className="flex items-center gap-1 border-l pl-2 sm:pl-3">
            <Flame className="w-3.5 h-3.5 text-purple-500" />
            <span>WPM: <span className="font-bold text-purple-400">{wpm}</span></span>
          </div>
          <div className="flex items-center gap-1 border-l pl-2 sm:pl-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>ACC: <span className="font-bold text-emerald-400">{accuracy}%</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left main typing prompts */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6 flex flex-col">
          {/* Prompts container box */}
          <Card 
            onClick={() => textareaRef.current?.focus()}
            className="shadow-sm overflow-hidden flex-1 select-none border-zinc-200/80 bg-white cursor-text hover:border-indigo-200 transition-colors"
          >
            <CardContent className="p-4 sm:p-6 font-sans text-lg md:text-2xl leading-relaxed text-zinc-400 dark:text-zinc-500 h-[135px] md:h-[195px] overflow-y-auto tracking-wide">
              {/* Highlight expected characters row by row */}
              {selectedStory.content.split("").map((char, index) => {
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
          </Card>

          {/* User Input Area */}
          <Card className={cn(
            "shadow-inner border-2 focus-within:border-primary/50 transition-all duration-300 overflow-hidden",
            !showTextArea ? "opacity-0 h-0 border-0 pointer-events-none absolute w-0" : "opacity-100"
          )}>
            <textarea
              ref={textareaRef}
              rows={2}
              className="w-full p-3 sm:p-4 border-none bg-transparent resize-none text-sm md:text-lg focus:outline-none placeholder:text-muted-foreground/30 font-sans"
              placeholder={testLanguage === "HI" ? "यहाँ टाइप करना शुरू करें (रेमिंगटन गेल कुंजी-मानचित्र स्वचालित रूप से सक्रिय है)..." : "Start typing here..."}
              value={typedValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
            />
          </Card>
        </div>

        {/* Right side live stats panel */}
        <div className="space-y-4">
          <Card className="bg-white border border-zinc-200 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold border-b pb-2">Live Statistics</h3>
              
              {/* Time stats */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                <span className="text-[9px] uppercase font-black text-zinc-400 block tracking-widest font-mono">Time Left</span>
                <span className="text-3xl font-black font-mono text-teal-400 block mt-1 drop-shadow-[0_0_8px_rgba(45,212,191,0.35)]">
                  {formatTimer(timeRemaining)}
                </span>
              </div>

              {/* Speed stats */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <span className="text-[9px] uppercase font-black text-zinc-400 block tracking-widest font-mono">Speed (WPM)</span>
                <span className="text-3xl font-black font-mono text-emerald-400 block mt-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
                  {wpm}
                </span>
              </div>

              {/* Accuracy stats */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                <span className="text-[9px] uppercase font-black text-zinc-400 block tracking-widest font-mono">Accuracy</span>
                <span className="text-3xl font-black font-mono text-amber-400 block mt-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">
                  {accuracy}%
                </span>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2.5 pt-2 text-xs font-medium font-sans">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Characters:</span>
                  <span className="font-bold">{typedValue.length} / {selectedStory.content.length}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Errors:</span>
                  <span className="font-bold text-rose-500">{errorsCount}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Correct:</span>
                  <span className="font-bold text-emerald-500">{correctCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="font-bold">{Math.round(progressPercent)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hindi input status indicator */}
          {testLanguage === "HI" && (
            <div className="flex gap-2 p-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-[10px] text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Remington GAIL keyboard mapping active! Type using traditional typewriter layout.</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom progress bar & submit button */}
      <div className="flex items-center gap-6 mt-4 p-4 border rounded-xl bg-card/20 select-none">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>PROGRESS</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        <Button onClick={endTest} className="font-bold px-6 shadow-md shadow-primary/10">
          Submit Test
        </Button>
      </div>
    </div>
  );
}
