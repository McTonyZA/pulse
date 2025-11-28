package com.pulse.android.remote.models

import androidx.annotation.Keep
import kotlinx.serialization.Serializable

@Keep
@Serializable
public data class InteractionAttrsEntry(
    val name: String,
    val value: String,
    val operator: String,
)
