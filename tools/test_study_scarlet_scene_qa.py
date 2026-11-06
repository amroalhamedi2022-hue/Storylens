#!/usr/bin/env python3
"""No-network regression for 4 real 1887 Friston images vs 14 full Doyle chapters."""
from pathlib import Path
import hashlib
import json
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from export_study_scarlet_original_for_art import extract, git_blob_sha
import gemini_suggest_study_scarlet_friston_scenes as review


class OriginalFristonSceneSourceTests(unittest.TestCase):
    def test_source_prose_14_complete_distinct_chapters(self):
        original = extract()
        self.assertEqual(len(original["chapters"]), 14)
        self.assertEqual([x["chapterOneBased"] for x in original["chapters"]], list(range(1, 15)))
        self.assertEqual([x["partOneBased"] for x in original["chapters"]], [1]*7 + [2]*7)
        self.assertEqual([x["chapterWithinPart"] for x in original["chapters"]], list(range(1, 8))*2)
        self.assertGreater(sum(len(p) for c in original["chapters"] for p in c["paragraphs"]), 150000)
        self.assertFalse(original["rightsApproved"])
        self.assertNotEqual(git_blob_sha(b"original"), git_blob_sha(b"tampered"))

    def test_real_all_four_local_binary_engraving_sha_matches_source(self):
        manifest = json.loads((review.engine.GALLERY / "manifest.json").read_text("utf-8"))
        self.assertEqual(manifest["category"],
                         "Category:A Study in Scarlet illustrated by D. H. Friston")
        self.assertEqual(len(manifest["images"]), 4)
        hashes = set()
        for image in manifest["images"]:
            path = review.engine.GALLERY / image["localPath"]
            raw = path.read_bytes()
            self.assertEqual(hashlib.sha256(raw).hexdigest(), image["webpSha256"])
            self.assertTrue(raw[:4] == b"RIFF" and raw[8:12] == b"WEBP")
            self.assertNotIn(image["webpSha256"], hashes)
            hashes.add(image["webpSha256"])
            self.assertFalse(image["editoriallyApproved"])
            self.assertIn("PENDING_", image["rightsStatus"])
            self.assertTrue(image["commonsPage"].startswith("https://commons.wikimedia.org/"))

    def test_image_scene_qa_isolated_from_reader_approval(self):
        self.assertEqual(review.engine.WORK_ID, "a-study-in-scarlet")
        self.assertIn("friston-1887-scene-reviews", str(review.engine.OUTPUT))
        self.assertIn("friston-1887-period-plates", str(review.engine.GALLERY))
        self.assertIn("two passes", (ROOT / ".github/workflows/scarlet-1887-friston-scene-review.yml").read_text("utf-8"))
        parent = (ROOT / "tools/gemini_suggest_verne_plate_scenes.py").read_text("utf-8")
        self.assertIn('"sceneMatchHumanApproved": False', parent)
        self.assertIn('"rightsVerifiedForTerritories": False', parent)
        self.assertIn('"publicationApproved": False', parent)
        self.assertIn("visual_crosscheck(", parent)


if __name__ == "__main__":
    unittest.main()
