"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TypingTest } from "@/components/typing-test";

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

export default function TypingTestPage() {
  const router = useRouter();

  const handleTestComplete = (result: TestResult) => {
    // Save to history list in localStorage
    const savedHistory = localStorage.getItem("typing-master-history");
    let history: TestResult[] = [];
    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory);
      } catch (e) {}
    }
    history.push(result);
    localStorage.setItem("typing-master-history", JSON.stringify(history));

    // Store the last results directly so statistics page can load it instantly
    localStorage.setItem("typing-master-last-result", JSON.stringify(result));

    // Trigger local events to update root layout stats
    window.dispatchEvent(new Event("typing-test-complete"));

    // Route to statistics
    router.push("/statistics");
  };

  return <TypingTest onTestComplete={handleTestComplete} />;
}
