import { Box, Text, Paper } from "@mantine/core";
import { LineChart } from "../../../components/Charts";
import classes from "./TrendGraph.module.css";

interface TrendGraphProps {
  data: Array<{ date: string; count: number }>;
  title: string;
  dataKey?: string;
  lineColor?: string;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({
  data = [],
  title = "Trend",
  dataKey = "count",
  lineColor = "#0ec9c2",
}) => {
  if (data.length === 0) {
    return (
      <Paper withBorder p="md" mb="lg">
        <Text fw={600} size="lg" mb="md">
          {title}
        </Text>
        <Text c="dimmed" ta="center" py="xl">
          No data available
        </Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder p="md" mb="lg" className={classes.trendCard}>
      <Box className={classes.topAccent} />
      <Text className={classes.graphTitle}>{title}</Text>
      <Box style={{ height: 225 }}>
        <LineChart
          height={225}
          option={{
            xAxis: {
              type: "category",
              data: data.map((d) => d.date),
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                name: "Occurrences",
                color: lineColor,
                data: data.map((d) => d[dataKey as keyof typeof d]),
              },
            ],
          }}
        />
      </Box>
    </Paper>
  );
};
