#!/usr/bin/env python3
"""Test real 1860 Harper McLenan page-extracted source engravings.

The original PDF was verified against Commons SHA1 at acquisition.
The original illustration crop binaries and direct visual evidence list are
each independently checked locally. Machine-proposed drawings and ordinary
typeset page text must NEVER count as verified artwork or reader cards.
"""
from pathlib import Path
import json
import sys
import unittest

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"tools"))
from report_chapter_art_progress import verify_mclenan_1860_original_illustrations,generate
SOURCE=ROOT/"docs/literature/staging/woman-white-mclenan-1860-original-scan"


class ActualHarper1860SourceAudit(unittest.TestCase):
    def test_original_art_must_be_real_and_visually_identified_not_type(self):
        report=verify_mclenan_1860_original_illustrations()
        self.assertGreaterEqual(report["originalHarper1860McLenanConfirmedArtworkFiles"],8)
        self.assertGreaterEqual(report["historicalScannedProseFalsePositivesDiscarded"],3)
        self.assertEqual(report["archivedLocalHistoricArt"],
                         report["originalHarper1860McLenanConfirmedArtworkFiles"])
        manifest=json.loads((SOURCE/"manifest.json").read_text("utf-8"))
        ledger=json.loads((SOURCE/"visually-inspected-original-drawings.json").read_text("utf-8"))
        self.assertEqual(manifest["sourcePDFPageCount"],278)
        self.assertEqual(manifest["sourcePDFBytes"],31714138)
        self.assertEqual(manifest["sourcePDFSHA256"],
                         "97c7236c8f6f02d63fa2a11043402f781467ba8c57aad48556be72080f19b854")
        self.assertFalse(manifest["publicationApproved"])
        self.assertFalse(manifest["humanVisualReviewComplete"])
        self.assertEqual({x["sourcePDFPageOneBased"] for x in ledger["visuallyVerifiedHistoricalPictureSources"]},
                         {42,55,129,157,174,195,232,236})
        self.assertTrue(all(r["specificChapter"] is None
                            for r in ledger["visuallyVerifiedHistoricalPictureSources"]))
        self.assertTrue(all(r["editorialPublicationApproved"] is False
                            for r in ledger["visuallyVerifiedHistoricalPictureSources"]))
        images={i["webpSha256"] for i in manifest["images"]}
        rejected={r["sha256"] for r in manifest["visuallyRejectedProseScans"]}
        self.assertTrue(images.isdisjoint(rejected))
        self.assertTrue(all(not (SOURCE/"scan-art-crops"/("invalid-"+r["sha256"])).exists()
                            for r in manifest["visuallyRejectedProseScans"]))

    def test_new_art_increases_archive_without_fabricating_chapter_readiness(self):
        progress=generate()
        book=next(b for b in progress["books"] if b["bookId"]=="the-woman-in-white")
        self.assertGreaterEqual(book["archivedLocalHistoricArt"],17)
        self.assertGreaterEqual(book["originalHarper1860McLenanConfirmedArtworkFiles"],8)
        self.assertEqual(book["chapterCount"],62)
        self.assertEqual(book["localCandidateChapters"],8)
        self.assertEqual(book["missingImageChapters"],54)
        self.assertEqual(book["readyForUICards"],0)
        self.assertEqual(book["historical1860PublisherBookCovers"],1)
        self.assertEqual(progress["counts"]["readyChapterCards"],0)
        self.assertGreaterEqual(progress["counts"]["verifiedHistoricalArtBinaryFilesAcrossAuditedSources"],1217)


if __name__=="__main__":
    unittest.main()
