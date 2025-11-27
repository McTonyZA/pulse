import { ApiResponse } from "../../helpers/makeRequest";

export type CancelQueryRequestType = {
  requestId: string;
};

export type CancelQueryResponseType = {
  success: boolean;
};

export type CancelQueryOnSettledResponse =
  | ApiResponse<CancelQueryResponseType>
  | undefined;

export type OnSettled = (response: CancelQueryOnSettledResponse) => void;
