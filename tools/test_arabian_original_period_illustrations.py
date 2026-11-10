#!/usr/bin/env python3
"""Adversarial, source-edition-specific tests for 22 genuine Arabian Nights plates."""
from pathlib import Path
import re
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
import intake_arabian_period_original_illustrations as source
import intake_verne_commons_period_gallery as commons


class GenuineVintageArabianNightsArtTest(unittest.TestCase):
    def test_15_distinct_dulac_1907_pages_and_no_faux_original_cover(self):
        cfg = source.configure("dulac")
        self.assertEqual(len(cfg["names"]), 15)
        self.assertEqual(len(source.DULAC_PAGES), 15)
        self.assertEqual(commons.SOURCE_CATEGORY, source.DULAC_CATEGORY)
        self.assertEqual(commons.ORIGINAL_YEAR, 1907)
        self.assertIn("Housman", cfg["edition"])
        for page in source.DULAC_PAGES:
            with self.subTest(page=page):
                name = f"File:Stories from the Arabian nights - colour plate at page {page:03d}.jpg"
                self.assertTrue(commons.PERIOD_NAME.fullmatch(name))
        for fake in (
            "File:Stories from the Arabian nights - cover.png",
            "File:Stories from the Arabian nights - end paper.png",
            "File:Stories from the Arabian nights - frontipiece.jpg",
            "File:Stories from the Arabian nights - colour plate at page 037.jpg",
            "File:Stories from the Arabian nights - colour plate at page 039 (cropped).jpg",
            "File:Stories from the Arabian nights - colour plate at page 039.png",
            "File:Illustration by Edmund Dulac from One Thousand and One Nights 01.jpg",
        ):
            self.assertFalse(commons.PERIOD_NAME.fullmatch(fake), fake)

    def test_seven_actual_night_numbered_original_gross_images(self):
        cfg = source.configure("gross")
        self.assertEqual(len(cfg["names"]), 7)
        self.assertEqual(source.GROSS_NIGHTS, {9, 109, 167, 231, 236, 247, 460})
        self.assertEqual(commons.SOURCE_CATEGORY, source.GROSS_CATEGORY)
        self.assertIsNone(commons.ORIGINAL_YEAR)
        self.assertEqual(len({n.casefold() for n in cfg["names"]}), 7)
        for name in cfg["names"]:
            self.assertTrue(commons.PERIOD_NAME.fullmatch(name), name)
        for invalid in (
            "File:Gross F, 10. Nacht, 1001 Nacht, Bd 1, 1838.jpg",
            "File:Gross F, 460. Nacht, 1001 Nacht, Bd 1, 1838.jpg",
            "File:Gross F, 247. Nacht, 1001 Nacht, Bd 1, 1838.jpg",
            "File:1001 Nacht Seite 119.jpg",
            "File:1001 Nacht Seite 119.svg",
            "File:Þúsund og ein nótt epigraph.svg",
        ):
            self.assertFalse(commons.PERIOD_NAME.fullmatch(invalid), invalid)

    def test_only_individually_pd_tagged_commons_actual_images_eligible(self):
        source.configure("dulac")
        entry = {
            "title": "File:Stories from the Arabian nights - colour plate at page 039.jpg",
            "imageinfo": [{
                "mime": "image/jpeg", "sha1": "a"*40,
                "thumburl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/p/p/plate.jpg/960px-plate.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/p/p/plate.jpg",
                "width": 1900, "height": 2500,
                "extmetadata": {"LicenseShortName": {"value": "Public domain"},
                                "Copyrighted": {"value": "False"}}
            }]
        }
        self.assertIsNotNone(commons.permit_candidate(entry, set()))
        entry["imageinfo"][0]["extmetadata"]["LicenseShortName"]["value"] = "No known copyright restrictions"
        self.assertIsNone(commons.permit_candidate(entry, set()))
        entry["imageinfo"][0]["extmetadata"]["LicenseShortName"]["value"] = "Public domain"
        entry["imageinfo"][0]["extmetadata"]["Copyrighted"]["value"] = "True"
        self.assertIsNone(commons.permit_candidate(entry, set()))
        entry["imageinfo"][0]["extmetadata"]["Copyrighted"]["value"] = "False"
        self.assertIsNone(commons.permit_candidate(entry, {"a"*40}))
        entry["imageinfo"][0]["thumburl"] = "https://thumb.wikimedia.org.evil.test/fake.jpg"
        self.assertIsNone(commons.permit_candidate(entry, set()))

    def test_no_generated_image_no_unverified_publication_no_false_burton_chapter(self):
        text = (ROOT / "tools/intake_arabian_period_original_illustrations.py").read_text("utf-8")
        for term in (
            'doc["sourceBookNotExactBurtonTranslation"] = True',
            'doc["sourceBookNotExactArabicTranscription"] = True',
            'doc["publicationApproved"] = False',
            'item["editoriallyApproved"] = False',
            'item["publishedToApp"] = False',
            'item["altAr"] = None',
            'item["altEn"] = None',
            'item["captionEvidenceStatus"] = "EXACT_GERMAN_EDITION_NIGHT_NUMBER_NOT_SCENE_ALIGNED"',
            'item["captionEvidenceStatus"] = "EXACT_1907_PRINT_PAGE_NUMBER_NOT_STORY_ALIGNED"',
            'finally:',
            "provenance(edition)",
        ):
            self.assertIn(term, text)
        collector = (ROOT / "tools/intake_verne_commons_period_gallery.py").read_text("utf-8")
        for term in ("downloadedResourceSha256", "webpSha256", "individualCommonsLicense",
                     "ImageOps.exif_transpose", "PERIOD_NAME.match", "image.save(out, \"WEBP\"",
                     "persist(existing)"):
            self.assertIn(term, collector)

    def test_existing_burton_original_source_and_Arabic_not_changed(self):
        for volume in range(1, 11):
            file = (ROOT / "docs/literature/staging/user-requested-classics-20261105" /
                    f"arabian-nights-burton-v{volume:02d}/manifest.json")
            self.assertTrue(file.is_file())
        for volume in range(1, 5):
            self.assertTrue((ROOT / "docs/literature/staging/arabian-nights-arabic-wikisource-20261105" /
                             f"part-{volume:02d}/manifest.json").is_file())
        self.assertIn("unassignedOriginalArabianNightsArtworkFiles",
                      (ROOT / "tools/report_chapter_art_progress.py").read_text("utf-8"))


if __name__ == "__main__":
    unittest.main()
