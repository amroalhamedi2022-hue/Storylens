#!/usr/bin/env python3
"""Evidence-only match between original 1903 picture caption and Doyle chapter VI.

No AI guesses, no app publication, no rights approval, no change to the
original 57-chapter source index; checks the exact independently pinned source
text and downloaded historical image bytes before accepting a *lead*.
"""
from pathlib import Path
import hashlib
import json
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
STAGE = ROOT / "docs/literature/staging"
SIGN = STAGE / "sign-four-townsend-1903-period-plates"
TEXT = STAGE / "the-sign-of-the-four"


def git_blob_sha(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\\0" + raw).hexdigest()


class ActualTownsendCaptionSceneLead(unittest.TestCase):
    def test_single_source_verified_chapter_six_lead_is_not_published(self):
        leads = json.loads((SIGN / "scene-caption-source-leads.json").read_text("utf-8"))
        pictures = json.loads((SIGN / "manifest.json").read_text("utf-8"))
        chapters = json.loads((TEXT / "chapter-image-map.json").read_text("utf-8"))
        source = json.loads((TEXT / "manifest.json").read_text("utf-8"))
        self.assertEqual(leads["bookId"], "the-sign-of-the-four")
        self.assertEqual(leads["sourceTextEditionCommit"], source["source"]["upstreamCommit"])
        self.assertFalse(leads["releaseApproved"])
        self.assertFalse(leads["territorialRightsCleared"])
        self.assertFalse(leads["humanSceneReviewApproved"])
        self.assertEqual(leads["approvedPrimaryChapterImageCount"], 0)
        self.assertEqual(len(leads["discoveredSourceCaptionLeads"]), 1)
        self.assertEqual(len(pictures["images"]), 8)
        self.assertEqual(chapters["chapterCount"], 12)
        self.assertEqual(chapters["localCandidateChapters"], 0)
        self.assertEqual(chapters["readyForUICards"], 0)
        rec = leads["discoveredSourceCaptionLeads"][0]
        self.assertEqual(rec["sourceFileName"], "File:Sign-t1.jpg")
        self.assertEqual(rec["candidateChapterOneBased"], 6)
        self.assertFalse(rec["candidateCardMapped"])
        self.assertFalse(rec["editorialApproval"])
        self.assertEqual(rec["rightsStatus"], "PENDING_INDIVIDUAL_TERRITORY_AND_SCENE_REVIEW")
        self.assertEqual(rec["evidenceCategory"],
                         "HISTORICAL_CAPTION_MATCHES_CHAPTER_NARRATIVE__PENDING_HUMAN_VISUAL_CONFIRMATION")
        self.assertIn("this horrid thing", rec["captionFromCommons"].lower())
        self.assertIn("the horrid thing", rec["originalChapterTextExcerpt"].lower())
        self.assertEqual(chapters["chapters"][5]["sourceOriginalTitle"], rec["chapterOriginalTitle"])
        self.assertIsNone(chapters["chapters"][5]["primaryImage"])
        original_file = ROOT / rec["originalTextPath"]
        raw = original_file.read_bytes()
        self.assertEqual(git_blob_sha(raw), rec["originalTextGitBlobSha"])
        self.assertEqual(rec["originalTextGitBlobSha"], chapters["chapters"][5]["sourceGitBlobSha"])
        prose = " ".join("".join(ET.fromstring(raw).itertext()).split())
        self.assertIn(rec["originalChapterTextExcerpt"].casefold(), prose.casefold())
        item = next(x for x in pictures["images"] if x["wikiFile"] == rec["sourceFileName"])
        self.assertEqual(item["commonsPage"], rec["sourceUrl"])
        self.assertIn("public domain", item["individualCommonsLicense"].lower())
        self.assertEqual(item["originalCreator"], rec["originalArtist"])
        image_path = (ROOT / rec["localImagePath"]).resolve()
        self.assertTrue(image_path.is_relative_to(ROOT.resolve()))
        self.assertEqual(image_path.relative_to(SIGN.resolve()).as_posix(), item["localPath"])
        real_bytes = image_path.read_bytes()
        self.assertEqual(real_bytes[:4], b"RIFF")
        self.assertEqual(real_bytes[8:12], b"WEBP")
        self.assertEqual(hashlib.sha256(real_bytes).hexdigest(), rec["localWebpSha256"])
        self.assertEqual(item["webpSha256"], rec["localWebpSha256"])

    def test_seven_remaining_originals_are_not_reused_as_fake_cards(self):
        leads = json.loads((SIGN / "scene-caption-source-leads.json").read_text("utf-8"))
        pictures = json.loads((SIGN / "manifest.json").read_text("utf-8"))
        assigned = {r["sourceFileName"] for r in leads["discoveredSourceCaptionLeads"]}
        original_names = {p["wikiFile"] for p in pictures["images"]}
        self.assertEqual(len(original_names - assigned), 7)
        self.assertIn("UNMAPPED", leads["otherSevenOriginalTownsendPlatesStatus"])
        self.assertTrue(all(not p["publishedToApp"] and not p["editoriallyApproved"]
                            for p in pictures["images"]))


if __name__ == "__main__":
    unittest.main()
