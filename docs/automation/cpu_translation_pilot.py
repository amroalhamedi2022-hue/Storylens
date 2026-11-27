#!/usr/bin/env python3
"""Free local CPU translation baseline; never overwrites literary content."""
import argparse
import hashlib
import json
import pathlib
import re
import subprocess
import time
import unittest

MODEL = "Helsinki-NLP/opus-mt-en-ar"
REVISION = "03087980e8ce753d64b3248ed0a912444545b840"
ROOT = pathlib.Path(__file__).resolve().parents[2]

def sha(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def validate_rows(data, chapter):
    if data.get("chapterOneBased") != chapter or data.get("originalLanguage") != "en":
        raise ValueError("Unexpected source")
    rows = data["paragraphs"]
    if not rows or any(row.get("index") != i or not isinstance(row.get("en"), str)
                       or not row["en"].strip() for i, row in enumerate(rows)):
        raise ValueError("Invalid paragraph alignment")
    return rows

def run(chapter, limit, output):
    import torch
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    torch.set_num_threads(2)
    source = json.loads(subprocess.check_output(
        ["node", "tools/export_verne_chapter.cjs", str(chapter)],
        cwd=ROOT, text=True, timeout=60))
    rows = validate_rows(source, chapter)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False).eval()
    records = []
    start = time.monotonic()
    for row in rows[:limit]:
        inputs = tokenizer(">>ara<< " + row["en"], return_tensors="pt", truncation=False)
        if inputs["input_ids"].shape[1] > 480:
            records.append({"index": row["index"], "sourceSha256": sha(row["en"]),
                            "status": "SKIPPED_LONG_INPUT_NO_TRUNCATION"})
            continue
        with torch.inference_mode():
            generated = model.generate(**inputs, max_new_tokens=500, num_beams=4,
                                       return_dict_in_generate=True)
        seq = generated.sequences[0]
        text = tokenizer.decode(seq, skip_special_tokens=True).strip()
        if len(seq) >= 501 or not re.search(r"[\u0600-\u06ff]", text):
            raise RuntimeError("Output may be truncated or is not Arabic")
        records.append({"index": row["index"], "sourceSha256": sha(row["en"]),
                        "sourceEnglish": row["en"], "existingArabicDraft": row["existingArabicDraft"],
                        "cpuArabicCandidate": text, "status": "UNAPPROVED_MACHINE_BASELINE"})
        print("Translated source paragraph", row["index"], flush=True)
    count = sum(r["status"] == "UNAPPROVED_MACHINE_BASELINE" for r in records)
    if count == 0:
        raise RuntimeError("No usable pilot translation")
    result = {"status": "REVIEW_ONLY_NOT_PUBLICATION_APPROVED", "model": MODEL,
              "revision": REVISION, "chapter": chapter, "sourceHashes": source["sourceFileShas256"],
              "totalParagraphs": len(rows), "translated": count, "seconds": round(time.monotonic()-start, 2),
              "records": records}
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    print(f"CPU candidate translations: {count}; approved translations: 0")

class Tests(unittest.TestCase):
    def test_alignment(self):
        data = {"chapterOneBased": 1, "originalLanguage": "en",
                "paragraphs": [{"index": 0, "en": "Hello."}]}
        self.assertEqual(len(validate_rows(data, 1)), 1)
        data["paragraphs"][0]["index"] = 2
        with self.assertRaises(ValueError):
            validate_rows(data, 1)
    def test_hash(self):
        self.assertEqual(sha("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--chapter", type=int, choices=range(1,38), default=1)
    parser.add_argument("--limit", type=int, choices=range(1,17), default=8)
    parser.add_argument("--output", type=pathlib.Path, default=pathlib.Path("cpu-translation-evidence/pilot.json"))
    args = parser.parse_args()
    if args.self_test:
        unittest.main(argv=["self-test"])
    else:
        run(args.chapter, args.limit, args.output)
