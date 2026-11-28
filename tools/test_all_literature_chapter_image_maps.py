#!/usr/bin/env python3
"""Offline adversarial tests for global original image provenance auditing."""
import hashlib,json,tempfile,unittest
from pathlib import Path
from tools.audit_all_literature_chapter_image_maps import audit

class AllBookSourceArtAuditTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        self.folder=self.root/"docs/literature/staging/book-one"
        self.folder.mkdir(parents=True)
        self.image=self.root/"image.webp"
        self.image.write_bytes(b"RIFFreal original art binary fixture")
        self.sha=hashlib.sha256(self.image.read_bytes()).hexdigest()
        self.art={"imagePath":"image.webp","sha256":self.sha,"sourceUrl":"https://commons.wikimedia.org/wiki/File:Original.jpg","sceneAnchor":"Actual passage and scene","editoriallyApproved":False}
        self.write_map(self.folder,[{"chapterOneBased":1,"primaryImage":self.art}])
    def write_map(self,folder,rows):
        folder.mkdir(parents=True,exist_ok=True)
        (folder/"chapter-image-map.json").write_text(json.dumps({"chapterCount":len(rows),"chapters":rows}))
    def test_one_real_image_is_pending_not_approved(self):
        d=audit(self.root)
        self.assertEqual(d["mapsAudited"],1)
        self.assertEqual(d["uniqueSourceHashedPrimaryArt"],1)
        self.assertEqual(d["pendingEditorialReview"],1)
    def test_cross_book_duplicate_binary_under_different_path_fails(self):
        (self.root/"copy.webp").write_bytes(self.image.read_bytes())
        other=self.root/"docs/literature/staging/book-two"
        self.write_map(other,[{"chapterOneBased":1,"primaryImage":{**self.art,"imagePath":"copy.webp"}}])
        with self.assertRaisesRegex(ValueError,"reused across books"):
            audit(self.root)
    def test_wrong_bytes_or_source_is_rejected(self):
        self.image.write_bytes(b"changed")
        with self.assertRaisesRegex(ValueError,"SHA mismatch"):
            audit(self.root)
    def test_path_escape_is_rejected(self):
        self.art["imagePath"]="../outside.webp"
        self.write_map(self.folder,[{"chapterOneBased":1,"primaryImage":self.art}])
        with self.assertRaisesRegex(ValueError,"Path traversal"):
            audit(self.root)
    def test_fake_rights_clearance_is_rejected(self):
        self.art["editoriallyApproved"]=True
        self.write_map(self.folder,[{"chapterOneBased":1,"primaryImage":self.art}])
        with self.assertRaisesRegex(ValueError,"falsely approved"):
            audit(self.root)
    def test_missing_chapter_is_rejected(self):
        self.write_map(self.folder,[{"chapterOneBased":2,"primaryImage":None}])
        with self.assertRaisesRegex(ValueError,"Missing/duplicated"):
            audit(self.root)

if __name__=="__main__": unittest.main()
