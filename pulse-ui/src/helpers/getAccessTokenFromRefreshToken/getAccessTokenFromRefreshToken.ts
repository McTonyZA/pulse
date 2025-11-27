import { API_ROUTES, API_BASE_URL, COOKIES_KEY } from "../../constants";
import { getCookies, setCookies } from "../cookies";
import { ApiResponse } from "../makeRequest";
import { makeRequestToServer } from "../makeRequestToServer";
import { GetAccessTokenFromRefreshTokenSuccessResponse } from "./getAccessTokenFromRefreshToken.interface";

export const getAndSetAccessTokenFromRefreshToken = async (
  retryLimit: number = 3,
): Promise<boolean> => {
  try {
    if (retryLimit === 0) {
      return false;
    }

    const response = await makeRequestToServer({
      url: `${API_BASE_URL}${API_ROUTES.REFRESH_TOKEN.apiPath}`,
      init: {
        method: API_ROUTES.REFRESH_TOKEN.method,
        body: JSON.stringify({
          refreshToken: `${getCookies(COOKIES_KEY.REFRESH_TOKEN)}`,
        }),
      },
    });

    if (response.status === 200) {
      const {
        data,
      }: ApiResponse<GetAccessTokenFromRefreshTokenSuccessResponse> =
        await response.json();
      if (data?.accessToken && data?.refreshToken && data?.tokenType) {
        setCookies(COOKIES_KEY.ACCESS_TOKEN, data.accessToken);
        setCookies(COOKIES_KEY.REFRESH_TOKEN, data.refreshToken);
        setCookies(COOKIES_KEY.TOKEN_TYPE, data.tokenType);
        return true;
      }
      return false;
    }

    if (response.status >= 400 && response.status < 500) {
      return getAndSetAccessTokenFromRefreshToken(--retryLimit);
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
