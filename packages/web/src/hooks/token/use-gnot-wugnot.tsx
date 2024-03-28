import { WRAPPED_GNOT_PATH } from "@common/clients/wallet-client/transaction-messages";
import { useGetTokenByPath } from "@query/token";
import { useCallback } from "react";
const GNOT_PATH = "gnot";

export const useGnotToGnot = () => {
  const { data: gnot, isFetched } = useGetTokenByPath(GNOT_PATH);
  const { data: wugnot } = useGetTokenByPath(WRAPPED_GNOT_PATH);

  const getGnotPath = useCallback((token: any) => {
    return {
      path: token?.path === WRAPPED_GNOT_PATH ? (gnot?.path || "") : (token?.path || ""),
      name: token?.path === WRAPPED_GNOT_PATH ? (gnot?.name || "") : (token?.name || ""),
      symbol: token?.path === WRAPPED_GNOT_PATH ? (gnot?.symbol || "") : (token?.symbol || ""),
      logoURI: token?.path === WRAPPED_GNOT_PATH ? (gnot?.logoURI || "") : (token?.logoURI || ""),
    };
  }, [gnot]);

  return {
    gnot,
    wugnot,
    wugnotPath: WRAPPED_GNOT_PATH,
    getGnotPath,
    isFetched,
  };
};