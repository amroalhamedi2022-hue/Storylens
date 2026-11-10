# Lingua Tales — AI companion art pilot (10 November 2026)

**This is an executable scene-to-prompt pipeline, NOT four finished pictures.** The historical originals, literature, chapter maps, cover images, reader, page curl, Android keys and data are untouched.

## What actually exists
- `verne-pilot-scenes.json`: 4 human-curated candidate scenes tied to chapter I paragraph 0/19 and chapter II paragraph 7/8 in the real Towle bilingual text currently in Android assets.
- `tools/story_art_pilot.cjs`: executes the **actual chapter JS** in a restricted Node VM, checks every scene's English excerpt against its specific original paragraph, preserves the existing bilingual source, computes exact SHA256 paragraph fingerprints and emits detailed generation prompts, character continuity, modern-AI provenance, and bilingual alt.
- `tools/test_story_art_pilot.cjs`: negative tests for false/chapter-wrong anchors, duplicate scenes, unknown characters and premature release.
- Isolated GitHub Actions job runs both scripts without image-generation charges or API keys.

## Run
```bash
node tools/story_art_pilot.cjs --check
node tools/story_art_pilot.cjs --export /tmp/lingua-scene-queue.json
node tools/test_story_art_pilot.cjs
```

## Deliberately **not** done
The queue does not make images and is not approved for app distribution. **No generated image is a genuine historical plate.** A failed image/story match must be rejected, never silently inserted. Generated image binaries need a separate generated-art manifest with output hash, recorded source quote/paragraph, style/character references, production licensing, human editorial and distribution review, then a fail-closed Android offline packager, before reader integration. Keep original historical chapter-primary thumbnail contract distinct. Never depict the Chapter III Reform Club wager in Chapters I or II.

## Practical generation
Use the exported queue prompts as the exact input for controlled image jobs, together with actual reference-image files under a separately licensed Visual Bible. Review each result against the original paragraph BEFORE promotion. No automated billing, external image fetch or real-time online app behavior is introduced by this pilot.

## Strict local image promotion (implemented, no pictures approved)
The image intake path is `docs/art-generation/approved/<bookId>/<sceneId>.webp`. The signed-APK package path, after separate approval, will be `app/src/main/assets/art/generated/<bookId>/<sceneId>.webp`. The original `art/verne-*.webp` historical engravings and historical thumbnail registry remain untouched.

```bash
python3 tools/package_generated_story_art.py --check
python3 tools/test_generated_art_packaging.py
```

Release manifest `docs/art-generation/approved/generated-art-release.json` is **empty and fail-closed**. A source-verified output is still not approved until editorial, owner, image usage rights and territorial review all pass; a scene ID + matching exact English paragraph SHA + original WebP bytes SHA are mandatory. A revoked packaged image cannot silently linger in the APK. The standalone registry `lt-generated-art-registry.js` is also empty; **no live reader integration or Android release** in this branch.
