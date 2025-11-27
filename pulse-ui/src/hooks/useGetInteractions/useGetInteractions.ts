import { useQuery } from "@tanstack/react-query";
import {
  getQueryParamString,
  removeUndefinedValues,
} from "../../helpers/queryParams";
import { API_BASE_URL, API_ROUTES } from "../../constants";
import {
  GetInteractionsQueryParams,
  GetInteractionsResponse,
} from "./useGetInteractions.interface";
import { makeRequest } from "../../helpers/makeRequest";

export const useGetInteractions = ({
  queryParams = null,
  enabled = true,
  pageIdentifier = "details",
}: GetInteractionsQueryParams) => {
  const getInteractions = API_ROUTES.GET_INTERACTIONS;
  const searchParams = getQueryParamString(
    removeUndefinedValues(queryParams || {}),
  );

  return useQuery({
    queryKey: [
      getInteractions.key,
      pageIdentifier,
      queryParams?.interactionName,
      queryParams?.userEmail,
      queryParams?.status,
    ],
    queryFn: async () => {
      return makeRequest<GetInteractionsResponse>({
        url: `${API_BASE_URL}${getInteractions.apiPath}${searchParams}`,
        init: {
          method: getInteractions.method,
        },
      });
    },
    refetchOnWindowFocus: false,
    enabled: enabled,
    staleTime: 0,
  });
};
