import { useCallback, useEffect, useMemo } from "react";

import { GNS_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { GNS_TOKEN_PATH, WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useReferral } from "@hooks/common/use-referral";
import { usePoolData } from "@hooks/pool/data/use-pool-data";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolModel } from "@models/pool/pool-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { useGetPoolCreationFee, useGetRPCPoolsBy } from "@query/pools";
import { AddLiquidityRequest } from "@repositories/pool/request/add-liquidity-request";
import { CreatePoolRequest } from "@repositories/pool/request/create-pool-request";
import { checkGnotPath } from "@utils/common";
import { sortTokenPaths } from "@utils/sort-utils";

interface Props {
  compareToken: TokenModel | null;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  isReverted?: boolean;
}

export const usePool = ({ compareToken, tokenA, tokenB, isReverted = false }: Props) => {
  const { getNextReferralAddress } = useReferral();

  const { account } = useWallet();
  const { poolRepository } = useGnoswapContext();
  const { pools, updatePools, isFetchedPools, loading } = usePoolData();
  const { tokens, isFetched: isFetchedTokens } = useTokenData(true);
  const gnsToken = useMemo(() => tokens.find(token => token.path === GNS_TOKEN_PATH) ?? GNS_TOKEN, [tokens]);
  const wugnotToken = useMemo(() => tokens.find(token => token.path === WRAPPED_GNOT_PATH) ?? WUGNOT_TOKEN, [tokens]);
  const { data: createPoolFee } = useGetPoolCreationFee();

  const allPoolPaths = useMemo(() => {
    if (!tokenA || !tokenB) {
      return [];
    }
    const tokenATokenPath = checkGnotPath(tokenA.path);
    const tokenBTokenPath = checkGnotPath(tokenB.path);
    const tokenPair = [tokenATokenPath, tokenBTokenPath].sort(sortTokenPaths);

    return [
      SwapFeeTierInfoMap.FEE_100,
      SwapFeeTierInfoMap.FEE_500,
      SwapFeeTierInfoMap.FEE_3000,
      SwapFeeTierInfoMap.FEE_10000,
    ].map(feeInfo => `${tokenPair[0]}:${tokenPair[1]}:${feeInfo.fee}`);
  }, [tokenA, tokenB]);

  const { data: rpcPools, isLoading: isLoadingRPCPools, refetch: refetchRPCPools } = useGetRPCPoolsBy(allPoolPaths);

  const feetierOfLiquidityMap: { [key in string]: number } | null = useMemo(() => {
    if (!rpcPools) {
      return null;
    }
    const feetierOfLiquidityMap: { [key in string]: number } = {};

    const totalLiquidities = rpcPools.map(info => info.liquidity).reduce((total, cur) => total + cur, 0n);
    for (const info of rpcPools) {
      const liquidityRate = totalLiquidities === 0n ? 0 : (Number(info.liquidity) * 100) / Number(totalLiquidities);
      const feeTier = info.fee;
      if (feeTier) {
        feetierOfLiquidityMap[`${feeTier}`] = liquidityRate;
      }
    }
    return feetierOfLiquidityMap;
  }, [rpcPools]);

  const currentPools: PoolModel[] = useMemo(() => {
    if (!tokenA || !tokenB) {
      return [];
    }

    const tokenATokenPath = tokenA.wrappedPath || tokenA.path;
    const tokenBTokenPath = tokenB.wrappedPath || tokenB.path;

    const tokenPairOfPaths = [tokenATokenPath, tokenBTokenPath];
    return pools?.filter(pool => {
      const currentTokenATokenPath = isNativeToken(pool.tokenA) ? pool.tokenA.wrappedPath : pool.tokenA.path;
      const currentTokenBTokenPath = isNativeToken(pool.tokenB) ? pool.tokenB.wrappedPath : pool.tokenB.path;
      return tokenPairOfPaths.includes(currentTokenATokenPath) && tokenPairOfPaths.includes(currentTokenBTokenPath);
    });
  }, [pools, tokenA, tokenB]);

  const getCurrentTokenPairAmount = useCallback(
    (tokenAAmount: string, tokenBAmount: string) => {
      if (!compareToken || !tokenA || !tokenB) {
        return null;
      }
      const ordered = compareToken.path === tokenA.path;
      if (ordered) {
        return {
          tokenA,
          tokenAAmount,
          tokenB,
          tokenBAmount,
        };
      }
      return {
        tokenA: tokenB,
        tokenAAmount: tokenBAmount,
        tokenB: tokenA,
        tokenBAmount: tokenAAmount,
      };
    },
    [compareToken, tokenA, tokenB],
  );

  const buildCreatePoolAction = async (
    request: CreatePoolRequest,
    poolRepository: ReturnType<typeof useGnoswapContext>["poolRepository"],
  ) => {
    try {
      return await poolRepository.createPool(request);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const createPool = useCallback(
    async ({
      tokenAAmount,
      tokenBAmount,
      swapFeeTier,
      startPrice,
      minTick,
      maxTick,
      slippage,
    }: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      startPrice: string;
      minTick: number;
      maxTick: number;
      slippage: number;
    }) => {
      if (!tokenA || !tokenB || !account || createPoolFee === undefined || !isFetchedTokens) {
        return null;
      }
      const currentTokenData = getCurrentTokenPairAmount(tokenAAmount, tokenBAmount);
      if (!currentTokenData) {
        return null;
      }

      const currentReferralAddress = getNextReferralAddress();

      const request: CreatePoolRequest = {
        tokenA: currentTokenData.tokenA,
        tokenB: currentTokenData.tokenB,
        gnsToken,
        wugnotToken,
        tokenAAmount: currentTokenData.tokenAAmount,
        tokenBAmount: currentTokenData.tokenBAmount,
        feeTier: swapFeeTier,
        startPrice,
        minTick,
        maxTick,
        slippage,
        caller: account.address,
        createPoolFee,
        referrerAddress: currentReferralAddress,
      };

      return buildCreatePoolAction(request, poolRepository);
    },
    [
      tokenA,
      tokenB,
      account,
      getCurrentTokenPairAmount,
      poolRepository,
      getNextReferralAddress,
      createPoolFee,
      gnsToken,
      wugnotToken,
      isFetchedTokens,
    ],
  );

  const buildAddLiquidityAction = async (
    request: AddLiquidityRequest,
    poolRepository: ReturnType<typeof useGnoswapContext>["poolRepository"],
  ) => {
    try {
      return await poolRepository.addLiquidity(request);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const addLiquidity = useCallback(
    async ({
      tokenAAmount,
      tokenBAmount,
      swapFeeTier,
      minTick,
      maxTick,
      slippage,
    }: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      minTick: number;
      maxTick: number;
      slippage: number;
    }) => {
      if (!tokenA || !tokenB || !account || !isFetchedTokens) {
        return null;
      }
      const currentTokenData = getCurrentTokenPairAmount(tokenAAmount, tokenBAmount);
      if (!currentTokenData) {
        return null;
      }

      const currentReferralAddress = getNextReferralAddress();

      const request: AddLiquidityRequest = {
        tokenA: currentTokenData.tokenA,
        tokenB: currentTokenData.tokenB,
        wugnotToken,
        tokenAAmount: currentTokenData.tokenAAmount,
        tokenBAmount: currentTokenData.tokenBAmount,
        feeTier: swapFeeTier,
        minTick,
        maxTick,
        slippage: Number(slippage),
        caller: account.address,
        referrerAddress: currentReferralAddress,
      };

      return buildAddLiquidityAction(request, poolRepository);
    },
    [
      tokenA,
      tokenB,
      account,
      getCurrentTokenPairAmount,
      poolRepository,
      getNextReferralAddress,
      isFetchedTokens,
      wugnotToken,
    ],
  );

  useEffect(() => {
    updatePools();
  }, [updatePools]);

  useEffect(() => {
    if (!tokenA || !tokenB || isReverted) {
      return;
    }
    refetchRPCPools();
  }, [tokenA, tokenB, isReverted, refetchRPCPools]);

  return {
    fetching: isLoadingRPCPools,
    pools: currentPools,
    feetierOfLiquidityMap: feetierOfLiquidityMap || {},
    createPool,
    addLiquidity,
    isFetchedPools,
    isFetchingPools: loading,
  };
};
