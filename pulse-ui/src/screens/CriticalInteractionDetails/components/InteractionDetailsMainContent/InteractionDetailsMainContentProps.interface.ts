import { InteractionDetailsResponse } from "../../../../hooks/useGetInteractionDetails/useGetInteractionDetails.interface";
import { CriticalInteractionDetailsFilterValues } from "../../CriticalInteractionDetails.interface";

export type InteractionDetailsMainContentProps = {
  jobDetails?: InteractionDetailsResponse;
  dashboardFilters?: CriticalInteractionDetailsFilterValues;
  startTime?: string;
  endTime?: string;
  orientation?: "horizontal" | "vertical";
};
