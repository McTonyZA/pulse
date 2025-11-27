import classes from "../InteractionDetailsGraphs/InteractionDetailsGraphs.module.css";
import errorMetricsClasses from "./ErrorMetricsGraph.module.css";
import { useMantineTheme } from "@mantine/core";
import { LineChart } from "../../../../../../components/Charts";
import { AbsoluteNumbersForGraphs } from "../AbsoluteNumbersForGraphs/AbsoluteNumbersForGraphs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { createTooltipFormatter } from "../../../../../../components/Charts/Tooltip/Tooltip";
import { DATE_FORMAT } from "../../../../../../constants";
import { GraphDataProps } from "../ApdexGraph/ApdexGraph.interface";

dayjs.extend(utc);

export function ErrorMetricsGraph({
  className,
  graphData,
  metrics,
}: GraphDataProps) {
  const theme = useMantineTheme();

  const getGraphTitle = () => {
    return "Error Rate";
  };

  const getEChartsSeries = () => {
    return [
      {
        name: "Error Rate",
        type: "line",
        smooth: true,
        data: graphData?.map((d) => [d.timestamp, d.errorRate]),
        itemStyle: { color: theme.colors.red[6] },
        lineStyle: { width: 2 },
        symbol: "circle",
        symbolSize: 6,
        emphasis: {
          focus: "series",
          itemStyle: {
            borderColor: theme.colors.red[6],
            borderWidth: 2,
          },
        },
      },
    ];
  };

  const option = {
    grid: { right: 20, top: 24, bottom: 50 },
    tooltip: {
      trigger: "axis",
      formatter: createTooltipFormatter({
        valueFormatter: (value: any) => {
          const numericValue = Array.isArray(value) ? value[1] : value;
          return `${Number(numericValue).toFixed(2)}%`;
        },
        customHeaderFormatter: (axisValue: any) => {
          if (axisValue && typeof axisValue === "number") {
            return dayjs(axisValue).format(DATE_FORMAT);
          }
          return axisValue || "";
        },
      }),
    },
    xAxis: {
      type: "time",
      axisLabel: {
        fontSize: 11,
        formatter: (value: number) => {
          const dateTime = new Date(value);
          return dayjs(dateTime).format(DATE_FORMAT);
        },
      },
    },
    yAxis: {
      type: "value",
      nameTextStyle: {
        fontSize: 12,
        fontFamily: theme.fontFamily,
      },
      min: 0,
      max: 100,
      interval: 25,
      axisLabel: {
        fontSize: 11,
        formatter: (value: number) => `${value}%`,
      },
    },
    series: getEChartsSeries(),
  };

  return (
    <div className={`${classes.graphContainer} ${className}`}>
      <div className={errorMetricsClasses.graphTitleContainer}>
        <div className={classes.graphTitle}>{getGraphTitle()}</div>
      </div>

      <div className={classes.absoluteCardContainer}>
        <AbsoluteNumbersForGraphs
          data={`${metrics?.errorRate?.toFixed(2) || "0"}%`}
          title="Error Rate"
          color="red-6"
        />
        <AbsoluteNumbersForGraphs
          data={`${metrics?.crashRate?.toFixed(2) || "0"}%`}
          title="Crashes"
          color="gray-7"
        />
        <AbsoluteNumbersForGraphs
          data={`${metrics?.anrRate?.toFixed(2) || "0"}%`}
          title="ANR"
          color="gray-7"
        />
        <AbsoluteNumbersForGraphs
          data={`${metrics?.networkErrorRate?.toFixed(2) || "0"}%`}
          title="Network Errors"
          color="gray-7"
        />
      </div>

      <LineChart option={option} height={220} withLegend={false} />
    </div>
  );
}
