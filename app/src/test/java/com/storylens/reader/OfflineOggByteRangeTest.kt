package com.storylens.reader

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class OfflineOggByteRangeTest {
    @Test fun supportsWholeAndOpenEndedRequests() {
        assertEquals(OfflineOggByteRange(0,999), OfflineOggByteRange.parse(null,1000))
        assertEquals(OfflineOggByteRange(0,999), OfflineOggByteRange.parse("bytes=0-",1000))
        assertEquals(OfflineOggByteRange(250,999), OfflineOggByteRange.parse("bytes=250-",1000))
        assertEquals(OfflineOggByteRange(0,99), OfflineOggByteRange.parse("bytes=0-99",1000))
        assertEquals(OfflineOggByteRange(900,999), OfflineOggByteRange.parse("bytes=-100",1000))
        assertEquals(OfflineOggByteRange(0,999), OfflineOggByteRange.parse("bytes=-2500",1000))
        assertEquals(OfflineOggByteRange(900,999).length,100L)
    }

    @Test fun capsExcessiveEndAndRejectsHostileRanges() {
        assertEquals(OfflineOggByteRange(500,999),OfflineOggByteRange.parse("bytes=500-999999",1000))
        for (value in arrayOf("bytes=1000-", "bytes=500-100", "bytes=-0",
                             "bytes=-", "bytes=0-1,3-4", "bytes=abc-",
                             "bytes=9999999999999999999999999-")) {
            assertThrows(value, IllegalArgumentException::class.java) {
                OfflineOggByteRange.parse(value,1000)
            }
        }
        assertThrows(IllegalArgumentException::class.java) { OfflineOggByteRange.parse(null,0) }
    }
}
