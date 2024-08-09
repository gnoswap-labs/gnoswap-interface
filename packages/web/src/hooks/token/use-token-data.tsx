import { GNOT_TOKEN } from "@common/values/token-constant";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import {
  CardListTokenInfo,
  UpDownType,
} from "@models/common/card-list-item-info";
import { TokenModel } from "@models/token/token-model";
import { TokenState } from "@states/index";
import { checkPositivePrice } from "@utils/common";
import { evaluateExpressionToNumber } from "@utils/rpc-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useGnotToGnot } from "./use-gnot-wugnot";
import { QUERY_KEY, useGetTokenPrices, useGetTokensList } from "@query/token";
import { useForceRefetchQuery } from "@hooks/common/useForceRefetchQuery";
import { toUnitFormat } from "@utils/number-utils";
import { isEmptyObject } from "@utils/validation-utils";

export const useTokenData = () => {
  const {
    data: { tokens = [] } = {},
    isLoading: loading,
    isFetched,
    error,
  } = useGetTokensList();
  const {
    data: tokenPrices = {},
    isLoading: isLoadingTokenPrice,
    isFetched: isFetchedTokenPrices,
  } = useGetTokenPrices();
  const forceRefect = useForceRefetchQuery();
  const { account, availNetwork, refetchGnotBalance } = useWallet();
  const { rpcProvider } = useGnoswapContext();
  const [balances, setBalances] = useAtom(TokenState.balances);
  const [loadingBalance, setLoadingBalance] = useAtom(
    TokenState.isLoadingBalances,
  );
  const [isChangeBalancesToken, setIsChangeBalancesToken] = useAtom(
    TokenState.isChangeBalancesToken,
  );
  const { getGnotPath } = useGnotToGnot();

  const gnotToken = useMemo((): TokenModel => {
    const token = tokens.find(token => token.path === "gnot");
    if (token) {
      return token;
    }
    return GNOT_TOKEN;
  }, [tokens]);

  const displayBalanceMap = useMemo(() => {
    const tokenBalanceMap: { [key in string]: number | null } = {};
    if (tokens.length === 0) return {};
    Object.keys(balances).forEach(key => {
      const token = tokens.find(token => token.priceID === key);
      const balance = balances[key];
      const exist = token && balance !== null && balance !== undefined;
      tokenBalanceMap[key] = exist
        ? makeDisplayTokenAmount(token, balance)
        : null;
    });
    return tokenBalanceMap;
  }, [balances, tokens]);

  const trendingTokens: CardListTokenInfo[] = useMemo(() => {
    const sortedTokens = tokens
      .sort((t1, t2) => {
        if (tokenPrices[t1.path] && tokenPrices[t2.path]) {
          return (
            BigNumber(tokenPrices[t2.path].volume).toNumber() -
            BigNumber(tokenPrices[t1.path].volume).toNumber()
          );
        }
        if (tokenPrices[t2.path]) {
          return 1;
        }
        if (tokenPrices[t1.path]) {
          return -1;
        }
        return 0;
      })
      .filter((_, index) => index < 3);
    return sortedTokens.map(token => {
      const tokenPrice = tokenPrices[token.priceID];
      if (
        !tokenPrice ||
        BigNumber(tokenPrice.pricesBefore.latestPrice).isNaN() ||
        BigNumber(tokenPrice.pricesBefore.priceToday).isNaN()
      ) {
        return {
          token: {
            ...token,
            symbol: getGnotPath(token).symbol,
            name: getGnotPath(token).name,
            logoURI: getGnotPath(token).logoURI,
          },
          upDown: "none",
          content: "-",
        };
      }
      const data1D = checkPositivePrice(
        tokenPrice.pricesBefore.latestPrice,
        tokenPrice.pricesBefore.priceToday,
      );

      return {
        token: {
          ...token,
          symbol: getGnotPath(token).symbol,
          name: getGnotPath(token).name,
          logoURI: getGnotPath(token).logoURI,
        },
        upDown: data1D.status === MATH_NEGATIVE_TYPE.POSITIVE ? "up" : "down",
        content: data1D.percentDisplay.replace(/[+-]/g, ""),
      };
    });
  }, [tokens, tokenPrices]);

  const recentlyAddedTokens: CardListTokenInfo[] = useMemo(() => {
    const sortedTokens = tokens
      .sort((t1, t2) => {
        const createTimeOfToken1 = new Date(t1.createdAt).getTime();
        const createTimeOfToken2 = new Date(t2.createdAt).getTime();
        return createTimeOfToken2 + createTimeOfToken1;
      })
      .filter((_: TokenModel) => !!_.logoURI);
    return sortedTokens
      .map(token =>
        tokenPrices[token.path]
          ? {
              token: {
                ...token,
                symbol: getGnotPath(token).symbol,
                name: getGnotPath(token).name,
                logoURI: getGnotPath(token).logoURI,
              },
              upDown: "none" as UpDownType,
              content: `${toUnitFormat(
                tokenPrices[token.path].usd,
                true,
                false,
              )}`,
            }
          : {
              token: {
                ...token,
                symbol: getGnotPath(token).symbol,
                name: getGnotPath(token).name,
                logoURI: getGnotPath(token).logoURI,
              },
              upDown: "none" as UpDownType,
              content: "-",
            },
      )
      .filter((_: CardListTokenInfo) => _.content !== "-")
      .slice(0, 3);
  }, [tokenPrices, tokens]);

  const getTokenUSDPrice = useCallback(
    (tokenAId: string, amount: bigint | string | number) => {
      const tokenUSDPrice = tokenPrices[tokenAId]?.usd || "0";
      if (!tokenUSDPrice || Number.isNaN(amount)) {
        return null;
      }
      return BigNumber(amount.toString())
        .multipliedBy(tokenUSDPrice)
        .toNumber();
    },
    [tokenPrices],
  );

  const getTokenPriceRate = useCallback(
    (tokenAId: string, tokenBId: string) => {
      const tokenAUSDPrice = tokenPrices[tokenAId]?.usd;
      const tokenBUSDPrice = tokenPrices[tokenBId]?.usd;
      if (!tokenAUSDPrice || !tokenBUSDPrice) {
        return null;
      }
      return BigNumber(tokenBUSDPrice).dividedBy(tokenAUSDPrice).toNumber();
    },
    [tokenPrices],
  );

  async function updateTokens() {
    forceRefect({ queryKey: [QUERY_KEY.tokens] });
  }

  async function updateTokenPrices() {
    forceRefect({ queryKey: [QUERY_KEY.tokenPrices] });
  }

  const fetchTokenBalance = useCallback(
    async (token: TokenModel) => {
      if (!rpcProvider || !account || !availNetwork) {
        return null;
      }
      if (token.type === "native") {
        const res = await rpcProvider
          .getBalance(account.address, token.denom || "ugnot")
          .catch(() => null);
        return res;
      } else if (token.type === "grc20") {
        const param = `BalanceOf("${account.address}")`;
        const res = await rpcProvider
          .evaluateExpression(token.path, param)
          .then(evaluateExpressionToNumber)
          .catch(() => null);
        return res;
      }
      return null;
    },
    [account, availNetwork, rpcProvider],
  );

  const updateBalances = useCallback(async () => {
    if (!rpcProvider || !account) {
      return;
    }

    if (isEmptyObject(balances) && loadingBalance) {
      setLoadingBalance(true);
    }

    if (tokens.length === 0) return;
    const fetchResults = await Promise.all(
      tokens.map(async token => {
        const result = await fetchTokenBalance(token);
        return {
          priceID: token.priceID,
          balance: result,
        };
      }),
    );
    const balancesData: Record<string, number | null> = {};
    fetchResults.forEach((result, index) => {
      if (index < tokens.length) {
        balancesData[result.priceID] = result.balance;
      }
    });
    if (
      JSON.stringify(balancesData) !== JSON.stringify(balances) &&
      !isEmptyObject(balancesData)
    ) {
      refetchGnotBalance();
      setIsChangeBalancesToken(true);
      setBalances(balancesData);
    }
    setLoadingBalance(false);
  }, [
    availNetwork,
    account,
    balances,
    fetchTokenBalance,
    loadingBalance,
    rpcProvider,
    tokens,
  ]);

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
    loadingBalance,
    isFetched,
    isFetchedTokenPrices,
    error,
    isLoadingTokenPrice,
    isChangeBalancesToken,
    setIsChangeBalancesToken,
  };
};
