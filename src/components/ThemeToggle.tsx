import type { WritingDirection } from "../hooks/useWritingDirection";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  writingDirection: WritingDirection;
  onToggleDirection: () => void;
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
}: ThemeToggleProps) {
  return (
    <div className="fixed top-4 right-4 flex gap-2">
      {/* Writing direction toggle */}
      <button
        onClick={onToggleDirection}
        className={btnClass}
        style={btnStyle}
        aria-label={`Switch to ${writingDirection === "horizontal" ? "vertical" : "horizontal"} text`}
      >
        {writingDirection === "horizontal" ? (
          // Vertical text icon: 縦 (tate) — three vertical lines right-to-left
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
          // Horizontal text icon: 横 (yoko) — three horizontal lines
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

      {/* Theme toggle */}
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
  );
}
