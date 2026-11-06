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


    def test_moonstone_preserves_53_narrative_units_without_fictitious_chapter_count(self):
        data = audit.moonstone_source_unit_coverage()
        self.assertEqual(data["narrativeSourceUnitsNotChapterCount"], 53)
        self.assertEqual(data["originalStructuralHeadingUnits"], 3)
        self.assertEqual(data["narrativeUnitsWithoutMappedArt"], 53)

    def test_moonstone_rejects_false_approval_or_missing_epilogue(self):
        path = audit.STAGING / "the-moonstone" / "narrative-unit-index.json"
        original = audit.jload(path)
        loader = audit.jload
        for kind, change in (
            ("release", lambda m: m.__setitem__("releaseApproved", True)),
            ("non-original", lambda m: m["narrativeUnits"][2].__setitem__("sourceGitBlobSha", "0" * 40)),
            ("missing-epilogue", lambda m: m["narrativeUnits"].pop()),
            ("false-image", lambda m: m["narrativeUnits"][0].__setitem__("primaryImage", {"fake": True})),
        ):
            with self.subTest(kind=kind):
                fake = copy.deepcopy(original)
                change(fake)
                with patch.object(audit, "jload", side_effect=lambda p: fake if Path(p) == path else loader(p)):
                    with self.assertRaises(ValueError):
                        audit.moonstone_source_unit_coverage()


    def test_valley_of_fear_14_real_gutenberg_chapters_plus_epilogue(self):
        folder = audit.STAGING / "user-requested-classics-20261105" / "the-valley-of-fear"
        data = audit.valley_of_fear_original_chapter_coverage(folder)
        self.assertEqual(data["localCandidateChapters"], 0)
        self.assertEqual(data["missingImageChapters"], 14)
        self.assertEqual(data["nonChapterNarrativeSourceUnits"], 1)

    def test_valley_of_fear_rejects_invalid_historical_chapter_anchor(self):
        folder = audit.STAGING / "user-requested-classics-20261105" / "the-valley-of-fear"
        path = folder / "chapter-image-map.json"
        original, loader = audit.jload(path), audit.jload
        for label, damage in (
            ("bad-anchor", lambda m: m["chapters"][7].__setitem__("sourceAnchorId", "chap01")),
            ("bad-title", lambda m: m["chapters"][0].__setitem__("titleEn", "An invented title")),
            ("missing-end", lambda m: m["nonChapterNarrativeUnits"].clear()),
            ("fake-release", lambda m: m.__setitem__("releaseApproved", True)),
        ):
            with self.subTest(label=label):
                fake = copy.deepcopy(original)
                damage(fake)
                with patch.object(audit, "jload", side_effect=lambda p: fake if Path(p) == path else loader(p)):
                    with self.assertRaises(ValueError):
                        audit.valley_of_fear_original_chapter_coverage(folder)


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


if __name__ == "__main__":
    unittest.main()
