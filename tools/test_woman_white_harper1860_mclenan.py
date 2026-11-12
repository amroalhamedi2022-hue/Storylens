#!/usr/bin/env python3
"""Tests for authentic Harper 1860 Woman in White original scan intake.

Source PDFs and historical illustrations must be real independently SHA-pinned
Commons bytes; these synthetic *test fixtures* are NEVER written to staging.
"""
import hashlib
from io import BytesIO
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest import mock

import cv2
import numpy as np
from PIL import Image

sys.path.insert(0,str(Path(__file__).resolve().parent))
import intake_woman_white_harper1860_mclenan as m

class RealOriginalEditionSourceTests(unittest.TestCase):
    def test_source_identity_and_individual_commons_public_domain_metadata(self):
        self.assertIn("IA womaninwhitenove00collrich",m.TITLE)
        self.assertEqual(m.EXPECTED_PAGES,278)
        sample={"query":{"pages":[{"title":m.TITLE,"imageinfo":[{
            "mime":"application/pdf","sha1":"a"*40,"size":31714138,
            "url":m.PDF_URL,
            "descriptionurl":m.COMMONS_PAGE,
            "extmetadata":{"LicenseShortName":{"value":"Public domain"},
                           "Copyrighted":{"value":"False"}}
        }]}]}}
        metadata=m.validate_source_metadata(sample)
        self.assertEqual(metadata["commonsOriginalSHA1"],"a"*40)
        for broken in ("license","size","mime","remote"):
            bad=json.loads(json.dumps(sample))
            field=bad["query"]["pages"][0]["imageinfo"][0]
            if broken=="license":field["extmetadata"]["LicenseShortName"]["value"]="All rights reserved"
            if broken=="size":field["size"]=900_000_000
            if broken=="mime":field["mime"]="image/jpeg"
            if broken=="remote":field["url"]="https://evil.example/bad.pdf"
            with self.assertRaises(ValueError):
                m.validate_source_metadata(bad)

    def test_ink_sparse_text_and_large_art_stroke_detection(self):
        page=np.full((1380,860),255,np.uint8)
        # Simulate 22px text rows in two narrow columns; they should not create
        # any giant dark 180x160 illustration regions.
        for y in range(95,1280,28):
            for x in (50,465):
                for j in range(5):
                    cv2.line(page,(x+j*55,y),(x+j*55+35,y),(80,),1)
        # Real drawings contain dense crossed engraving strokes, not letters.
        for y in range(410,635,8):
            cv2.line(page,(100,y),(360,y),(18,),2)
        for x in range(100,365,9):
            cv2.line(page,(x,410),(x,640),(32,),1)
        boxes=m.detect_original_engraving_regions(page)
        self.assertTrue(any(b[0]<140 and b[2]>310 and b[1]<450 and b[3]>590 for b in boxes),
                        f"Original dense engraved art was missed: {boxes}")
        self.assertTrue(len(boxes)<=3)
        for b in boxes:
            data=m.encode_scan_region(page,b)
            self.assertEqual(data[:4],b"RIFF")
            self.assertEqual(data[8:12],b"WEBP")
            self.assertEqual(len(hashlib.sha256(data).hexdigest()),64)

    def test_text_only_page_does_not_manufacture_an_illustration(self):
        page=np.full((1400,850),255,np.uint8)
        for y in range(50,1330,18):
            for x in (60,475):
                for j in range(22):
                    cv2.line(page,(x+j*14,y),(x+j*14+10,y),(60,),2)
        self.assertEqual(m.detect_original_engraving_regions(page),[])

    def test_existing_archive_is_verified_not_overwritten(self):
        with tempfile.TemporaryDirectory() as d:
            dest=Path(d)
            (dest/"scan-art-crops").mkdir()
            actual=b"RIFFabcdWEBPdata"
            name="scan-art-crops/test.webp"
            (dest/name).write_bytes(actual)
            doc={"schemaVersion":1,"sourceFileTitle":m.TITLE,
                 "publicationApproved":False,"chapterSceneMatchingComplete":False,
                 "humanVisualReviewComplete":False,
                 "images":[{"localPath":name,"webpSha256":m.sha(actual)}]}
            (dest/"manifest.json").write_text(json.dumps(doc))
            with mock.patch.object(m,"DEST",dest),mock.patch.object(m,"MANIFEST",dest/"manifest.json"):
                self.assertEqual(len(m.existing_doc()["images"]),1)
                (dest/name).write_bytes(b"corrupted")
                with self.assertRaisesRegex(ValueError,"altered"):
                    m.existing_doc()

if __name__=="__main__":
    unittest.main()
