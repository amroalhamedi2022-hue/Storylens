#!/usr/bin/env python3
"""Offline regression: Gemini looks at 1903 plates, never invents 1890 prose."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from export_sign_four_original_source_for_art import collect, git_blob_hash, ORIGINAL, ART
from gemini_suggest_sign_four_plate_scenes import pending_scene_count, check, engine


class AuthenticTownsendGeminiResearch(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original = collect()
        cls.archived = json.loads((ART / "manifest.json").read_text("utf-8"))

    def test_exact_all_twelve_original_1890_chapters(self):
        c = self.original
        self.assertEqual(c["chapterCount"], 12)
        self.assertEqual([x["chapterOneBased"] for x in c["chapters"]], list(range(1, 13)))
        self.assertGreater(sum(len(x["paragraphs"]) for x in c["chapters"]), 150)
        self.assertFalse(c["humanSceneApproved"])
        self.assertFalse(c["rightsApproved"])
        self.assertIn("standardebooks.org", c["sourceEdition"])
        self.assertNotEqual(c["sourceEdition"], c["illustrationSourceEdition"])
        for row in c["chapters"]:
            n = row["chapterOneBased"]
            raw = (ORIGINAL / f"chapter-{n}.xhtml").read_bytes()
            self.assertEqual(git_blob_hash(raw), row["sourceGitBlobSha"])
            self.assertTrue(all(len(x) >= 15 for x in row["paragraphs"]))
        self.assertTrue(all(not i["editoriallyApproved"] and not i["publishedToApp"]
                            for i in self.archived["images"]))

    def test_actual_1903_art_in_shared_engine_and_api_fails_closed(self):
        check()
        self.assertEqual(engine.WORK_ID, "the-sign-of-the-four")
        self.assertEqual(engine.GALLERY, ART)
        self.assertTrue(engine.ORIGINAL_ARTIST.startswith("Frederick Henry Townsend"))
        self.assertEqual(len(self.archived["images"]), 8)
        self.assertEqual(len({f["webpSha256"] for f in self.archived["images"]}), 8)
        for fig in self.archived["images"]:
            raw = (ART / fig["localPath"]).read_bytes()
            self.assertEqual(hashlib.sha256(raw).hexdigest(), fig["webpSha256"])
        self.assertTrue(0 <= pending_scene_count() <= 8)

    def test_literal_original_excerpt_or_reject_fake_image_match(self):
        original = self.original["chapters"][4]
        quote = "By the table, in a wooden armchair, the master of the house was seated all in a heap"
        at = next(i for i, p in enumerate(original["paragraphs"]) if quote in engine.normalized(p))
        source_row = {"chapterOneBased": 5, "paragraphIndexZeroBased": at,
                      "englishSource": engine.normalized(original["paragraphs"][at])[:900]}
        suggestion = {"imageSceneMatchesSource": True, "chapterOneBased": 5,
                      "paragraphIndexZeroBased": at, "exactSourceQuotation": quote,
                      "confidence": 0.99}
        evidence = engine.supported_exact_source_selection(suggestion, [source_row])
        self.assertIsNotNone(evidence)
        self.assertEqual(evidence["chapterOneBased"], 5)
        self.assertNotIn("approved", json.dumps(evidence).lower())
        for bad in (
            dict(suggestion, exactSourceQuotation="This never appeared in the authentic Doyle book."),
            dict(suggestion, chapterOneBased=10),
            dict(suggestion, confidence=1.1),
            dict(suggestion, imageSceneMatchesSource=False),
        ):
            with self.subTest(bad=bad):
                self.assertIsNone(engine.supported_exact_source_selection(bad, [source_row]))

    def test_workflow_scopes_secrets_and_prevents_concurrent_model_spending(self):
        s = (ROOT / ".github/workflows/sign-four-gemini-original-scene-review.yml").read_text("utf-8")
        self.assertIn("group: lingua-townsend-1903-source-backed-gemini-original-visuals", s)
        self.assertIn("cancel-in-progress: false", s)
        self.assertIn("if: github.event_name != 'pull_request'", s)
        self.assertIn("GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}", s)
        self.assertIn("python tools/gemini_suggest_sign_four_plate_scenes.py --max-new 4", s)
        self.assertNotIn("git add app", s)
        self.assertNotIn("APPROVED_FOR_TARGET_TERRITORIES", s)
        self.assertIn("python tools/test_original_quote_rejection_nonblocking.py", s)


if __name__ == "__main__":
    unittest.main()
