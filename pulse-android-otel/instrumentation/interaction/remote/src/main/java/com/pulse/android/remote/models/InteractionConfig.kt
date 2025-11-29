package com.pulse.android.remote.models

import androidx.annotation.Keep
import com.pulse.android.remote.BuildConfig
import kotlinx.serialization.Serializable

@Keep
@Serializable
public class InteractionConfig internal constructor(
    public val id: Int,
    public val name: String,
    public val events: List<InteractionEvent>,
    public val globalBlacklistedEvents: List<InteractionEvent> = emptyList(),
    public val uptimeLowerLimitInMs: Long,
    public val uptimeMidLimitInMs: Long,
    public val uptimeUpperLimitInMs: Long,
    public val thresholdInMs: Long,
) {
    public val eventsSize: Int = events.size

    public val firstEvent: InteractionEvent = events.first()

    init {
        if (BuildConfig.DEBUG) {
            assert(events.count { !it.isBlacklisted } > 0) { "event sequence doesn't have any non blacklisted event" }
            assert(!events.first().isBlacklisted) { "event first event is blacklisted" }
            assert(!events.last().isBlacklisted) { "event last event is blacklisted" }
        }
    }
}
