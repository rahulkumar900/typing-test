"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Keyboard, BookOpen, Swords, BarChart3, Keyboard as KeyboardIcon, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestResult {
  storyTitle: string;
  wpm: number;
  accuracy: number;
  timeSpent: number;
  errorsCount: number;
  totalCharacters: number;
  charactersTyped: number;
  speedHistory: { time: number; wpm: number }[];
  weakCharacters: Record<string, number>;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Aggregate Stats stored in localStorage
  const [totalTests, setTotalTests] = useState(0);
  const [avgWpm, setAvgWpm] = useState(0);
  const [avgAccuracy, setAvgAccuracy] = useState(0);

  // Sync stats function
  const syncStats = () => {
    const savedHistory = localStorage.getItem("typing-master-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as TestResult[];
        if (parsed.length > 0) {
          setTotalTests(parsed.length);
          const sumWpm = parsed.reduce((sum, r) => sum + r.wpm, 0);
          const sumAcc = parsed.reduce((sum, r) => sum + r.accuracy, 0);
          setAvgWpm(Math.round(sumWpm / parsed.length));
          setAvgAccuracy(Math.round(sumAcc / parsed.length));
        }
      } catch (err) {
        console.error("Failed to parse typing history", err);
      }
    } else {
      setTotalTests(0);
      setAvgWpm(0);
      setAvgAccuracy(0);
    }
  };

  // Load stats history from localStorage on mount and on route updates
  useEffect(() => {
    syncStats();
  }, [pathname]);

  // Handle listening to local storage storage updates across windows/redirects
  useEffect(() => {
    window.addEventListener("storage", syncStats);
    window.addEventListener("typing-test-complete", syncStats);
    return () => {
      window.removeEventListener("storage", syncStats);
      window.removeEventListener("typing-test-complete", syncStats);
    };
  }, []);

  const menuItems = [
    { href: "/", label: "Course", icon: BookOpen },
    { href: "/typing-test", label: "Typing Test", icon: Keyboard },
    { href: "/games", label: "Games", icon: Swords },
    { href: "/statistics", label: "Statistics", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#eef3f7] text-foreground font-sans relative">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Navigation Bar Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-8 select-none shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black tracking-tight text-zinc-800 uppercase font-mono">
              {pathname === "/" && "Touch Typing Course"}
              {pathname === "/typing-test" && "Typing Test"}
              {pathname === "/games" && "Typing Games"}
              {pathname === "/statistics" && "Statistics Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats - Hidden on narrow mobile, visible on sm and up */}
            <div className="hidden sm:flex items-center gap-4 text-[11px] md:text-xs text-muted-foreground font-medium">
              <span>Tests: <strong className="text-foreground">{totalTests}</strong></span>
              <span>Avg WPM: <strong className="text-foreground">{avgWpm}</strong></span>
              <span>Avg Accuracy: <strong className="text-foreground">{avgAccuracy}%</strong></span>
            </div>

            {/* Sidebar toggle button (desktop only) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex items-center justify-center p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-700 border border-zinc-200"
              title={isSidebarOpen ? "Collapse Menu" : "Expand Menu"}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* View switching panel */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Sidebar - Collapsible on Desktop, Hidden on Mobile */}
      <aside className={cn(
        "hidden md:flex flex-col justify-between shrink-0 bg-gradient-to-b from-[#14232e] to-[#0c161d] text-white border-l border-zinc-800 shadow-xl z-10 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 overflow-hidden border-l-0"
      )}>
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="flex items-center gap-3 p-5 border-b border-zinc-800 select-none">
            <div className="p-2.5 bg-teal-500 text-white rounded-xl shadow-md flex items-center justify-center">
              <KeyboardIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block text-white leading-none">TypingMaster</span>
              <span className="text-[10px] uppercase font-bold text-teal-400 mt-1.5 block tracking-widest leading-none">Pro Edition</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "w-[calc(100%+8px)] flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-150 justify-start select-none border-l-4",
                    isActive
                      ? "bg-[#eef3f7] text-[#0b3c40] rounded-l-xl -ml-2 z-20 shadow-[-2px_2px_4px_rgba(0,0,0,0.04)] border-y border-l border-[#0b3c40]/10 border-l-teal-500"
                      : "border-transparent text-teal-100/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-teal-600" : "text-zinc-500")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800 bg-black/10 space-y-2 select-none">
          <div className="px-3.5 py-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-400 font-medium leading-normal">
              Practice daily to improve your typing speed and accuracy
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around z-20 shadow-lg">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[10px] font-bold transition-all",
                isActive ? "text-teal-600" : "text-muted-foreground hover:text-zinc-800"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-teal-600" : "text-muted-foreground")} />
              <span className="text-[9px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
