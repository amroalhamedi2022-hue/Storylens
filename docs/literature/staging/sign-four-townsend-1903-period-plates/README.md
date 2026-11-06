# The Sign of Four — authentic Townsend illustrated-edition evidence (1903)

**Archive status:** real local WebP scans, source URLs and SHA256 stored in
`manifest.json` under `plates/`, independently fetched by
[GitHub Actions archive #42314060772](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/42314060772).
Exactly eight `File:Sign-t1.jpg` through `File:Sign-t8.jpg` originals.
**NOT** eight approved chapter-card pictures; all eight require matching to
individual chapter scenes and human editorial/territorial legal review.

## Exact historical provenance
- **Work:** Arthur Conan Doyle, *The Sign of Four*, first published 1890.
- **Illustrated scan edition:** G. Newnes Ltd., souvenir edition (1903).
- **Original illustrator:** Frederick Henry Townsend (1868–1920).
- **Individual source pages:** `https://commons.wikimedia.org/wiki/File:Sign-t1.jpg`
  through `File:Sign-t8.jpg`. Original [Commons category](https://commons.wikimedia.org/wiki/Category:The_Sign_of_Four_illustrated_by_F._H._Townsend).
- **Rights:** Commons labels the eight scans Public Domain; retain the
  individual Commons license and geographic/edition-specific approval
  hold rather than inferring universal redistribution permission.
- **Edition caveat:** the main staged **12-chapter original English text**
  is pinned to a Standard Ebooks revision in
  `docs/literature/staging/the-sign-of-the-four/manifest.json`.
  The 1903 visual edition and this text edition are **not identical**.
  Picture ordinal 1..8 is **not** chapter number or proof of a matching scene.

## Verified acquisition
- Dedicated safe downloader `tools/intake_sign_four_townsend_1903.py`
  accepts only eight exact titles with Commons page + original source SHA1,
  individual public-domain evidence, HTTPS-only JPEG payloads and actual
  low-resolution (254–265px) source checks; stores decoded original-colour
  WebP, actual SHA256 and individual creator/edition/rights fields.
- New exception to 350px scan floor is **source-specific**. All existing
  Verne, Wells and Mohicans original-source intake floors remain intact.
- Source-only Actions preserve actual images on a branch and later on main.
  Only the centralized `tools/report_chapter_art_progress.py` computes
  archived source totals after sha verification. It must **not** automatically
  assign a chapter, supply fabricated bilingual alt text or approve images.
- Offline tests `tools/test_sign_four_townsend_1903.py` verify strict
  source whitelist, safe HTTPS, decoded JPEG/WEBP signatures, idempotency
  and non-publication. All eight images were acquired, and exact-head
  source CI must pass again over checked-in binary files before merge.

**Remaining:** visually inspect each source image and find an exact, independently
verified scene/passage in the authentic English chapter (some 1903 captions
may differ from the Standard Ebooks transcription), provide accurate
altAr/altEn, individual territory review and human approval. Until then:
12 source chapters, zero approved chapter pictures. Other PR owners continue
Lost World, Hound, Dracula, Frankenstein and reader UI separately.
