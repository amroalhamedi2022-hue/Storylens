#!/usr/bin/env python3
"""Original full-source corpus integrity: no invented bilingual releases or art."""
from __future__ import annotations
import hashlib
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/literature/staging"


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def checked_sha256(data, amount, digest):
    if len(data) != amount or hashlib.sha256(data).hexdigest() != digest:
        raise ValueError("Byte-exact primary source checksum mismatch")


def original_index(slug):
    folder = STAGING / slug
    manifest = load(folder / "manifest.json")
    source_index = load(folder / "chapter-image-map.json")
    items = manifest["narrativeParts"]
    assert manifest.get("originalSourceComplete") is True or manifest.get("completeOriginalSource") is True
    assert source_index["bookId"] == slug
    assert source_index["releaseApproved"] is False
    actual_chapters = []
    fronts = []
    for row in items:
        name = row["file"]
        assert name.endswith(".xhtml") and "/" not in name
        content = (folder / name).read_bytes()
        git_blob_sha = hashlib.sha1(b"blob " + str(len(content)).encode("ascii") + b"\0" + content).hexdigest()
        checked_sha = row["upstreamGitBlobSha"]
        if len(content) != row["bytes"] or git_blob_sha != checked_sha:
            raise ValueError(f"Changed original byte source: {slug} {name}")
        item = {
            "sourceFilePath": str((folder / name).relative_to(ROOT)),
            "sourceGitBlobSha": checked_sha,
            "sourceByteCount": row["bytes"],
        }
        if name.startswith("chapter-"):
            item["chapterOneBased"] = len(actual_chapters) + 1
            actual_chapters.append(item)
        else:
            fronts.append(item)
    assert len(actual_chapters) == source_index["chapterCount"] == len(source_index["chapters"])
    assert len(fronts) == len(source_index["nonChapterNarrativeUnits"])
    for expected, actual in zip(actual_chapters, source_index["chapters"]):
        for k, v in expected.items():
            if actual[k] != v:
                raise ValueError(f"Chapter order/source mismatch: {slug}")
        if actual["primaryImage"] is not None:
            raise ValueError(f"Source-only book falsely represented as illustrated: {slug}")
    for expected, actual in zip(fronts, source_index["nonChapterNarrativeUnits"]):
        for k, v in expected.items():
            if actual[k] != v:
                raise ValueError(f"Preface, letters or epilogue missing: {slug}")
    return len(actual_chapters), len(fronts)


class OriginalSourceAudit(unittest.TestCase):
    def test_dracula_frankenstein_complete_canonical_source_chapters(self):
        self.assertEqual(original_index("dracula"), (27, 2))
        self.assertEqual(original_index("frankenstein"), (24, 4))

    def test_woman_and_ten_burton_volumes_are_full_unchanged_originals_not_bilingual(self):
        root = STAGING / "user-requested-classics-20261105"
        total_words = 0
        for idx in range(0, 11):
            slug = "the-woman-in-white" if idx == 0 else f"arabian-nights-burton-v{idx:02d}"
            with self.subTest(slug=slug):
                meta = load(root / slug / "manifest.json")
                source = meta["source"]
                original = (root / slug / "original-edition.html").read_bytes()
                checked_sha256(original, source["bytes"], source["sha256"])
                self.assertTrue(source["originalFullEditionPreservedVerbatim"])
                self.assertTrue(source["completeGutenbergMarkers"])
                self.assertFalse(meta["acceptance"]["fullNaturalArabicTranslation"])
                self.assertFalse(meta["acceptance"]["appIntegrated"])
                self.assertEqual(len(meta["sourceImages"]), meta["historicalArtworkCandidates"])
                if idx:
                    self.assertEqual(meta["seriesVolume"], idx)
                    self.assertEqual(meta["seriesVolumeCount"], 10)
                    total_words += source["narrativeWords"]
        self.assertEqual(total_words, 1599851)

    def test_all_four_arabic_wikisource_parts_have_real_bytes_no_fake_alignment(self):
        root = STAGING / "arabian-nights-arabic-wikisource-20261105"
        for i in range(1, 5):
            with self.subTest(part=i):
                folder = root / f"part-{i:02d}"
                meta = load(folder / "manifest.json")
                self.assertEqual(meta["segment"], f"part-{i:02d}")
                self.assertEqual(meta["workId"], "alf-layla-wa-layla")
                checked_sha256((folder / "wikisource-original-page.html").read_bytes(), meta["originalPageBytes"], meta["originalPageSha256"])
                checked_sha256((folder / "arabic-transcription.txt").read_bytes(), meta["transcriptionBytes"], meta["transcriptionSha256"])
                self.assertFalse(meta["verifiedAsMatchingBurtonEnglishEdition"])
                self.assertFalse(meta["colouredHistoricalChapterArtworkIntegrated"])


if __name__ == "__main__":
    unittest.main()
