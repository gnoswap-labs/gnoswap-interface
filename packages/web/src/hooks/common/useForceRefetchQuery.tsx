import { useQueryClient } from "@tanstack/react-query";

export const useForceRefetchQuery = () => {
  const client = useQueryClient();

  return client.fetchQuery.bind(client);
};
