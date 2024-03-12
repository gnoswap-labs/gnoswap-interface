import { WRAPPED_GNOT_PATH } from "@common/clients/wallet-client/transaction-messages";
import { useGetTokensList } from "@query/token";
import { useCallback } from "react";

export const useTokenImage = () => {
  const { data: { tokens = [] } = {} } = useGetTokensList();
  const getTokenImage = useCallback((tokenId: string): string | null => {
    const temp = tokenId === WRAPPED_GNOT_PATH ? "gnot" : tokenId;
    return tokens.find(token => token.path === temp)?.logoURI || null;
  }, [tokens]);

  const getTokenSymbol = useCallback((tokenId: string): string | null => {
    const temp = tokenId === WRAPPED_GNOT_PATH ? "gnot" : tokenId;
    return tokens.find(token => token.path === temp)?.symbol || null;
  }, [tokens]);

  return {
    getTokenImage,
    getTokenSymbol,
  };
};