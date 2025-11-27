import { jwtDecode } from "jwt-decode";
import {
  AuthenticateSuccessResponse,
  GuardianDecodedToken,
} from "../authenticateUser";
import { setCookies } from "../cookies";
import { COOKIES_KEY } from "../../constants";

export const setCookiesAfterAuthentication = (
  authenticationSuccessResponse: AuthenticateSuccessResponse,
) => {
  const { accessToken, refreshToken, idToken, tokenType, expiresIn } =
    authenticationSuccessResponse;

  const { email, profilePicture, firstName, lastName } =
    jwtDecode<GuardianDecodedToken>(idToken);

  setCookies(COOKIES_KEY.USER_EMAIL, email);
  setCookies(COOKIES_KEY.USER_NAME, `${firstName} ${lastName}`);
  setCookies(COOKIES_KEY.USER_PICTURE, profilePicture);
  setCookies(COOKIES_KEY.ACCESS_TOKEN, accessToken);
  setCookies(COOKIES_KEY.REFRESH_TOKEN, refreshToken);
  setCookies(COOKIES_KEY.TOKEN_TYPE, tokenType);
  setCookies(COOKIES_KEY.EXPIRES_IN, `${expiresIn}`);
};
