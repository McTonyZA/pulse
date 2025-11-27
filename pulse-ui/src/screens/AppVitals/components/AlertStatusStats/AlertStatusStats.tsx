import { Box, Text } from "@mantine/core";
import classes from "./AlertStatusStats.module.css";

interface AlertStatusStatsProps {
  startTime: string;
  endTime: string;
}

export function AlertStatusStats({
  startTime,
  endTime,
}: AlertStatusStatsProps) {
  // TODO: Implement API call when alerts API is available
  // For now, using placeholder values
  const metrics = {
    firingAlerts: 0,
    activeAlerts: 0,
  };

  return (
    <Box className={classes.statSection}>
      <Text className={classes.sectionTitle}>Alert Status</Text>
      <Box className={classes.metricsGrid}>
        <Box className={classes.statItem}>
          <Text className={classes.statLabel}>Firing Alerts</Text>
          <Text className={classes.statValue} c="blue">
            {metrics.firingAlerts}
          </Text>
        </Box>
        <Box className={classes.statItem}>
          <Text className={classes.statLabel}>Active Alerts</Text>
          <Text className={classes.statValue} c="blue">
            {metrics.activeAlerts}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
