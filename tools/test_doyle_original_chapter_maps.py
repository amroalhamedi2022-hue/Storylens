#!/usr/bin/env python3
"""58? No: exactly 57 real, pinned original Doyle chapter sources and maps."""
from pathlib import Path
import json
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from map_doyle_four_original_chapters import generate, CONFIG, roman, git_blob_sha

class OriginalDoyleChapterIndexTests(unittest.TestCase):
    def test_all_four_works_cover_exact_original_57_chapters(self):
        self.assertEqual(sum(c[1] for c in CONFIG.values()), 57)
        for slug, (expected_id, total) in CONFIG.items():
            with self.subTest(slug=slug):
                doc = generate(slug)
                self.assertEqual(doc["bookId"], slug)
                self.assertEqual(doc["chapterCount"], total)
                self.assertEqual(len(doc["chapters"]), total)
                self.assertEqual([x["chapterOneBased"] for x in doc["chapters"]], list(range(1, total + 1)))
                self.assertEqual(len({x["sourceFile"] for x in doc["chapters"]}), total)
                self.assertEqual(len({x["sourceGitBlobSha"] for x in doc["chapters"]}), total)
                self.assertEqual(doc["missingCandidateChapters"], total)
                self.assertEqual(doc["localCandidateChapters"], 0)
                self.assertEqual(doc["readyForUICards"], 0)
                self.assertFalse(doc["releaseApproved"])
                self.assertTrue(all(x["primaryImage"] is None and not x["titleAr"] for x in doc["chapters"]))

    def test_original_edition_titles_match_staged_source_html_and_saved_maps(self):
        for slug in CONFIG:
            with self.subTest(slug=slug):
                actual = generate(slug)
                saved = json.loads((ROOT / "docs/literature/staging" / slug / "chapter-image-map.json").read_text("utf-8"))
                self.assertEqual(actual, saved)
                self.assertTrue(all(x["sourceOriginalTitle"] for x in actual["chapters"]))
                self.assertTrue(all(x["sourceOriginalTitle"] in x["titleEn"] for x in actual["chapters"]))

    def test_two_study_in_scarlet_parts_remain_distinct(self):
        chapters = generate("a-study-in-scarlet")["chapters"]
        self.assertEqual([x["bookPartOneBased"] for x in chapters], [1]*7 + [2]*7)
        self.assertEqual([x["chapterWithinBookPart"] for x in chapters], list(range(1,8))*2)
        self.assertTrue(chapters[0]["titleEn"].startswith("Part I"))
        self.assertTrue(chapters[7]["titleEn"].startswith("Part II"))
        self.assertEqual(roman(16), "XVI")
        self.assertNotEqual(git_blob_sha(b"source1"), git_blob_sha(b"source2"))

    def test_mapped_source_chapters_do_not_grant_distribution_rights(self):
        for slug in CONFIG:
            d = generate(slug)
            self.assertEqual(d["countSemantics"], "AUTHENTIC_UNABRIDGED_ORIGINAL_ENGLISH_CHAPTERS")
            for row in d["chapters"]:
                self.assertIn("NO_SCENE_MAPPED", row["imageStatus"])
                self.assertTrue((ROOT / row["sourceFile"]).is_file())


if __name__ == "__main__":
    unittest.main()
