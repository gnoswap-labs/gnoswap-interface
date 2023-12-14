import { useQueryClient } from "@tanstack/react-query";

export const useValidateRefectQuery = () => {
  const client = useQueryClient();

  return client.invalidateQueries.bind(client);
};
