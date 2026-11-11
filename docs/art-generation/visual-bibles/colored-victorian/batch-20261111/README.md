# Lingua Tales — Colored Scene Production, 11 November 2026

This second batch contains **two actual 1536×1024 color WebP moodboards**, distinct from the three older boards. The pictures are modern AI-generated and **NOT valid scenes for Chapters I–II**. The ship/harbor study and travel-map study contain speculative activity, landmarks and inaccurate character appearance. Their only intended use is lighting, palettes, gilded framing and texture.

No historical source was altered, and no art was copied into Android assets. No original page-curl, story text, progress data or signing setup was touched. The `manifest.json` is intentionally fail-closed (all approval flags false). `review.html` is a fully offline gallery using the real local WebP files and no API calls.

## New executable generation preparation

```bash
node tools/prepare_color_scene_queue.cjs --check
node tools/prepare_color_scene_queue.cjs --export /tmp/lingua-color-queue.json
node tools/test_color_scene_queue.cjs
node tools/generate_story_art_openai.cjs --color-scenes --scene verne-ch03-color-wager
```

The new queue verifies SIX original **English+Arabic** chapter/paragraph anchors from I–IV, SHA-256 source fingerprints and single-image prompts that explicitly forbid collages, off-chapter scenes, fabricated travel and inaccurate Fogg appearance. The existing generator supports opt-in `--color-scenes` to target these exact source-grounded prompts. Its default is a **DRY RUN**. Paid API calls still require `--execute --confirm-paid` and a user-provided private API key, and all outputs go to unapproved review storage (never the app). No key, paid generation or owner approval was used in this batch.

**Important:** `tools/package_generated_story_art.py` still controls all release approval and is intentionally not activated for these new scene IDs. Even if a prompt produces an image, that image is NOT automatically published.
