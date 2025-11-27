import { Text } from "@mantine/core";
import { IconDeviceDesktop, TablerIcon } from "@tabler/icons-react";
import classes from "./ScreenCard.module.css";

interface ScreenCardProps {
  screenName: string;
  startTime?: string;
  endTime?: string;
  onClick?: () => void;
  icon?: TablerIcon;
  // Static values (used when not fetching from API)
  staticAvgTimeSpent?: number;
  staticCrashRate?: number;
  staticLoadTime?: number;
  staticUsers?: number;
}

export function ScreenCard({
  screenName,
  startTime,
  endTime,
  onClick,
  icon: IconComponent = IconDeviceDesktop,
  staticAvgTimeSpent,
  staticCrashRate,
  staticLoadTime,
  staticUsers,
}: ScreenCardProps) {
  const getLoadTimeFormattString = (loadTime: number) => {
    // The load time is in nanoseconds, so we need to convert it to milliseconds. If the milliseconds is greater than 1000, then format it as seconds
    // first convert the nanoseconds to milliseconds
    const milliseconds = loadTime / 1000000;
    // then format the milliseconds
    if (milliseconds > 1000) {
      return (milliseconds / 1000).toFixed(2) + "s";
    }
    return milliseconds.toFixed(2) + "ms";
  };


  return (
    <div className={classes.screenCard} onClick={onClick}>
      {/* Screen Mockup */}
      <div className={classes.screenMockup}>
        <div className={classes.screenHeader}></div>
        <div className={classes.screenContent}>
          <div className={classes.screenIcon}>
            <IconComponent size={32} stroke={1.8} />
          </div>
          <Text className={classes.screenName}>{screenName}</Text>
        </div>
      </div>
      <div className={classes.healthIndicator} />

      {/* Health Metrics */}
      <div className={classes.metricsRow}>
        <div className={classes.metricItem}>
          <Text className={classes.metricLabel}>Avg Time Spent</Text>
          <Text className={classes.metricValue}>
            {staticAvgTimeSpent ? `${getLoadTimeFormattString(staticAvgTimeSpent)}` : "N/A"}
          </Text>
        </div>
        <div className={classes.metricItem}>
          <Text className={classes.metricLabel}>Crash Rate</Text>
          <Text className={classes.metricValue}>
            {staticCrashRate ? `${staticCrashRate.toFixed(1)}%` : "N/A"}
          </Text>
        </div>
        <div className={classes.metricItem}>
          <Text className={classes.metricLabel}>Load Time</Text>
          <Text className={classes.metricValue}>
            {staticLoadTime ? `${getLoadTimeFormattString(staticLoadTime)}` : "N/A"}
          </Text>
        </div>
        <div className={classes.metricItem}>
          <Text className={classes.metricLabel}>Users</Text>
          <Text className={classes.metricValue}>
            {staticUsers ? staticUsers.toLocaleString() : "N/A"}
          </Text>
        </div>
      </div>
    </div>
  );
}
