#!/usr/bin/env python3
"""Fast deterministic isolated converter tests; never requires network access."""
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
import build_freedict as fd
fixture = """<?xml version='1.0' encoding='UTF-8'?>
<TEI xmlns="http://www.tei-c.org/ns/1.0"><text><body>
<entry><form><orth>dog</orth></form><sense><cit type="trans"><quote>كلب</quote></cit></sense></entry>
<entry><form><orth>run</orth></form><sense><cit type="trans"><quote>يركض</quote></cit><cit type="trans"><quote>يدير</quote></cit></sense></entry>
<entry><form><orth>bad123</orth></form><sense><cit type="trans"><quote>لا تضف</quote></cit></sense></entry>
<entry><form><orth>image</orth></form><sense><cit type="example"><quote>صورة في مثال</quote></cit></sense></entry>
</body></text></TEI>"""
result = fd.extract_dictionary(fixture.encode())
assert result["dog"] == ["كلب"],result
assert result["run"] == ["يركض","يدير"],result
assert "bad123" not in result,result
assert "image" in result,result  # fallback only when trans missing
script = fd.render_js(result)
assert "FreeDictEnglishArabic" in script
assert "GPL-2.0-or-later" in script
assert fd.EXPECTED_SHA512 and len(fd.EXPECTED_SHA512)==128
print("PASS: TEI namespace, Arabic quote extraction, polysemy, input filtering, provenance and JS packaging")
