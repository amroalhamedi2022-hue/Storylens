#!/usr/bin/env python3
"""Offline historical Sidney Paget Hound whitelist, original bytes and no false chapters."""
import ast
import re
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / "tools/intake_hound_paget_original_period_plates.py"


def selectors():
    tree = ast.parse(FILE.read_text("utf-8"))
    got = {}
    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        for target in node.targets:
            if isinstance(target, ast.Attribute) and target.attr in (
                "SOURCE_CATEGORY", "ORIGINAL_YEAR", "OUTPUT_PREFIX", "PERIOD_NAME"):
                got[target.attr] = (ast.literal_eval(node.value.args[0])
                                    if target.attr == "PERIOD_NAME"
                                    else ast.literal_eval(node.value))
    return got


class PagetOriginalArtSourceTest(unittest.TestCase):
    def test_strict_paget_book_only_without_film_or_generated_art(self):
        meta = selectors()
        self.assertEqual(meta["ORIGINAL_YEAR"], 1902)
        self.assertEqual(meta["SOURCE_CATEGORY"],
                         "Category:The Hound of the Baskervilles illustrated by Sidney Paget")
        allowed = re.compile(meta["PERIOD_NAME"], re.IGNORECASE)
        for file in ("File:Houn-01.jpg", "File:Houn-08.jpg",
                     "File:Houn-05 - Hound of Baskervilles, page 24.jpg",
                     "File:Houn-27 - Legend of the wicked Hugo (Hound of Baskervilles, page 160).jpg",
                     "File:Houn-60.jpg"):
            self.assertIsNotNone(allowed.fullmatch(file))
        for file in ("File:Sherlock-Holmes-Netflix.jpg", "File:Houn-61.jpg",
                     "File:Hound 1902 Poster.jpg", "File:Houn-01.png",
                     "File:Houn-0.jpg", "File:Houn-19 (generated).jpg"):
            self.assertIsNone(allowed.fullmatch(file))

    def test_preserve_author_source_color_sha_and_human_release_hold(self):
        src = FILE.read_text("utf-8")
        for token in ('image', 'item["originalCreator"] = ATTRIBUTION',
                      'item["editoriallyApproved"] = False',
                      'item["sceneChapterMatchStatus"] = "UNREVIEWED__NO_CHAPTER_CARD"',
                      'item["rightsStatus"] = "PENDING_', 'finally:', 'maintain_evidence()'):
            self.assertIn(token, src)
        shared = (ROOT / "tools/intake_verne_commons_period_gallery.py").read_text("utf-8")
        for token in ("downloadedResourceSha256", "webpSha256", "individualCommonsLicense",
                      "sourceProofStatus", "PERIOD_NAME.match(name)", "ImageOps.exif_transpose"):
            self.assertIn(token, shared)

    def test_separate_action_queue_and_central_original_sha_audit(self):
        workflow = (ROOT / ".github/workflows/hound-paget-original-period-intake.yml").read_text("utf-8")
        self.assertIn("cancel-in-progress: false", workflow)
        self.assertIn("gh workflow run chapter-art-progress.yml --ref main", workflow)
        self.assertIn("git add -f docs/literature/staging/hound-paget-", workflow)
        self.assertNotIn("chapter-image-map.json", workflow)
        report = (ROOT / "tools/report_chapter_art_progress.py").read_text("utf-8")
        self.assertIn("unassignedHistoricalSidneyPagetFiles", report)
        self.assertIn("check_binary(", report)


if __name__ == "__main__":
    unittest.main()
