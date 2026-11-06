# Lingua Tales — CHG-02 Chapter Gallery UI Handoff
Last verified: **2026-11-07**. Scope: **APP UI / images positioning / reading navigation / QA only**. The other conversation exclusively sources and translates novels and source artwork.

## Actual delivered code on PR #40
- Gallery searches across all chapter numbers + Arabic/English titles, including unmounted chapter cards.
- A source-ordered horizontal rail renders **36 cards per batch**, preserving input, scroll and keyboard focus. Covers book-length sources without putting hundreds of cards in the DOM.
- Restores true reading progress and distinguishes **Start here** from **Resume**; identifies visited pages without faking chapter-completion percentages.
- Fixes same-reader chapter jumps through the existing reader function, avoids extra browser/Android history entries and restores the gallery after a delayed reader exit.
- Supports RTL/LTR hardware-keyboard arrows, Home/End and a focus-visible book-card chapter entry for TalkBack; no changes to Codex-owned paper-curl logic.
- Places only **rights/editorially/source approved local historical images** inside the actual chapter hero and gallery thumbnails with provenance credit and uncropped original colours. Missing art uses numbered chapter placeholders.
- Images are staged by the other content conversation; packaging is offline and verifies exact SHA-256, source edition, archival URL, image licence, per-chapter uniqueness, and revoked/art-orphan failures. No image download, server requests or newly generated story art in this branch.
- CI now has **two independent jobs**: fast source/registry/art safety checks and **real headless Chromium phone/tablet chapter navigation** screenshots. The isolated CI at https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/42308074660 passed all jobs on commit 665f3c95f02f05c2b637e18f3bbc9e182b32d19c. Updates after that run require their own exact-head verification.

## Actual app/source coverage at last inspection
As of GitHub source audit Nov 7: **280** story-chapter local-image candidates across tracked sources; **0** fully rights/editorially approved scene cards; **0** published in the generated local chapter-image registry. These are not equal to ready pictures. Each chapter without approved art retains an explicitly pending numbered card.

Never equate a source candidate with a released Android thumbnail. The source conversation alone selects new images and supplies legal/scene proofs.

## Main work and remaining gates
- Current branch: reader/chapter-gallery-phase2-20261106; PR #40 https://github.com/amroalhamedi2022-hue/Storylens/pull/40.
- Live read-only coverage generator: tools/report_chapter_gallery_ui_progress.py --report; use --write to refresh two machine+human-readable files when making a release/handoff. Do not hardcode historical artwork counts in the app.
- Verify **all final PR-head jobs** (fast, browser, Android, existing reader tests). The previous full Android workflow failed in **an unrelated Wen Glass optical gesture browser test** even though its content/read-navigation stages passed. Do not hide or change that test from this UI branch.
- Separate paper-curl PR #19 and other content workstreams are out-of-scope; don't modify or override them.
- Still needed: real phone/tablet acceptance, actual complete chapter image coverage and rights sign-off from other conversation, final source-linked bilingual edition, signed APK update with permanent existing key and no lost data. **No signed APK delivered or physical device test claimed.**

## Preserving handoff
When moving to another conversation: inspect newest main and PR #40 HEAD, review real GitHub Actions URLs, review docs/CHAPTER_GALLERY_PROGRESS_CURRENT.json plus this file and run the report generator to get current content counts. Continue from commits, not from status prose.
