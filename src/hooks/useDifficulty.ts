import { useState, useCallback, useEffect } from "react";
import type { JLPTLevel } from "../types";

const LEVEL_RANGES: Record<JLPTLevel, [number, number]> = {
  N5: [1, 20],
  N4: [21, 40],
  N3: [41, 60],
  N2: [61, 80],
  N1: [81, 100],
};

const SUCCESS_DELTA = 5;
const FAILURE_DELTA = -8;

function scoreToLevel(score: number): JLPTLevel {
  if (score <= 20) return "N5";
  if (score <= 40) return "N4";
  if (score <= 60) return "N3";
  if (score <= 80) return "N2";
  return "N1";
}

function levelToStartScore(level: JLPTLevel): number {
  const [min, max] = LEVEL_RANGES[level];
  return Math.round((min + max) / 2);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function useDifficulty(initialLevel: JLPTLevel) {
  const [score, setScore] = useState(() => levelToStartScore(initialLevel));

  useEffect(() => {
    setScore(levelToStartScore(initialLevel));
  }, [initialLevel]);

  const currentLevel = scoreToLevel(score);

  const recordSuccess = useCallback(() => {
    setScore((s) => clamp(s + SUCCESS_DELTA, 1, 100));
  }, []);

  const recordFailure = useCallback(() => {
    setScore((s) => clamp(s + FAILURE_DELTA, 1, 100));
  }, []);

  return { score, currentLevel, recordSuccess, recordFailure };
}
