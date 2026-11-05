# Lingua Tales — PERMANENT chapter-image contract (5 November 2026)

**Status: binding, retrospective and prospective. Owner: literature/content workflow.** This contract applies to ALL real chaptered works previously imported, currently in staging, in PR branches, and all future acquisitions. Reader/UI implementation belongs to the other conversation; do not change the Android reader here.

## Non-negotiable acceptance criteria

1. One visible, locally stored **book cover**, with readable book title.
2. **At least one distinct, chapter-specific primary thumbnail** for EVERY real narrative chapter/section of each book. The thumbnail represents a genuine scene of that specific chapter, not a generic book cover, copied placeholder, randomly reused illustration or decorative stock.
3. Each selected image must be a **real downloaded image binary** with a verifiable SHA-256, original creator/edition/date when known, page or scan URL, licensing/territorial review state and bilingual alt text; historically genuine original colour is welcome. Do not invent an archival source or call AI imagery historical art.
4. Keep an explicit, stable **chapter-to-image map** consumable by the separate reader/UI thread. Display journey: book card → ordered image-backed chapter cards, arranged beside one another in a horizontally scrollable gallery/grid according to device → tap chapter card → read that chapter. UX and gestures remain owned by the other thread.
5. For each chapter card use a **single designated primary image**, optionally with other in-prose historical illustrations. Neither additional in-prose images nor a book-wide 450-image archive counts as chapter-card coverage until mapped individually.
6. Source book/translation completeness, editorial review, chapter-image coverage, scan rights, offline file integrity, visual/UI acceptance and signed release are **independent gates**. Chapter-card imagery missing means **visual chapter coverage incomplete**, not proof the source novel is incomplete. Do not declare an unfinished book published.
7. Scope includes works on `main`, open content PRs, and historical staging. Do not accidentally count open-PR source as already merged into `main`; do not duplicate previous images.
8. Human editorial approval and distribution-territory rights clearance are required before marking `READY_FOR_UI`; Gemini's draft or image-similarity judgement is not approval. Review specific source scene passage, attribution and license. A placeholder or external-only URL is NOT a completed thumbnail.
9. Preserve the full original prose, literary translations, app state, other conversations' page-turn/UI design and signer. This track writes source provenance, art, chapter maps and progress only.

## Canonical mapping shape (JSON v1)

Suggested path for a staged book: `docs/literature/staging/<work-id>/chapter-image-map.json`; if a source work uses another stable folder, record it in the central report. Any path is **repository-root-relative**, so the UI thread can package images into the app without silently fetching live network content.

```json
{
  "schemaVersion": 1,
  "bookId": "example-original-work-id",
  "chapterCount": 2,
  "releaseApproved": false,
  "chapters": [
    {
      "chapterOneBased": 1,
      "titleAr": "عنوان الفصل",
      "titleEn": "Chapter title",
      "primaryImage": {
        "imagePath": "docs/literature/staging/example/art/chapter-01.webp",
        "sha256": "the complete 64-character hex checksum",
        "sourceUrl": "https://archive.example.org/scan",
        "sourceEdition": "original historically illustrated edition",
        "sceneAnchor": "exact scene or uniquely supported passage",
        "credit": "artist or archive credit",
        "license": "per-scan rights citation",
        "rightsStatus": "PENDING_TERRITORIAL_REVIEW",
        "altAr": "وصف دقيق للصورة",
        "altEn": "Accurate image description",
        "editoriallyApproved": false
      }
    }
  ]
}
```

**Semantics:** absent `primaryImage` = missing chapter thumbnail; `editoriallyApproved:false` = local candidate only, NOT reader-ready; `rightsStatus` must be independently reviewed; `sourceUrl` alone is never a local image; unverified SHA must never be fabricated. The picture's actual chapter, source citation and file bytes must be verified, not merely guessed from plate ordering. Store original-colour manuscripts without artificial desaturation/cropping. Validate chapter numbering 1..N and no duplicate image-path reuse for distinct chapter cards.

## Backfill / priority order

1. **Around the World in Eighty Days** — full 37 chapter source with draft Arabic; 9 historically sourced, checked-in WebP files have distinct scene-chapter provenance, but chapter-card art has not yet received all editorial, rights and UI approval. Map these 9 as **candidates**, then source unique visuals for the other 28 chapters.
2. **The Moonstone** — original staged, 53 narrative XHTML units plus structural files, exact presentation-unit granularity requires formal chapter index; art leads are not the same as downloaded images.
3. **The War of the Worlds** — 27 historical source chapters; chapter art acquisition, source mapping, translations, review and reader promotion pending.
4. Previously staged complete illustrated originals **Treasure Island, Kidnapped, The Black Arrow, The Last of the Mohicans, The Gilded Age** — preserve their existing full source HTML and 450 verified original illustration files; derive real chapter/section boundaries, map one suitable distinct original illustration per chapter where possible, acquire additional authentic art for uncovered chapters, review rights. A large source art count does NOT mean all chapters covered.
5. Additional older staged book families: **A Study in Scarlet, Dracula, Frankenstein, The Hound of the Baskervilles, The Lost World, The Sign of the Four, Kalila wa Dimna**; **Arabian Nights**, **The Woman in White**, **The Valley of Fear**, **Count of Monte Cristo** and others in open PRs must also be brought into scope after checking actual HEAD/branch ownership. For *Kalila*, use edition-specific Arabic section boundaries; for *Arabian Nights*, chapters/nights need an agreed edition-specific segmentation policy rather than arbitrary invented chapter counts.

## Reporting and transfer contract

- Canonical current machine-audited status: `docs/literature/CHAPTER_ART_PROGRESS.md` (generated by `tools/report_chapter_art_progress.py`) and companion `docs/literature/CHAPTER_ART_PROGRESS.json`.
- Handoff anchor: `docs/handoffs/LINGUA_TALES_HANDOFF_CURRENT.md`; broader scope: `docs/LINGUA_TALES_MASTER_PLAN.md`; original edition/copyright inventory: `docs/LITERATURE_SOURCE_QUEUE.md`.
- After every meaningful content change, update/generate the status, **report per-book: chapters total (or unknown), uniquely mapped local image candidates, rights/editorially approved READY cards, missing cards, actual new binary images, and blockers**. Keep prior and new chat conversations able to recover from these files.
- An hourly ChatGPT automation maintains the handoff and validates content commits; a GitHub action may refresh the machine-generated snapshot when source-art files change. Never claim the automation independently completed a story without verified files and source commits.
- Historical status as of the writing of this contract is a baseline only, not a claim that all stored scans have been scene-aligned or approved for release.
