"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

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

export default function StatisticsPage() {
  const router = useRouter();
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to retrieve the last test result or parsed history from localStorage
    const lastResultSaved = localStorage.getItem("typing-master-last-result");
    if (lastResultSaved) {
      try {
        setLastResult(JSON.parse(lastResultSaved) as TestResult);
      } catch (e) {
        console.error("Failed to parse last result", e);
      }
    } else {
      // Fallback to last element of history if last-result is empty
      const historySaved = localStorage.getItem("typing-master-history");
      if (historySaved) {
        try {
          const parsed = JSON.parse(historySaved) as TestResult[];
          if (parsed.length > 0) {
            setLastResult(parsed[parsed.length - 1]);
          }
        } catch (e) {}
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!lastResult) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center select-none">
        <BarChart3 className="w-16 h-16 text-muted-foreground/30 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold">No Practice Data</h2>
        <p className="text-muted-foreground text-sm max-w-xs mt-1.5 leading-relaxed">
          Complete at least one typing practice test to generate your performance metrics and visual analytics.
        </p>
        <Button 
          className="mt-5 font-bold" 
          onClick={() => router.push("/typing-test")}
        >
          Start Practice Now
        </Button>
      </div>
    );
  }

  return (
    <AnalyticsDashboard
      storyTitle={lastResult.storyTitle}
      wpm={lastResult.wpm}
      accuracy={lastResult.accuracy}
      timeSpent={lastResult.timeSpent}
      errorsCount={lastResult.errorsCount}
      totalCharacters={lastResult.totalCharacters}
      charactersTyped={lastResult.charactersTyped}
      speedHistory={lastResult.speedHistory}
      weakCharacters={lastResult.weakCharacters}
      onRestart={() => router.push("/typing-test")}
      onGoHome={() => router.push("/")}
    />
  );
}
