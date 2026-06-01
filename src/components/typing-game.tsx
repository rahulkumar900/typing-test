"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { krutidevToUnicode } from "@/lib/hindi-transliterator";
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Heart, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordItem {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
}

interface TypingGameProps {}

const ENGLISH_WORDS = [
  "computer", "keyboard", "practice", "accuracy", "speed", "develop", "science", "nature",
  "habits", "success", "future", "digital", "quantum", "network", "system", "program",
  "clean", "code", "learn", "patience", "master", "focus", "effort", "challenge",
  "logic", "input", "output", "screen", "timer", "score", "level", "game", "world"
];

const HINDI_WORDS = [
  "गति", "अभ्यास", "सफलता", "प्रकृति", "योग", "स्वास्थ्य", "संस्कृति", "संगणक",
  "कुंजीपटल", "अनुभव", "शिक्षा", "तकनीक", "प्रयास", "परिश्रम", "ज्ञान", "विज्ञान",
  "लेखन", "सुंदर", "सरल", "भारत", "राष्ट्र", "भाषा", "विचार", "जीवन", "समय",
  "लक्ष्य", "परिवर्तन", "क्रांति", "महत्व", "सुरक्षा", "संसाधन", "विकास"
];

export function TypingGame({}: TypingGameProps) {
  const [gameLanguage, setGameLanguage] = useState<"EN" | "HI">("EN");
  const [gameState, setGameState] = useState<"idle" | "playing" | "game-over">("idle");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [inputVal, setInputVal] = useState("");
  const [keyBuffer, setKeyBuffer] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wordsRef = useRef<WordItem[]>([]);
  const nextWordId = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const spawnTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Restart Game
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setInputVal("");
    setKeyBuffer([]);
    wordsRef.current = [];
    nextWordId.current = 0;
    setGameState("playing");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Handle SPAWNING words
  useEffect(() => {
    if (gameState !== "playing") {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
      return;
    }

    const spawnWord = () => {
      const wordsList = gameLanguage === "EN" ? ENGLISH_WORDS : HINDI_WORDS;
      const randomText = wordsList[Math.floor(Math.random() * wordsList.length)];
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Ensure word fits on screen horizontally
      const textWidth = randomText.length * 10;
      const minX = 20;
      const maxX = canvas.width - textWidth - 20;
      const x = Math.max(minX, Math.floor(Math.random() * (maxX - minX + 1)) + minX);

      // Speed increases with level
      const baseSpeed = 0.5 + level * 0.15;
      const speed = baseSpeed + Math.random() * 0.4;

      wordsRef.current.push({
        id: nextWordId.current++,
        text: randomText,
        x,
        y: 0,
        speed,
      });
    };

    // Spawn rate speeds up as level increases
    const spawnRate = Math.max(1000, 3000 - level * 200);
    spawnTimer.current = setInterval(spawnWord, spawnRate);

    // Initial spawns
    spawnWord();

    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [gameState, level, gameLanguage]);

  // Main Canvas Render and Update loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDestroyed = false;

    const renderLoop = () => {
      if (isDestroyed) return;

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill Background with a sleek dark space/grid look
      ctx.fillStyle = "rgba(10, 10, 12, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw horizontal dashed warning line at bottom
      ctx.strokeStyle = "rgba(239, 68, 68, 0.25)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 50);
      ctx.lineTo(canvas.width, canvas.height - 50);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      ctx.fillStyle = "rgba(239, 68, 68, 0.05)";
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      // Update and Draw Words
      if (gameState === "playing") {
        const words = wordsRef.current;
        for (let i = words.length - 1; i >= 0; i--) {
          const word = words[i];
          word.y += word.speed;

          // Check if word reached the bottom boundary
          if (word.y >= canvas.height - 45) {
            // Remove word
            words.splice(i, 1);
            
            // Lose a life
            setLives((prev) => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState("game-over");
              }
              return newLives;
            });
            continue;
          }

          // Draw falling word card (glassmorphism look in Canvas)
          const wordPadding = 12;
          ctx.font = "bold 16px sans-serif";
          const textWidth = ctx.measureText(word.text).width;
          const cardWidth = textWidth + wordPadding * 2;
          const cardHeight = 32;

          ctx.fillStyle = "rgba(30, 30, 38, 0.75)";
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 1;
          
          // Draw rounded card background
          const rx = word.x - wordPadding;
          const ry = word.y - 20;
          ctx.beginPath();
          ctx.roundRect?.(rx, ry, cardWidth, cardHeight, 6);
          ctx.fill();
          ctx.stroke();

          // Highlight matching typed prefix
          const textY = word.y;
          ctx.fillStyle = "#ffffff";
          
          if (inputVal && word.text.startsWith(inputVal)) {
            // Draw matching prefix in vibrant emerald green
            ctx.fillStyle = "#10b981";
            const prefix = inputVal;
            ctx.fillText(prefix, word.x, textY);
            
            // Draw remainder in white
            const prefixWidth = ctx.measureText(prefix).width;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(word.text.substring(inputVal.length), word.x + prefixWidth, textY);
          } else {
            // Draw full text in standard color
            ctx.fillText(word.text, word.x, textY);
          }
        }
      }

      // Loop
      if (gameState === "playing") {
        animationFrameId.current = requestAnimationFrame(renderLoop);
      }
    };

    if (gameState === "playing") {
      animationFrameId.current = requestAnimationFrame(renderLoop);
    } else {
      // Draw static screen or clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(10, 10, 12, 0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      isDestroyed = true;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState, inputVal]);

  // Handle inputs & Hindi mappings
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameLanguage === "HI") {
      if (e.ctrlKey || e.metaKey) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        setKeyBuffer((prev) => {
          const nextBuffer = prev.slice(0, -1);
          setInputVal(krutidevToUnicode(nextBuffer.join('')));
          return nextBuffer;
        });
        return;
      }

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        checkWordMatch(inputVal.trim());
        setInputVal("");
        setKeyBuffer([]);
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        setKeyBuffer((prev) => {
          const nextBuffer = [...prev, e.key];
          setInputVal(krutidevToUnicode(nextBuffer.join('')));
          return nextBuffer;
        });
        return;
      }
    } else {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        checkWordMatch(inputVal.trim());
        setInputVal("");
      }
    }
  };

  const checkWordMatch = (typedWord: string) => {
    if (!typedWord) return;

    const words = wordsRef.current;
    const matchIndex = words.findIndex((w) => w.text === typedWord);

    if (matchIndex !== -1) {
      // Successful match: remove word, increase score
      words.splice(matchIndex, 1);
      
      setScore((prev) => {
        const nextScore = prev + 10;
        // Level up every 100 points
        const nextLevel = Math.floor(nextScore / 100) + 1;
        if (nextLevel > level) {
          setLevel(nextLevel);
        }
        return nextScore;
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-4xl mx-auto pb-10">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-3">
          <Swords className="w-5 h-5 text-teal-600 mr-2" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Bubbles & Invaders Mode</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Typing Games</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Type the words correctly before they crash into your defensive shield!
        </p>
      </div>

      <div className="w-full relative">
        {/* Game Stats Bar */}
        <div className="flex justify-between items-center bg-card/60 border rounded-t-xl px-6 py-3 w-full backdrop-blur font-mono">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-muted-foreground">SCORE:</span>
              <span className="text-lg font-bold ml-2 text-primary">{score}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">LEVEL:</span>
              <span className="text-lg font-bold ml-2 text-teal-400">{level}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-2">LIVES:</span>
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${
                  i < lives ? "text-rose-500 fill-rose-500" : "text-muted-foreground/30"
                } transition-colors`}
              />
            ))}
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative border-x border-b rounded-b-xl overflow-hidden shadow-2xl h-[280px] sm:h-[400px] w-full">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-full block bg-black"
          />

          {/* Overlay Screen states */}
          {gameState === "idle" && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none">
              <Swords className="w-16 h-16 text-teal-500 animate-pulse mb-4" />
              <h2 className="text-2xl font-black text-white">Ready to Defend?</h2>
              <p className="text-muted-foreground max-w-sm text-sm mt-2 leading-relaxed">
                Words will drop down from above. Type them exactly as shown and press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted border font-semibold text-xs text-white">SPACE</kbd> or{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted border font-semibold text-xs text-white">ENTER</kbd> to blast them.
              </p>

              {/* Local language selection pill toggle */}
              <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 shadow-inner mt-4">
                <button
                  onClick={() => setGameLanguage("EN")}
                  className={cn(
                    "py-1 px-3 rounded-md text-xs font-bold transition-all duration-150",
                    gameLanguage === "EN" ? "bg-teal-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  English Words
                </button>
                <button
                  onClick={() => setGameLanguage("HI")}
                  className={cn(
                    "py-1 px-3 rounded-md text-xs font-bold transition-all duration-150",
                    gameLanguage === "HI" ? "bg-teal-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  Hindi Words
                </button>
              </div>

              <Button size="lg" className="mt-5 font-bold" onClick={startGame}>
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </div>
          )}

          {gameState === "game-over" && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none">
              <AlertTriangle className="w-16 h-16 text-rose-500 animate-bounce mb-4" />
              <h2 className="text-3xl font-black text-rose-500">GAME OVER</h2>
              <p className="text-muted-foreground text-sm mt-2">
                You reached Level <span className="text-teal-400 font-bold">{level}</span> with a final score of{" "}
                <span className="text-primary font-bold">{score}</span> points.
              </p>
              <div className="flex gap-4 mt-6">
                <Button size="lg" className="font-bold" onClick={startGame}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input controller */}
      {gameState === "playing" && (
        <div className="w-full max-w-md mt-2 flex flex-col gap-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full text-center px-4 py-3 text-lg font-bold tracking-wide rounded-xl bg-card border shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
              placeholder={gameLanguage === "HI" ? "यहाँ टाइप करें..." : "Type word here..."}
              value={inputVal}
              onChange={(e) => gameLanguage === "EN" && setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
            />
          </div>
          {gameLanguage === "HI" && (
            <div className="flex items-center justify-center text-[10px] text-muted-foreground gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Remington GAIL keyboard mapping active! Use QWERTY keys.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
