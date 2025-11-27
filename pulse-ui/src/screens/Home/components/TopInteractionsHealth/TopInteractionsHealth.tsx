import { TopInteractionsHealthProps } from "./TopInteractionsHealth.interface";
import classes from "./TopInteractionsHealth.module.css";
import { InteractionCard } from "../../../CriticalInteractionList/components/InteractionCard";
import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useGetDataQuery } from "../../../../hooks";
import { useMemo } from "react";
import dayjs from "dayjs";
import { SpanType } from "../../../../constants/PulseOtelSemcov";

export function TopInteractionsHealth({
  onViewAll,
  onCardClick,
}: TopInteractionsHealthProps) {
  const { startTime, endTime } = useMemo(() => {
    return {
      startTime: dayjs()
        .utc()
        .endOf("day")
        .subtract(6, "days")
        .startOf("day")
        .toISOString(),
      endTime: dayjs().utc().endOf("day").toISOString(),
    };
  }, []);
  // Fetch top 5 interactions data
  const { data } = useGetDataQuery({
    requestBody: {
      dataType: "TRACES",
      timeRange: {
        start: startTime,
        end: endTime,
      },
      select: [
        {
          function: "COL",
          param: { field: "SpanName" },
          alias: "interaction_name",
        },
        {
          function: "CUSTOM",
          param: { expression: "COUNT()" },
          alias: "spanfreq",
        },
        { function: "APDEX", alias: "apdex" },
        { function: "INTERACTION_SUCCESS_COUNT", alias: "success_count" },
        { function: "INTERACTION_ERROR_COUNT", alias: "error_count" },
        { function: "USER_CATEGORY_EXCELLENT", alias: "user_excellent" },
        { function: "USER_CATEGORY_GOOD", alias: "user_good" },
        { function: "USER_CATEGORY_AVERAGE", alias: "user_avg" },
        { function: "USER_CATEGORY_POOR", alias: "user_poor" },
        { function: "DURATION_P50", alias: "p50" },
      ],
      filters: [{ field: "SpanType", operator: "EQ", value: [SpanType.INTERACTION] }],
      groupBy: ["interaction_name"],
      orderBy: [{ field: "spanfreq", direction: "DESC" }],
      limit: 4,
    },
    enabled: !!startTime && !!endTime,
  });

  // Transform API response to card props
  const topInteractionsData = useMemo(() => {
    const responseData = data?.data;
    if (!responseData || !responseData.rows || responseData.rows.length === 0) {
      return [];
    }

    const fields = responseData.fields;
    const interactionNameIndex = fields.indexOf("interaction_name");
    const apdexIndex = fields.indexOf("apdex");
    const successCountIndex = fields.indexOf("success_count");
    const errorCountIndex = fields.indexOf("error_count");
    const userExcellentIndex = fields.indexOf("user_excellent");
    const userGoodIndex = fields.indexOf("user_good");
    const userAvgIndex = fields.indexOf("user_avg");
    const userPoorIndex = fields.indexOf("user_poor");
    const p50Index = fields.indexOf("p50");

    return responseData.rows.map((row, index) => {
      const successCount = parseFloat(row[successCountIndex]) || 0;
      const errorCount = parseFloat(row[errorCountIndex]) || 0;
      const totalRequests = successCount + errorCount;

      const userExcellent = parseFloat(row[userExcellentIndex]) || 0;
      const userGood = parseFloat(row[userGoodIndex]) || 0;
      const userAvg = parseFloat(row[userAvgIndex]) || 0;
      const userPoor = parseFloat(row[userPoorIndex]) || 0;
      const totalUsers = userExcellent + userGood + userAvg + userPoor;

      return {
        id: index,
        interactionName: row[interactionNameIndex],
        apdex: parseFloat(row[apdexIndex]) || 0,
        errorRate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0,
        p50: parseFloat(row[p50Index]) || 0,
        poorUserPercentage: totalUsers > 0 ? (userPoor / totalUsers) * 100 : 0,
      };
    });
  }, [data]);

  return (
    <div>
      <div className={classes.headerContainer}>
        <h2 className={classes.sectionTitle}>Top Interactions Health</h2>
        <Button
          variant="subtle"
          rightSection={<IconArrowRight size={16} />}
          onClick={onViewAll}
          className={classes.viewAllButton}
        >
          View All
        </Button>
      </div>
      <div className={classes.interactionsGrid}>
        {topInteractionsData.map((interaction) => (
          <InteractionCard
            key={interaction.id}
            interactionName={interaction.interactionName}
            apdexScore={interaction.apdex}
            errorRateValue={interaction.errorRate}
            p50Latency={interaction.p50}
            poorUserPercentage={interaction.poorUserPercentage}
            onClick={() =>
              onCardClick({
                id: interaction.id,
                name: interaction.interactionName,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
