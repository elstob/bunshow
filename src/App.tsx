"use client";

import { useState } from "react";
import type { JLPTLevel, AppPhase } from "./types";
import { useTheme } from "./hooks/useTheme";
import { useWritingDirection } from "./hooks/useWritingDirection";
import { useFontStyle } from "./hooks/useFontStyle";
import { LevelSelect } from "./components/LevelSelect";
import { StudySession } from "./components/StudySession";
import { ThemeToggle } from "./components/ThemeToggle";
import { DataAttribution } from "./components/DataAttribution";

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("select-level");
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>("N4");
  const { theme, toggle: toggleTheme } = useTheme();
  const { direction, toggle: toggleDirection } = useWritingDirection();
  const { fontStyle, toggle: toggleFontStyle } = useFontStyle();

  const handleLevelSelect = (level: JLPTLevel) => {
    setSelectedLevel(level);
    setPhase("studying");
  };

  const handleExit = () => {
    setPhase("select-level");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <ThemeToggle
        theme={theme}
        onToggle={toggleTheme}
        writingDirection={direction}
        onToggleDirection={toggleDirection}
        fontStyle={fontStyle}
        onToggleFontStyle={toggleFontStyle}
      />

      {phase === "select-level" && (
        <LevelSelect onSelect={handleLevelSelect} />
      )}

      {phase === "studying" && (
        <StudySession
          initialLevel={selectedLevel}
          onExit={handleExit}
          writingDirection={direction}
          fontStyle={fontStyle}
        />
      )}

      <DataAttribution />
    </div>
  );
}
