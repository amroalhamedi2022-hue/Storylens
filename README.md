# Lingua Tales 📚

Offline-first Android English reading and vocabulary app for adults. Repository
name remains `Storylens` for continuity; Android package ID remains
`com.storylens.reader` so existing data/upgrade identity is preserved.

## Current development state (2026-10-25)

**IN PROGRESS — draft PR #1, not a final APK.** The production catalog has
37 works, including the newly completed original **The Salt Meridian** short
serial (five chapters, 50 bilingual English/Arabic passages). This original
1,470-word story is **not** a full-length classic. Existing reading progress,
contextual dictionary, idioms, saved words, bookmarks, backup, Arabic/English
UI, RTL/LTR drawer and theme gallery remain core requirements.

- Original five-chapter content and Harbor Ledger theme: source/CI PASS on
  functional SHA `c00b5accb91e44bbded8137c0cdaae2000ad81bc`,
  [Actions 40155296890](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40155296890).
- Optional playback-only synthesized ambience previews (20 selectable scenes)
  are available; **these are not 20 licensed recordings or music tracks**.
  Audio defaults to silent. No microphone, recording, TTS or voice input.
- Public-domain classic research, including the 1873 Towle translation of
  Jules Verne, is tracked in `docs/LITERATURE_PROVENANCE.md`; the classic
  itself is **not yet bundled**.
- The visual design is developed for Xiaomi Pad 5, but device install,
  accessibility, performance, audio focus, editorial translation quality,
  long licensed literature and final acceptance are **NOT TESTED**.

## Development and acceptance

Read `docs/LINGUA_TALES_REBRAND_UX_PERFORMANCE_I18N_PLAN.md` for LT-01..13,
`docs/AUTONOMOUS_ACCEPTANCE.md` for actual PASS/FAIL/NOT TESTED evidence,
and `docs/AUTONOMOUS_DEVELOPER.md` for repository workflow.

The development branch is `automation/storylens-dictionary-saved-words-20261023`.
Do not merge automatically or treat a Debug APK as a release. The GitHub Actions
workflow runs curated Node tests, offline content validation, Android unit
tests and Debug assembly, asset packaging checks and browser journey QA.
Physical Xiaomi Pad 5 testing is still an independent requirement.

No paid APIs, third-party cloud content dependency, or background downloads
are required for reading. Fonts, themes and learning progress are offline.
