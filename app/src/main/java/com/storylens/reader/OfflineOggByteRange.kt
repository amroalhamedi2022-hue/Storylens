package com.storylens.reader

/** Byte-range contract for offline Android WebView audio files.
 * HTMLMediaElement uses Range requests; answering with a regular 200 response
 * can result in short playback or unexpected media pipeline stalls.
 */
internal data class OfflineOggByteRange(val first: Long, val last: Long) {
    val length: Long get() = last - first + 1

    companion object {
        fun parse(header: String?, total: Long): OfflineOggByteRange {
            require(total > 0) { "Audio asset is empty" }
            if (header.isNullOrBlank()) return OfflineOggByteRange(0, total - 1)
            // Exactly one byte range; disallow multi-range, integer overflow,
            // and malformed headers instead of accidentally serving wrong bytes.
            val match = Regex("^bytes=(\\d*)-(\\d*)$", RegexOption.IGNORE_CASE)
                .matchEntire(header.trim()) ?: throw IllegalArgumentException("Invalid byte range")
            val (startRaw, endRaw) = match.destructured
            require(startRaw.isNotEmpty() || endRaw.isNotEmpty()) { "Empty byte range" }
            if (startRaw.isEmpty()) {
                val suffix = endRaw.toLongOrNull() ?: throw IllegalArgumentException("Invalid suffix")
                require(suffix > 0) { "Zero suffix" }
                return OfflineOggByteRange((total - suffix).coerceAtLeast(0), total - 1)
            }
            val start = startRaw.toLongOrNull() ?: throw IllegalArgumentException("Invalid start")
            val end = if (endRaw.isEmpty()) total - 1
                else endRaw.toLongOrNull() ?: throw IllegalArgumentException("Invalid end")
            require(start in 0 until total && end >= start) { "Unsatisfiable range" }
            return OfflineOggByteRange(start, end.coerceAtMost(total - 1))
        }
    }
}
