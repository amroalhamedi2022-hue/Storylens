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

## Third working component — opt-in API image producer (NO API calls by CI)
The source-checked four-prompt queue now has an actual OpenAI Images API adapter, `tools/generate_story_art_openai.cjs`. Verified against current OpenAI API documentation on 10 Nov 2026. Supports `gpt-image-2.6-flare` for trial runs or `gpt-image-2.6-sunburst` for detailed scenes, one image/request. Without references it uses `/v1/images/generations`. With a **locally saved, SHA-verified, rights-approved reference manifest** in `docs/art-generation/visual-bibles/`, it uses `/v1/images/edits` with 1–4 data-URL images and a continuous character/style bible.

```bash
node tools/generate_story_art_openai.cjs --scene verne-ch01-new-servant
# Paid, explicit ONE scene only; use a secured environment variable, NEVER commit the key.
OPENAI_API_KEY=... node tools/generate_story_art_openai.cjs --scene verne-ch01-new-servant --execute --confirm-paid
node tools/test_story_art_openai.cjs
```

**Hard controls:** dry run is the default and needs no key; BOTH paid flags required; only one image at a time; no overwrite of review output; never approves or packages its own output. Real API results and SHA256 + source hashes land only in `docs/art-generation/review/<bookId>/`, **not Android**. Do not use paid API without an account budget/owner consent. No key is stored or sent by Actions. If historical references are included, each must have exact local bytes, SHA256, source credit and explicit permission for AI-reference use; absence of proof blocks reference submission. This is executable code, but no paid API call has been run in this chat.

## Reader integration (Stage 4)
`lt-generated-art-registry.js` now loads before `reader-experience.js` but starts EMPTY. The existing reader consumes only explicit approved AI entries, after validating chapter, exact source quote, original paragraph SHA supplied by the offline packager, modern AI origin, local asset path and **all** owner/editorial/territorial/release gates. Generated art is marked `lt-ai-generated-companion` and is never labeled an antique engraving. Real period engravings take precedence on any duplicate paragraph; all insertion is before existing measured pagination, with bilingual paragraph pairing retained. No font/page-curl/DB/text/signing edits. Run `node tools/generated-art-reader.test.cjs`; no generated images automatically appear.

## Cross-tool export — ChatGPT Images, Canva, Midjourney
Run `node tools/export_story_art_briefs.cjs --output-dir /tmp/lingua-prompt-exports`. It reads the **actual approved source-paragraph verifier** (no chatbot summary) and exports **four individual scene prompts** to `chatgpt-image-prompt.txt`, `canva-image-prompt.txt` and `midjourney-manual.txt` plus JSON source SHA/alt and honest review instructions. Midjourney is strictly MANUAL (do not imply the tool has an automated API). All prompts state images are modern AI art, no fake original attribution, no scenes invented or images generated. GitHub CI uploads the complete five-file no-cost prompt package as an Actions artifact, no credential stored.
