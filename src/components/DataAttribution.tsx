export function DataAttribution() {
  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[min(94vw,52rem)] rounded-md px-3 py-2 text-[11px]"
      style={{
        backgroundColor: "var(--c-bg-raised)",
        border: "1px solid var(--c-border)",
        color: "var(--c-text-muted)",
      }}
    >
      Sentences are adapted from Tatoeba via ManyThings.org. Text data is licensed
      under CC BY 2.0 FR and requires attribution to sentence authors, Tatoeba,
      and ManyThings. See{" "}
      <a
        href="https://www.manythings.org/anki/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--c-accent)" }}
      >
        ManyThings
      </a>
      ,{" "}
      <a
        href="https://tatoeba.org/eng/terms_of_use"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--c-accent)" }}
      >
        Tatoeba terms
      </a>{" "}
      and{" "}
      <a
        href="https://creativecommons.org/licenses/by/2.0/fr/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--c-accent)" }}
      >
        CC BY 2.0 FR
      </a>
      .
    </div>
  );
}
