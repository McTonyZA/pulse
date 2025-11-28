import {
  IconHome,
  IconListDetails,
  IconFileText,
  IconGridDots,
  IconArrowRight,
} from "@tabler/icons-react";
import { ScreensHealthProps } from "./ScreensHealth.interface";
import classes from "./ScreensHealth.module.css";
import { ScreenCard } from "../../../ScreenList/components/ScreenCard";
import { Button } from "@mantine/core";
import { useGetDataQuery } from "../../../../hooks";
import { useMemo } from "react";
import dayjs from "dayjs";
import { COLUMN_NAME, STATUS_CODE, SpanType } from "../../../../constants/PulseOtelSemcov";

export function ScreensHealth({
  startTime,
  endTime,
  onViewAll,
  onCardClick,
}: ScreensHealthProps) {
  // Fetch top 5 screens data
  const { data } = useGetDataQuery({
    requestBody: {
      dataType: "TRACES",
      timeRange: {
        start: dayjs().utc().subtract(6, "days").startOf("day").toISOString(),
        end: dayjs().utc().endOf("day").toISOString(),
      },
      select: [
        {
          function: "COL",
          param: { field: `SpanAttributes['${SpanType.SCREEN_NAME}']` },
          alias: "screen_name",
        },
        {
          function: "CUSTOM",
          param: { expression: "COUNT()" },
          alias: "screen_count",
        },
        {
          function: "CUSTOM",
          param: { expression: `sumIf(Duration,SpanType = '${SpanType.SCREEN_SESSION}')` },
          alias: "total_time_spent",
        },
        {
          function: "CUSTOM",
          param: { expression: `sumIf(Duration,SpanType = '${SpanType.SCREEN_LOAD}')` },
          alias: "total_load_time",
        },
        {
          function: "CUSTOM",
          param: { expression: `uniqCombined(${COLUMN_NAME.USER_ID})` },
          alias: "user_count",
        },
        {
          function: "CUSTOM",
          param: { expression: `countIf(StatusCode = '${STATUS_CODE.ERROR}')` },
          alias: "error_count",
        },
      ],
      groupBy: ["screen_name"],
      orderBy: [{ field: "screen_count", direction: "DESC" }],
      filters: [
        {
          field: "SpanType",
          operator: "IN",
          value: ["screen_session", "screen_load"],
        },
      ],
      limit: 5,
    },
    enabled: true,
  });

  // Transform API response to screen data
  const screensData = useMemo(() => {
    const responseData = data?.data;
    if (!responseData || !responseData.rows || responseData.rows.length === 0) {
      return [];
    }

    const fields = responseData.fields;
    const screenNameIndex = fields.indexOf("screen_name");
    const screenCountIndex = fields.indexOf("screen_count");
    const totalTimeSpentIndex = fields.indexOf("total_time_spent");
    const totalLoadTimeIndex = fields.indexOf("total_load_time");
    const userCountIndex = fields.indexOf("user_count");
    const errorCountIndex = fields.indexOf("error_count");

    return responseData.rows.map((row) => {
      const screenCount = parseFloat(row[screenCountIndex]) || 1;
      const totalTimeSpent = parseFloat(row[totalTimeSpentIndex]) || 0;
      const totalLoadTime = parseFloat(row[totalLoadTimeIndex]) || 0;

      return {
        screenName: row[screenNameIndex],
        avgTimeSpent: Math.round(totalTimeSpent / screenCount), // Average time per session
        crashRate: (parseFloat(row[errorCountIndex]) / screenCount) * 100 || 0,
        loadTime: Math.round(totalLoadTime / screenCount), // Average load time
        users: parseInt(row[userCountIndex]) || 0,
        screenType: row[screenNameIndex],
        errorRate: parseFloat(row[errorCountIndex]) || 0,
      };
    });
  }, [data]);

  const getScreenIcon = (screenType: string) => {
    switch (screenType) {
      case "home":
        return IconHome;
      case "detail":
        return IconListDetails;
      case "form":
        return IconFileText;
      case "list":
        return IconGridDots;
      default:
        return IconHome;
    }
  };

  return (
    <div>
      <div className={classes.headerContainer}>
        <h2 className={classes.sectionTitle}>Screen Health</h2>
        <Button
          variant="subtle"
          rightSection={<IconArrowRight size={16} />}
          onClick={onViewAll}
          className={classes.viewAllButton}
        >
          View All
        </Button>
      </div>
      <div className={classes.screensGrid}>
        {screensData.map((screen, index) => {
          const Icon = getScreenIcon(screen.screenType);

          return (
            <ScreenCard
              key={index}
              screenName={screen.screenName}
              icon={Icon}
              staticAvgTimeSpent={screen.avgTimeSpent}
              staticCrashRate={screen.crashRate}
              staticLoadTime={screen.loadTime}
              staticUsers={screen.users}
              onClick={() => onCardClick(screen.screenName)}
            />
          );
        })}
      </div>
    </div>
  );
}
