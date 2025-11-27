export type MakeRequestConfig = {
  url: RequestInfo | URL;
  init?: RequestInit;
};

export type DefaultErrorResponse = {
  code: string;
  message: string;
  cause: string;
};

export type ApiResponse<D> = {
  data: D | null | undefined;
  error: DefaultErrorResponse | null | undefined;
  status: number;
};
