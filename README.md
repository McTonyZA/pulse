# Pulse

<div align="center">

**A comprehensive, full-stack observability platform for real-time monitoring, analytics, and alerting**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.4-blue.svg)](https://www.typescriptlang.org/)
[![Android API](https://img.shields.io/badge/Android_API-21+-green.svg)](https://developer.android.com/)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Documentation](#-documentation)
- [Technology Stack](#-technology-stack)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

Pulse is a modern observability platform that provides comprehensive monitoring capabilities for web, mobile, and backend applications. Built on OpenTelemetry standards, it offers real-time insights into application performance, user behavior, and system health.

### Key Capabilities

- **📊 Real-time Monitoring**: Track user interactions, performance metrics, and system health
- **🔍 Distributed Tracing**: Follow requests across microservices and distributed systems
- **📱 Mobile Observability**: Native SDKs for Android and React Native applications
- **🚨 Alerting**: Flexible alert management with multiple notification channels
- **📈 Analytics**: Advanced analytics powered by ClickHouse for high-performance queries
- **🔌 OpenTelemetry Native**: Built on OpenTelemetry standards for vendor-neutral observability

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│  Web (React) │   Android    │ React Native │  Backend Services │
└──────┬───────┴──────┬───────┴──────┬───────┴─────────┬─────────┘
       │              │              │                 │
       └──────────────┴──────────────┴─────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   OTLP (4317/4318)     │
              │   OpenTelemetry        │
              │   Collector            │
              └────────────┬────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │   ClickHouse     │      │   Pulse Server   │
    │   (Time-series   │◄─────┤   (Java/Vert.x)  │
    │    Analytics)    │      │                  │
    └──────────────────┘      └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │   MySQL          │
                              │   (Metadata)     │
                              └──────────────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │   Pulse UI       │
                              │   (React)        │
                              └──────────────────┘
```
## ✨ Features

### Backend Server (Java/Vert.x)

- **Reactive Architecture**: Built on Vert.x for high-performance async processing
- **User Authentication**: Google OAuth integration with JWT tokens
- **Critical Interactions**: Track and monitor key user interactions
- **Alert Management**: Flexible alerting with multiple channels (Email, Slack, Webhook)
- **Job Scheduling**: Background job processing and monitoring
- **API Gateway**: RESTful APIs for all platform capabilities
- **Multi-Database**: MySQL for metadata, ClickHouse for time-series data

### Frontend UI (React/TypeScript)

- **Modern UI**: Built with React 18, TypeScript, and Mantine UI
- **Real-time Dashboards**: Live monitoring of metrics and alerts
- **Interactive Analytics**: Advanced querying and visualization
- **Alert Configuration**: Easy-to-use alert creation and management
- **User Management**: Role-based access control
- **Responsive Design**: Works seamlessly on desktop and mobile

### Data Ingestion (OpenTelemetry)

- **OTLP Support**: Native support for OpenTelemetry Protocol (gRPC/HTTP)
- **Multi-Signal**: Handles traces, logs, and metrics
- **High Throughput**: Batch processing for efficient ingestion
- **Data Transformation**: Processors for enrichment and filtering
- **Storage Optimization**: Partitioned tables with compression

### Android SDK

- **Auto-Instrumentation**: Automatic tracking of:
  - Activity and Fragment lifecycles
  - Network requests (OkHttp, HttpURLConnection)
  - User interactions (clicks, gestures)
  - Application crashes and ANRs
  - Slow rendering detection
- **Manual Instrumentation**: OpenTelemetry API for custom events
- **Offline Support**: Disk buffering for offline scenarios
- **Low Overhead**: Optimized for minimal performance impact

### React Native SDK

- **Cross-Platform**: Single SDK for iOS and Android
- **Native Bridge**: Native modules for optimal performance
- **JavaScript API**: Easy-to-use JavaScript/TypeScript API
- **Auto-Instrumentation**: Automatic tracking of navigation, network, errors
- **Custom Events**: Rich API for custom instrumentation


## 📚 Documentation

### Run Locally

- **[Setup Guide](deploy/README.md)** - Step-by-step setup instructions

### Backend Documentation

- **[Server](backend/server/README.md)** - Backend architecture and development

### Frontend Documentation

- **[UI](pulse-ui/README.md)** - Frontend development guide

### Mobile SDK Documentation

- **[Android SDK](pulse-android-otel/README.md)** - Android OpenTelemetry SDK
- **[Android Demo App](pulse-android-otel/demo-app/README.md)** - Example Android integration
- **[React Native SDK](pulse-react-native-otel/README.md)** - React Native OpenTelemetry SDK
- **[Integration Guide](backend/ingestion/INTEGRATION_GUIDE.md)** - OpenTelemetry integration

### Instrumentation Documentation

- [Activity Instrumentation](pulse-android-otel/instrumentation/activity/README.md)
- [Fragment Instrumentation](pulse-android-otel/instrumentation/fragment/README.md)
- [Crash Reporting](pulse-android-otel/instrumentation/crash/README.md)
- [ANR Detection](pulse-android-otel/instrumentation/anr/README.md)
- [Network Monitoring](pulse-android-otel/instrumentation/network/README.md)
- [OkHttp Instrumentation](pulse-android-otel/instrumentation/okhttp3/README.md)


## 🛠️ Technology Stack

### Backend

- **Runtime**: Java 17
- **Framework**: Vert.x 4.5.10 (Reactive)
- **Build Tool**: Maven
- **Databases**:
  - MySQL 8.0 (Metadata storage)
  - ClickHouse (Time-series analytics)
- **Authentication**: Google OAuth 2.0, JWT
- **Metrics**: Dropwizard Metrics
- **Testing**: JUnit 5, Mockito, AssertJ

### Frontend

- **Framework**: React 18.3
- **Language**: TypeScript 4.4
- **UI Library**: Mantine UI 7.11
- **Build Tool**: Webpack 5
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router 6
- **Charts**: ECharts
- **Testing**: Jest, React Testing Library

### Data Ingestion

- **Collector**: OpenTelemetry Collector
- **Protocol**: OTLP (gRPC/HTTP)
- **Storage**: ClickHouse
- **Formats**: JSON, Protobuf

### Android SDK

- **Language**: Kotlin
- **Build Tool**: Gradle
- **Min API**: Android API 21+
- **Base SDK**: OpenTelemetry Java
- **Testing**: JUnit 4/5, Robolectric

### React Native SDK

- **Language**: TypeScript
- **iOS**: Objective-C++
- **Android**: Kotlin
- **Build**: React Native Builder Bob

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Your Changes**
4. **Write Tests**: Ensure your changes are tested
5. **Format Code**: 
   - Frontend: `npm run format`
   - Backend: Follow Checkstyle rules
   - Android: `./gradlew spotlessApply`
6. **Commit**: Use conventional commits
7. **Push**: `git push origin feature/amazing-feature`
8. **Create Pull Request**

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: Checkstyle + Google Java Format
- **Android**: Spotless + ktlint
- **Commits**: Conventional Commits format

### Pull Request Guidelines

- Clear description of changes
- Link related issues
- Include tests
- Update documentation
- Ensure CI passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues, questions, or contributions:
1. **Documentation**: Check the [Documentation](#-documentation) section
2. **Issues**: Open a GitHub issue
3. **Discussions**: Use GitHub Discussions


---

<div align="center">

**Built with ❤️ by the Pulse Team**

• [Getting Started](#-getting-started) • [Contributing](#-contributing) • [License](#-license)

</div>

