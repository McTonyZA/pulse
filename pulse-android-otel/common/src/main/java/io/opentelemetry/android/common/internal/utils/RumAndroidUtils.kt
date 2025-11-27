package io.opentelemetry.android.common.internal.utils

import android.os.Build

val Thread.threadIdCompat: Long
    get() = @Suppress("DEPRECATION") id