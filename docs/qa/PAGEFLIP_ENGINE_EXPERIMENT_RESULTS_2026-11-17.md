# Lingua Tales — third-party HTML paper-curl evaluation, 17 Nov 2026

## Scope and custody
Dedicated branch `experiments/pageflip-engine-evaluation-20261117`; **no modifications to `main`** from this experiment. The published `page-flip@2.0.7` and `@openpageflip/core@0.7.0` bundles were actually installed and executed by GitHub Actions in offline Chromium against eight original bilingual paragraphs from `app/src/main/assets/classic-verne-towle-ch01.js`. No production app signing/data/permission files touched.

Exact result source: [GitHub Actions run 44038340214](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/44038340214). Source was instrumented for real pointer clicks, actual text-selection drags, 420ms stationary holds, forward/backwards API, RAF activity 650ms after destroy, and screenshot snapshots.

## Observed cases — latest source `0610632176d8ff3b31d83800bb48a72969a600d0`

| Package / configuration | Real pointer text selection | Dictionary click | Page hold and navigation | RAF after destroy | Overall |
|---|---|---|---|---|---|
| StPageFlip LTR phone | pass | pass | backward API not verified in scenario | 39 pending RAF requests | **not accepted** |
| StPageFlip LTR spread | fail | pass | backward API not verified in scenario | 39 pending RAF requests | **not accepted** |
| OpenPageFlip LTR phone/spread (edge) | pass/pass | pass/pass | pass/pass | 0/0 | **pass** |
| OpenPageFlip RTL phone/spread (edge) | pass/pass | pass/pass | pass/pass | 0/0 | **pass** |
| OpenPageFlip LTR phone (blank-area free grab) | pass | pass | pass | 0 | **pass** |
| OpenPageFlip RTL phone/spread (blank-area free grab) | pass/pass | pass/pass | pass/pass | 0/0 | **pass** |

The first 6-case OpenPageFlip smoke was green, but a subsequent genuine selection-drag test discovered that printed text selection was blocked in **three of four** edge tests and **all three** `click:anywhere` tests. Those failures were reproduced in [run 44037920243](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/44037920243). They were fixed in the isolated proof-of-concept by reserving `.source-text,h2` in the library's `ignoreDragOn` selector and moving free-grab into a blank paper area. No claim is made that free-grabbing *on printed text* and selecting text can happen simultaneously with the same gesture.

## Visual audit (actual offline Chromium, not generated images)
- StPageFlip: corner fold visible but reported RAF activity continues after destroy; no native RTL binding, unsuitable for full app.
- OpenPageFlip edge-gesture: visibly smoother and no clipping apparent in tested static frames, including RTL facing spreads. This does **not** prove 120Hz or absence of every frame glitch.
- OpenPageFlip blank-paper free-grab: more dramatic diagonal folds which can temporarily overlap text; accepted by mechanical smoke test but **not signed off** as perfect visual fidelity.
- No complete integration into Lingua Tales, no Android device WebView install tested, no APK published from this experiment.

## Decision and next gate
**OpenPageFlip is preferred as a candidate, not approved for main.** Before integration, implement feature-flagged adapter in an isolated branch, preserve original chapter pagination and semantic bookmarks, compare Android real 120Hz tablet and phone recordings to user's faulty video, and prove text selection/word popup, long-press dictionary, RTL spread boundaries and slow-swipe cancellation. Any issue reverts via flag, not by replacing the user-facing renderer.

**Recovery note:** Main's PR #97 rollback is commit `9e1adacb451b6852e8ff4990d0d91e96ece2710d`. Its full Android workflow [44035447213](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/44035447213) initially failed at Wen Glass browser acceptance; second attempt was triggered. Do not claim a signed higher-version restoration APK without verifying the exact artifact/signature.
