# Lingua Tales — literature provenance and editorial acceptance

Updated 2026-10-25. This ledger distinguishes **packaged original text** from
**researched but not yet imported** classic editions. A book is not accepted
merely because its title is present in a roadmap.

## Packaged draft: Around the World in Eighty Days — Chapter II (Towle; Standard Ebooks transcription)

- ID: `around-the-world-in-eighty-days-towle`; appended by
  `app/src/main/assets/classic-verne-towle-ch02.js` after Chapter I.
  **Two of 37 authentic chapters now packaged**, not a completed novel.
- **English:** all 11 source paragraphs, **1,114 English words**, checked
  paragraph-by-paragraph against the public-domain Towle translation as
  transcribed by Standard Ebooks (11/11 exact matches after HTML and
  typographic spacing normalization). No synopsis or fabricated text.
- **Arabic:** 11 new aligned translations; **independent bilingual literary
  editing NOT TESTED**. Fourteen additional source-occurring
  contextual expressions; one original offline SVG of Fogg's numbered
  wardrobe and matching clocks, distinct from the Chapter I street scene.
- **Upstream English source:** 
  https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-2.xhtml
  (upstream Git blob `62c2a501351321b1251309ffd2d4587ca4a44e5a`).
  **Rights:** Standard Ebooks `LICENSE.md` (blob
  `87aa7d003e74ba350bcce690938ced732f96e06e`) states the
  original text is believed public domain in the United States, and
  contributors dedicate their own editorial contributions worldwide via
  CC0 1.0. Territory-specific rights verification remains **NOT TESTED**.
  No publisher logo or third-party art is included.
- **Source verification:** production scripts evaluated in V8 with the
  upstream XHTML: 11/11 paragraphs matched, 11/11 Arabic passages present,
  14 new terms appear in the English, correct chapter load order and
  distinct offline illustration. These checks do **not** verify Arabic
  translation quality or device performance.
- **Theme:** Station Tickets (railway ticket geometry, blue/ivory/red palette)
  registered in Settings, CSS and offline backup whitelist.
- **Android CI and Pad 5:** see `docs/AUTONOMOUS_ACCEPTANCE.md`; do not
  infer successful packaging or real-device acceptance from V8 checks.
- **Next batch:** complete Chapter III from the same verified translation,
  with independent editorial review of Chapters I–II before final release.

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
- Chapter II is now included as a separate verified English/Arabic draft;
  next editorial batch is **complete Chapter III**, with independent review.
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

## Continuing research: remaining Chapters III–XXXVII of Around the World in Eighty Days

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
- **Chapters I–II are now packaged as unreviewed bilingual drafts; Chapters III–XXXVII are NOT PACKAGED.** Do not claim the complete novel is available offline in Lingua Tales.
- Next coherent editorial milestone: finish redistribution-territory review,
  add contiguous authentic Chapters III onward with fresh Arabic
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
