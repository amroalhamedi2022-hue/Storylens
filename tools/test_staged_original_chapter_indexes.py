#!/usr/bin/env python3
"""Offline regression: independent original-chapter indexes must be exact and nonpublishable."""
from __future__ import annotations

import copy
import unittest
from pathlib import Path
from unittest.mock import patch

import report_chapter_art_progress as audit

EXPECTED = {
    "a-study-in-scarlet": (14, 0),
    "dracula": (27, 2),           # preface + epilogue, kept as narrative units
    "frankenstein": (24, 4),      # four framing letters, not chapter 1-4
    "the-hound-of-the-baskervilles": (15, 0),
    "the-lost-world": (16, 0),
    "the-sign-of-the-four": (12, 0),
}


class RealOriginalChapterIndexes(unittest.TestCase):
    def test_all_108_chapters_are_genuine_and_no_art_is_fabricated(self):
        total = 0
        for slug, (count, additional_units) in EXPECTED.items():
            with self.subTest(slug=slug):
                data = audit.staged_original_chapter_coverage(audit.STAGING / slug)
                self.assertEqual(data["missingImageChapters"], count)
                self.assertEqual(data["localCandidateChapters"], 0)
                self.assertEqual(data["readyForUICards"], 0)
                self.assertEqual(data["nonChapterNarrativeSourceUnits"], additional_units)
                self.assertEqual(data["sourceHashAudit"], "UPSTREAM_GIT_BLOB_SHA1_AND_EXACT_BYTES")
                total += count
        self.assertEqual(total, 108)

    def test_false_release_flags_and_corrupt_chapter_provenance_are_rejected(self):
        folder = audit.STAGING / "frankenstein"
        index = folder / "chapter-image-map.json"
        original = audit.jload(index)
        loader = audit.jload
        tamper_cases = (
            ("release", lambda m: m.__setitem__("releaseApproved", True)),
            ("chapter-source", lambda m: m["chapters"][4].__setitem__("sourceFilePath", m["chapters"][5]["sourceFilePath"])),
            ("chapter-sha", lambda m: m["chapters"][0].__setitem__("sourceGitBlobSha", "0" * 40)),
            ("chapter-bytes", lambda m: m["chapters"][0].__setitem__("sourceByteCount", 2)),
            ("framing-letters", lambda m: m["nonChapterNarrativeUnits"].pop()),
        )
        for name, corrupt in tamper_cases:
            with self.subTest(name=name):
                fake = copy.deepcopy(original)
                corrupt(fake)
                with patch.object(audit, "jload", side_effect=lambda p: fake if Path(p) == index else loader(p)):
                    with self.assertRaises(ValueError):
                        audit.staged_original_chapter_coverage(folder)


    def test_wells_27_original_chapter_titles_and_four_structure_files(self):
        data = audit.war_of_worlds_original_chapter_coverage()
        self.assertEqual(data["missingImageChapters"], 27)
        self.assertEqual(data["localCandidateChapters"], 0)
        self.assertEqual(data["readyForUICards"], 0)
        self.assertEqual(data["sourceStructuralUnits"], 4)

    def test_wells_rejects_invented_title_or_wrong_original_part(self):
        path = audit.STAGING / "the-war-of-the-worlds" / "chapter-image-map.json"
        original, loader = audit.jload(path), audit.jload
        for label, change in (
            ("invalid-original-title", lambda m: m["chapters"][0].__setitem__("titleEn", "Modern invented chapter")),
            ("wrong-structural-part", lambda m: m["chapters"][17].__setitem__("sourceBookOneBased", 1)),
            ("missing-chapter", lambda m: m["chapters"].pop()),
            ("fake-release", lambda m: m.__setitem__("releaseApproved", True)),
        ):
            with self.subTest(label=label):
                fake = copy.deepcopy(original)
                change(fake)
                with patch.object(audit, "jload", side_effect=lambda p: fake if Path(p) == path else loader(p)):
                    with self.assertRaises(ValueError):
                        audit.war_of_worlds_original_chapter_coverage()


    def test_all_ten_burton_volumes_and_woman_in_white_are_real_complete_source(self):
        words = 0
        for volume in range(1, 11):
            with self.subTest(volume=volume):
                slug = f"arabian-nights-burton-v{volume:02d}"
                status = audit.verify_unpublished_gutenberg_edition(slug, volume)
                self.assertEqual(status["localCandidateChapters"], 0)
                self.assertEqual(status["readyForUICards"], 0)
                self.assertIsNone(status["chapterCount"])
                words += status["originalNarrativeWordsClaimFromSource"]
        self.assertEqual(words, 1599851)
        woman = audit.verify_unpublished_gutenberg_edition("the-woman-in-white")
        self.assertEqual(woman["chapterCount"], None)
        self.assertEqual(woman["originalNarrativeWordsClaimFromSource"], 246996)

    def test_four_arabic_nights_transcriptions_remain_unpaired(self):
        data = audit.verify_arabian_wikisource_arabic_segments()
        self.assertEqual(data["arabicSourceSegments"], 4)
        self.assertIsNone(data["chapterCount"])
        self.assertEqual(data["readyForUICards"], 0)

    def test_fake_burton_edition_approval_or_volume_is_rejected(self):
        folder = audit.STAGING / "user-requested-classics-20261105" / "arabian-nights-burton-v01"
        manifest_path = folder / "manifest.json"
        original, loader = audit.jload(manifest_path), audit.jload
        for label, change in (
            ("false-arabic-translation", lambda m: m["acceptance"].__setitem__("fullNaturalArabicTranslation", True)),
            ("false-number", lambda m: m.__setitem__("seriesVolume", 2)),
            ("altered-text-sha", lambda m: m["source"].__setitem__("sha256", "0" * 64)),
        ):
            with self.subTest(label=label):
                bad = copy.deepcopy(original)
                change(bad)
                with patch.object(audit, "jload", side_effect=lambda p: bad if Path(p) == manifest_path else loader(p)):
                    with self.assertRaises(ValueError):
                        audit.verify_unpublished_gutenberg_edition("arabian-nights-burton-v01", 1)


if __name__ == "__main__":
    unittest.main()
