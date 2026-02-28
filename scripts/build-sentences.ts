import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import Kuroshiro from "@sglkc/kuroshiro";
import KuromojiAnalyzer from "@sglkc/kuroshiro-analyzer-kuromoji";

// ── Types ──

type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

// Furigana segment: plain string OR [kanji, reading] tuple
type FuriSegment = string | [string, string];

interface CompactSentence {
  j: string;
  e: string;
  g: string;
  f: FuriSegment[];
}

interface GrammarPattern {
  point: string;
  level: JLPTLevel;
  patterns: RegExp[];
}

// ── Inline data (avoid importing .ts from src at build time) ──

const LEVEL_ORDER: Record<JLPTLevel, number> = {
  N5: 1,
  N4: 2,
  N3: 3,
  N2: 4,
  N1: 5,
};

const ALL_LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
const MAX_PER_LEVEL = 15000;

// ── Load vocab and grammar data by evaluating the TS source ──

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const srcData = join(projectRoot, "src", "data");

// Validate jlptVocab.ts has no duplicate keys by scanning the source text.
// JS silently drops duplicate object keys, so we catch it here instead.
function checkVocabDuplicates(filePath: string): void {
  const src = readFileSync(filePath, "utf-8");
  const keyPattern = /^\s*(\S+):\s*"N[1-5]"/gm;
  const seen = new Map<string, number>();
  const dupes: string[] = [];
  let match: RegExpExecArray | null;
  let lineNum = 0;

  for (const line of src.split("\n")) {
    lineNum++;
    // Reset regex per-line since we use a global pattern
    const linePattern = /(\S+):\s*"N[1-5]"/g;
    while ((match = linePattern.exec(line)) !== null) {
      const key = match[1];
      if (seen.has(key)) {
        dupes.push(`  "${key}" at line ${lineNum} (first seen at line ${seen.get(key)})`);
      } else {
        seen.set(key, lineNum);
      }
    }
  }

  if (dupes.length > 0) {
    console.error(`\nERROR: Duplicate keys found in jlptVocab.ts:\n${dupes.join("\n")}`);
    process.exit(1);
  }

  console.log(`Vocab check passed: ${seen.size} unique entries, no duplicates`);
}

checkVocabDuplicates(join(srcData, "jlptVocab.ts"));

// We'll dynamically import the data files using tsx's TS support
const { jlptVocab } = await import(join(srcData, "jlptVocab.ts"));
const { grammarPatterns } = await import(join(srcData, "grammarPatterns.ts"));

// ── Kuroshiro init ──

console.log("Initializing Kuroshiro (loading dictionary)...");
const kuroshiro = new Kuroshiro();
await kuroshiro.init(new KuromojiAnalyzer());
console.log("Kuroshiro ready.");

// Parse kuroshiro's HTML output into compact furigana segments.
// Input like: <ruby>東京<rp>(</rp><rt>とうきょう</rt><rp>)</rp></ruby>は
// Output: [["東京","とうきょう"], "は"]
function parseFuriganaHTML(html: string): FuriSegment[] {
  const segments: FuriSegment[] = [];
  // Match <ruby>BASE<rp>...<rt>READING</rt>...</ruby> or plain text
  const pattern = /<ruby>([^<]+)<rp>\(<\/rp><rt>([^<]+)<\/rt><rp>\)<\/rp><\/ruby>|([^<]+)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    if (match[1] && match[2]) {
      // Ruby pair — only store if reading differs from base (skip kana-only ruby)
      if (match[1] === match[2]) {
        segments.push(match[1]);
      } else {
        segments.push([match[1], match[2]]);
      }
    } else if (match[3]) {
      segments.push(match[3]);
    }
  }

  // Merge adjacent plain strings
  const merged: FuriSegment[] = [];
  for (const seg of segments) {
    if (typeof seg === "string" && merged.length > 0 && typeof merged[merged.length - 1] === "string") {
      merged[merged.length - 1] = (merged[merged.length - 1] as string) + seg;
    } else {
      merged.push(seg);
    }
  }

  return merged;
}

