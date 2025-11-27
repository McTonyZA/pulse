import { Box, Text } from "@mantine/core";
import ReleaseComparisonChart from "../components/ReleaseComparisonChart";
import { LoaderWithMessage } from "../../../../../../../components/LoaderWithMessage";
import { ErrorAndEmptyStateWithNotification } from "../../ErrorAndEmptyStateWithNotification";
import {
  ANALYSIS_ERROR_MESSAGES,
  ANALYSIS_LOADING_MESSAGES,
} from "../Analysis.constants";
import commonStyles from "../../../common.module.css";
import { AnalysisSectionProps } from "../Analysis.interface";
import { useGetReleasePerformance } from "../hooks/useGetReleasePerformance";

export const ReleasePerformanceSection: React.FC<AnalysisSectionProps> = ({
  dashboardFilters,
  startTimeMs,
  endTimeMs,
  shouldFetch,
  interactionName,
}) => {
  const {
    releaseData,
    isLoading,
    isError,
    error,
  } = useGetReleasePerformance({
    interactionName,
    startTime: startTimeMs,
    endTime: endTimeMs,
    enabled: shouldFetch,
    dashboardFilters,
  });

  if (isError) {
    const errorMessage = error?.message || "Unknown error";

    return (
      <ErrorAndEmptyStateWithNotification
        message={ANALYSIS_ERROR_MESSAGES.RELEASE_PERFORMANCE.ERROR}
        errorDetails={errorMessage}
      />
    );
  }

  if (isLoading) {
    return (
      <LoaderWithMessage
        className={commonStyles.centeredContainer}
        loadingMessage={ANALYSIS_LOADING_MESSAGES.RELEASE_PERFORMANCE}
      />
    );
  }

  const hasData = releaseData && releaseData.length > 0;

  if (!hasData) {
    return (
      <ErrorAndEmptyStateWithNotification
        message={ANALYSIS_ERROR_MESSAGES.RELEASE_PERFORMANCE.EMPTY}
        isError={false}
        showNotification={false}
      />
    );
  }

  return (
    <Box mb="lg">
      <Box mb="md">
        <Text
          size="sm"
          fw={700}
          c="#0ba09a"
          mb={4}
          style={{ fontSize: "16px", letterSpacing: "-0.3px" }}
        >
          Release Performance Analysis
        </Text>
        <Text size="xs" c="dimmed" style={{ fontSize: "12px" }}>
          How did our last release impact performance?
        </Text>
      </Box>
      <ReleaseComparisonChart data={releaseData} />
    </Box>
  );
};
