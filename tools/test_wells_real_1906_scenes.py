#!/usr/bin/env python3
"""Real 1906 Corrêa evidence: fail closed on wrong edition/text/sha/releases."""
from __future__ import annotations
import copy
import unittest
from pathlib import Path
from unittest.mock import patch
import report_chapter_art_progress as audit

class CorrêaOriginalWarPlates(unittest.TestCase):
    def test_wells_27_original_chapter_titles_and_four_structure_files(self):
        data = audit.war_of_worlds_original_chapter_coverage()
        self.assertEqual(data["missingImageChapters"], 22)
        self.assertEqual(data["localCandidateChapters"], 5)
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



    def test_five_real_correa_images_have_unique_original_page_and_source_evidence(self):
        import re
        book = audit.jload(audit.STAGING / "the-war-of-the-worlds" / "chapter-image-map.json")
        art_archive = audit.STAGING / "war-of-worlds-correa-period-plates"
        originals = audit.jload(art_archive / "manifest.json")["images"]
        art_by_path = {str((art_archive / a["localPath"]).relative_to(audit.ROOT)): a for a in originals}
        expected = {5: 34, 9: 59, 16: 122, 23: 181, 25: 233}
        actual = {}
        digests = set()
        for chapter in book["chapters"]:
            art = chapter["primaryImage"]
            if art is None:
                continue
            number = chapter["chapterOneBased"]
            self.assertIn(number, expected)
            self.assertIn(art["imagePath"], art_by_path)
            original = art_by_path[art["imagePath"]]
            self.assertEqual(art["sha256"], original["webpSha256"])
            self.assertEqual(art["sourceUrl"], original["commonsPage"])
            self.assertEqual(original["individualCommonsLicense"], "Public domain")
            self.assertEqual(art["rightsStatus"], "PENDING_TERRITORIAL_AND_EDITORIAL_REVIEW")
            self.assertFalse(art["editoriallyApproved"])
            self.assertEqual(art["publicationStatus"], "STAGING_ONLY_NOT_PUBLISHED")
            self.assertTrue(art["altAr"] and art["altEn"] and art["creator"])
            self.assertTrue(art["sceneVerificationStatus"].endswith("PENDING_FINAL_EDITOR"))
            self.assertTrue(art["sourceEditionPlatePageURL"].endswith("/" + str(expected[number])))
            original_xhtml = (audit.ROOT / chapter["sourceFilePath"]).read_text(encoding="utf-8")
            exact_text = re.sub(r"<[^>]+>", " ", original_xhtml)
            exact_text = re.sub(r"\s+", " ", exact_text)
            self.assertIn(art["sourcePassage"], exact_text)
            self.assertEqual(art["sceneAnchor"], art["sourcePassage"])
            self.assertNotIn(art["sha256"], digests)
            digests.add(art["sha256"])
            actual[number] = expected[number]
        self.assertEqual(actual, expected)


if __name__ == "__main__":
    unittest.main()
