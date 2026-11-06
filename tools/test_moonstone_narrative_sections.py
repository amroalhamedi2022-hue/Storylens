#!/usr/bin/env python3
"""Moonstone: strict full original source ordering, 53 units and no fake artwork."""
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from map_moonstone_narrative_sections import generate, git_blob_sha, exact_parts, title_for, roman

FOLDER = ROOT / "docs/literature/staging/the-moonstone"


class MoonstoneOriginalUnitTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.doc = generate()

    def test_53_original_sections_and_full_period_order(self):
        doc = self.doc
        self.assertEqual(doc["chapterCount"], 53)
        self.assertEqual([r["chapterOneBased"] for r in doc["chapters"]], list(range(1, 54)))
        self.assertEqual([r["periodId"] for r in doc["chapters"]].count("prologue"), 1)
        self.assertEqual([r["periodId"] for r in doc["chapters"]].count("first-period"), 23)
        self.assertEqual([r["periodId"] for r in doc["chapters"]].count("second-period"), 26)
        self.assertEqual([r["periodId"] for r in doc["chapters"]].count("epilogue"), 3)
        self.assertTrue(doc["chapters"][0]["titleEn"].startswith("Prologue"))
        self.assertTrue(doc["chapters"][-1]["titleEn"].startswith("Epilogue"))
        self.assertFalse(doc["releaseApproved"])

    def test_real_source_file_identity_and_no_chapter_image_substitution(self):
        doc = self.doc
        self.assertEqual(len({r["sourceFile"] for r in doc["chapters"]}), 53)
        self.assertEqual(len({r["sourceGitBlobSha"] for r in doc["chapters"]}), 53)
        for r in doc["chapters"]:
            self.assertTrue((ROOT / r["sourceFile"]).is_file())
            self.assertIsNone(r["primaryImage"])
            self.assertEqual(r["titleAr"], "")
        self.assertEqual(doc["readyForUICards"], 0)
        self.assertEqual(doc["localCandidateChapters"], 0)
        self.assertEqual(doc["missingCandidateChapters"], 53)
        self.assertIn("NOT_53_ORDINARY_CHAPTERS", doc["countSemantics"])

    def test_exact_manifest_and_saved_map(self):
        manifest = json.loads((FOLDER / "manifest.json").read_text("utf-8"))
        self.assertEqual([r["file"] for r in manifest["sourceParts"]], exact_parts())
        self.assertEqual(json.loads((FOLDER / "chapter-image-map.json").read_text("utf-8")), self.doc)

    def test_reject_tampered_blob_or_invented_title(self):
        self.assertNotEqual(git_blob_sha(b"source one"), git_blob_sha(b"source two"))
        self.assertEqual(roman(23), "XXIII")
        with self.assertRaises(ValueError):
            title_for("chapter-1-2.xhtml", "I")
        with self.assertRaises(ValueError):
            title_for("chapter-2-3-2.xhtml", "IV")
        with self.assertRaises(ValueError):
            title_for("epilogue-2.xhtml", "II")
        with self.assertRaises(ValueError):
            title_for("fake-chapter.xhtml", "X")


if __name__ == "__main__":
    unittest.main()
