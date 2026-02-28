import { useState, useEffect, useCallback } from "react";
import type { Sentence, FuriSegment } from "../types";
import type { WritingDirection } from "../hooks/useWritingDirection";

interface SentenceCardProps {
  sentence: Sentence;
  onResult: (understood: boolean) => void;
  writingDirection: WritingDirection;
}

const KANJI_REGEX = /[\u4e00-\u9faf\u3400-\u4dbf]/;

function renderKanjiLinks(text: string) {
  return text.split("").map((char, i) =>
    KANJI_REGEX.test(char) ? (
      <a
        key={i}
        href={`https://www.wanikani.com/search?query=${char}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "inherit", textDecoration: "none" }}
      >
        {char}
      </a>
    ) : (
      <span key={i}>{char}</span>
    )
  );
}

function renderFuriganaSegments(
  segments: FuriSegment[],
  showFurigana: boolean,
  writingDirection: WritingDirection
) {
  return segments.map((seg, i) => {
    if (typeof seg === "string") {
      return <span key={i}>{renderKanjiLinks(seg)}</span>;
    }

    const [base, reading] = seg;
    return (
      <ruby
        key={i}
        style={{
          rubyPosition: writingDirection === "vertical" ? "over" : "over",
        }}
      >
        {renderKanjiLinks(base)}
        <rp>(</rp>
        <rt
          style={{
            visibility: showFurigana ? "visible" : "hidden",
            fontSize: "0.5em",
            color: "var(--c-text-muted)",
          }}
        >
          {reading}
        </rt>
        <rp>)</rp>
      </ruby>
    );
  });
}

export function SentenceCard({ sentence, onResult, writingDirection }: SentenceCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [showFurigana, setShowFurigana] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!revealed && e.code === "Space") {
        e.preventDefault();
        setRevealed(true);
      }
      if (revealed && e.key === "1") {
        onResult(false);
      }
      if (revealed && e.key === "2") {
        onResult(true);
      }
    },
    [revealed, onResult]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="rounded-lg p-8 max-w-xl w-full"
      style={{
        backgroundColor: "var(--c-bg-raised)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div
        className="mb-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: writingDirection === "vertical" ? "flex-start" : "center",
          maxHeight: "16em",
          overflow: "hidden",
        }}
      >
        <p
          className="text-3xl font-medium leading-relaxed cursor-pointer select-none"
          style={{
            fontFamily: "var(--font-serif-jp)",
            color: "var(--c-text)",
            writingMode: writingDirection === "vertical" ? "vertical-rl" : "horizontal-tb",
            textOrientation: writingDirection === "vertical" ? "upright" : "mixed",
            textAlign: writingDirection === "vertical" ? "start" : "center",
            letterSpacing: writingDirection === "vertical" ? "0.15em" : "normal",
            lineHeight: writingDirection === "vertical" ? "1.8" : "1.5",
          }}
          onClick={(e) => {
            // Don't toggle if clicking a kanji link
            if ((e.target as HTMLElement).tagName === "A") return;
            setShowFurigana((v) => !v);
          }}
        >
          {renderFuriganaSegments(sentence.furigana, showFurigana, writingDirection)}
        </p>
      </div>
      <p
        className="text-xs text-center mb-8"
        style={{ color: "var(--c-text-muted)" }}
      >
        {sentence.grammar_point}
      </p>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-lg transition-colors cursor-pointer"
          style={{
            backgroundColor: "var(--c-bg-hover)",
            color: "var(--c-text-secondary)",
            border: "1px solid var(--c-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--c-border-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--c-border)";
          }}
        >
          Reveal Translation{" "}
          <kbd className="ml-2 text-xs" style={{ color: "var(--c-text-muted)" }}>
            space
          </kbd>
        </button>
      ) : (
        <>
          <p
            className="text-lg text-center mb-8 pt-6"
            style={{
              color: "var(--c-text-secondary)",
              borderTop: "1px solid var(--c-border)",
            }}
          >
            {sentence.english}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => onResult(false)}
              className="flex-1 py-3 rounded-lg transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--c-red-bg)",
                color: "var(--c-red)",
                border: "1px solid var(--c-red-border)",
              }}
            >
              Missed{" "}
              <kbd className="ml-1 text-xs opacity-60">1</kbd>
            </button>
            <button
              onClick={() => onResult(true)}
              className="flex-1 py-3 rounded-lg transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--c-green-bg)",
                color: "var(--c-green)",
                border: "1px solid var(--c-green-border)",
              }}
            >
              Got it{" "}
              <kbd className="ml-1 text-xs opacity-60">2</kbd>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