async function generateFurigana(japanese: string): Promise<FuriSegment[]> {
  try {
    const html = await kuroshiro.convert(japanese, { mode: "furigana", to: "hiragana" });
    return parseFuriganaHTML(html);
  } catch {
    // Fallback: return the whole string as plain text
    return [japanese];
  }
}

// ── Classification functions ──

function classifyLevel(japanese: string): JLPTLevel {
  let hardest: JLPTLevel | null = null;

  for (let len = 1; len <= 6; len++) {
    for (let i = 0; i <= japanese.length - len; i++) {
      const substr = japanese.substring(i, i + len);
      const level = jlptVocab[substr] as JLPTLevel | undefined;
      if (level && (!hardest || LEVEL_ORDER[level] > LEVEL_ORDER[hardest])) {
        hardest = level;
      }
    }
  }

  return hardest ?? "N3";
}

function matchGrammar(japanese: string): { point: string; level: JLPTLevel } | null {
  // Try higher-level patterns first (more distinctive)
  const sorted = [...(grammarPatterns as GrammarPattern[])].sort(
    (a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]
  );

  for (const gp of sorted) {
    for (const pattern of gp.patterns) {
      if (pattern.test(japanese)) {
        return { point: gp.point, level: gp.level };
      }
    }
  }

  return null;
}

// ── Main ──

console.log("Reading Tatoeba data...");
const tsvPath = join(__dirname, "jpn.txt");
const raw = readFileSync(tsvPath, "utf-8");
const lines = raw.split("\n").filter((l) => l.trim());

console.log(`Found ${lines.length} sentence pairs`);

// First pass: classify and bucket (without furigana — that's expensive)
interface RawSentence {
  j: string;
  e: string;
  g: string;
}

const buckets: Record<JLPTLevel, RawSentence[]> = {
  N5: [],
  N4: [],
  N3: [],
  N2: [],
  N1: [],
};

let grammarMatched = 0;

for (const line of lines) {
  const parts = line.split("\t");
  if (parts.length < 2) continue;

  const english = parts[0].trim();
  const japanese = parts[1].trim();

  if (!english || !japanese) continue;

  // Skip very short sentences (less useful for study)
  if (japanese.length < 4) continue;

  const level = classifyLevel(japanese);
  const grammar = matchGrammar(japanese);

  if (grammar) grammarMatched++;

  const sentence: RawSentence = {
    j: japanese,
    e: english,
    g: grammar?.point ?? "general",
  };

  buckets[level].push(sentence);
}

// Write output (shuffle, cap, then generate furigana only for kept sentences)
const outDir = join(srcData, "sentences");
mkdirSync(outDir, { recursive: true });

let totalWritten = 0;

for (const level of ALL_LEVELS) {
  let sentences = buckets[level];

  // Shuffle before capping
  for (let i = sentences.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
  }

  // Cap per level
  if (sentences.length > MAX_PER_LEVEL) {
    sentences = sentences.slice(0, MAX_PER_LEVEL);
  }

  // Generate furigana for kept sentences
  console.log(`${level}: generating furigana for ${sentences.length} sentences...`);
  const withFurigana: CompactSentence[] = [];
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    const f = await generateFurigana(s.j);
    withFurigana.push({ j: s.j, e: s.e, g: s.g, f });

    // Progress logging every 5000
    if ((i + 1) % 5000 === 0) {
      console.log(`  ${level}: ${i + 1}/${sentences.length}`);
    }
  }

  const outPath = join(outDir, `${level}.json`);
  writeFileSync(outPath, JSON.stringify(withFurigana));

  const grammarCount = withFurigana.filter((s) => s.g !== "general").length;
  console.log(
    `${level}: ${withFurigana.length} sentences (${grammarCount} with grammar tags)`
  );
  totalWritten += withFurigana.length;
}

console.log(`\nTotal: ${totalWritten} sentences written`);
console.log(`Grammar matched: ${grammarMatched}/${lines.length} (${((grammarMatched / lines.length) * 100).toFixed(1)}%)`);
console.log("Done!");
