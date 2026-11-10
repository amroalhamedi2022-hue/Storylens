#!/usr/bin/env python3
"""Nine REAL SHA256-pinned 1912 original images: exact FIVE Wikisource chapters."""
from pathlib import Path
import hashlib
import json
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from map_doyle_four_original_chapters import generate
from apply_lost_world_1912_wikisource_chapter_art import apply, EVIDENCE


class LostWorld1912OriginalTextAndImageProof(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.map = generate("the-lost-world")

    def test_nine_real_pictures_five_accurate_source_chapters_no_fake_release(self):
        doc = self.map
        self.assertEqual(doc["chapterCount"], 16)
        self.assertEqual(doc["localCandidateChapters"], 5)
        self.assertEqual(doc["missingCandidateChapters"], 11)
        self.assertEqual(doc["readyForUICards"], 0)
        self.assertFalse(doc["releaseApproved"])
        self.assertEqual(doc["original1912SourceVerifiedChapterCoPlacement"], 5)
        self.assertEqual(doc["additionalOriginal1912ChapterPicturesHeldForReview"], 4)
        main = [r for r in doc["chapters"] if r["primaryImage"]]
        self.assertEqual([r["chapterOneBased"] for r in main], [4, 9, 10, 11, 15])
        self.assertEqual(
            [r["primaryImage"]["sourcePrintPageOneBased"] for r in main],
            [59, 161, 187, 225, 299],
        )
        self.assertEqual(
            sorted(x["sourcePrintPageOneBased"]
                   for r in doc["chapters"] for x in r.get("additionalIllustrations", [])),
            [55, 142, 195, 222],
        )

    def test_original_nine_visual_binaries_have_distinct_file_bytes_and_rights_on_hold(self):
        seen_files, seen_sha = set(), set()
        count = 0
        for row in self.map["chapters"]:
            items = ([row["primaryImage"]] if row["primaryImage"] else [])
            items += row.get("additionalIllustrations", [])
            for item in items:
                with self.subTest(file=item["imagePath"]):
                    count += 1
                    actual = (ROOT / item["imagePath"]).read_bytes()
                    self.assertEqual(hashlib.sha256(actual).hexdigest(), item["sha256"])
                    self.assertTrue(actual.startswith(b"RIFF") and actual[8:12] == b"WEBP")
                    self.assertNotIn(item["imagePath"], seen_files)
                    self.assertNotIn(item["sha256"], seen_sha)
                    seen_files.add(item["imagePath"])
                    seen_sha.add(item["sha256"])
                    self.assertFalse(item["editoriallyApproved"])
                    self.assertFalse(item["publishedToApp"])
                    self.assertEqual(item["rightsStatus"], "PENDING_1912_ORIGINAL_PRINT_AND_TERRITORIAL_REVIEW")
                    self.assertEqual(item["sourceActualChapterOneBased"], row["chapterOneBased"])
                    self.assertEqual(item["sourceChapterEnglishGitBlobSha"], row["sourceGitBlobSha"])
                    self.assertIn("SCENE_AND_TERRITORIAL_RIGHTS_PENDING", item["sceneVerificationStatus"])
        self.assertEqual(count, 9)

    def test_wikisource_chapter_transclusions_verified_not_visual_claims(self):
        evidence = json.loads(EVIDENCE.read_text("utf-8"))
        self.assertEqual(evidence["sourceArtCount"], 9)
        self.assertEqual(evidence["distinctChaptersWithEvidence"], 5)
        self.assertFalse(evidence["publicationApproved"])
        real_source = json.loads((ROOT / evidence["sourceImageManifest"]).read_text("utf-8"))
        self.assertEqual(len(real_source["images"]), 9)
        self.assertEqual(set(x["wikiFile"] for x in evidence["images"]),
                         set(x["wikiFile"] for x in real_source["images"]))
        for record in evidence["images"]:
            self.assertTrue(record["sourceChapterCoPlacementVerified"])
            self.assertFalse(record["rightsApprovedForReader"])
            self.assertFalse(record["depictedSceneVerifiedByHuman"])
            self.assertFalse(record["editoriallyApproved"])
            self.assertEqual(
                record["wikisourceProofUrl"],
                "https://en.wikisource.org/wiki/The_Lost_World/Chapter_" +
                record["originalChapterRoman"],
            )

    def test_other_three_doyle_books_and_original_texts_unchanged(self):
        for slug, expected in (
            ("a-study-in-scarlet", 14),
            ("the-hound-of-the-baskervilles", 15),
            ("the-sign-of-the-four", 12),
        ):
            doc = generate(slug)
            self.assertEqual(doc["chapterCount"], expected)
            self.assertEqual(doc["localCandidateChapters"], 0)
            self.assertEqual(doc["readyForUICards"], 0)
            self.assertFalse(doc["releaseApproved"])
        actual = json.loads((ROOT / "docs/literature/staging/the-lost-world/chapter-image-map.json").read_text("utf-8"))
        self.assertEqual(actual, self.map)


if __name__ == "__main__":
    unittest.main()
