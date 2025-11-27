import { Text } from "@mantine/core";
import {
  createTooltipFormatter,
  LineChart,
} from "../../../../components/Charts";
import classes from "./UserEngagementGraph.module.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useGetDataQuery } from "../../../../hooks";
import { useMemo } from "react";
import { UserEngagementGraphProps } from "./UserEngagementGraph.interface";
import { SpanType } from "../../../../constants/PulseOtelSemcov";

dayjs.extend(utc);

export function UserEngagementGraph({
  screenName,
  appVersion,
  osVersion,
  device,
  startTime,
  endTime,
  spanType = "app_start",
}: UserEngagementGraphProps = {}) {
  // Always use last 7 days for daily graph (ignore time filter)
  const { dailyStartDate, dailyEndDate } = useMemo(() => {
    const end = dayjs().utc().endOf("day");
    const start = end.subtract(6, "days").startOf("day");
    return {
      dailyStartDate: start.toISOString(),
      dailyEndDate: end.toISOString(),
    };
  }, []);

  //TODO: check the dates logic for week and monthly users
  // Always use last 1 month for weekly and monthly averages (ignore time filter)
  const { weekStartDate, weekEndDate } = useMemo(() => {
    const end = dayjs().utc().endOf("day");
    const start = end.subtract(6, "days").startOf("day");
    return {
      weekStartDate: start.toISOString(),
      weekEndDate: end.toISOString(),
    };
  }, []);

  const { monthStartDate, monthEndDate } = useMemo(() => {
    const end = dayjs().utc().endOf("day");
    const start = end.subtract(27, "days").startOf("day");
    return {
      monthStartDate: start.toISOString(),
      monthEndDate: end.toISOString(),
    };
  }, []);

  // Build filters array
  const buildFilters = useMemo(() => {
    const filterArray: Array<{
      field: string;
      operator: "IN" | "EQ";
      value: string[];
    }> = [
      {
        field: "SpanType",
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
        field: "AppVersionCode",
        operator: "EQ",
        value: [appVersion],
      });
    }

    if (osVersion && osVersion !== "all") {
      filterArray.push({
        field: "OsVersion",
        operator: "EQ",
        value: [osVersion],
      });
    }

    if (device && device !== "all") {
      filterArray.push({
        field: "DeviceModel",
        operator: "EQ",
        value: [device],
      });
    }

    return filterArray;
  }, [screenName, appVersion, osVersion, device, spanType]);

  // Fetch daily unique users for the last 7 days (for graph)
  const { data: dailyData } = useGetDataQuery({
    requestBody: {
      dataType: "TRACES",
      timeRange: {
        start: dailyStartDate,
        end: dailyEndDate,
      },
      select: [
        {
          function: "TIME_BUCKET",
          param: { bucket: "1d", field: "Timestamp" },
          alias: "t1",
        },
        {
          function: "CUSTOM",
          param: { expression: "uniqCombined(UserId)" },
          alias: "user_count",
        },
      ],
      filters: buildFilters,
      groupBy: ["t1"],
      orderBy: [{ field: "t1", direction: "ASC" }],
    },
    enabled: !!dailyStartDate && !!dailyEndDate,
  });

  // Fetch weekly unique users for the last 1 month
  const { data: weeklyData } = useGetDataQuery({
    requestBody: {
      dataType: "TRACES",
      timeRange: {
        start: weekStartDate,
        end: weekEndDate,
      },
      select: [
        {
          function: "TIME_BUCKET",
          param: { bucket: "1w", field: "Timestamp" },
          alias: "t1",
        },
        {
          function: "CUSTOM",
          param: { expression: "uniqCombined(UserId)" },
          alias: "user_count",
        },
      ],
      filters: buildFilters,
      groupBy: ["t1"],
      orderBy: [{ field: "t1", direction: "ASC" }],
    },
    enabled: !!dailyStartDate && !!dailyEndDate,
  });

  // Fetch monthly unique users for the last 1 month
  const { data: monthlyData } = useGetDataQuery({
    requestBody: {
      dataType: "TRACES",
      timeRange: {
        start: monthStartDate,
        end: monthEndDate,
      },
      select: [
        {
          function: "TIME_BUCKET",
          param: { bucket: "1M", field: "Timestamp" },
          alias: "t1",
        },
        {
          function: "CUSTOM",
          param: { expression: "uniqCombined(UserId)" },
          alias: "user_count",
        },
      ],
      filters: buildFilters,
      groupBy: ["t1"],
      orderBy: [{ field: "t1", direction: "ASC" }],
    },
    enabled: !!dailyStartDate && !!dailyEndDate,
  });

  // Transform daily data and calculate average
  const { dailyUsers, trendData } = useMemo(() => {
    const responseData = dailyData?.data;
    if (!responseData || !responseData.rows || responseData.rows.length === 0) {
      return {
        dailyUsers: 0,
        trendData: [],
      };
    }

    const t1Index = responseData.fields.indexOf("t1");
    const userCountIndex = responseData.fields.indexOf("user_count");

    const trend = responseData.rows.map((row) => ({
      timestamp: dayjs(row[t1Index]).valueOf(),
      dau: parseFloat(row[userCountIndex]) || 0,
    }));

    // Calculate average daily users
    const avgDailyUsers =
      trend.length > 0
        ? Math.round(trend.reduce((sum, d) => sum + d.dau, 0) / trend.length)
        : 0;

    return {
      dailyUsers: avgDailyUsers,
      trendData: trend,
    };
  }, [dailyData]);

  // Calculate weekly active users
  const weeklyUsers = useMemo(() => {
    const responseData = weeklyData?.data;
    if (!responseData || !responseData.rows || responseData.rows.length === 0) {
      return 0;
    }

    const userCountIndex = responseData.fields.indexOf("user_count");
    const total = responseData.rows.reduce(
      (sum, row) => sum + (parseFloat(row[userCountIndex]) || 0),
      0,
    );

    return total;
  }, [weeklyData]);

  // Calculate monthly active users
  const monthlyUsers = useMemo(() => {
    const responseData = monthlyData?.data;
    if (!responseData || !responseData.rows || responseData.rows.length === 0) {
      return 0;
    }

    const userCountIndex = responseData.fields.indexOf("user_count");
    const total = responseData.rows.reduce(
      (sum, row) => sum + (parseFloat(row[userCountIndex]) || 0),
      0,
    );

    return total;
  }, [monthlyData]);

  return (
    <div className={classes.graphCard}>
      <div className={classes.graphTitle}>User Engagement</div>
      <div className={classes.metricsGrid}>
        <div className={classes.metricCard}>
          <Text className={classes.metricLabel}>Avg Daily Users</Text>
          <Text className={classes.metricValue} style={{ color: "#0ec9c2" }}>
            {dailyUsers.toLocaleString()}
          </Text>
        </div>
        <div className={classes.metricCard}>
          <Text className={classes.metricLabel}>Weekly Users</Text>
          <Text className={classes.metricValue} style={{ color: "#0ba09a" }}>
            {weeklyUsers.toLocaleString()}
          </Text>
        </div>
        <div className={classes.metricCard}>
          <Text className={classes.metricLabel}>Monthly Users</Text>
          <Text className={classes.metricValue} style={{ color: "#2c3e50" }}>
            {monthlyUsers.toLocaleString()}
          </Text>
        </div>
      </div>
      <div className={classes.chartContainer}>
        <LineChart
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
                    return dayjs(axisValue).format("MMM DD, HH:mm");
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
              name: "Users",
              nameGap: 40,
              nameTextStyle: { fontSize: 11 },
              axisLabel: {
                fontSize: 10,
                formatter: (value: number) => `${(value / 1000).toFixed(0)}K`,
              },
            },
            series: [
              {
                name: "DAU",
                type: "line",
                smooth: true,
                data: trendData.map((d) => [d.timestamp, d.dau]),
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
