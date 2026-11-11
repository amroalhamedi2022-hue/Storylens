# Story Art — 11 November 2026, continuation from merged PR #80

## Verified new work
- PR #80 was merged into main at **eac0d193e2410823971d842c9da7dabe467599ef** after the complete Android CI passed. 3 older colored moodboards preserved.
- Added **2 additional real WebP images** at 1536x1024, totaling 1,260,716 image bytes, with SHA-256 in `batch-20261111/manifest.json`. This changes the repository's STYLE reference count from 3 to **5** (NOT the number of approved in-reader illustrations).
- Both new images show scenes that do not match early original Verne passages, and Fogg's identity remains inaccurate. They are deliberately REJECTED as chapter art, kept only as color/framing/lighting studies.
- Added 6 individually source-verified **chapter I–IV production prompts**, accessible from a deterministic Node queue. It reads the real bilingual Android chapter files, checks the exact quote, original paragraph hash, correct chapter positions and the BEARDED/LIGHT-haired Fogg reference.
- The OpenAI single-image API adapter now supports `--color-scenes --scene verne-ch03-color-wager` with existing explicit paid-call protections, output unapproved only.
- New GitHub workflow hashes both real image files, validates all 6 source anchors, runs adapter dry-run and uploads a queue artifact; no automatic generation and no network in Android.
- **0 new chapter illustrations were approved or added to the Android reader, 0 signed APK.** No physical-device tests claimed.

## Next work
Generate *one scene at a time* with controlled references and source-accurate appearances, reject any collage or invented activity; secure the rights/editorial/owner reviews, and only then promote successful frames through the offline image packager and Android UI QA.
