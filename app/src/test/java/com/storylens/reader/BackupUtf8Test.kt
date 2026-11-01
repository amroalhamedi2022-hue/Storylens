package com.storylens.reader

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test
import java.nio.charset.CharacterCodingException

class BackupUtf8Test {
    @Test fun validMultilingualBackupRoundTripsWithoutChangingWords() {
        val original = """{"format":"storylens.backup","words":["مرحبا","漢字","😀"]}"""
        assertEquals(original, BackupUtf8.decode(original.toByteArray(Charsets.UTF_8)))
    }

    @Test fun optionalUtf8BomIsRemovedBeforeJsonParsing() {
        val content = """{"format":"storylens.backup","version":1}"""
        val bom = byteArrayOf(0xEF.toByte(), 0xBB.toByte(), 0xBF.toByte())
        assertEquals(content, BackupUtf8.decode(bom + content.toByteArray(Charsets.UTF_8)))
    }

    @Test fun malformedTruncatedOverlongAndSurrogateBytesAreRejected() {
        val invalid = listOf(
            byteArrayOf(0xC3.toByte(), 0x28),
            byteArrayOf(0xF0.toByte(), 0x9F.toByte(), 0x98.toByte()),
            byteArrayOf(0xC0.toByte(), 0xAF.toByte()),
            byteArrayOf(0xED.toByte(), 0xA0.toByte(), 0x80.toByte())
        )
        for (bytes in invalid) {
            assertThrows(CharacterCodingException::class.java) { BackupUtf8.decode(bytes) }
        }
    }
}
