import { useState, useCallback, useRef } from "react";
import type { JLPTLevel, Sentence, CompactSentence } from "../types";

const SESSION_KEY = "bunshow-seen-sentences";

const SENTENCE_LOADERS: Record<
  JLPTLevel,
  () => Promise<{ default: CompactSentence[] }>
> = {
  N5: () =>
    import("../data/sentences/N5.json") as Promise<{ default: CompactSentence[] }>,
  N4: () =>
    import("../data/sentences/N4.json") as Promise<{ default: CompactSentence[] }>,
  N3: () =>
    import("../data/sentences/N3.json") as Promise<{ default: CompactSentence[] }>,
  N2: () =>
    import("../data/sentences/N2.json") as Promise<{ default: CompactSentence[] }>,
  N1: () =>
    import("../data/sentences/N1.json") as Promise<{ default: CompactSentence[] }>,
};

function expandSentence(compact: CompactSentence): Sentence {
  return {
    japanese: compact.j,
    english: compact.e,
    grammar_point: compact.g,
    furigana: compact.f ?? [compact.j],
  };
}

function getSeenSet(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markSeen(japanese: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const seen = getSeenSet();
  seen.add(japanese);

  try {
    if (seen.size > 5000) {
      const arr = Array.from(seen);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(arr.slice(-3000)));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(seen)));
    }
  } catch {
    // ignore storage failures
  }
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useTatoebaSentences() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Partial<Record<JLPTLevel, CompactSentence[]>>>({});

  const loadLevel = useCallback(
    async (level: JLPTLevel): Promise<CompactSentence[]> => {
      if (cacheRef.current[level]) {
        return cacheRef.current[level];
      }

      setIsLoading(true);
      setError(null);

      try {
        const mod = await SENTENCE_LOADERS[level]();
        cacheRef.current[level] = mod.default;
        return mod.default;
      } catch {
        setError(`Failed to load ${level} sentences`);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const pickSentence = useCallback(
    async (level: JLPTLevel, grammarPoint?: string): Promise<Sentence | null> => {
      const sentences = await loadLevel(level);
      if (sentences.length === 0) {
        return null;
      }

      const seen = getSeenSet();

      const candidates = grammarPoint
        ? sentences.filter((s) => s.g === grammarPoint)
        : sentences;

      let unseen = candidates.filter((s) => !seen.has(s.j));
      if (unseen.length === 0) {
        unseen = candidates;
      }
      if (unseen.length === 0) {
        unseen = sentences.filter((s) => !seen.has(s.j));
      }
      if (unseen.length === 0) {
        unseen = sentences;
      }

      const pick = pickRandom(unseen);
      markSeen(pick.j);
      return expandSentence(pick);
    },
    [loadLevel]
  );

  return { pickSentence, isLoading, error };
}
