import type { JLPTLevel } from "../types";

const LEVELS: { level: JLPTLevel; label: string; kanji: string; description: string }[] = [
  { level: "N5", label: "N5", kanji: "初", description: "Beginner — basic phrases & grammar" },
  { level: "N4", label: "N4", kanji: "基", description: "Elementary — everyday conversation" },
  { level: "N3", label: "N3", kanji: "中", description: "Intermediate — general topics" },
  { level: "N2", label: "N2", kanji: "上", description: "Upper intermediate — nuanced expression" },
  { level: "N1", label: "N1", kanji: "極", description: "Advanced — complex & abstract" },
];

interface LevelSelectProps {
  onSelect: (level: JLPTLevel) => void;
}

export function LevelSelect({ onSelect }: LevelSelectProps) {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center">
        <h1
          className="text-5xl font-bold mb-3 tracking-wide"
          style={{ fontFamily: "var(--font-serif-jp)", color: "var(--c-text)" }}
        >
          文<span className="text-3xl" style={{ color: "var(--c-accent)" }}>show</span>
        </h1>
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "var(--c-text-muted)", letterSpacing: "0.2em" }}
        >
          Japanese Sentence Study
        </p>
      </div>

      <div className="grid gap-2 w-full max-w-sm">
        {LEVELS.map(({ level, kanji, description }) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className="flex items-center gap-4 px-5 py-4 rounded-lg transition-all text-left cursor-pointer"
            style={{
              backgroundColor: "var(--c-bg-raised)",
              border: "1px solid var(--c-border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--c-border-hover)";
              e.currentTarget.style.backgroundColor = "var(--c-bg-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--c-border)";
              e.currentTarget.style.backgroundColor = "var(--c-bg-raised)";
            }}
          >
            <span
              className="text-2xl w-10 text-center"
              style={{ fontFamily: "var(--font-serif-jp)", color: "var(--c-accent)" }}
            >
              {kanji}
            </span>
            <div className="flex flex-col">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--c-text)" }}
              >
                {level}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--c-text-muted)" }}
              >
                {description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
