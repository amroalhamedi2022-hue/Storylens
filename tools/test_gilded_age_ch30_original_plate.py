#!/usr/bin/env python3
"""Verify a real original Chapter XXX rail-scene plate; never approve release."""
from __future__ import annotations
import hashlib
import html
import json
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/literature/staging/illustrated-five-20261105/the-gilded-age"


class GildedAgeOriginalChapterThirtyArtwork(unittest.TestCase):
    def setUp(self):
        self.manifest = json.loads((SOURCE / "manifest.json").read_text("utf-8"))
        self.mapping = json.loads((SOURCE / "chapter-image-map.json").read_text("utf-8"))
        self.art = next(a for a in self.manifest["art"] if a["imageOrdinalInExactSourceDOM"] == 109)
        self.photo = self.mapping["chapters"][29]["primaryImage"]

    def test_locally_stored_original_image_and_unique_chapter(self):
        self.assertEqual(len(self.mapping["chapters"]), 63)
        self.assertEqual([x["chapterOneBased"] for x in self.mapping["chapters"]], list(range(1, 64)))
        self.assertFalse(self.mapping["releaseApproved"])
        self.assertEqual(self.mapping["chapters"][29]["titleEn"], "CHAPTER XXX.")
        self.assertEqual(self.art["nearestPriorHeading"], "CHAPTER XXX.")
        self.assertEqual(self.art["originalRelativeImageSource"], "images/p277.jpg")
        self.assertEqual(self.photo["sourceUrl"], self.art["originalSourceUrl"])
        self.assertEqual(self.photo["sha256"], self.art["webpSha256"])
        self.assertEqual(self.photo["originalSourceSha256"], self.art["sourceSha256"])
        self.assertEqual(self.photo["sourceOriginalImageOrdinal"], 109)
        path = ROOT / self.photo["imagePath"]
        self.assertEqual(path.resolve(), (SOURCE / self.art["localPath"]).resolve())
        raw = path.read_bytes()
        self.assertEqual(len(raw), self.art["webpBytes"])
        self.assertTrue(raw.startswith(b"RIFF") and raw[8:12] == b"WEBP")
        self.assertEqual(hashlib.sha256(raw).hexdigest(), self.photo["sha256"])
        mapped = [x["primaryImage"] for x in self.mapping["chapters"] if x["primaryImage"]]
        self.assertEqual(len(mapped), 62)
        self.assertEqual(len({x["imagePath"] for x in mapped}), 62)
        self.assertEqual(len({x["sha256"] for x in mapped}), 62)
        self.assertEqual([x["chapterOneBased"] for x in self.mapping["chapters"] if not x["primaryImage"]], [55])

    def test_original_exact_chapter_position_and_prose(self):
        source = (SOURCE / "original-full-edition.html").read_bytes()
        self.assertEqual(len(source), self.manifest["source"]["bytes"])
        self.assertEqual(hashlib.sha256(source).hexdigest(), self.manifest["source"]["sha256"])
        raw = source.decode("utf-8")
        # Exactly one real original illustration, not an image duplicated from a neighboring chapter.
        self.assertEqual(raw.count("images/p277.jpg"), 1)
        image_at = raw.index("images/p277.jpg")
        chapter_at = raw.rfind("CHAPTER XXX.", 0, image_at)
        next_chapter_at = raw.find("CHAPTER XXXI.", chapter_at + 1)
        self.assertTrue(0 <= chapter_at < image_at < next_chapter_at)
        chapter_text = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", raw[chapter_at:next_chapter_at])).split())
        self.assertIn("railroad from Hawkeye to Washington via New York", chapter_text)
        self.assertIn(self.photo["sourcePassage"], chapter_text)
        self.assertEqual(self.photo["sceneAnchor"], self.photo["sourcePassage"])

    def test_pending_rights_and_truthful_alt_text(self):
        self.assertEqual(self.photo["rightsStatus"], "PENDING_PER_SCAN_AND_TERRITORY_REVIEW")
        self.assertIs(self.photo["editoriallyApproved"], False)
        self.assertEqual(self.photo["publicationStatus"], "STAGING_ONLY_NOT_PUBLISHED")
        self.assertTrue(self.photo["nonAIArt"])
        self.assertTrue(self.photo["originalSourceImageEmbeddedWithinChapter"])
        self.assertTrue(self.photo["altAr"] and self.photo["altEn"])
        self.assertIn("attribution unverified", self.photo["creator"])
        self.assertNotIn("PASS", self.photo["rightsStatus"])

if __name__ == "__main__":
    unittest.main()
