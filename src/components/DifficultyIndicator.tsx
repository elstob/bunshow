import type { JLPTLevel } from "../types";

const LEVEL_COLORS: Record<JLPTLevel, string> = {
  N5: "#7db07d",
  N4: "#6a9ec4",
  N3: "#c4b86a",
  N2: "#c4956a",
  N1: "#c47070",
};

interface DifficultyIndicatorProps {
  score: number;
  currentLevel: JLPTLevel;
}

export function DifficultyIndicator({
  score,
  currentLevel,
}: DifficultyIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm" style={{ color: "var(--c-text-muted)" }}>
        Level
      </span>
      <span
        className="text-lg font-bold"
        style={{ fontFamily: "var(--font-serif-jp)", color: "var(--c-text)" }}
      >
        {currentLevel}
      </span>
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--c-bar-bg)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            backgroundColor: LEVEL_COLORS[currentLevel],
          }}
        />
      </div>
      <span
        className="text-xs w-8 text-right"
        style={{ color: "var(--c-text-muted)" }}
      >
        {score}
      </span>
    </div>
  );
}
