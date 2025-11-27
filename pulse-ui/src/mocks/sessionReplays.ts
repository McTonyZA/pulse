import type {
  SessionReplayResponse,
  SessionReplayData,
} from "../hooks/useGetSessionReplays/useGetSessionReplays.interface";

interface GenerateMockSessionReplaysParams {
  interactionName: string;
  startTime: string;
  endTime: string;
  page: number;
  pageSize: number;
  eventTypes?: (
    | "crash"
    | "anr"
    | "networkError"
    | "frozenFrame"
    | "nonFatal"
    | "completed"
  )[];
  device?: "all" | "ios" | "android";
}

export const generateMockSessionReplays = ({
  interactionName,
  startTime,
  endTime,
  page,
  pageSize,
  eventTypes = ["crash", "anr", "networkError", "frozenFrame", "nonFatal", "completed"],
  device = "all",
}: GenerateMockSessionReplaysParams): SessionReplayResponse => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const timeRange = end - start;

  const eventTypeOptions: (
    | "crash"
    | "anr"
    | "networkError"
    | "frozenFrame"
    | "nonFatal"
    | "completed"
  )[] = ["crash", "anr", "networkError", "frozenFrame", "nonFatal", "completed"];
  const deviceOptions = [
    "iPhone 14 Pro",
    "iPhone 13",
    "Samsung Galaxy S23",
    "Google Pixel 7",
    "OnePlus 11",
  ];
  const osVersions = [
    "iOS 17.0",
    "iOS 16.5",
    "Android 13",
    "Android 12",
    "Android 14",
  ];

  const totalSessions = 247;
  const allSessions: SessionReplayData[] = [];

  for (let i = 0; i < totalSessions; i++) {
    const sessionStart = new Date(start + Math.random() * timeRange);
    const eventType =
      eventTypeOptions[Math.floor(Math.random() * eventTypeOptions.length)];
    const deviceName =
      deviceOptions[Math.floor(Math.random() * deviceOptions.length)];
    const isIOS = deviceName.includes("iPhone");

    if (device !== "all") {
      const matchesDevice =
        (device === "ios" && isIOS) || (device === "android" && !isIOS);
      if (!matchesDevice && Math.random() > 0.3) {
        continue; // Skip this session if it doesn't match device filter
      }
    }

    allSessions.push({
      id: `session_${String(i + 1).padStart(6, "0")}`,
      user_id: `user_${String(Math.floor(Math.random() * 10000)).padStart(5, "0")}`,
      phone_number: "",
      device: deviceName,
      os_version: osVersions[Math.floor(Math.random() * osVersions.length)],
      start_time: sessionStart.toISOString(),
      // Backend sends duration in milliseconds (max 200 seconds = 200000 ms)
      // Frontend will convert to seconds with 2 decimal places
      duration_ms: Math.floor(Math.random() * 200000) + 1000, // 1000ms to 200000ms (0.001s to 200s)
      event_count: 0,
      screen_count: 0,
      event_type: eventType,
      event_names: undefined, // Optional field
      interaction_name: interactionName,
      screens_visited: "",
      trace_id: `trace_${String(i + 1).padStart(6, "0")}`,
    });
  }

  const filteredSessions = allSessions.filter((session) =>
    eventTypes.includes(session.event_type),
  );

  const sortedSessions = filteredSessions.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );

  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSessions = sortedSessions.slice(startIndex, endIndex);

  const crashedCount = filteredSessions.filter((s) =>
    ["crash", "anr", "frozenFrame", "nonFatal"].includes(s.event_type),
  ).length;
  const completedCount = filteredSessions.filter(
    (s) => s.event_type === "networkError",
  ).length;

  return {
    data: paginatedSessions,
    pagination: {
      page,
      pageSize,
      totalItems: filteredSessions.length,
      totalPages: Math.ceil(filteredSessions.length / pageSize),
      hasNextPage: endIndex < filteredSessions.length,
      hasPreviousPage: page > 0,
    },
    stats: {
      total: filteredSessions.length,
      completed: completedCount,
      crashed: crashedCount,
      avgDuration:
        filteredSessions.reduce((sum, s) => sum + s.duration_ms, 0) /
        filteredSessions.length,
    },
  };
};
