import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
import { TokenState } from "@states/index";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useMemo } from "react";

export const useTokenData = () => {
  const { tokenRepository } = useGnoswapContext();
  const [tokens, setTokens] = useAtom(TokenState.tokens);
  const [tokenPrices, setTokenPrices] = useAtom(TokenState.tokenPrices);

  const trendingTokens: CardListTokenInfo[] = useMemo(() => {
    const sortedTokens = tokens.sort((t1, t2) => {
      if (tokenPrices[t1.priceId] && tokenPrices[t2.priceId]) {
        return tokenPrices[t2.priceId].volume - tokenPrices[t1.priceId].volume;
      }
      if (tokenPrices[t2.priceId]) {
        return 1;
      }
      if (tokenPrices[t1.priceId]) {
        return -1;
      }
      return 0;
    }).filter((_, index) => index < 3);
    return sortedTokens.map(token => (
      tokenPrices[token.priceId] ? {
        token,
        upDown: tokenPrices[token.priceId].changedBefore1D > 0 ? "up" : "down",
        content: `${BigNumber(tokenPrices[token.priceId].changedBefore1D).toFixed()}%`
      } : {
        token,
        upDown: "none",
        content: "-"
      }));
  }, [tokens, tokenPrices]);

  const recentlyAddedTokens: CardListTokenInfo[] = useMemo(() => {
    const sortedTokens = tokens.sort((t1, t2) => {
      const createTimeOfToken1 = new Date(t1.createdAt).getTime();
      const createTimeOfToken2 = new Date(t2.createdAt).getTime();
      return createTimeOfToken2 - createTimeOfToken1;
    }).filter((_, index) => index < 3);
    return sortedTokens.map(token => (
      tokenPrices[token.priceId] ? {
        token,
        upDown: "none",
        content: `$${tokenPrices[token.priceId].usd}`
      } : {
        token,
        upDown: "none",
        content: "-"
      }));
  }, [tokenPrices, tokens]);

  async function updateTokens() {
    const response = await tokenRepository.getTokens();
    setTokens(response.tokens);
  }

  async function updateTokenPrices() {
    const response = await tokenRepository.getTokenPrices();
    setTokenPrices(response.prices);
  }

  return {
    trendingTokens,
    recentlyAddedTokens,
    updateTokens,
    updateTokenPrices,
  };
};