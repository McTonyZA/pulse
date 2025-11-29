# Pulse React Native SDK

<div align="center">

**Production-grade observability for React Native applications**

*Real-time monitoring, error tracking, and performance insights powered by OpenTelemetry*

[![npm version](https://img.shields.io/npm/v/@horizoneng/pulse-react-native.svg)](https://www.npmjs.com/package/@horizoneng/pulse-react-native)
[![npm downloads](https://img.shields.io/npm/dm/@horizoneng/pulse-react-native.svg)](https://www.npmjs.com/package/@horizoneng/pulse-react-native)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@horizoneng/pulse-react-native)](https://bundlephobia.com/package/@horizoneng/pulse-react-native)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-%3E%3D%200.70-blue.svg)](https://reactnative.dev/)

**[📖 View Full Documentation →](https://pulse.horizonos.in/docs/sdk/react-native/overview)**

</div>

---

## 📦 Installation

```bash
npm install @horizoneng/pulse-react-native
# or
yarn add @horizoneng/pulse-react-native
```

## 🚀 Quick Start

### 1. Android Native Setup

Initialize the Pulse Android SDK in your `MainApplication.kt`:

```kotlin
import android.app.Application
import com.pulse.android.sdk.PulseSDK

class MainApplication : Application() {
  override fun onCreate() {
    super.onCreate()
    
    PulseSDK.INSTANCE.initialize(
      application = this,
      endpointBaseUrl = "<server-url>"
    )
  }
}
```

> **Important:** This step is mandatory. Without native SDK initialization, no telemetry will be sent.

### 2. React Native Initialization

Enable auto-instrumentation in your app entry point:

```typescript
import { Pulse } from '@horizoneng/pulse-react-native';

Pulse.start();

function App() {
  // Your app code
}
```

**What gets automatically tracked:**
- ✅ JavaScript crashes and unhandled exceptions
- ✅ HTTP requests via fetch and XMLHttpRequest

---

## 📚 Documentation

Complete documentation is available at **[https://pulse.horizonos.in/docs/sdk/react-native](https://pulse.horizonos.in/docs/sdk/react-native/overview)**.

### Getting Started
- [Overview](https://pulse.horizonos.in/docs/sdk/react-native/overview) - Introduction and key features
- [Quick Start](https://pulse.horizonos.in/docs/sdk/react-native/quick-start) - Installation and setup guide

### Instrumentation
- [Network Instrumentation](https://pulse.horizonos.in/docs/sdk/react-native/instrumentation/network-instrumentation) - Auto-instrument HTTP requests
- [Error Instrumentation](https://pulse.horizonos.in/docs/sdk/react-native/instrumentation/error-instrumentation) - Error tracking and reporting
- [Navigation Instrumentation](https://pulse.horizonos.in/docs/sdk/react-native/instrumentation/navigation-instrumentation) - React Navigation integration
- [Custom Instrumentation](https://pulse.horizonos.in/docs/sdk/react-native/instrumentation/custom-instrumentation) - Custom spans and performance tracing
- [Custom Events](https://pulse.horizonos.in/docs/sdk/react-native/instrumentation/custom-events) - Track business events
- [Error Boundaries](https://pulse.horizonos.in/docs/sdk/react-native/instrumentation/error-boundaries) - React Error Boundary integration

### Configuration
- [Global Attributes](https://pulse.horizonos.in/docs/sdk/react-native/global-attributes) - Set attributes for all telemetry
- [User Identification](https://pulse.horizonos.in/docs/sdk/react-native/user-identification) - Associate telemetry with users
- [CodePush Tracking](https://pulse.horizonos.in/docs/sdk/react-native/codepush-tracking) - Track OTA deployments

### Reference
- [API Reference](https://pulse.horizonos.in/docs/sdk/react-native/api-reference) - Complete API documentation

---

## ✨ Key Features

- **🚨 Error Monitoring** - Capture JavaScript crashes and exceptions with full stack traces
- **⚡ Performance Monitoring** - Distributed tracing spans for synchronous and asynchronous operations
- **🌐 Network Monitoring** - Auto-instrument HTTP requests (fetch and XMLHttpRequest) with zero code changes
- **🧭 Navigation Tracking** - Automatic screen transition monitoring with React Navigation integration
- **📊 Event Tracking** - Log custom business events and user actions with structured metadata
- **🔌 OpenTelemetry Native** - Built on OpenTelemetry Android SDK. Automatically captures ANR, frozen frames, lifecycle events, and more
- **🏗️ Architecture Support** - Supports both React Native Old Architecture and New Architecture out of the box

---

## 🔗 Related Documentation

- [Android SDK](../pulse-android-otel/README.md) - Native Android SDK documentation
- [Main Documentation](https://pulse.horizonos.in/docs/intro) - Complete Pulse platform documentation

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](../LICENSE) file for details.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://pulse.horizonos.in/docs/contribution) for detailed information.

---

<div align="center">

**Built with ❤️ by the Pulse Team**

**[📖 Documentation](https://pulse.horizonos.in/docs/sdk/react-native/overview)** • [npm Package](https://www.npmjs.com/package/@horizoneng/pulse-react-native) • [License](../LICENSE)

</div>
