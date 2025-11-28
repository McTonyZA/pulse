package com.pulse.android.remote.models

import kotlinx.serialization.Serializable

/**
 * Wrapper for API responses that follow the pattern:
 * {
 *   "data": [...],
 *   "error": null
 * }
 */
@Serializable
public data class ApiResponse<T>(
    val data: T,
    val error: String? = null,
)
