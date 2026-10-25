# Lingua Tales — literature provenance and editorial acceptance

Updated 2026-10-25. This ledger distinguishes **packaged original text** from
**researched but not yet imported** classic editions. A book is not accepted
merely because its title is present in a roadmap.

## Packaged draft: Around the World in Eighty Days — Chapter I (Towle 1873)

- ID: `around-the-world-in-eighty-days-towle`; asset:
  `app/src/main/assets/classic-verne-towle-ch01.js`.
- **Only authentic Chapter I of 37** is packaged, not a completed novel.
  English: 1,453 words in 29 continuous source-aligned passage groups;
  new Arabic companion translations: 29; 14 contextual vocabulary/idiom cards;
  one original locally generated Victorian Saville Row SVG scene.
- Author: **Jules Verne (1828–1905)**; original French work (1872).
  English translator: **George Makepeace Towle (1841–1893)**; 1873 edition.
- Edition and full first chapter verified against:
  https://en.wikisource.org/wiki/Around_the_World_in_Eighty_Days_(Towle)/Chapter_1
  and https://www.gutenberg.org/ebooks/103 .
  No Gutenberg trademark, edition images or modern translation is bundled.
  Project Gutenberg lists the Towle text public domain in the **USA**.
  Both original author and translator died over 120 years ago, a strong
  public-domain rationale in common life+70 jurisdictions; **territory-specific
  redistribution review is still open**, as is attribution/edition cross-check.
- Arabic translation is a **new companion draft**, not a pre-existing published
  Arabic translation; independent bilingual editorial proofreading is
  **NOT TESTED**. The opening chapter is marked as a continuing batch.
- Functional source checks: `tools/verne-towle.test.cjs`, including chapter
  beginning/end, continuity anchors, source-occurring lexicon, bilingual
  alignment, offline art, settings theme and backup. CI/Pad 5 device acceptance
  to be recorded separately; do not claim final release.
- Next editorial batch: add **complete Chapter II** from the same Towle
  edition with source and Arabic proofreading, then Chapters III onward.
  No placeholder text should be represented as a completed chapter.

## Packaged: The Salt Meridian (original short serial)

- ID: `the-salt-meridian`; local source: `app/src/main/assets/novella-salt-meridian.js`.
- Status: **SOURCE/CI PASS; EDITORIAL REVIEW NOT TESTED**.
- Five complete chapters, 50 aligned English/Arabic passages, 1,470 English
  words, 14 source-occurring edited expressions, five locally synthesized SVG
  chapter-hero scenes. This is a **short serial story**, not a full-length
  novel and **not a Jules Verne translation**.
- Provenance: original text created for Lingua Tales; no third-party literary
  excerpts, audio, licensed photography or externally sourced illustrations.
  The Arabic companion text requires independent fluent-editor review before
  claiming professionally edited translations.
- Offline packaging and browser journey: Actions run 40155296890 on functional
  SHA `c00b5accb91e44bbded8137c0cdaae2000ad81bc` PASS.
- Remaining: Pad 5 reading/performance, scene fidelity, editorial QA, any
  additional long-form content and signed final release.

## Research-only: Around the World in Eighty Days (1873 Towle translation)

- Author: Jules Verne (1828–1905); original French novel published 1872.
- Specific **English translation**: George Makepeace Towle (1841–1893),
  published 1873; do not substitute a modern translation without rights review.
- Primary source: https://www.gutenberg.org/ebooks/103
- Edition/reference: https://en.wikisource.org/wiki/Around_the_World_in_Eighty_Days_(Towle)
- Project Gutenberg lists this edition **public domain in the USA**. Copyright
  status outside the USA, any trademark conditions for Project Gutenberg
  distribution, and each image's own rights require independent checking
  before public APK distribution. Avoid carrying Project Gutenberg branding
  or license text into an app without reviewing their redistribution terms.
- **NOT PACKAGED, NOT TRANSLATED, NOT EDITORIALLY ACCEPTED.** Do not claim the
  book is already available offline in Lingua Tales.
- Next coherent editorial milestone: verify redistribution territory and
  edition, add substantial contiguous authentic chapters with fresh Arabic
  paragraph translations and source-to-paragraph QA, retain chapter numbering,
  then test actual reader progress, vocabulary and visual context. Prefer
  licensed historical illustrations with per-file provenance and attribution.

## Rules

- Do not call an original AI-assisted serial a published historic classic.
- Never use web image-search results as proof of reuse permission.
- Every imported edition/translation/image needs a source URL, author/editor,
  license or public-domain rationale, checksum and per-chapter QA.
- No third-party PDF, personal medical data, model weights or secrets belong
  in this literature repository.
