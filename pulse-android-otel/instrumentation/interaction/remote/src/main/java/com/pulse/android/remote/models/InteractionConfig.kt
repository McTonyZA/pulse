package com.pulse.android.remote.models

import androidx.annotation.Keep
import com.pulse.android.remote.BuildConfig
import kotlinx.serialization.Serializable

@Keep
@Serializable
public data class InteractionConfig(
    val id: Int,
    val name: String,
    val events: List<InteractionEvent>,
    val globalBlacklistedEvents: List<InteractionEvent> = emptyList(),
    val uptimeLowerLimitInMs: Long,
    val uptimeMidLimitInMs: Long,
    val uptimeUpperLimitInMs: Long,
    val thresholdInMs: Long,
) {
    val eventsSize: Int = events.size

    val firstEvent: InteractionEvent = events.first()

    init {
        if (BuildConfig.DEBUG) {
            assert(events.count { !it.isBlacklisted } > 0) { "event sequence doesn't have any non blacklisted event" }
            assert(!events.first().isBlacklisted) { "event first event is blacklisted" }
            assert(!events.last().isBlacklisted) { "event last event is blacklisted" }
        }
    }
}
