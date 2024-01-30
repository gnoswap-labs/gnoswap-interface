import { WRAPPED_GNOT_PATH } from "@common/clients/wallet-client/transaction-messages";
import { GNOT_TOKEN } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";
import { useGetTokenByPath } from "@query/token";
import { useCallback } from "react";
const GNOT_PATH = "gnot";

export const useGnotToGnot = () => {
  const { data: gnot } = useGetTokenByPath(GNOT_PATH);
  const { data: wugnot } = useGetTokenByPath(WRAPPED_GNOT_PATH);

  const getGnotPath = useCallback((token: any) => {
    return {
      path: token?.path === WRAPPED_GNOT_PATH ? (gnot?.path || "") : (token?.path || ""),
      name: token?.path === WRAPPED_GNOT_PATH ? (gnot?.name || "") : (token?.name || ""),
      symbol: token?.path === WRAPPED_GNOT_PATH ? (gnot?.symbol || "") : (token?.symbol || ""),
      logoURI: token?.path === WRAPPED_GNOT_PATH ? (gnot?.logoURI || "") : (token?.logoURI || ""),
    };
  }, [gnot]);

  const convertToNative = useCallback((token: TokenModel | null) => {
    if (token === null) {
      return null;
    }
    if (token.wrappedPath === WRAPPED_GNOT_PATH) {
      return GNOT_TOKEN;
    }
    return token;
  }, []);

  return {
    gnot,
    wugnot,
    wugnotPath: WRAPPED_GNOT_PATH,
    getGnotPath,
    convertToNative,
  };
};