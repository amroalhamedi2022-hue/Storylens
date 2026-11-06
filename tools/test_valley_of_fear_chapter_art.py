#!/usr/bin/env python3
"""Offline tests: real Valley of Fear source and 7 distinct chapter-local plates."""
from pathlib import Path
import json
import sys
import unittest
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from map_valley_of_fear_chapter_art import generate, chapter_sections, roman

FOLDER = ROOT / "docs/literature/staging/user-requested-classics-20261105/the-valley-of-fear"


class OriginalChapterArtTest(unittest.TestCase):
    def test_real_source_15_sections_with_two_separate_sevens(self):
        doc = generate()
        self.assertEqual(doc["chapterCount"], 15)
        self.assertEqual(doc["novelChapterCountExcludingEpilogue"], 14)
        self.assertEqual([x["chapterOneBased"] for x in doc["chapters"]], list(range(1, 16)))
        self.assertEqual([x["bookPartOneBased"] for x in doc["chapters"]], [1]*7 + [2]*8)
        self.assertEqual([x["chapterWithinBookPart"] for x in doc["chapters"]], list(range(1, 8))*2 + [None])
        self.assertEqual(doc["chapters"][-1]["titleEn"], "Epilogue")
        self.assertFalse(doc["releaseApproved"])

    def test_seven_real_unique_source_images_are_held_for_human_review(self):
        doc = generate()
        art = [(x["chapterOneBased"], x["primaryImage"]) for x in doc["chapters"] if x["primaryImage"]]
        self.assertEqual([i for i, _ in art], [1, 5, 6, 9, 10, 12, 14])
        self.assertEqual(len({x["imagePath"] for _, x in art}), 7)
        self.assertEqual(len({x["sha256"] for _, x in art}), 7)
        self.assertEqual(doc["localCandidateChapters"], 7)
        self.assertEqual(doc["readyForUICards"], 0)
        for _, item in art:
            self.assertFalse(item["editoriallyApproved"])
            self.assertIn("PENDING", item["rightsStatus"])
            self.assertIn("SOURCE_HTML_CHAPTER_POSITION_ONLY", item["sceneVerificationStatus"])

    def test_map_matches_committed_canonical_document(self):
        doc = generate()
        saved = json.loads((FOLDER / "chapter-image-map.json").read_text("utf-8"))
        self.assertEqual(saved, doc)
        self.assertEqual(sum(x["primaryImage"] is None for x in saved["chapters"]), 8)

    def test_roman_and_duplicate_chapter_heading_rejection(self):
        self.assertEqual(roman("VII"), 7)
        headings = ['<h2>PART I The Tragedy of Birlstone</h2>']
        headings += [f"<h2>Chapter {i} example</h2>" for i in
                     ("I", "II", "III", "IV", "V", "VI", "VII")]
        headings += ['<h2>PART II The Scowrers</h2>']
        headings += [f"<h2>Chapter {i} example</h2>" for i in
                     ("I", "II", "III", "IV", "V", "VI", "VII")]
        headings += ["<h2>Epilogue</h2>"]
        soup = BeautifulSoup("".join(headings), "html.parser")
        self.assertEqual(len(chapter_sections(soup)[0]), 15)
        with self.assertRaises(ValueError):
            chapter_sections(BeautifulSoup("".join(headings[:-1]), "html.parser"))
        with self.assertRaises(ValueError):
            chapter_sections(BeautifulSoup("".join(headings[:2]+headings[1:]), "html.parser"))


if __name__ == "__main__":
    unittest.main()
