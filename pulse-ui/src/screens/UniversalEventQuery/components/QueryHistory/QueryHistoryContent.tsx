import { useGetQueryHistory } from "../../../../hooks/useGetQueryHistory";
import { getCookies } from "../../../../helpers/cookies";
import { COOKIES_KEY } from "../../../../constants";
import { QueryList } from "../QueryList";

export const QueryHistoryContent: React.FC = () => {
  const { data: response, isLoading } = useGetQueryHistory({
    queryParams: { emailId: getCookies(COOKIES_KEY.USER_EMAIL) || "" },
  });

  const data: string[] = response?.data?.queries || [];

  const resolvedData = (data || []).map((query) => ({
    query,
  }));

  return (
    <QueryList
      loadMessage="Fetching History..."
      data={resolvedData}
      response={response}
      isLoading={isLoading}
    />
  );
};
