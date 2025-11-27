import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { API_ROUTES, API_BASE_URL } from "../../constants";
import { ApiResponse, makeRequest } from "../../helpers/makeRequest";
import {
  CancelQueryRequestType,
  CancelQueryResponseType,
} from "./useCancelQuery.interface";
import { GetQueryIdErrorResponse } from "../useRunUniversalQuery";

type useCancelQueryProps = Omit<
  UseMutationOptions<
    ApiResponse<CancelQueryResponseType>,
    GetQueryIdErrorResponse,
    CancelQueryRequestType
  >,
  "mutationFn" | "mutationKey"
> &
  CancelQueryRequestType;
export const useCancelQuery = ({
  onSuccess,
  onError,
  requestId,
}: useCancelQueryProps) => {
  return useMutation<
    ApiResponse<CancelQueryResponseType>,
    GetQueryIdErrorResponse,
    CancelQueryRequestType
  >({
    mutationKey: [API_ROUTES.GET_QUERY_ID.key, requestId],
    mutationFn: async (requestBody) =>
      makeRequest<CancelQueryResponseType>({
        url: `${API_BASE_URL}${API_ROUTES.CANCEL_QUERY.apiPath}`,
        init: {
          method: API_ROUTES.GET_QUERY_ID.method,
          body: JSON.stringify(requestBody),
        },
      }),
    onSuccess,
    onError,
  });
};
