export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};

export const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatTimeMs = (ms: number): string => {
  if (ms >= 1000) {
    const seconds = ms / 1000;
    // Show as integer if whole number, otherwise show 1 decimal place
    return seconds % 1 === 0 ? `${seconds}s` : `${seconds.toFixed(1)}s`;
  }
  return `${ms}ms`;
};

export const calculateEventPosition = (
  timestamp: number,
  maxTime: number,
): number => {
  return (timestamp / maxTime) * 100;
};

export const calculateEventWidth = (
  duration: number | undefined,
  maxTime: number,
): number => {
  if (!duration) return 0;
  return (duration / maxTime) * 100;
};

export const calculateMaxTimeFromSpans = (
  spans: Array<{ timestamp: number; duration?: number; children?: Array<any> }>,
): number => {
  let maxTime = 0;

  const processSpan = (span: {
    timestamp: number;
    duration?: number;
    children?: Array<any>;
  }) => {
    const spanEndTime = span.timestamp + (span.duration || 0);
    maxTime = Math.max(maxTime, spanEndTime);

    if (span.children && span.children.length > 0) {
      span.children.forEach(processSpan);
    }
  };

  spans.forEach(processSpan);

  // Ensure minimum time of at least 1000ms (1 second) for proper display
  return Math.max(maxTime, 1000);
};
