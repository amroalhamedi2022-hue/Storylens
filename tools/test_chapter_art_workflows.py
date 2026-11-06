#!/usr/bin/env python3
"""Prevent repeat of historical-art upload, report-rebase and queue cancellation bugs.

No image/metadata changes or network calls. The actual SHA-256 auditor is
tools/report_chapter_art_progress.py; this test checks job ownership and
GITHUB_TOKEN dispatch semantics before each PR can be merged.
"""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
WF = ROOT / ".github" / "workflows"
SOURCE = (
    "verne-commons-period-art-intake.yml",
    "war-worlds-original-1906-art.yml",
    "archived-chapter-art-maps.yml",
    "monte-cristo-chapter-art.yml",
)
REPORT = "chapter-art-progress.yml"


def read(name: str) -> str:
    return (WF / name).read_text(encoding="utf-8")


class HistoricalArtRaceRegression(unittest.TestCase):
    def test_isolated_workflow_queues_do_not_cancel_unrelated_jobs(self) -> None:
        names = (*SOURCE, REPORT)
        groups = []
        for name in names:
            text = read(name)
            found = re.search(r"^  group: (.+)$", text, re.MULTILINE)
            self.assertIsNotNone(found, name)
            groups.append(found.group(1))
            self.assertIn("cancel-in-progress: false", text)
        self.assertEqual(len(set(groups)), len(groups),
                         "Shared concurrency groups cancel intermediate pending jobs")

    def test_archival_jobs_commit_real_sources_only(self) -> None:
        for name in SOURCE[:2]:
            with self.subTest(name=name):
                text = read(name)
                self.assertIn("git add -f docs/literature/staging/", text)
                self.assertIn("git pull --rebase origin", text)
                self.assertNotIn("python tools/report_chapter_art_progress.py --write", text)
                self.assertNotIn("git add docs/literature/CHAPTER_ART_PROGRESS", text)
                self.assertIn("fetch-depth: 0", text)
                self.assertIn("if [ \"$changed\" -eq 1 ]; then", text)

    def test_all_source_writers_dispatch_after_successful_push(self) -> None:
        for name in SOURCE:
            with self.subTest(name=name):
                text = read(name)
                self.assertIn("  actions: write", text)
                self.assertIn('gh workflow run chapter-art-progress.yml --ref main', text)
                self.assertIn("GH_TOKEN: ${{ github.token }}", text)
                self.assertIn('if [ "$GITHUB_REF_NAME" = "main" ]; then', text)
                self.assertLess(text.index("git push origin"),
                                text.index("gh workflow run chapter-art-progress.yml"))
                for line in text.splitlines():
                    if "git commit -m" in line:
                        self.assertNotIn("[skip ci]", line)

    def test_mapping_jobs_never_rewrite_progress_while_staging_maps(self) -> None:
        for name in SOURCE[2:]:
            text = read(name)
            self.assertNotIn("python tools/report_chapter_art_progress.py --write", text)
            self.assertNotIn("git add docs/literature/CHAPTER_ART_PROGRESS", text)
            self.assertIn(" --verify", text)
        self.assertIn("illustrated-five-20261105/*/chapter-image-map.json",
                      read(SOURCE[2]))
        self.assertIn("the-count-of-monte-cristo/chapter-image-map.json",
                      read(SOURCE[3]))

    def test_one_reporter_reaudits_current_main_after_push_races(self) -> None:
        text = read(REPORT)
        self.assertIn("      - 'docs/literature/staging/**'", text)
        self.assertIn("  workflow_dispatch:", text)
        self.assertIn("git fetch origin main", text)
        self.assertIn("git reset --hard origin/main", text)
        self.assertEqual(text.count("python tools/report_chapter_art_progress.py --write"), 1)
        self.assertLess(text.index("git reset --hard origin/main"),
                        text.index("python tools/report_chapter_art_progress.py --write"))
        self.assertIn("git push origin HEAD:main", text)
        self.assertIn("for attempt in 1 2 3 4 5; do", text)
        self.assertIn("fetch-depth: 0", text)

    def test_human_editorial_release_is_never_automatically_granted(self) -> None:
        for name in (*SOURCE, REPORT):
            with self.subTest(name=name):
                text = read(name)
                self.assertNotIn("editoriallyApproved: true", text)
                self.assertNotIn("APPROVED_FOR_TARGET_TERRITORIES", text)


if __name__ == "__main__":
    unittest.main()
