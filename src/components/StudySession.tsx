import { useEffect, useCallback, useRef } from "react";
import type { JLPTLevel } from "../types";
import type { WritingDirection } from "../hooks/useWritingDirection";
import { useDifficulty } from "../hooks/useDifficulty";
import { useGrammarTracker } from "../hooks/useGrammarTracker";
import { useSentenceGenerator } from "../hooks/useSentenceGenerator";
import { SentenceCard } from "./SentenceCard";
import { DifficultyIndicator } from "./DifficultyIndicator";
import { GrammarTracker } from "./GrammarTracker";

interface StudySessionProps {
  initialLevel: JLPTLevel;
  onExit: () => void;
  writingDirection: WritingDirection;
}

export function StudySession({ initialLevel, onExit, writingDirection }: StudySessionProps) {
  const { score, currentLevel, recordSuccess, recordFailure } =
    useDifficulty(initialLevel);
  const { weaknesses, recordMiss, clearAll } = useGrammarTracker();
  const { sentence, isGenerating, generateError, generateSentence } =
    useSentenceGenerator();
  const hasLoadedInitialSentence = useRef(false);

  useEffect(() => {
    if (hasLoadedInitialSentence.current) {
      return;
    }

    hasLoadedInitialSentence.current = true;
    void generateSentence(currentLevel);
  }, [currentLevel, generateSentence]);

  const handleResult = useCallback(
    (understood: boolean) => {
      if (sentence && !understood) {
        recordMiss(sentence.grammar_point, currentLevel);
      }

      if (understood) {
        recordSuccess();
      } else {
        recordFailure();
      }

      const nextScore = understood
        ? Math.min(score + 5, 100)
        : Math.max(score - 8, 1);
      const nextLevel: JLPTLevel =
        nextScore <= 20
          ? "N5"
          : nextScore <= 40
            ? "N4"
            : nextScore <= 60
              ? "N3"
              : nextScore <= 80
                ? "N2"
                : "N1";

      generateSentence(nextLevel);
    },
    [
      sentence,
      score,
      currentLevel,
      recordMiss,
      recordSuccess,
      recordFailure,
      generateSentence,
    ]
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl">
      <div className="flex items-center justify-between w-full">
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-serif-jp)", color: "var(--c-text)" }}
        >
          Study Session
        </h2>
        <button
          onClick={onExit}
          className="text-sm transition-colors cursor-pointer"
          style={{ color: "var(--c-text-muted)" }}
        >
          Change Level
        </button>
      </div>

      <div className="w-full">
        <DifficultyIndicator score={score} currentLevel={currentLevel} />
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center gap-3 py-12">
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: "var(--c-accent)",
              borderTopColor: "transparent",
            }}
          />
          <span className="text-sm" style={{ color: "var(--c-text-muted)" }}>
            Loading sentence...
          </span>
        </div>
      )}

      {generateError && !isGenerating && (
        <div className="text-center py-8">
          <p className="text-sm mb-3" style={{ color: "var(--c-red)" }}>
            {generateError}
          </p>
          <button
            onClick={() => generateSentence(currentLevel)}
            className="text-sm cursor-pointer"
            style={{ color: "var(--c-accent)" }}
          >
            Try Again
          </button>
        </div>
      )}

      {sentence && !isGenerating && !generateError && (
        <SentenceCard
          key={sentence.japanese}
          sentence={sentence}
          onResult={handleResult}
          writingDirection={writingDirection}
        />
      )}

      <GrammarTracker weaknesses={weaknesses} onClear={clearAll} />
    </div>
  );
}
