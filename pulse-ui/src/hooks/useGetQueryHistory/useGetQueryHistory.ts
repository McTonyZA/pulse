import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ROUTES } from "../../constants";
import { getQueryParamString } from "../../helpers/queryParams";
import {
  GetQueryHistoryQueryParams,
  GetQueryHistoryResponse,
} from "./useGetQueryHistory.interface";
import { makeRequest } from "../../helpers/makeRequest";

export const useGetQueryHistory = ({
  queryParams = null,
}: GetQueryHistoryQueryParams) => {
  const getQueryHistory = API_ROUTES.GET_QUERY_HISTORY;
  const filteredQueryParams = filterNonNullParams(queryParams);

  const searchParams = getQueryParamString(filteredQueryParams);

  return useQuery({
    queryKey: [getQueryHistory.key],
    queryFn: async () => {
      return makeRequest<GetQueryHistoryResponse>({
        url: `${API_BASE_URL}${getQueryHistory.apiPath}${searchParams}`,
        init: {
          method: getQueryHistory.method,
        },
      });
    },
    refetchOnWindowFocus: false,
  });
};

function filterNonNullParams(
  params: GetQueryHistoryQueryParams["queryParams"],
): Partial<GetQueryHistoryQueryParams["queryParams"]> {
  if (!params) {
    return {};
  }

  // Filter out the entries with null values
  const filteredEntries = Object.entries(params).filter(
    ([_, value]) => value !== null,
  );

  // Rebuild the object without null values
  return Object.fromEntries(filteredEntries);
}
