import { useState } from "react";
import type { WritingDirection } from "../hooks/useWritingDirection";
import type { FontStyle } from "../hooks/useFontStyle";
import type { ThemeMode, ThemePalette } from "../hooks/useTheme";

interface ThemeToggleProps {
  mode: ThemeMode;
  palette: ThemePalette;
  onSelectTheme: (palette: ThemePalette, mode: ThemeMode) => void;
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

const themeOptions: { label: string; palette: ThemePalette; mode: ThemeMode }[] = [
  { label: "Kissa Dark", palette: "classic", mode: "dark" },
  { label: "Kissa Light", palette: "classic", mode: "light" },
  { label: "Sakura Dark", palette: "sakura", mode: "dark" },
  { label: "Sakura Light", palette: "sakura", mode: "light" },
];

export function ThemeToggle({
  mode,
  palette,
  onSelectTheme,
  writingDirection,
  onToggleDirection,
  fontStyle,
  onToggleFontStyle,
}: ThemeToggleProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

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
          onClick={() => setShowThemePicker((v) => !v)}
          className={btnClass}
          style={btnStyle}
          aria-label="Open theme picker"
          title="Theme picker"
        >
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
            <circle cx="13.5" cy="6.5" r="1.5" />
            <circle cx="17.5" cy="10.5" r="1.5" />
            <circle cx="16" cy="15.5" r="1.5" />
            <circle cx="10.5" cy="16.5" r="1.5" />
            <path d="M12 3a9 9 0 1 0 0 18c1.7 0 2.6-1.7 1.6-3.1-.7-1.1-.3-2.5 1-2.9.8-.2 1.6 0 2.4 0 2.8 0 5-2.2 5-5a7 7 0 0 0-7-7h-3z" />
          </svg>
        </button>
      </div>

      {showThemePicker && (
        <div
          className="fixed top-16 right-4 z-50 w-56 rounded-lg p-2"
          style={{
            backgroundColor: "var(--c-bg-raised)",
            border: "1px solid var(--c-border)",
          }}
        >
          <p
            className="px-2 pb-1 text-[11px] uppercase tracking-wider"
            style={{ color: "var(--c-text-muted)" }}
          >
            Theme Picker
          </p>
          <div className="grid gap-1">
            {themeOptions.map((option) => {
              const active = option.mode === mode && option.palette === palette;
              return (
                <button
                  key={option.label}
                  onClick={() => {
                    onSelectTheme(option.palette, option.mode);
                    setShowThemePicker(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm rounded-md cursor-pointer"
                  style={{
                    color: active ? "var(--c-text)" : "var(--c-text-secondary)",
                    backgroundColor: active ? "var(--c-bg-hover)" : "transparent",
                    border: active ? "1px solid var(--c-border-hover)" : "1px solid transparent",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
              <li>6. Top-right controls: ? guide, sentence font, text direction, theme picker.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
