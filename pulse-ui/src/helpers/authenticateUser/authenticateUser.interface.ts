export type AuthenticateSuccessResponse = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  code: string;
  tokenType: string;
  expiresIn: number;
};

export type AuthenticateErrorResponse = {
  code: number;
  message: string;
  cause: string;
};

export type GoogleDecodedToken = {
  email: string;
  name: string;
};

export type GuardianDecodedToken = {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
};
