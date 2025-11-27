export interface NetworkApiCardData {
  id: string;
  endpoint: string;
  method: string;
  avgResponseTime: number;
  requestCount: number;
  successRate: number;
  errorRate: number;
  trend?: number[];
  screenName?: string;
}

export interface NetworkApiCardProps {
  apiData: NetworkApiCardData;
  onClick: () => void;
}
