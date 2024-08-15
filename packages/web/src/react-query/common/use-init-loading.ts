import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { wait } from "@utils/common";

import { QUERY_KEY } from "../query-keys";

const DEFAULT_LOADING_TIME = 1_500;

export const useInitLoading = (options?: UseQueryOptions<boolean, Error>) => {
  return useQuery<boolean, Error>({
    queryKey: [QUERY_KEY.initLoading],
    queryFn: () =>
      wait<boolean>(async () => true, DEFAULT_LOADING_TIME)
        .then(() => true)
        .catch(() => true),
    ...options,
  });
};
