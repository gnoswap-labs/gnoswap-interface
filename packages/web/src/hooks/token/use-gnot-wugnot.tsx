import { useCallback } from "react";
import { useGetToken } from "@query/token";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";

const GNOT_PATH = "gnot";

export const useGnotToGnot = () => {
  const { data: gnot, isFetched } = useGetToken(GNOT_PATH);
  const { data: wugnot } = useGetToken(WRAPPED_GNOT_PATH);

  const getGnotPath = useCallback(
    (
      token:
        | {
            path?: string;
            name?: string;
            logoURI?: string;
            symbol?: string;
          }
        | null
        | undefined,
    ) => {
      return {
        path:
          token?.path === WRAPPED_GNOT_PATH
            ? gnot?.path || ""
            : token?.path || "",
        name:
          token?.path === WRAPPED_GNOT_PATH
            ? gnot?.name || ""
            : token?.name || "",
        symbol:
          token?.path === WRAPPED_GNOT_PATH
            ? gnot?.symbol || ""
            : token?.symbol || "",
        logoURI:
          token?.path === WRAPPED_GNOT_PATH
            ? gnot?.logoURI || ""
            : token?.logoURI || "",
      };
    },
    [gnot],
  );

  return {
    gnot,
    wugnot,
    wugnotPath: WRAPPED_GNOT_PATH,
    getGnotPath,
    isFetched,
  };
};
