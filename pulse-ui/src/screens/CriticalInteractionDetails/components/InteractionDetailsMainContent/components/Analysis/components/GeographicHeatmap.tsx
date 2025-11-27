import { Card, Text, Box, Tooltip, useMantineTheme } from "@mantine/core";
import type { GeographicHeatmapProps } from "./GeographicHeatmap.interface";

/**
 * Geographic Heatmap
 * Visual heatmap showing metrics by geographic location
 */
const GeographicHeatmap: React.FC<GeographicHeatmapProps> = ({
  data,
  title,
  description,
  metricLabel,
  metricSuffix = "",
}) => {
  const theme = useMantineTheme();
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));

  const getColorIntensity = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    if (normalized > 0.7)
      return {
        bg: theme.colors.red[0],
        border: theme.colors.red[3],
        text: theme.colors.red[7],
      };
    if (normalized > 0.5)
      return {
        bg: theme.colors.orange[0],
        border: theme.colors.orange[3],
        text: theme.colors.orange[7],
      };
    if (normalized > 0.3)
      return {
        bg: theme.colors.yellow[0],
        border: theme.colors.yellow[3],
        text: theme.colors.yellow[8],
      };
    return {
      bg: theme.colors.green[0],
      border: theme.colors.green[3],
      text: theme.colors.green[7],
    };
  };

  return (
    <Card
      py="md"
      px="0"
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
      <Box mb="sm" px="md">
        <Text
          fw={700}
          size="sm"
          c="#0ba09a"
          mb={4}
          style={{ fontSize: "14px", letterSpacing: "-0.2px" }}
        >
          {title}
        </Text>
        <Text size="xs" c="dimmed" style={{ fontSize: "12px" }}>
          {description}
        </Text>
      </Box>

      <Box h={334} px="md" style={{ overflowY: "auto" }}>
        <Box style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sortedData.map((location) => {
            const colors = getColorIntensity(location.value);
            const percentage = ((location.value / maxValue) * 100).toFixed(0);
            const displayValue = metricSuffix
              ? `${location.value}${metricSuffix}`
              : location.value;

            return (
              <Tooltip
                key={location.name}
                label={`${displayValue} ${metricLabel} (${percentage}% of max)`}
                withArrow
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 8,
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateX(2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 4px 12px rgba(14, 201, 194, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateX(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "none";
                  }}
                >
                  <Box style={{ flex: "0 0 110px" }}>
                    <Text size="xs" fw={600} c={colors.text}>
                      {location.name}
                    </Text>
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Box
                      style={{
                        height: 16,
                        width: `${percentage}%`,
                        backgroundColor: colors.border,
                        borderRadius: "var(--mantine-radius-sm)",
                        transition: "width 0.3s",
                      }}
                    />
                  </Box>
                  <Box style={{ flex: "0 0 70px", textAlign: "right" }}>
                    <Text size="sm" fw={700} c={colors.text}>
                      {displayValue}
                    </Text>
                  </Box>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>

      <Box
        mt="sm"
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Text size="xs" c="dimmed">
          Color Scale:
        </Text>
        <Box style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Box
            style={{
              width: 16,
              height: 16,
              backgroundColor: theme.colors.green[0],
              border: `1px solid ${theme.colors.green[3]}`,
            }}
          />
          <Text size="xs">Excellent</Text>
          <Box
            style={{
              width: 16,
              height: 16,
              backgroundColor: theme.colors.yellow[0],
              border: `1px solid ${theme.colors.yellow[3]}`,
            }}
          />
          <Text size="xs">Good</Text>
          <Box
            style={{
              width: 16,
              height: 16,
              backgroundColor: theme.colors.orange[0],
              border: `1px solid ${theme.colors.orange[3]}`,
            }}
          />
          <Text size="xs">Average</Text>
          <Box
            style={{
              width: 16,
              height: 16,
              backgroundColor: theme.colors.red[0],
              border: `1px solid ${theme.colors.red[3]}`,
            }}
          />
          <Text size="xs">Poor</Text>
        </Box>
      </Box>
    </Card>
  );
};

export default GeographicHeatmap;
