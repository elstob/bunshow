# bunshow

Next.js app for JLPT-based Japanese sentence study.

## Development

```bash
yarn dev
```

## Build

```bash
yarn build
yarn start
```

## Utility scripts

```bash
yarn download:tatoeba
yarn build:sentences
```

## Study Controls

- Click Japanese text to toggle furigana.
- Click any kanji in the sentence card to open a Jisho lookup.
- Top-right controls include: guide (`?`), sentence font style (`Aa` classical/modern), text direction, and theme.

## Sentence Data License

Sentence examples are adapted from Tatoeba data via ManyThings.org (`scripts/jpn.txt`).

- License: [CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/)
- Terms: [Tatoeba Terms of Use](https://tatoeba.org/eng/terms_of_use)
- Attribution source note: [`scripts/_about.txt`](/Users/davidelstob/Projects/bunshow/scripts/_about.txt)

CC BY attribution is required for redistribution/reuse.
The raw source file (`scripts/jpn.txt`) includes per-sentence attribution strings
from Tatoeba/ManyThings and should be retained when publishing derived datasets.
