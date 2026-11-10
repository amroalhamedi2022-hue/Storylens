#!/usr/bin/env python3
"""Nightly regeneration must never erase authentic, unapproved chapter art."""
from __future__ import annotations
import copy
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from map_archived_five_chapter_art import apply_curated_scenes, make_map, BASE, CURATED_SCENES


class AuthenticSceneRegeneration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.folder = BASE / "the-gilded-age"
        cls.manifest = json.loads((cls.folder / "manifest.json").read_text("utf-8"))
        cls.raw_source = (cls.folder / "original-full-edition.html").read_bytes()
        cls.proof = json.loads(CURATED_SCENES.read_text("utf-8"))
        cls.generated = make_map("the-gilded-age")

    def test_regenerated_map_preserves_actual_art_and_never_publishes(self):
        d = self.generated
        self.assertEqual(d["chapterCount"], 63)
        self.assertEqual(d["localCandidateChapters"], 62)
        self.assertEqual(d["missingCandidateChapters"], 1)
        self.assertEqual(d["readyForUICards"], 0)
        self.assertIs(d["releaseApproved"], False)
        self.assertEqual([x["chapterOneBased"] for x in d["chapters"] if x["primaryImage"] is None], [55])
        self.assertEqual(d["chapters"][29]["primaryImage"], self.proof["chapterScenes"][0]["primaryImage"])
        self.assertEqual(d["chapters"][29]["imageStatus"], self.proof["chapterScenes"][0]["imageStatus"])
        self.assertEqual(len({c["primaryImage"]["sha256"] for c in d["chapters"] if c["primaryImage"]}), 62)
        checked_in = json.loads((self.folder / "chapter-image-map.json").read_text("utf-8"))
        self.assertEqual(checked_in, d, "Scheduled --write would change the mapping or lose curator evidence")

    def test_source_alignment_and_metadata_tampering_are_rejected(self):
        mutations = {
            "missing-proof": lambda d: d["chapterScenes"].clear(),
            "duplicate-proof": lambda d: d["chapterScenes"].append(copy.deepcopy(d["chapterScenes"][0])),
            "new-book-identity": lambda d: d["chapterScenes"][0].__setitem__("bookId", "kidnapped"),
            "wrong-chapter": lambda d: d["chapterScenes"][0].__setitem__("chapterOneBased", 55),
            "false-book-release": lambda d: d.__setitem__("releaseApproved", True),
            "false-illustration-release": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("editoriallyApproved", True),
            "false-image-rights": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("rightsStatus", "APPROVED_FOR_TARGET_TERRITORIES"),
            "invented-quote": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("sourcePassage", "A fictional event which is absent from the authentic Victorian chapter."),
            "wrong-edition": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("sourceBookEditionURL", "https://example.invalid/fake.html"),
            "wrong-ordinal": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("sourceOriginalImageOrdinal", 108),
            "wrong-local-hash": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("sha256", "0"*64),
            "wrong-source-hash": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("originalSourceSha256", "0"*64),
            "fake-original-image": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("nonAIArt", False),
            "missing-human-rights-hold": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("sceneVerificationStatus", "APPROVED"),
            "empty-alt": lambda d: d["chapterScenes"][0]["primaryImage"].__setitem__("altAr", ""),
        }
        for name, mutate in mutations.items():
            with self.subTest(name=name):
                candidate = copy.deepcopy(self.proof)
                mutate(candidate)
                with self.assertRaises(ValueError):
                    apply_curated_scenes("the-gilded-age", copy.deepcopy(self.generated),
                                         self.raw_source, self.manifest, candidate)

    def test_other_original_books_keep_exact_existing_candidates(self):
        for slug in ("treasure-island", "kidnapped", "the-black-arrow", "the-last-of-the-mohicans"):
            with self.subTest(book=slug):
                actual = json.loads((BASE / slug / "chapter-image-map.json").read_text("utf-8"))
                regenerated = make_map(slug)
                self.assertEqual(regenerated, actual)
                self.assertIs(regenerated["releaseApproved"], False)
                self.assertEqual(regenerated["readyForUICards"], 0)


if __name__ == "__main__":
    unittest.main()
