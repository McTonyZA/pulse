import { Box } from "@mantine/core";
import { useMemo } from "react";
import { LineChart } from "../../../components/Charts";

interface TrendDataPoint {
  label: string;
  count?: number;
  [key: string]: any;
}

interface ChartColors {
  appVersion: string[];
  os: string[];
}

interface OccurrenceTrendChartProps {
  trendData: TrendDataPoint[];
  trendView: string;
  chartColors: ChartColors;
  getXAxisInterval: () => number;
}

export const OccurrenceTrendChart: React.FC<OccurrenceTrendChartProps> = ({
  trendData,
  trendView,
  chartColors,
  getXAxisInterval,
}) => {
  // Extract unique app versions and OS versions from trendData
  const { appVersions, osVersions } = useMemo(() => {
    if (!trendData || trendData.length === 0) {
      return { appVersions: [], osVersions: [] };
    }

    // Get all keys from all data points (excluding 'label' and 'count')
    const allKeys = new Set<string>();
    trendData.forEach((point) => {
      Object.keys(point).forEach((key) => {
        if (key !== "label" && key !== "count") {
          allKeys.add(key);
        }
      });
    });

    const keysArray = Array.from(allKeys).sort();

    // For appVersion view, assume keys are version numbers
    // For os view, assume keys are OS versions
    // We'll use the same keys for both and let the parent component determine the context
    return {
      appVersions: keysArray,
      osVersions: keysArray,
    };
  }, [trendData]);

  const generateSeries = () => {
    if (trendView === "aggregated") {
      return [
        {
          name: "Occurrences",
          color: "#0ec9c2",
          data: trendData.map((d) => d.count || 0),
        },
      ];
    } else if (trendView === "appVersion") {
      if (appVersions.length === 0) {
        return [];
      }
      return appVersions.map((version, idx) => ({
        name: version,
        color:
          chartColors.appVersion[idx % chartColors.appVersion.length] ||
          "#0ec9c2",
        data: trendData.map((d) => d[version] || 0),
      }));
    } else if (trendView === "os") {
      if (osVersions.length === 0) {
        return [];
      }
      return osVersions.map((os, idx) => ({
        name: os,
        color: chartColors.os[idx % chartColors.os.length] || "#0ec9c2",
        data: trendData.map((d) => d[os] || 0),
      }));
    }
    return [];
  };

  return (
    <Box style={{ height: 262, width: "100%" }}>
      <LineChart
        height={262}
        option={{
          xAxis: {
            type: "category",
            data: trendData.map((d) => d.label),
          },
          yAxis: {
            type: "value",
          },
          series: generateSeries(),
        }}
      />
    </Box>
  );
};
