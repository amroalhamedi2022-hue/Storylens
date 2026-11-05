#!/usr/bin/env python3
"""Independent second batch: never recategorise earlier five as new content.
Use the proven original-HTML-and-art acquisition, with separate staging.
Missing illustrated editions fail closed; no false publication status.
"""
import argparse
from pathlib import Path
import intake_five_complete_illustrated_books as intake

intake.OUTPUT = intake.ROOT / "docs/literature/staging/illustrated-second-five-20261105"
intake.BOOKS = {
    "around-the-world-in-eighty-days": dict(gutenbergId=103, title="Around the World in Eighty Days", author="Jules Verne", language="en", year=1873, genre="adventure", illustrator="SOURCE EDITION TO BE VERIFIED"),
    "the-moonstone": dict(gutenbergId=155, title="The Moonstone", author="Wilkie Collins", language="en", year=1868, genre="detective mystery", illustrator="SOURCE EDITION TO BE VERIFIED"),
    "the-war-of-the-worlds": dict(gutenbergId=36, title="The War of the Worlds", author="H. G. Wells", language="en", year=1898, genre="science fiction", illustrator="SOURCE EDITION TO BE VERIFIED"),
    "tom-sawyer": dict(gutenbergId=74, title="The Adventures of Tom Sawyer", author="Mark Twain", language="en", year=1876, genre="classic adventure", illustrator="SOURCE EDITION TO BE VERIFIED"),
    "huckleberry-finn": dict(gutenbergId=76, title="Adventures of Huckleberry Finn", author="Mark Twain", language="en", year=1884, genre="social adventure", illustrator="SOURCE EDITION TO BE VERIFIED"),
}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--book", required=True, choices=intake.BOOKS)
    args = parser.parse_args()
    intake.acquire(args.book)
    intake.verify(intake.OUTPUT / args.book)
