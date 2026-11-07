#!/usr/bin/env python3
"""Validate unapproved visual research leads against eight actual original
Townsend artwork binaries and 1890 English source bytes, not image guesswork.
Never update source chapter maps or grant historic-scene rights automatically.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "docs/literature/staging/sign-four-townsend-1903-period-plates"
TEXT = ROOT / "docs/literature/staging/the-sign-of-the-four"
PROVENANCE = ART / "visual-source-review-leads.json"


def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + bytes([0]) + data).hexdigest()


class RealVisualResearchLeads(unittest.TestCase):
    def test_two_distinct_unapproved_real_image_and_original_text_leads(self):
        doc = json.loads(PROVENANCE.read_text("utf-8"))
        manifest = json.loads((ART / "manifest.json").read_text("utf-8"))
        chapter_map = json.loads((TEXT / "chapter-image-map.json").read_text("utf-8"))
        pictures = {im["wikiFile"]: im for im in manifest["images"]}
        chapters = {ch["chapterOneBased"]: ch for ch in chapter_map["chapters"]}
        self.assertEqual(doc["schemaVersion"], 1)
        self.assertEqual(doc["bookId"], "the-sign-of-the-four")
        self.assertFalse(doc["independentHumanVisualReviewComplete"])
        self.assertFalse(doc["releaseApproved"])
        self.assertFalse(doc["rightsCleared"])
        self.assertEqual(doc["countAsMappedChapterCards"], 0)
        self.assertEqual(doc["countAsApprovedChapterCards"], 0)
        self.assertEqual(len(pictures), 8)
        self.assertEqual(len(doc["leads"]), 2)
        self.assertEqual({l["image"] for l in doc["leads"]},
                         {"File:Sign-t4.jpg", "File:Sign-t7.jpg"})
        self.assertEqual({l["proposedChapter"] for l in doc["leads"]}, {5, 10})
        self.assertEqual(chapter_map["localCandidateChapters"], 0)
        self.assertEqual(chapter_map["readyForUICards"], 0)
        for lead in doc["leads"]:
            with self.subTest(image=lead["image"]):
                chapter = chapters[lead["proposedChapter"]]
                item = pictures[lead["image"]]
                self.assertEqual(chapter["sourceOriginalTitle"], lead["actualChapterTitle"])
                self.assertEqual(chapter["sourceFile"], lead["sourceXhtml"])
                self.assertEqual(chapter["sourceGitBlobSha"], lead["sourceGitBlobSha"])
                self.assertIsNone(chapter["primaryImage"])
                self.assertFalse(lead["humanConfirmed"])
                self.assertFalse(lead["approvedForChapterCard"])
                self.assertEqual(lead["rightsStatus"],
                                 "PENDING_INDIVIDUAL_TERRITORY_AND_EDITORIAL_REVIEW")
                self.assertEqual(lead["verificationStatus"],
                                 "VISUAL_HYPOTHESIS_WITH_REAL_SHA_VERIFIED_SOURCE_PASSAGE__NOT_CHAPTER_MAPPING")
                self.assertTrue(lead["visualAmbiguity"])
                self.assertTrue(lead["visualObservation"])
                self.assertEqual(item["commonsPage"], lead["imageSource"])
                self.assertEqual(item["webpSha256"], lead["imageSha256"])
                self.assertEqual(item["originalCreator"],
                                 "Frederick Henry Townsend (1868–1920)")
                self.assertFalse(item["editoriallyApproved"])
                self.assertFalse(item["publishedToApp"])
                image_path = (ROOT / lead["imagePath"]).resolve()
                self.assertTrue(image_path.is_relative_to(ART.resolve()))
                self.assertEqual(image_path.relative_to(ART.resolve()).as_posix(),
                                 item["localPath"])
                image_bytes = image_path.read_bytes()
                self.assertEqual(image_bytes[:4], b"RIFF")
                self.assertEqual(image_bytes[8:12], b"WEBP")
                self.assertEqual(hashlib.sha256(image_bytes).hexdigest(),
                                 lead["imageSha256"])
                raw = (ROOT / lead["sourceXhtml"]).read_bytes()
                self.assertEqual(git_blob_sha(raw), lead["sourceGitBlobSha"])
                english = " ".join("".join(ET.fromstring(raw).itertext()).split())
                self.assertIn(lead["originalTextAnchor"].casefold(), english.casefold())

    def test_original_english_source_and_all_nonchosen_images_stay_unmodified(self):
        doc = json.loads(PROVENANCE.read_text("utf-8"))
        book = json.loads((TEXT / "chapter-image-map.json").read_text("utf-8"))
        self.assertEqual(book["chapterCount"], 12)
        self.assertFalse(book["releaseApproved"])
        self.assertTrue(all(ch["primaryImage"] is None for ch in book["chapters"]))
        self.assertEqual(doc["sourceArchive"],
                         "docs/literature/staging/sign-four-townsend-1903-period-plates/manifest.json")
        self.assertEqual(doc["canonicalOriginalEnglish"],
                         "docs/literature/staging/the-sign-of-the-four/manifest.json")
        self.assertIn("NOT", doc["note"])


if __name__ == "__main__":
    unittest.main()
