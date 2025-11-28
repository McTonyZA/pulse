package com.pulse.android.remote.models

import androidx.annotation.Keep
import kotlinx.serialization.Serializable

@Keep
@Serializable
public data class InteractionEvent(
    val name: String,
    val props: List<InteractionAttrsEntry>?,
    val isBlacklisted: Boolean,
)
