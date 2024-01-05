import { useGetTokensList } from "@query/token";
import { useCallback } from "react";

export const useTokenImage = () => {
  const { data: { tokens = [] } = {} } = useGetTokensList();
  const getTokenImage = useCallback((tokenId: string): string | null => {
    return tokens.find(token => token.path === tokenId)?.logoURI || null;
  }, [tokens]);

  const getTokenSymbol = useCallback((tokenId: string): string | null => {
    return tokens.find(token => token.path === tokenId)?.symbol || null;
  }, [tokens]);

  return {
    getTokenImage,
    getTokenSymbol,
  };
};