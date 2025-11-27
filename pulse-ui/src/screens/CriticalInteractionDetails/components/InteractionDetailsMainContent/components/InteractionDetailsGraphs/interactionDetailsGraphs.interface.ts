export type InteractionDetailsGraphsData = {
  timestamp: number;
  apdex: number;
  errorRate: number;
  userAvg: number;
  userGood: number;
  userExcellent: number;
  userPoor: number;
};

export type InteractionDetailsMetricsData = {
  apdex: number;
  errorRate: number;
  p50: number;
  p95: number;
  frozenFrameRate: number;
  crashRate: number;
  anrRate: number;
  networkErrorRate: number;
  excellentUsersPercentage: string;
  goodUsersPercentage: string;
  averageUsersPercentage: string;
  poorUsersPercentage: string;
};
