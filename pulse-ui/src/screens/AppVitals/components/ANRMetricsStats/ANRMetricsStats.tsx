import { Box, Text } from "@mantine/core";
import { useMemo } from "react";
import { useGetDataQuery } from "../../../../hooks";
import { useQueryError } from "../../../../hooks/useQueryError";
import { StatsSkeleton } from "../../../../components/StatsSkeleton";
import type { DataQueryResponse } from "../../../../hooks/useGetDataQuery/useGetDataQuery.interface";
import classes from "./ANRMetricsStats.module.css";

interface ANRMetricsStatsProps {
  startTime: string;
  endTime: string;
  appVersion?: string;
  osVersion?: string;
  device?: string;
  screenName?: string;
}

export function ANRMetricsStats({
  startTime,
  endTime,
  appVersion = "all",
  osVersion = "all",
  device = "all",
  screenName,
}: ANRMetricsStatsProps) {
  // Build filters array for API request
  const filters = useMemo(() => {
    const filterArray = [];

    // Add screen name filter if provided
    if (screenName) {
      filterArray.push({
        field: "ScreenName",
        operator: "EQ" as const,
        value: [screenName],
      });
    }

    if (appVersion && appVersion !== "all") {
      filterArray.push({
        field: "AppVersionCode",
        operator: "EQ" as const,
        value: [appVersion],
      });
    }

    if (osVersion && osVersion !== "all") {
      filterArray.push({
        field: "OsVersion",
        operator: "EQ" as const,
        value: [osVersion],
      });
    }

    if (device && device !== "all") {
      filterArray.push({
        field: "DeviceModel",
        operator: "EQ" as const,
        value: [device],
      });
    }

    return filterArray.length > 0 ? filterArray : undefined;
  }, [appVersion, osVersion, device, screenName]);

  const queryResult = useGetDataQuery({
    requestBody: {
      dataType: "EXCEPTIONS",
      timeRange: {
        start: startTime,
        end: endTime,
      },
      filters,
      select: [
        {
          function: "CUSTOM",
          param: {
            expression: "uniqCombinedIf(UserId, EventName = 'device.anr')",
          },
          alias: "anr_users",
        },
        {
          function: "CUSTOM",
          param: {
            expression: "uniqCombinedIf(SessionId, EventName = 'device.anr')",
          },
          alias: "anr_sessions",
        },
        {
          function: "CUSTOM",
          param: {
            expression: "uniqCombined(UserId)",
          },
          alias: "all_users",
        },
        {
          function: "CUSTOM",
          param: {
            expression: "uniqCombined(SessionId)",
          },
          alias: "all_sessions",
        },
      ],
    },
    enabled: !!startTime && !!endTime,
  });

  const { data } = queryResult;
  const queryState = useQueryError<DataQueryResponse>({ queryResult });

  const metrics = useMemo(() => {
    const responseData = data?.data;
    if (!responseData || !responseData.rows || responseData.rows.length === 0) {
      return {
        anrFreeUsers: 0,
        anrFreeSessions: 0,
      };
    }

    const fields = responseData.fields;
    const anrUsersIndex = fields.indexOf("anr_users");
    const anrSessionsIndex = fields.indexOf("anr_sessions");
    const allUsersIndex = fields.indexOf("all_users");
    const allSessionsIndex = fields.indexOf("all_sessions");

    const row = responseData.rows[0];
    const anrUsers = parseFloat(row[anrUsersIndex]) || 0;
    const anrSessions = parseFloat(row[anrSessionsIndex]) || 0;
    const allUsers = parseFloat(row[allUsersIndex]) || 0;
    const allSessions = parseFloat(row[allSessionsIndex]) || 0;

    const anrFreeUsers =
      allUsers > 0 ? ((allUsers - anrUsers) / allUsers) * 100 : 0;
    const anrFreeSessions =
      allSessions > 0 ? ((allSessions - anrSessions) / allSessions) * 100 : 0;

    return {
      anrFreeUsers: parseFloat(anrFreeUsers.toFixed(2)),
      anrFreeSessions: parseFloat(anrFreeSessions.toFixed(2)),
    };
  }, [data]);

  if (queryState.isLoading) {
    return <StatsSkeleton title="ANR Metrics" itemCount={2} />;
  }

  if (queryState.isError) {
    return (
      <Box className={classes.statSection}>
        <Text className={classes.sectionTitle}>ANR Metrics</Text>
        <Text size="sm" c="red" mt="xs">
          {queryState.errorMessage || "Failed to load ANR metrics"}
        </Text>
      </Box>
    );
  }

  return (
    <Box className={`${classes.statSection} ${classes.fadeIn}`}>
      <Text className={classes.sectionTitle}>ANR Metrics</Text>
      <Box className={classes.metricsGrid}>
        <Box className={classes.statItem}>
          <Text className={classes.statLabel}>ANR-Free Users</Text>
          <Text className={classes.statValue} c="orange">
            {`${metrics.anrFreeUsers}%`}
          </Text>
        </Box>
        <Box className={classes.statItem}>
          <Text className={classes.statLabel}>ANR-Free Sessions</Text>
          <Text className={classes.statValue} c="orange">
            {`${metrics.anrFreeSessions}%`}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
