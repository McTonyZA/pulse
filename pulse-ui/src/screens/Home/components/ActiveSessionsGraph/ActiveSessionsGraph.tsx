import { Text } from "@mantine/core";
import {
  createTooltipFormatter,
  AreaChart,
} from "../../../../components/Charts";
import classes from "./ActiveSessionsGraph.module.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useGetDataQuery } from "../../../../hooks";
import { useMemo } from "react";
import { ActiveSessionsGraphProps } from "./ActiveSessionsGraph.interface";
import { getTimeBucketSize } from "../../../../utils/TimeBucketUtil";
import { COLUMN_NAME, SpanType } from "../../../../constants/PulseOtelSemcov";

dayjs.extend(utc);

export function ActiveSessionsGraph({
  screenName,
  appVersion,
  osVersion,
  device,
  startTime,
  endTime,
  spanType = "app_start",
}: ActiveSessionsGraphProps = {}) {
  // Calculate date range - use provided time range or default to last 7 days
  const { startDate, endDate, bucketSize } = useMemo(() => {
    let finalStartDate: string;
    let finalEndDate: string;

    if (startTime && endTime) {
      // Convert to ISO format if needed
      finalStartDate =
        startTime.includes("T") || startTime.includes("Z")
          ? startTime
          : dayjs.utc(startTime).toISOString();
      finalEndDate =
        endTime.includes("T") || endTime.includes("Z")
          ? endTime
          : dayjs.utc(endTime).toISOString();
    } else {
      const end = dayjs().utc().endOf("day");
      const start = end.subtract(6, "days").startOf("day");
      finalStartDate = start.toISOString();
      finalEndDate = end.toISOString();
    }

    // Use smart bucketing based on time range
    const bucket = getTimeBucketSize(finalStartDate, finalEndDate);

    return {
      startDate: finalStartDate,
      endDate: finalEndDate,
      bucketSize: bucket,
    };
  }, [startTime, endTime]);

  // Build filters array
  const buildFilters = useMemo(() => {
    const filterArray: Array<{
      field: string;
      operator: "IN" | "EQ";
      value: string[];
    }> = [
      {
        field: COLUMN_NAME.SPAN_TYPE,
        operator: "EQ",
        value: [spanType],
      },
    ];

    if (screenName) {
      filterArray.push({
        field: `SpanAttributes['${SpanType.SCREEN_NAME}']`,
        operator: "IN",
        value: [screenName],
      });
    }

    if (appVersion && appVersion !== "all") {
      filterArray.push({
        field: "ResourceAttributes['app.version']",
        operator: "EQ",
        value: [appVersion],
      });
    }

    if (osVersion && osVersion !== "all") {
      filterArray.push({
        field: COLUMN_NAME.OS_VERSION,
        operator: "EQ",
        value: [osVersion],
      });
    }

    if (device && device !== "all") {
      filterArray.push({
        field: COLUMN_NAME.DEVICE_MODEL,
        operator: "EQ",
        value: [device],
      });
    }

    return filterArray;
  }, [screenName, appVersion, osVersion, device, spanType]);

  // Fetch active sessions for the last 7 days
  const { data } = useGetDataQuery({
    requestBody: {
      dataType: "TRACES",
      timeRange: {
        start: startDate,
        end: endDate,
      },
      select: [
        {
          function: "TIME_BUCKET",
          param: { bucket: bucketSize, field: COLUMN_NAME.TIMESTAMP },
          alias: "t1",
        },
        {
          function: "CUSTOM",
          param: { expression: "uniqCombined(SessionId)" },
          alias: "session_count",
        },
      ],
      filters: buildFilters,
      groupBy: ["t1"],
      orderBy: [{ field: "t1", direction: "ASC" }],
    },
    enabled: !!startDate && !!endDate,
  });

  // Transform data and calculate metrics
  const { currentSessions, peakSessions, averageSessions, trendData } =
    useMemo(() => {
      const responseData = data?.data;
      if (
        !responseData ||
        !responseData.rows ||
        responseData.rows.length === 0
      ) {
        return {
          currentSessions: 0,
          peakSessions: 0,
          averageSessions: 0,
          trendData: [],
        };
      }

      const t1Index = responseData.fields.indexOf("t1");
      const sessionCountIndex = responseData.fields.indexOf("session_count");

      const trend = responseData.rows.map((row) => ({
        timestamp: dayjs(row[t1Index]).valueOf(),
        sessions: parseFloat(row[sessionCountIndex]) || 0,
      }));

      // Calculate metrics
      const sessionCounts = trend.map((d) => d.sessions);
      const current = sessionCounts[sessionCounts.length - 1] || 0; // Most recent
      const peak = Math.max(...sessionCounts);
      const average = Math.round(
        sessionCounts.reduce((sum, val) => sum + val, 0) / sessionCounts.length,
      );

      return {
        currentSessions: Math.round(current),
        peakSessions: Math.round(peak),
        averageSessions: average,
        trendData: trend,
      };
    }, [data]);

  return (
    <div className={classes.graphCard}>
      <div className={classes.graphTitle}>Active Sessions</div>
      <div className={classes.metricsGrid}>
        <div className={classes.metricCard}>
          <Text className={classes.metricLabel}>Current</Text>
          <Text className={classes.metricValue} style={{ color: "#0ec9c2" }}>
            {currentSessions.toLocaleString()}
          </Text>
        </div>
        <div className={classes.metricCard}>
          <Text className={classes.metricLabel}>Peak</Text>
          <Text className={classes.metricValue} style={{ color: "#0ba09a" }}>
            {peakSessions.toLocaleString()}
          </Text>
        </div>
        <div className={classes.metricCard}>
          <Text className={classes.metricLabel}>Average</Text>
          <Text className={classes.metricValue} style={{ color: "#2c3e50" }}>
            {averageSessions.toLocaleString()}
          </Text>
        </div>
      </div>
      <div className={classes.chartContainer}>
        <AreaChart
          height={260}
          withLegend={false}
          option={{
            grid: { left: 60, right: 24, top: 24, bottom: 45 },
            tooltip: {
              trigger: "axis",
              formatter: createTooltipFormatter({
                valueFormatter: (value: any) => {
                  const numericValue = Array.isArray(value) ? value[1] : value;
                  return `${parseFloat(numericValue).toFixed(0)}`;
                },
                customHeaderFormatter: (axisValue: any) => {
                  if (axisValue && typeof axisValue === "number") {
                    return dayjs(axisValue).format("MMM DD, YYYY");
                  }
                  return axisValue || "";
                },
              }),
            },
            xAxis: {
              type: "time",
              axisLabel: {
                fontSize: 10,
                formatter: (value: number) => dayjs(value).format("MMM DD"),
              },
            },
            yAxis: {
              type: "value",
              name: "Sessions",
              nameGap: 40,
              nameTextStyle: { fontSize: 11 },
              axisLabel: {
                fontSize: 10,
                formatter: (value: number) => `${(value / 1000).toFixed(1)}K`,
              },
            },
            series: [
              {
                name: "Sessions",
                type: "line",
                smooth: true,
                areaStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: "rgba(14, 201, 194, 0.4)" },
                      { offset: 1, color: "rgba(14, 201, 194, 0.05)" },
                    ],
                  },
                },
                data: trendData.map((d) => [d.timestamp, d.sessions]),
                itemStyle: { color: "#0ec9c2" },
                lineStyle: { width: 2.5, color: "#0ec9c2" },
                symbol: "circle",
                symbolSize: 6,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
