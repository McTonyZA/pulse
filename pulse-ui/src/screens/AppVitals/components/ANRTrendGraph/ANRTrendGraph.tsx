import { TrendGraph } from "../TrendGraph";
import { useTrendData } from "../TrendGraphWithData/hooks/useTrendData";
import { QueryState } from "../../../../components/QueryState";
import { ANRTrendGraphProps } from "./ANRTrendGraph.interface";

export function ANRTrendGraph({
  startTime,
  endTime,
  appVersion = "all",
  osVersion = "all",
  device = "all",
  screenName,
  title,
  lineColor,
}: ANRTrendGraphProps) {
  const { trendData, queryState } = useTrendData({
    startTime,
    endTime,
    eventName: "device.anr",
    appVersion,
    osVersion,
    device,
    screenName,
  });

  return (
    <QueryState
      isLoading={queryState.isLoading}
      isError={queryState.isError}
      errorMessage={queryState.errorMessage}
      errorType={queryState.errorInfo?.type}
      emptyMessage="No ANR trend data available"
      skeletonTitle={title}
      skeletonHeight={225}
    >
      <TrendGraph
        data={trendData}
        title={title}
        dataKey="count"
        lineColor={lineColor}
      />
    </QueryState>
  );
}
