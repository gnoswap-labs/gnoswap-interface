import { TokenState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export const useTokenImage = () => {
  const [tokens] = useAtom(TokenState.tokens);

  const getTokenImage = useCallback((tokenId: string): string | null => {
    return tokens.find(token => token.path === tokenId)?.logoURI || null;
  }, [tokens]);

  return {
    getTokenImage
  };
};