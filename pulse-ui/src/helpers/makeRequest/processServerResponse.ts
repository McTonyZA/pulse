import { ApiResponse } from "./makeRequest.interface";

export const processServerResponse = async <D>(
  response: Response,
): Promise<ApiResponse<D>> => {
  const status = response.status;
  const { data, error } = await response.json();

  if (data) {
    return {
      status: status,
      data: data,
      error: null,
    };
  } else {
    return {
      status: status,
      data: null,
      error: error,
    };
  }
};
