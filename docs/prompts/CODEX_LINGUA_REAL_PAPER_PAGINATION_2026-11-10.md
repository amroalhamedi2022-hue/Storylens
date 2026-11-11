# CODEX DELEGATION — Lingua Tales / real-paper text pagination (2026-11-10)

You are the lead Android WebView typography/pagination engineer assigned one **bounded implementation task** within an existing production reader. **Ship a tested PR with concrete code, not a plan or report.** The owner chat retains final design, physical curl geometry and merge control. User prefers engineering-quality source changes and objective evidence, not optimistic status prose.

## 0. Mandatory evidence first

Repository: `amroalhamedi2022-hue/Storylens`.
Existing parent integration branch: `fix/reader-integrity-49-audit-20261110`, PR [#68](https://github.com/amroalhamedi2022-hue/Storylens/pull/68).
Before branching: inspect **latest** HEAD of PR #68 and `main`, actual open PRs and workflow status; do not assume SHA in this document remains current. Read:
- `AGENTS.md`
- `docs/LINGUA_TALES_MASTER_PLAN.md`
- `docs/LINGUA_TALES_LIVE_STATUS.md`
- `docs/handoffs/LINGUA_TALES_HANDOFF_CURRENT.md`
- `docs/qa/READER_AUDIT_49_TRACKER_2026-11-10.md`
- `app/src/main/assets/reader-experience.js`, `reader-experience.css`, `physical-page-curl.js` (last one read-only), `index.html`
- `tools/measured-reader-pages.test.cjs`, `tools/physical-page-curl.test.cjs`, `tools/physical-page-curl-browser.cjs`, `tools/semantic-bookmarks.test.cjs`, `tools/reader-page-scroll.test.cjs`.

Create a **new dedicated branch** `codex/lingua-real-paper-pagination-20261110` from the current **PR #68 head**, NOT stale main. Open a PR targeting `fix/reader-integrity-49-audit-20261110`, not `main`. If branch already exists, inspect latest changes and continue there safely; never reset it.

## 1. Exclusively assigned defect IDs

Implement a proper, measurable solution for **P0 #16 (nearly empty sheets), P0 #17 (only whole-paragraph page boundaries), P1 #18 (paragraph taller than page)**. Existing reader groups full paragraphs by `ltMeasuredParagraphHeights()` / `ltMeasuredPageStarts()` with a four-paragraph cap, and reserves chapter title height on the first page. It deliberately leaves oversized paragraphs unbroken and scrollable; **that behavior is insufficient** for authentic bounded paper leaves.

Goal: **fit prose to one physical page and continue it on the next**, line-aware and with actual WebView typography metrics, preserving text byte-for-byte and interaction semantics. Must work for both portrait single sheet and landscape two sheets in RTL and LTR, and respect user-selected language, fonts, reader-material themes, translations, and dynamic window resizing.

## 2. Engineering contract / correctness

- Preserve the original authentic text and chapter ordering **exactly**. Never rewrite, drop, silently duplicate, summarize, inject fake prose or change translations. Render exact, reversible character order across page fragments, including punctuation, spaces, Arabic combining marks, directional text and line endings. Do not split a grapheme cluster or corrupt ligatures.
- Prefer DOM Range-based layout measurement (or proven equivalent) that uses actual rendered text metrics after `document.fonts.ready`, not word-count-only guesses or a hard-coded number of lines. Minimize forced synchronous reflow; benchmark or bound DOM work for long 200k+ word novels.
- Keep chapter heading/label inside the **first true sheet** (already corrected on PR #68); account for its actual measured height. Never create a title-only sheet if subsequent text fits.
- Keep bilingual and inline companion translations **in correct semantic order**; preserve `lang`, `dir`, font profiles, punctuation and content. Split safely without confusing parallel translations; handle exceptionally long translations independently if needed while maintaining their source pairing and paragraph identity.
- Never crop or distort historic images. A figure with its real source caption stays complete or moves to a separate paper if necessary; an image that cannot fit may use a dedicated readable full-height sheet, while preserving image size/rights/provenance and exact source position. Do not alter or source image files.
- Preserve interactive dictionary `.tok` taps exactly once per tap, compound phrase matching, word sheets, saved words, SRS, translations, keyboard focus, native Back, reader scroll and full-book reader.
- Semantic bookmarks and read progress must survive reflow, rotation, font changes, app restart and saved data formats. Preserve/migrate the existing `readpage_*` and `readpage_anchor_*` semantics; adding a backward-compatible fragment/offset anchor is allowed. Never discard old users' saved progress, backups or sync keys.
- Keep page-turn commit/cancel, controls, RTL physical direction and current `LinguaPageCurl` API working. The visual curl engine and ghost/under-paper logic are explicitly **out of scope**. No shortcut that hides text or disables the real gesture engine.
- Do not ever depend on the internet at reading time; stay offline. No new network libraries, remote fonts, online images, telemetry or paid APIs.
- Degrade gracefully if a WebView lacks a required API. A safe fallback may keep one huge paragraph scrollable **only in that explicitly unsupported case**, with an honest test; do not claim the defect fully fixed from a fallback.

## 3. Ownership and allowed changes — avoid parallel collisions

**You exclusively own for this assignment:** `app/src/main/assets/reader-experience.js`, `app/src/main/assets/reader-experience.css`, `tools/measured-reader-pages.test.cjs`, new narrow test files such as `tools/reader-line-pagination.test.cjs` or `tools/reader-line-pagination-browser.cjs`, and a minimal one-line integration of your tests into `.github/workflows/android.yml` if necessary.

**Do not modify:** `physical-page-curl.js`, `physical-page-curl.css`, `lt-chapter-gallery.js/css`, `lt-device-acceptance.css`, `lt-wen-glass-engine.js/css`, `lingua-shell.js/css`, `app/src/main/assets/index.html` unless the owner explicitly approves a justified minimal test fixture insertion, story JSON/texts/translations or any historical art/manifest, app package ID, DB/storage/backups, Android signing secrets/keystores, production releases, unrelated worktrees or user account icons.

Never merge PR #68 or your own PR; request review from the owner. Another conversation sources literary texts and image rights; do not work on content. Our owner chat will **not** edit your owned JS/CSS/tests while your branch is active; communicate any need for shared-file changes first.

## 4. Acceptance and reproducible tests (MANDATORY)

Create real regression cases; do not settle for regex tests only:
1. A 12–30-line continuous EN paragraph spans 2+ paper sheets; exact concatenated DOM text and `textContent` including Unicode matches source. No clipping/overflow outside a sheet.
2. The same for Arabic including diacritics/combining marks and RTL direction. Verify grapheme-safe splitting and independent visible/hidden words.
3. A first sheet containing actual chapter heading + sentence fits without title clipping. A very long chapter remains fully navigable to its real last sentence.
4. A bilingual paragraph with long translation and a historic inline illustration breaks safely; art remains uncropped and with real caption.
5. A dictionary token near a split boundary opens **exactly one** word sheet and can be saved/reviewed.
6. A saved late-paragraph anchor resumes correctly after font, paper preset, app restart, 90° rotation, Android split-screen width change; old pre-fragment bookmarks still open.
7. RTL/LTR finger curl, keyboard arrows/PageDown/PageUp, next/previous including chapter boundaries, cancellation and double taps remain correct.
8. 360×760 and 460×860 phones; 760×390 short landscape; 700×1000 tablet portrait; 1280×840 landscape; browser screenshots before/after and at first/last page.
9. Measurable overflow guard: for each active sheet assert prose boxes remain within actual sheet padded content box (except explicitly allowed scrollable fallback). Avoid relying on screenshots alone.
10. Performance: verify bounded DOM allocation and no unbounded memory growth when turning tens of pages; no duplicated event listeners or animation frame work.

Run at least: `node tools/measured-reader-pages.test.cjs`, `node tools/reader-page-scroll.test.cjs`, `node tools/semantic-bookmarks.test.cjs`, `node tools/physical-page-curl.test.cjs`, `node tools/reader-experience.test.cjs`, your new tests, plus the exact-HEAD Android and browser workflow. Keep **Wen Glass QA enabled** and analyze any failure; do not skip or weaken tests to obtain green status.

## 5. Delivery and definition of done

Produce actual source commits on your isolated branch; a focused PR into the owner branch; a short list of touched files; measured before→after screenshots; test commands and exact SHA/Actions URLs; defects #16/#17/#18 individually categorized as **CODE FIXED / PARTIAL / OPEN** with evidence; and any regressions/blockers. Include a small `docs/qa/CODEX_PAGINATION_HANDOFF_2026-11-10.md` focused only on YOUR assignment; don't overwrite the canonical handoff or master progress file owned by the chat.

No new APK, signing key, production tag, branch merge or release. **A plan-only answer is not completion.** If you cannot implement safely after inspecting code, make a precise minimal failing test and document the real blocker rather than claiming success.
