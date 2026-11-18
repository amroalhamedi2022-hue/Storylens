# Lingua Tales — Visual QA Engine, phase 1 (2026-11-14)

**Scope:** Only `amroalhamedi2022-hue/Storylens` (Lingua Tales). **Explicitly excluded:** Wen Sarafet and Hawala Shop unless the owner separately requests them. No changes to application assets, paper-curl engine, literature, finance logic or signing. No APK release.

## What has actually been implemented

- `tools/visual_qa.py` compares screenshots to **owner-approved and SHA-256 pinned** references. It produces pixel-level changed fraction, normalized mean absolute error, changed-pixel bounds, overlay, red-marked diff and side-by-side evidence, and fails for dimensions, tampering and missing approved captures.
- `tools/test_visual_qa.py` uses synthetic fixtures to prove identical=PASS, significant change=FAIL, missing owner reference=PENDING, invalid dimension/hash=FAIL, protected masks cannot hide all pixels. These are comparator unit tests, *not* app screenshot acceptance.
- `.github/workflows/lingua-visual-qa.yml` reuses the existing real application HTML/JS browser fixtures. It checks a chapter journey, Verne reader, and held LTR/RTL page curl; screenshots are taken with actual headless Chromium at 360×760, 460×860, 760×390, 1280×840 as applicable, then uploaded as Action artifacts. These are **browser-rendered screenshots**, not Android emulator or physical device screenshots.
- The reference registry `docs/qa/visual-references/approved.json` starts empty **intentionally**. No user image has been declared approved in this QA work. All screenshots are `PENDING_REFERENCE` until a reference is individually approved, committed at the matching screen size, and pinned by SHA-256.

## Reference approval and visual repair protocol

1. Obtain the owner's actual reference for a *specific screen state, viewport, theme, language and orientation*. Do not generate a replacement "reference" from the current app and falsely call it approved.
2. Normalize device pixel ratio, safe-area/insets, fonts, WebView/Chromium version, animations and scroll state. When necessary, use Android emulator screenshots separately; do not claim browser/Android pixel parity.
3. Commit the approved reference PNG at `docs/qa/visual-references/<same-relative-name-as-capture>.png` and add its **exact** SHA-256 plus optional `pixel_tolerance`, `max_changed_fraction`, `max_mean_error` and tightly bounded `ignore_rectangles` in `approved.json`.
4. When a matching reference exists, CI generates 3 proof images: `.side-by-side.png`, `.overlay.png` and `.diff.png`. A mismatch causes CI failure. PENDING_REFERENCE never counts as visual PASS.
5. Developer/Codex repairs only the UI files responsible for failing visual differences, then reruns the same capture and comparison. This pipeline **reports and blocks**; it does **not** automatically edit code or merge changes on its own. Review dynamic glass/page curl separately by short motion sequences on real Android/Pad 5, not only one static screenshot.
6. Promote a release only after the visual review, existing functional/readability tests, offline data integrity, Android hardware QA, rights approvals and matching signing certificate are independently satisfied.

## Run locally

```
python -m pip install Pillow==11.3.0
PYTHONPATH=tools python -m unittest discover -s tools -p 'test_visual_qa.py' -v
python tools/visual_qa.py --actual-dir qa-screenshots/visual-qa --references docs/qa/visual-references --out qa-reports/visual-qa
```

**Current known gaps:** references not yet approved; hosted CI not verified on exact new commit; no Android emulator screenshot capture, motion/video perceptual comparison or autonomous correction loop. The existing app already has other Chromium UI tests; this layer is additive and must not weaken them. Document no false visual success.
