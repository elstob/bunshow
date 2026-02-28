import { useState, useCallback, useEffect } from "react";

export type WritingDirection = "horizontal" | "vertical";

const STORAGE_KEY = "bunshow-writing-direction";

function getStoredDirection(): WritingDirection {
  if (typeof window === "undefined") {
    return "horizontal";
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "horizontal" || stored === "vertical") {
      return stored;
    }
  } catch {
    // ignore storage failures
  }

  return "horizontal";
}

export function useWritingDirection() {
  const [direction, setDirection] = useState<WritingDirection>("horizontal");

  useEffect(() => {
    setDirection(getStoredDirection());
  }, []);

  const toggle = useCallback(() => {
    setDirection((d) => {
      const next = d === "horizontal" ? "vertical" : "horizontal";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore storage failures
      }
      return next;
    });
  }, []);

  return { direction, toggle };
}
