import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Text, Button, Paper, Loader } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  IssueDetailsCard,
  OccurrenceSection,
  StackTraceSection,
} from "../components";
import { getXAxisInterval } from "../helpers/trendDataHelper";
import {
  useIssueDetailData,
  useIssueStackTraces,
  useIssueScreenBreakdown,
  useIssueTrendData,
} from "./hooks";
import dayjs from "dayjs";
import classes from "./IssueDetail.module.css";

const CHART_COLORS = {
  appVersion: ["#14b8a6", "#06b6d4", "#8b5cf6", "#f59e0b"],
  os: ["#10b981", "#3b82f6", "#8b5cf6", "#ef4444"],
};

export const IssueDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [trendView, setTrendView] = useState("aggregated");
  
  // Use default time range (hooks will use last 7 days if empty)
  const startTime = "";
  const endTime = "";

  // Fetch issue details from API
  const { issue, queryState: issueQueryState } = useIssueDetailData({
    groupId: groupId || "",
    startTime,
    endTime,
  });

  // Determine issue type
  const issueType = useMemo(() => {
    if (!issue) return "Issue";
    if (issue.id.startsWith("crash")) return "Crash";
    if (issue.id.startsWith("anr")) return "ANR";
    if (issue.id.startsWith("nonfatal")) return "Non-Fatal";
    return "Issue";
  }, [issue]);

  // Fetch stack traces (occurrences)
  const { stackTraces } = useIssueStackTraces({
    groupId: groupId || "",
    startTime,
    endTime,
    limit: 10,
  });

  // Fetch screen breakdown
  const { screenBreakdown } = useIssueScreenBreakdown({
    groupId: groupId || "",
    startTime,
    endTime,
  });

  // Format time for API calls
  const formattedStartTime = useMemo(() => {
    if (!startTime) return "";
    try {
      return dayjs.utc(startTime).toISOString();
    } catch {
      return "";
    }
  }, [startTime]);

  const formattedEndTime = useMemo(() => {
    if (!endTime) return "";
    try {
      return dayjs.utc(endTime).toISOString();
    } catch {
      return "";
    }
  }, [endTime]);

  // Fetch trend data from API
  const { trendData } = useIssueTrendData({
    groupId: groupId || "",
    startTime: formattedStartTime,
    endTime: formattedEndTime,
    trendView,
    appVersion: "all",
    osVersion: "all",
    device: "all",
  });


  // Loading state
  if (issueQueryState.isLoading) {
    return (
      <Box className={classes.pageContainer}>
        <Paper className={classes.notFoundCard}>
          <Loader size="md" />
          <Text className={classes.notFoundText} mt="md">
            Loading issue details...
          </Text>
        </Paper>
      </Box>
    );
  }

  // Error state
  if (issueQueryState.isError) {
    return (
      <Box className={classes.pageContainer}>
        <Paper className={classes.notFoundCard}>
          <Text className={classes.notFoundTitle}>Error loading issue</Text>
          <Text className={classes.notFoundText}>
            {issueQueryState.errorMessage || "Failed to load issue details"}
          </Text>
          <Button
            variant="light"
            color="teal"
            mt="md"
            onClick={() => navigate("/app-vitals")}
          >
            Go Back to App Vitals
          </Button>
        </Paper>
      </Box>
    );
  }

  // Not found state
  if (!issue) {
    return (
      <Box className={classes.pageContainer}>
        <Paper className={classes.notFoundCard}>
          <Text className={classes.notFoundTitle}>Issue not found</Text>
          <Text className={classes.notFoundText}>
            The issue you're looking for doesn't exist or has been removed.
          </Text>
          <Button
            variant="light"
            color="teal"
            mt="md"
            onClick={() => navigate("/app-vitals")}
          >
            Go Back to App Vitals
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={classes.pageContainer}>
      {/* Back Button */}
      <Button
        variant="subtle"
        color="teal"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/app-vitals")}
        className={classes.backButton}
      >
        Back to App Vitals
      </Button>

      {/* Issue Details */}
      <IssueDetailsCard issue={issue} issueType={issueType} />

      {/* Occurrence Section */}
      <OccurrenceSection
        trendView={trendView}
        onTrendViewChange={setTrendView}
        trendData={trendData}
        screenBreakdown={screenBreakdown}
        chartColors={CHART_COLORS}
        getXAxisInterval={() => getXAxisInterval(startTime, endTime)}
      />

      {/* Stack Trace Section */}
      <StackTraceSection stackTraces={stackTraces || []} />
    </Box>
  );
};
