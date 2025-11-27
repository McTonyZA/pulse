import { Box, Text, Paper, SegmentedControl } from "@mantine/core";
import { OccurrenceTrendChart } from "./OccurrenceTrendChart";
import { ScreenBreakdownList } from "./ScreenBreakdownList";
import classes from "./OccurrenceSection.module.css";

interface OccurrenceSectionProps {
  trendView: string;
  onTrendViewChange: (value: string) => void;
  trendData: any[];
  screenBreakdown: any[];
  chartColors: any;
  getXAxisInterval: () => number;
}

const VIEW_OPTIONS = [
  { label: "Aggregated", value: "aggregated" },
  { label: "App Version", value: "appVersion" },
  { label: "OS Version", value: "os" },
  { label: "By Screen", value: "screen" },
];

export const OccurrenceSection: React.FC<OccurrenceSectionProps> = ({
  trendView,
  onTrendViewChange,
  trendData,
  screenBreakdown,
  chartColors,
  getXAxisInterval,
}) => {
  return (
    <Paper className={classes.sectionContainer}>
      {/* Header with Title */}
      <Text className={classes.sectionTitle} mb="md">
        Occurrence
      </Text>

      {/* View Toggle - Compact, not full width */}
      <SegmentedControl
        value={trendView}
        onChange={onTrendViewChange}
        data={VIEW_OPTIONS}
        size="sm"
        className={classes.segmentedControl}
      />

      <Box className={classes.contentContainer}>
        {trendView === "screen" ? (
          <ScreenBreakdownList screenBreakdown={screenBreakdown} />
        ) : (
          <OccurrenceTrendChart
            trendData={trendData}
            trendView={trendView}
            chartColors={chartColors}
            getXAxisInterval={getXAxisInterval}
          />
        )}
      </Box>
    </Paper>
  );
};
