# Line-aware physical-page pagination handoff — 2026-11-11

## Delivery

- Branch: `codex/lingua-real-paper-pagination-20261110`
- Target: `fix/reader-integrity-49-audit-20261110`
- Source implementation commit: `371eb02`
- Scope: reader pagination defects #16, #17, and #18. The physical curl, gallery, themes, literary content, storage schema, signing, and application identity were not changed.

The reader now measures the actual laid-out HTML in the browser and continues oversized paragraphs across fixed-height physical sheets. It chooses word boundaries with `Intl.Segmenter`, validates each candidate with DOM `Range` geometry, and falls back to grapheme-safe boundaries. Existing token, sentence, inline-language, dictionary, vocabulary, bookmark, translation, and image nodes are retained by cloning the exact DOM range for each fragment. A fragment records its source paragraph and character offset so rotation, font reflow, reopen, bookmarks, and dictionary taps resolve to the original position.

Historical figures remain atomic. A figure moves to the next sheet or a contained dedicated sheet rather than being cropped or duplicated. The chapter heading remains on the first real paper page. Portrait builds one sheet per view; landscape measures each half of the two-page spread, including compact landscape.

## Issue status

| Issue | Source status | Automated rendering evidence | Hardware acceptance |
|---|---|---|---|
| #16 nearly empty pages | CODE FIXED on this branch | Long paragraphs fill consecutive sheets at all required viewports | Pending physical Android device |
| #17 paragraph-only pagination | CODE FIXED on this branch | Exact English and vocalized-Arabic text survives line-aware splitting with no repeat or omission | Pending physical Android device |
| #18 paragraph overflow | CODE FIXED on this branch | Zero padded-ink overflow across 10 language/viewport combinations | Pending physical Android device |

## Verification

- Node: all 114 `tools/*.test.cjs` files passed.
- Chromium: `tools/reader-line-pagination-browser.cjs` passed 360×760, 460×860, 700×1000, 760×390, and 1280×840 in English and Arabic. It also passed dictionary interaction at a fragment boundary, saved-word creation, font/rotation/reopen anchor restoration, bilingual translation continuation, single contained historical image, grapheme integrity, and bounded DOM size.
- Curl compatibility: `tools/physical-page-curl-browser.cjs` passed LTR and RTL portrait/spread, real touch, rapid controls, original illustration, and catch/cancel scenarios.
- Android: `:app:testDebugUnitTest :app:assembleDebug` passed with Gradle 9.3.1, JDK 17, and Android SDK 36. No release APK or key was generated.
- Workflow Python validation: the exact Python checks registered by `.github/workflows/android.yml` passed.
- [GitHub Actions #43027888129](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/43027888129) **SUCCESS** on code/test SHA `a487e47cb8dc45747e227ae772541b2f1247d2f2`; the workflow included Android build/identity, browser journeys, measured pagination, physical curl, and screenshot artifacts.
- Screenshots and raw measurements: [`pagination-evidence`](pagination-evidence). Before evidence shows the old 8,635-character paragraph in one approximately 10,165 px-tall sheet; after evidence shows fixed-height first and continuation sheets.

Headless Chromium pagination times for the adversarial paragraph were 229–2,145 ms depending on language and viewport. The worst case was compact landscape, which produced 64 short sheets. These are rebuild timings, not animation-frame work; pagination is not run during curl animation frames.

## Remaining acceptance

Physical Android phone and Xiaomi Pad 5 portrait/landscape acceptance, TalkBack, actual 120Hz frame pacing, Android system-inset behavior, and a data-preserving owner-signed update remain pending. No 120 FPS claim is made. Older WebViews without `Range` or `TreeWalker` retain the explicit scrolling fallback rather than using the new measured split path.
