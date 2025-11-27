import { EChartsReactProps } from "echarts-for-react";

export interface LineChartProps extends EChartsReactProps {
  height?: number;
  zoom?: boolean;
  withLegend?: boolean;
  tooltipValueFormatter?: (value: any) => string;
  syncTooltips?: boolean;
  group?: string;
}
