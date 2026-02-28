import type { JLPTLevel } from "../types";

export interface GrammarPattern {
  point: string;
  level: JLPTLevel;
  patterns: RegExp[];
}

// Regex patterns to detect grammar points in Japanese sentences.
// Intentionally excludes particles like は/が/を/に/で/も/と/から/まで/の
// because they appear in virtually every sentence and provide no signal.
export const grammarPatterns: GrammarPattern[] = [
  // ── N5 ──
  { point: "ます form", level: "N5", patterns: [/ます[。？]?$/, /ました/, /ません/] },
  { point: "て form", level: "N5", patterns: [/てください/, /てから/] },
  { point: "ない form (negation)", level: "N5", patterns: [/ないで/, /なかった/] },
  { point: "たい (want to)", level: "N5", patterns: [/たいです/, /たいと思/, /たくない/] },
  { point: "ている (progressive/state)", level: "N5", patterns: [/ている/, /ています/, /ていた/] },

  // ── N4 ──
  { point: "てもいい (permission)", level: "N4", patterns: [/てもいい/, /でもいい/] },
  { point: "てはいけない (prohibition)", level: "N4", patterns: [/てはいけない/, /ではいけない/, /ちゃいけない/, /じゃいけない/] },
  { point: "なければならない (must)", level: "N4", patterns: [/なければならない/, /なければいけない/, /なきゃ/, /ないといけない/, /なくてはならない/] },
  { point: "たら (conditional)", level: "N4", patterns: [/たら、/, /だったら/] },
  { point: "ば (conditional)", level: "N4", patterns: [/[えけせてねへめれげぜでべ]ば/] },
  { point: "のに (despite)", level: "N4", patterns: [/のに、/, /のに[。！]$/] },
  { point: "ようにする (try to)", level: "N4", patterns: [/ようにする/, /ようにして/] },
  { point: "ようになる (come to be able)", level: "N4", patterns: [/ようになる/, /ようになった/, /ようになり/] },
  { point: "そうだ (hearsay)", level: "N4", patterns: [/そうです/, /そうだ[。]/] },
  { point: "ことがある (sometimes)", level: "N4", patterns: [/ことがある/, /ことがあり/] },
  { point: "たことがある (have experienced)", level: "N4", patterns: [/たことがある/, /たことがない/] },
  { point: "てあげる/てもらう/てくれる (giving/receiving)", level: "N4", patterns: [/てあげ/, /てもらう/, /てもらい/, /てもらっ/, /てくれ/] },
  { point: "passive form", level: "N4", patterns: [/[ら]れた/, /[ら]れる/, /れました/, /れません/] },
  { point: "causative form", level: "N4", patterns: [/[さ]せる/, /[さ]せた/, /せられ/, /せました/] },

  // ── N3 ──
  { point: "ように (so that)", level: "N3", patterns: [/ように[、。]/, /ないように/] },
  { point: "ことにする (decide to)", level: "N3", patterns: [/ことにする/, /ことにした/, /ことにし/] },
  { point: "ことになる (it has been decided)", level: "N3", patterns: [/ことになる/, /ことになった/, /ことになり/, /ことになって/] },
  { point: "ばかり (just did/only)", level: "N3", patterns: [/ばかり/, /ばっかり/] },
  { point: "はず (should be/expected)", level: "N3", patterns: [/はずだ/, /はずです/, /はずが/, /はずの/] },
  { point: "わけ (reason/meaning)", level: "N3", patterns: [/わけだ/, /わけです/, /わけがない/, /わけではない/, /わけにはいかない/] },
  { point: "として (as/in the role of)", level: "N3", patterns: [/として[、は]/] },
  { point: "に対して (toward/against)", level: "N3", patterns: [/に対して/, /に対する/] },
  { point: "について (about/regarding)", level: "N3", patterns: [/について/, /につき/] },
  { point: "によって (depending on/by means of)", level: "N3", patterns: [/によって/, /により/, /による/] },
  { point: "とともに (together with/as well as)", level: "N3", patterns: [/とともに/] },
  { point: "において (in/at — formal)", level: "N3", patterns: [/において/, /における/] },
  { point: "つつある (in the process of)", level: "N3", patterns: [/つつある/] },
  { point: "かわりに (instead of)", level: "N3", patterns: [/かわりに/, /代わりに/] },
  { point: "さえ (even)", level: "N3", patterns: [/さえ[もあ]/, /さえすれば/] },

  // ── N2 ──
  { point: "一方で (on the other hand)", level: "N2", patterns: [/一方で/, /一方、/] },
  { point: "に伴い (along with)", level: "N2", patterns: [/に伴い/, /に伴う/, /に伴って/] },
  { point: "をはじめ (starting with)", level: "N2", patterns: [/をはじめ/] },
  { point: "にかけて (through/over)", level: "N2", patterns: [/にかけて/] },
  { point: "に限り (limited to)", level: "N2", patterns: [/に限り/, /に限って/, /に限る/] },
  { point: "どころか (far from)", level: "N2", patterns: [/どころか/] },
  { point: "にもかかわらず (despite)", level: "N2", patterns: [/にもかかわらず/] },
  { point: "を通じて (through)", level: "N2", patterns: [/を通じて/, /を通して/] },
  { point: "に基づいて (based on)", level: "N2", patterns: [/に基づ/] },
  { point: "上で (after/upon)", level: "N2", patterns: [/[たる]上で/] },
  { point: "次第 (as soon as/depending on)", level: "N2", patterns: [/次第[、。で]/] },
  { point: "に関して (regarding)", level: "N2", patterns: [/に関して/, /に関する/] },
  { point: "つつ (while/although)", level: "N2", patterns: [/[いしきりみびぎ]つつ[、も]/] },
  { point: "たびに (every time)", level: "N2", patterns: [/たびに/] },
  { point: "ものの (although)", level: "N2", patterns: [/ものの[、。]/] },

  // ── N1 ──
  { point: "をもって (by means of/as of)", level: "N1", patterns: [/をもって/] },
  { point: "ともなると (when it comes to)", level: "N1", patterns: [/ともなると/, /ともなれば/] },
  { point: "ないまでも (even if not)", level: "N1", patterns: [/ないまでも/] },
  { point: "をおいて (except for)", level: "N1", patterns: [/をおいて/] },
  { point: "を禁じ得ない (cannot help but)", level: "N1", patterns: [/を禁じ得ない/, /禁じえない/] },
  { point: "極まりない (extremely)", level: "N1", patterns: [/極まりない/, /極まる/] },
  { point: "が早いか (as soon as)", level: "N1", patterns: [/が早いか/] },
  { point: "や否や (the moment that)", level: "N1", patterns: [/や否や/] },
  { point: "であれ (even if/whether)", level: "N1", patterns: [/であれ[、。]/] },
  { point: "たりとも (not even one)", level: "N1", patterns: [/たりとも/] },
  { point: "をものともせず (in spite of)", level: "N1", patterns: [/をものともせず/] },
  { point: "ずにはおかない (cannot help but)", level: "N1", patterns: [/ずにはおかない/] },
  { point: "とあって (because of the special situation)", level: "N1", patterns: [/とあって/] },
  { point: "始末だ (end up in the sorry state of)", level: "N1", patterns: [/始末だ/] },
  { point: "まじき (should not)", level: "N1", patterns: [/まじき/] },
];
