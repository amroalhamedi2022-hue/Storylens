#!/usr/bin/env python3
"""Validate the bundled bilingual novel catalog (standard-library only)."""
import json
import re
from pathlib import Path

html = Path("app/src/main/assets/index.html").read_text(encoding="utf-8")
def read_json(tag):
    pattern = rf'<script id="{tag}" type="application/json">([\s\S]*?)</script>'
    match = re.search(pattern, html)
    assert match, f"missing {tag}"
    return json.loads(match.group(1))

library = read_json("libraryData")
art = read_json("artData")
genres = {genre["id"] for genre in library["genres"]}
stories = library["stories"]
assert len(genres) >= 6 and len(stories) >= 12
assert len({s["id"] for s in stories}) == len(stories)
assert not any("audio" in str(k).lower() for k in library.keys())
chapters = paragraphs = 0
for story in stories:
    assert story["genre"] in genres
    assert story["title"] and story["description"]
    if story.get("lazyBook") is True:
        # Long-book metadata is visible at startup while its large chapter payload
        # stays inert until the reader explicitly opens the book.
        assert story.get("totalChapters", 0) > 0
        assert story["chapters"] == []
        assert story.get("terms") == []
        assert story["id"] + "_0" in art
        assert story.get("provenance")
        continue
    assert story["chapters"]
    for chapter in story["chapters"]:
        chapters += 1
        assert chapter["title"] and chapter["titleAr"]
        for paragraph in chapter["paragraphs"]:
            paragraphs += 1
            assert len(paragraph["en"].strip()) >= 12
            assert len(paragraph["ar"].strip()) >= 8
    for term in story["terms"]:
        assert term["term"] and term["context"] and term["literal"]
for image in art.values():
    assert image.startswith("data:image/")
assert len(art) >= 30
print(f"PASS: {len(stories)} stories, {chapters} chapters, {paragraphs} bilingual paragraphs, {len(art)} illustrations.")
