import type { GrammarWeakness } from "../types";

interface GrammarTrackerProps {
  weaknesses: GrammarWeakness[];
  onClear: () => void;
}

export function GrammarTracker({ weaknesses, onClear }: GrammarTrackerProps) {
  if (weaknesses.length === 0) return null;

  return (
    <div
      className="rounded-lg p-5 max-w-xl w-full"
      style={{
        backgroundColor: "var(--c-bg-raised)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-xs font-semibold uppercase"
          style={{ color: "var(--c-text-muted)", letterSpacing: "0.15em" }}
        >
          Weak Points
        </h3>
        <button
          onClick={onClear}
          className="text-xs transition-colors cursor-pointer"
          style={{ color: "var(--c-text-muted)" }}
        >
          Clear
        </button>
      </div>
      <ul className="space-y-1">
        {weaknesses.slice(0, 10).map((w) => (
          <li key={w.point} className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--c-text-secondary)" }}>{w.point}</span>
            <span style={{ color: "var(--c-text-muted)" }}>
              {w.level} &middot; {w.missCount}x
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
