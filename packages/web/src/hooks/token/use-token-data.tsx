import { GNOT_TOKEN } from "@common/values/token-constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { CardListTokenInfo, UpDownType } from "@models/common/card-list-item-info";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenState } from "@states/index";
import { checkPositivePrice } from "@utils/common";
import { evaluateExpressionToNumber } from "@utils/rpc-utils";
import { convertLargePrice } from "@utils/stake-position-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
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
  
  const gnotToken = useMemo((): TokenModel => {
    const token = tokens.find(token => token.path === "gnot");
    if (token) {
      return token;
    }
    return GNOT_TOKEN;
  }, [tokens]);

  const displayBalanceMap = useMemo(() => {
    const tokenBalanceMap: { [key in string]: number | null } = {};
    Object.keys(balances).forEach(key => {
      const balance = balances[key];
      const token = tokens.find(token => token.priceId === key);
      const exist = token && balance !== null && balance !== undefined;
      tokenBalanceMap[key] = exist ? makeDisplayTokenAmount(token, balance) : null;
    });
    return tokenBalanceMap;
  }, [balances, tokens]);

  const trendingTokens: CardListTokenInfo[] = useMemo(() => {
    const sortedTokens = tokens.sort((t1, t2) => {
      if (tokenPrices[t1.path] && tokenPrices[t2.path]) {
        return BigNumber(tokenPrices[t2.path].volume).toNumber() - BigNumber(tokenPrices[t1.path].volume).toNumber();
      }
      if (tokenPrices[t2.path]) {
        return 1;
      }
      if (tokenPrices[t1.path]) {
        return -1;
      }
      return 0;
    }).filter((_, index) => index < 3);
    return sortedTokens.map(token => {
      const tokenPrice = tokenPrices[token.priceId];
      if (!tokenPrice || BigNumber(tokenPrice.pricesBefore.latestPrice).isNaN() || BigNumber(tokenPrice.pricesBefore.priceToday).isNaN()) {
        return {
          token,
          upDown: "none",
          content: "-"
        };
      }
      const data1D = checkPositivePrice(tokenPrice.pricesBefore.latestPrice, tokenPrice.pricesBefore.priceToday);
      return {
        token,
        upDown: data1D.status === MATH_NEGATIVE_TYPE.POSITIVE ? "up" : "down",
        content: data1D.percent.replace(/[+-]/g, ""),
      };
    });
  }, [tokens, tokenPrices]);

  const recentlyAddedTokens: CardListTokenInfo[] = useMemo(() => {
    const sortedTokens = tokens.sort((t1, t2) => {
      const createTimeOfToken1 = new Date(t1.createdAt).getTime();
      const createTimeOfToken2 = new Date(t2.createdAt).getTime();
      return createTimeOfToken2 - createTimeOfToken1;
    }).filter((_: TokenModel) => !!_.logoURI);
    return sortedTokens.map(token => (
      tokenPrices[token.path] ? {
        token,
        upDown: "none" as UpDownType,
        content: `$${convertLargePrice(tokenPrices[token.path].usd, 10)}`
      } : {
        token,
        upDown: "none" as UpDownType,
        content: "-"
      })).slice(0,3);
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
      if (token.type === "native") {
        return rpcProvider.getBalance(account.address, token.denom || "ugnot")
          .catch(() => null);
      }
      else if (token.type === "grc20") {
        const param = `BalanceOf("${account.address}")`;
        return rpcProvider.evaluateExpression(token.path, param)
          .then(evaluateExpressionToNumber)
          .catch(() => null);
      }
      return null;
    }
    const fetchResults = await Promise.all(tokens.map(fetchTokenBalance));
    const balances: Record<string, number | null> = {};
    fetchResults.forEach((result, index) => {
      if (index < tokens.length) {
        balances[tokens[index].priceId] = result;
      }
    });
    setBalances(balances);
  }

  return {
    gnotToken,
    tokens,
    tokenPrices,
    displayBalanceMap,
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