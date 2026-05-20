import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

import { GNOT_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { CardListTokenInfo, UpDownType } from "@models/common/card-list-item-info";
import { isNativeTokenByType, TokenModel } from "@models/token/token-model";
import { useGetAllTokenPrices, useGetGrc20Balances, useGetTokens } from "@query/token";
import { TokenState } from "@states/index";
import { checkPositivePrice } from "@utils/common";
import { toUnitFormat } from "@utils/number-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { isEmptyObject } from "@utils/validation-utils";

import { useGnotToGnot } from "./use-gnot-wugnot";

export const useTokenData = () => {
  const {
    data: { tokens = [] } = {},
    isLoading: loading,
    isFetched,
    error,
    refetch: refetchTokenList,
  } = useGetTokens();
  const {
    data: tokenPrices = {},
    isLoading: isLoadingTokenPrice,
    isFetched: isFetchedTokenPrices,
    refetch: refetchTokenPrices,
  } = useGetAllTokenPrices();
  const { account, availNetwork, refetchGnotBalance } = useWallet();
  const {
    data: grc20BalancesData,
    isLoading: isLoadingGrc20Balances,
    refetch: refetchGrc20Balances,
  } = useGetGrc20Balances(account?.address || "", { enabled: !!account?.address });

  const { rpcProvider } = useGnoswapContext();
  const [balances, setBalances] = useAtom(TokenState.balances);
  const [loadingBalance, setLoadingBalance] = useAtom(TokenState.isLoadingBalances);
  const [isChangeBalancesToken, setIsChangeBalancesToken] = useAtom(TokenState.isChangeBalancesToken);
  const { getGnotPath } = useGnotToGnot();

  const gnotToken = useMemo((): TokenModel => {
    const token = tokens.find(token => token.path === "ugnot");
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
      tokenBalanceMap[key] = exist ? makeDisplayTokenAmount(token, balance) : null;
    });
    return tokenBalanceMap;
  }, [balances, tokens]);

  const trendingTokens: CardListTokenInfo[] = useMemo(() => {
    const sortedTokens = tokens
      .sort((t1: { path: string }, t2: { path: string }) => {
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
      })
      .filter((_: unknown, index: number) => index < 3);
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
            displaySymbol: getGnotPath(token).displaySymbol,
            name: getGnotPath(token).name,
            logoURI: getGnotPath(token).logoURI,
          },
          upDown: "none",
          content: "-",
        };
      }
      const data1D = checkPositivePrice(tokenPrice.pricesBefore.latestPrice, tokenPrice.pricesBefore.priceToday);

      return {
        token: {
            ...token,
            symbol: getGnotPath(token).symbol,
            displaySymbol: getGnotPath(token).displaySymbol,
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
                displaySymbol: getGnotPath(token).displaySymbol,
                name: getGnotPath(token).name,
                logoURI: getGnotPath(token).logoURI,
              },
              upDown: "none" as UpDownType,
              content: `${toUnitFormat(tokenPrices[token.path].usd, true, false)}`,
            }
          : {
              token: {
                ...token,
                symbol: getGnotPath(token).symbol,
                displaySymbol: getGnotPath(token).displaySymbol,
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

  const getTokenSymbol = useCallback(
    (tokenPath: string): string | null => {
      if (tokenPath === XGNS_TOKEN.path) {
        return XGNS_TOKEN.symbol;
      }

      const token = tokens.find(token => token.path === tokenPath);
      if (token) {
        return token.symbol;
      }

      return null;
    },
    [tokens],
  );

  const getTokenUSDPrice = useCallback(
    (tokenAId: string, amount: bigint | string | number) => {
      const tokenUSDPrice = tokenPrices[tokenAId]?.usd || "0";
      if (!tokenUSDPrice || Number.isNaN(amount)) {
        return null;
      }
      return BigNumber(amount.toString()).multipliedBy(tokenUSDPrice).toNumber();
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
    refetchTokenList();
  }

  async function updateTokenPrices() {
    refetchTokenPrices();
  }

  const fetchNativeTokenBalance = useCallback(
    async (token: TokenModel) => {
      if (!rpcProvider || !account || !availNetwork) {
        return null;
      }

      const res = await rpcProvider.getBalance(account.address, token.denom || "ugnot").catch(() => null);
      return res;
    },
    [account, availNetwork, rpcProvider],
  );

  const getGrc20Balance = useCallback(
    (token: TokenModel) => {
      if (!grc20BalancesData?.data) {
        return 0;
      }
      const balance = grc20BalancesData.data.find(balance => balance.path === token.path);
      return balance ? Number(balance.amount) : 0;
    },
    [grc20BalancesData],
  );

  const fetchTokenBalance = async (token: TokenModel) => {
    try {
      if (!rpcProvider || !account || !availNetwork) {
        return null;
      }

      if (isNativeTokenByType(token.type)) {
        return await fetchNativeTokenBalance(token);
      }

      return getGrc20Balance(token);
    } catch (error) {
      console.log(`Failed to fetch balance for token ${token.symbol}: `, error);
      return null;
    }
  };

  const updateBalances = async () => {
    if (!rpcProvider || !account) {
      return;
    }

    if ((isEmptyObject(balances) && loadingBalance) || isLoadingGrc20Balances) {
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

    if (JSON.stringify(balancesData) !== JSON.stringify(balances) && !isEmptyObject(balancesData)) {
      refetchGnotBalance();
      refetchGrc20Balances();
      setIsChangeBalancesToken(true);
      setBalances(balancesData);
    }

    setLoadingBalance(false);
  };

  /**
   * Update the overall balance whenever GRC20 token balance data changes
   *
   *  * Key trigger situations:
   * 1. after completion of a transaction (SWAP, ADD LIQUIDITY, etc.)
   * 2. automatic refetch of useGetGrc20Balances (every 5 seconds)
   * 3. when calling refetchGrc20Balances manually
   *.
   * Update process:
   * 1. Get Native Token (GNOT) balance.
   * 2. Get all GRC20 token balances
   * 3. compare with previous balance and update status only if there are changes
   */
  useEffect(() => {
    updateBalances();
  }, [grc20BalancesData]);

  return {
    gnotToken,
    tokens,
    tokenPrices,
    displayBalanceMap,
    balances,
    trendingTokens,
    recentlyAddedTokens,
    getTokenSymbol,
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
    refetchGrc20Balances,
  };
};
