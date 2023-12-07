import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenState } from "@states/index";
import { evaluateExpressionToNumber } from "@utils/rpc-utils";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

export const useTokenData = () => {
  const { account } = useWallet();
  const { rpcProvider, tokenRepository } = useGnoswapContext();
  const [tokens, setTokens] = useAtom(TokenState.tokens);
  const [tokenPrices, setTokenPrices] = useAtom(TokenState.tokenPrices);
  const [balances, setBalances] = useAtom(TokenState.balances);
  const [loading, setLoading] = useAtom(TokenState.isLoading);

  const trendingTokens: CardListTokenInfo[] = useMemo(() => {
    const sortedTokens = tokens.sort((t1, t2) => {
      if (tokenPrices[t1.priceId] && tokenPrices[t2.priceId]) {
        return BigNumber(tokenPrices[t2.priceId].volume).toNumber() - BigNumber(tokenPrices[t1.priceId].volume).toNumber();
      }
      if (tokenPrices[t2.priceId]) {
        return 1;
      }
      if (tokenPrices[t1.priceId]) {
        return -1;
      }
      return 0;
    }).filter((_, index) => index < 3);
    return sortedTokens.map(token => {
      const tokenPrice = tokenPrices[token.priceId];
      if (!tokenPrice || BigNumber(tokenPrice.change1d).isNaN()) {
        return {
          token,
          upDown: "none",
          content: "-"
        };
      }
      return {
        token,
        upDown: BigNumber(tokenPrice.change1d).isPositive() ? "up" : "down",
        content: `${BigNumber(tokenPrice.change1d).toFixed()}%`
      };
    });
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

  const getTokenUSDPrice = useCallback((tokenAId: string, amount: bigint | string | number) => {
    const tokenUSDPrice = tokenPrices[tokenAId]?.usd || "0";
    if (!tokenUSDPrice || Number.isNaN(amount)) {
      return null;
    }
    return BigNumber(amount.toString()).multipliedBy(tokenUSDPrice).toNumber();
  }, [tokenPrices]);

  const getTokenPriceRate = useCallback((tokenAId: string, tokenBId: string) => {
    const tokenAUSDPrice = tokenPrices[tokenAId]?.usd;
    const tokenBUSDPrice = tokenPrices[tokenBId]?.usd;
    if (!tokenAUSDPrice || !tokenBUSDPrice) {
      return null;
    }
    return BigNumber(tokenBUSDPrice).dividedBy(tokenAUSDPrice).toNumber();
  }, [tokenPrices]);

  async function updateTokens() {
    const response = await tokenRepository.getTokens();
    setLoading(false);
    setTokens(response?.tokens || []);
  }

  async function updateTokenPrices() {
    const response = await tokenRepository.getTokenPrices();
    const priceMap = response.prices.reduce<Record<string, TokenPriceModel>>((prev, current) => {
      prev[current.path] = current;
      return prev;
    }, {});
    setTokenPrices(priceMap);
  }

  async function updateBalances() {
    if (!rpcProvider) {
      return;
    }
    async function fetchTokenBalance(token: TokenModel) {
      if (!rpcProvider || !account) {
        return null;
      }
      const param = `BalanceOf("${account.address}")`;
      return rpcProvider.evaluateExpression(token.path, param)
        .then(evaluateExpressionToNumber)
        .catch(() => null);
    }
    const fetchResults = await Promise.all(tokens.map(fetchTokenBalance));
    const balances: Record<string, number | null> = {};
    fetchResults.forEach((result, index) => {
      if (index < tokens.length) {
        balances[tokens[index].path] = result;
      }
    });
    setBalances(balances);
  }

  return {
    tokens,
    tokenPrices,
    balances,
    trendingTokens,
    recentlyAddedTokens,
    getTokenUSDPrice,
    getTokenPriceRate,
    updateTokens,
    updateTokenPrices,
    updateBalances,
    loading,
  };
};