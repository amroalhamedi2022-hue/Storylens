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


if __name__ == "__main__":
    unittest.main()
