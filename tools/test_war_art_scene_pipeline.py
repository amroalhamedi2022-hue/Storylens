#!/usr/bin/env python3
"""Offline regression: exact original source, strict AI quarantine, isolated jobs."""
from pathlib import Path
import json
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from export_war_source_for_art import extract, git_blob_sha

class WarScenePipelineTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.book = extract()

    def test_pinned_unabridged_27_chapters(self):
        chapters = self.book["chapters"]
        self.assertEqual(len(chapters), 27)
        self.assertEqual([c["chapterOneBased"] for c in chapters], list(range(1, 28)))
        self.assertEqual([c["bookOneBased"] for c in chapters], [1]*17 + [2]*10)
        self.assertTrue(all(c["paragraphs"] and c["sourceGitBlobSha"] for c in chapters))
        self.assertFalse(self.book["rightsApproved"])

    def test_tampered_source_is_detectable(self):
        self.assertNotEqual(git_blob_sha(b"corrupt"), git_blob_sha(b"corrupt!"))
        self.assertGreater(sum(len(p) for c in self.book["chapters"] for p in c["paragraphs"]), 200000)

    def test_archived_real_images_remain_unassigned(self):
        manifest = json.loads((ROOT / "docs/literature/staging/war-of-worlds-correa-period-plates/manifest.json").read_text())
        self.assertFalse(manifest["publicationApproved"])
        self.assertFalse(manifest["chapterSceneMatchingComplete"])
        self.assertGreater(len(manifest["images"]), 0)
        self.assertEqual(len({x["webpSha256"] for x in manifest["images"]}), len(manifest["images"]))
        self.assertTrue(all(x["sceneChapterMatchStatus"] == "UNREVIEWED__NO_CHAPTER_CARD" for x in manifest["images"]))

    def test_gemini_provenance_is_quarantined(self):
        from gemini_suggest_war_plate_scenes import engine
        self.assertEqual(engine.WORK_ID, self.book["workId"])
        self.assertIn("war-of-worlds-correa-scene-reviews", str(engine.OUTPUT))
        self.assertIn("war-of-worlds-correa-period-plates", str(engine.GALLERY))
        code = (ROOT / "tools/gemini_suggest_verne_plate_scenes.py").read_text()
        self.assertIn('"publicationApproved": False', code)
        self.assertIn('"sceneMatchHumanApproved": False', code)
        self.assertIn('"rightsVerifiedForTerritories": False', code)
        self.assertIn("visual_crosscheck(", code)

    def test_workflow_is_separate_and_scheduled(self):
        workflow = (ROOT / ".github/workflows/war-correa-gemini-scene-match.yml").read_text()
        self.assertIn("cron: '37 1,5,9,13,17,21 * * *'", workflow)
        self.assertIn("cancel-in-progress: false", workflow)
        self.assertIn("GEMINI_API_KEY", workflow)
        self.assertIn("--self-test", workflow)
        self.assertNotIn("chapter-image-map.json", workflow)
        self.assertNotIn("APPROVED_FOR_TARGET_TERRITORIES", workflow)

if __name__ == "__main__":
    unittest.main()
