export type GetQueryHistoryQueryParams = {
  queryParams: {
    emailId: string | null;
  } | null;
};

export type GetQueryHistoryResponse = {
  totalQueries: number;
  queries: Array<string>;
};
