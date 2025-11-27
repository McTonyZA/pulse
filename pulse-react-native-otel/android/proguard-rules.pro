# Pulse React Native OpenTelemetry - Consumer ProGuard Rules
# These rules are automatically applied to consuming applications

# ===== OpenTelemetry ProGuard Rules =====
# OpenTelemetry is heavily reflection-based and needs these classes preserved

# Keep all OpenTelemetry classes
-keep class io.opentelemetry.** { *; }
-dontwarn io.opentelemetry.**

# Keep OpenTelemetry API
-keep class io.opentelemetry.api.** { *; }
-keep interface io.opentelemetry.api.** { *; }

# Keep OpenTelemetry SDK
-keep class io.opentelemetry.sdk.** { *; }

# Keep OpenTelemetry Context (critical for span propagation)
-keep class io.opentelemetry.context.** { *; }
-keep class io.opentelemetry.context.Context { *; }
-keep class io.opentelemetry.context.Scope { *; }
-keep class io.opentelemetry.context.ImplicitContextKeyed { *; }
-keep interface io.opentelemetry.context.** { *; }

# ===== Missing Compile-Time Annotations =====
# These annotations are compile-time only and not needed at runtime
# R8/ProGuard should ignore them when missing

-dontwarn com.google.errorprone.annotations.**
-dontwarn javax.annotation.**
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn edu.umd.cs.findbugs.annotations.**
-dontwarn org.checkerframework.checker.**
-dontwarn com.google.j2objc.annotations.**

# Specifically ignore the MustBeClosed annotation that R8 complains about
-dontwarn com.google.errorprone.annotations.MustBeClosed
-dontwarn com.google.errorprone.annotations.CanIgnoreReturnValue
-dontwarn com.google.errorprone.annotations.CheckReturnValue
-dontwarn com.google.errorprone.annotations.concurrent.**

# ===== Missing Java SE Classes (not available in Android) =====
# java.beans package is part of Java SE but not Android
# These are referenced by libraries like SnakeYAML and Jackson but not used at runtime

-dontwarn java.beans.**
-dontwarn java.beans.BeanInfo
-dontwarn java.beans.ConstructorProperties
-dontwarn java.beans.FeatureDescriptor
-dontwarn java.beans.IntrospectionException
-dontwarn java.beans.Introspector
-dontwarn java.beans.PropertyDescriptor
-dontwarn java.beans.Transient

# SnakeYAML uses java.beans for reflection but has fallbacks
-dontwarn org.yaml.snakeyaml.introspector.MethodProperty

# Jackson uses java.beans for annotations but has fallbacks
-dontwarn com.fasterxml.jackson.databind.ext.Java7SupportImpl

# ===== Pulse React Native OTEL =====
# Keep our library classes
-keep class com.pulsereactnativeotel.** { *; }
-keepclassmembers class com.pulsereactnativeotel.** { *; }

# Keep Kotlin metadata
-keep class kotlin.Metadata { *; }

# ===== General Rules =====
# Keep attributes needed for proper functioning
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keepattributes Exceptions
-keepattributes SourceFile
-keepattributes LineNumberTable

# Keep generic signatures for proper type checking
-keepattributes Signature

# ===== React Native Specific =====
# Keep native method names
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep React Native annotations
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *

-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

