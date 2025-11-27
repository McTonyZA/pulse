// @ts-nocheck

import { Card, Text, Box, Grid, useMantineTheme } from "@mantine/core";
import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandReact,
} from "@tabler/icons-react";
import {
  PieChart,
  CustomToolTip,
  createTooltipFormatter,
} from "../../../../../../../components/Charts";
import type { PlatformDonutChartProps } from "./PlatformDonutChart.interface";

/**
 * Platform Donut Chart
 * Shows distribution by platform
 */
const PlatformDonutChart: React.FC<PlatformDonutChartProps> = ({
  data,
  title,
  description,
  metricName,
  metricSuffix = "",
}) => {
  const theme = useMantineTheme();
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));

  // Helper function to get color based on relative comparison between platforms
  const getColorByComparison = (value) => {
    // Normalize between platforms (0 = lowest, 1 = highest)
    const normalized =
      maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);

    if (normalized > 0.7) return theme.colors.red[4];
    if (normalized > 0.4) return theme.colors.orange[4];
    if (normalized > 0.3) return theme.colors.yellow[8];
    return theme.colors.yellow[4];
  };

  // Calculate color for each platform based on relative comparison
  const platformDataWithColors = data.map((d) => ({
    ...d,
    color: getColorByComparison(d.value),
  }));

  const option = {
    tooltip: {
      ...CustomToolTip,
      trigger: "item",
      formatter: createTooltipFormatter({
        valueFormatter: (value) => {
          return metricSuffix
            ? `${Math.round(Number(value))}${metricSuffix}`
            : Math.round(Number(value));
        },
      }),
    },
    legend: { bottom: 0 },
    series: [
      {
        name: metricName,
        type: "pie",
        radius: ["50%", "80%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inside",
          formatter: (params) => Math.round(params.percent) + "%",
          fontWeight: 700,
          color: "white",
        },
        labelLine: { show: false },
        data: platformDataWithColors.map((d) => ({
          value: d.value,
          name: d.platform,
          itemStyle: { color: d.color },
        })),
      },
    ],
  };

  // support android, rn, ios, web
  const getIconByPlatform = (platform: string) => {
    if (platform.toLowerCase().includes("android"))
      return <IconBrandAndroid size={18} color={platform.color} />;
    if (platform.toLowerCase().includes("ios"))
      return <IconBrandApple size={18} color={platform.color} />;
    if (platform.toLowerCase().includes("rn"))
      return <IconBrandReact size={18} color={platform.color} />;
    if (platform.toLowerCase().includes("web"))
      return <IconBrandReact size={18} color={platform.color} />;
    return <IconBrandReact size={18} color={platform.color} />;
  };

  return (
    <Card
      padding="md"
      withBorder
      radius="md"
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)",
        border: "1px solid rgba(14, 201, 194, 0.12)",
        borderRadius: "16px",
        boxShadow:
          "0 4px 12px rgba(14, 201, 194, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box mb="sm">
        <Text
          fw={700}
          size="sm"
          c="#0ba09a"
          mb={4}
          style={{ fontSize: "14px", letterSpacing: "-0.2px" }}
        >
          {title}
        </Text>
        <Text c="dimmed" size="xs" style={{ fontSize: "12px" }}>
          {description}
        </Text>
      </Box>

      <Box height={250} mb="sm">
        <PieChart option={option} height={250} />
      </Box>

      <Grid gutter="xs">
        {platformDataWithColors.map((platform) => (
          <Grid.Col span={{ base: 12, sm: 6 }} key={platform.platform}>
            <Box
              style={{
                padding: 12,
                border: `1px solid ${platform.color}`,
                borderRadius: "12px",
                background: `${platform.color}15`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 4px 12px ${platform.color}30`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                {getIconByPlatform(platform.platform)}
                <Text fw={600} size="xs">
                  {platform.platform}
                </Text>
              </Box>
              <Text fw={700} size="lg" style={{ color: platform.color }}>
                {metricSuffix
                  ? `${platform.value}${metricSuffix}`
                  : platform.value.toLocaleString()}
              </Text>
              <Text size="xs" c="dimmed">
                {totalValue === 0
                  ? "0% of total"
                  : `${((platform.value / totalValue) * 100).toFixed(1)}% of total`}
              </Text>
            </Box>
          </Grid.Col>
        ))}
      </Grid>
    </Card>
  );
};

export default PlatformDonutChart;
