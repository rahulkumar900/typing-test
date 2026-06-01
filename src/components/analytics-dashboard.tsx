"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { AlertCircle, Clock, Percent, ShieldAlert, Sparkles, Trophy, Undo2, Home } from "lucide-react";

interface SpeedHistoryPoint {
  time: number;
  wpm: number;
}

interface AnalyticsDashboardProps {
  storyTitle: string;
  wpm: number;
  accuracy: number;
  timeSpent: number; // in seconds
  errorsCount: number;
  totalCharacters: number;
  charactersTyped: number;
  speedHistory: SpeedHistoryPoint[];
  weakCharacters: Record<string, number>;
  onRestart: () => void;
  onGoHome: () => void;
}

export function AnalyticsDashboard({
  storyTitle,
  wpm,
  accuracy,
  timeSpent,
  errorsCount,
  totalCharacters,
  charactersTyped,
  speedHistory,
  weakCharacters,
  onRestart,
  onGoHome,
}: AnalyticsDashboardProps) {
  // Format duration (e.g., 65s -> 1m 5s)
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // Convert weak characters record to array for Recharts BarChart
  const weakCharsData = Object.entries(weakCharacters)
    .map(([char, count]) => ({
      name: char === " " ? "Space" : char,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // top 10 weak characters

  // Generate recommendations based on weak characters
  const getRecommendations = () => {
    if (weakCharsData.length === 0) {
      return "Excellent typing! You made zero errors. Keep up the flawless work!";
    }
    const charsList = weakCharsData.map((d) => d.name).slice(0, 5).join(", ");
    return `Focus on practicing these keys: ${charsList}. Slow down slightly when approaching these keys to build muscle memory.`;
  };

  // Get performance rating based on accuracy and WPM
  const getRating = () => {
    if (accuracy >= 95 && wpm >= 60) return { label: "Elite Typist", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
    if (accuracy >= 90 && wpm >= 40) return { label: "Excellent", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    if (accuracy >= 80 && wpm >= 25) return { label: "Average", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    return { label: "Needs Practice", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
  };

  const rating = getRating();
  const errorRate = charactersTyped > 0 ? ((errorsCount / charactersTyped) * 100).toFixed(1) : "0.0";

  // Recharts colors
  const purpleGradient = "#a855f7";
  const redColor = "#ef4444";

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Test Complete!</h1>
          <p className="text-muted-foreground mt-1">
            Here's how you performed on &ldquo;{storyTitle}&rdquo;
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-semibold bg-secondary/50">
            <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
            <span className={rating.label === "Needs Practice" ? "text-rose-400" : "text-emerald-400 font-bold"}>
              {rating.label}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Statistics (Speed, Accuracy, Time, Errors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Speed */}
        <Card className="relative overflow-hidden border-l-4 border-l-purple-500 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Speed</CardTitle>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{wpm}</div>
            <p className="text-xs text-muted-foreground mt-1">Words per minute</p>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
            <Percent className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{accuracy}%</div>
            <p className="text-xs text-muted-foreground mt-1">Correct characters</p>
          </CardContent>
        </Card>

        {/* Time */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{formatDuration(timeSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total duration</p>
          </CardContent>
        </Card>

        {/* Errors */}
        <Card className="relative overflow-hidden border-l-4 border-l-rose-500 bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Errors</CardTitle>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-500">{errorsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total mistakes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed Progress over time */}
        <Card className="bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Speed Progress</CardTitle>
            <CardDescription>WPM tracking over the duration of the test</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={(t) => `${t}s`} 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "10px" }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "10px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                  formatter={(val: any) => [`${val} WPM`, "Speed"]}
                  labelFormatter={(label) => `Time: ${label}s`}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke={purpleGradient}
                  strokeWidth={3}
                  dot={{ r: 4, fill: purpleGradient, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weak Characters chart */}
        <Card className="bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Weak Characters</CardTitle>
            <CardDescription>Most frequently missed keys during the session</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {weakCharsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weakCharsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "10px" }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "10px" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(val: any) => [`${val} errors`, "Mistakes"]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {weakCharsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={redColor} opacity={1 - index * 0.08} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
                <Trophy className="w-10 h-10 text-emerald-500 opacity-60" />
                <p className="font-medium text-foreground">Zero Mistakes!</p>
                <p className="text-xs max-w-xs">You typed the entire story without hitting a single wrong character.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Card & Recommendations */}
      <Card className="bg-card/30 backdrop-blur-sm border shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center border-b pb-5">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Characters</div>
              <div className="text-xl font-bold mt-1">{totalCharacters}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Characters Typed</div>
              <div className="text-xl font-bold mt-1">{charactersTyped}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Error Rate</div>
              <div className="text-xl font-bold mt-1 text-rose-500">{errorRate}%</div>
            </div>
          </div>

          {/* Recommendations Banner */}
          <div className="flex gap-3 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-500/90 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-400">Practice Recommendations</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {getRecommendations()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Control Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <Button size="lg" onClick={onRestart} className="px-8 font-semibold shadow-lg shadow-primary/10">
          <Undo2 className="w-4 h-4 mr-2" />
          Practice Again
        </Button>
        <Button size="lg" variant="outline" onClick={onGoHome} className="px-8 font-semibold">
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>
    </div>
  );
}
