export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

// Furigana segment: plain string OR [kanji, reading] tuple
export type FuriSegment = string | [string, string];

export interface Sentence {
  japanese: string;
  english: string;
  grammar_point: string;
  furigana: FuriSegment[];
}

export interface CompactSentence {
  j: string;
  e: string;
  g: string;
  f?: FuriSegment[];
}

export interface GrammarWeakness {
  point: string;
  level: JLPTLevel;
  missCount: number;
}

export type AppPhase = "select-level" | "studying";
