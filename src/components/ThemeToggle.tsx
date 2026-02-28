import { useState } from "react";
import type { WritingDirection } from "../hooks/useWritingDirection";
import type { FontStyle } from "../hooks/useFontStyle";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  writingDirection: WritingDirection;
  onToggleDirection: () => void;
  fontStyle: FontStyle;
  onToggleFontStyle: () => void;
}

const btnClass =
  "w-9 h-9 flex items-center justify-center rounded-full border transition-colors cursor-pointer";

const btnStyle = {
  borderColor: "var(--c-border)",
  backgroundColor: "var(--c-bg-raised)",
  color: "var(--c-text-secondary)",
};

export function ThemeToggle({
  theme,
  onToggle,
  writingDirection,
  onToggleDirection,
  fontStyle,
  onToggleFontStyle,
}: ThemeToggleProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="fixed top-4 right-4 flex gap-2">
        <button
          onClick={() => setShowHelp(true)}
          className={btnClass}
          style={btnStyle}
          aria-label="Open study guide"
        >
          ?
        </button>

        <button
          onClick={onToggleFontStyle}
          className={btnClass}
          style={btnStyle}
          aria-label={`Switch to ${fontStyle === "classical" ? "modern" : "classical"} font style`}
          title={fontStyle === "classical" ? "Classical font" : "Modern font"}
        >
          Aa
        </button>

        <button
          onClick={onToggleDirection}
          className={btnClass}
          style={btnStyle}
          aria-label={`Switch to ${writingDirection === "horizontal" ? "vertical" : "horizontal"} text`}
        >
          {writingDirection === "horizontal" ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="17" y1="4" x2="17" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="7" y1="4" x2="7" y2="20" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>

        <button
          onClick={onToggle}
          className={btnClass}
          style={btnStyle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-md rounded-lg p-5"
            style={{
              backgroundColor: "var(--c-bg-raised)",
              border: "1px solid var(--c-border)",
              color: "var(--c-text)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">How Bunshow Works</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-sm cursor-pointer"
                style={{ color: "var(--c-text-muted)" }}
                aria-label="Close guide"
              >
                Close
              </button>
            </div>

            <ul
              className="text-sm space-y-2 leading-relaxed"
              style={{ color: "var(--c-text-secondary)" }}
            >
              <li>1. Pick a JLPT level to start a session.</li>
              <li>2. Click the Japanese sentence to toggle furigana.</li>
              <li>3. Click a kanji character to open Jisho.</li>
              <li>4. Press <kbd>space</kbd> (or button) to reveal translation.</li>
              <li>5. Mark your result: <kbd>1</kbd> = Missed, <kbd>2</kbd> = Got it.</li>
              <li>6. Top-right controls: ? guide, sentence font, text direction, theme.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
