import { useCallback, useEffect, useMemo } from "react";

import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePoolData } from "@hooks/pool/data/use-pool-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolModel } from "@models/pool/pool-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { useGetPoolCreationFee, useGetRPCPoolsBy } from "@query/pools";
import { checkGnotPath } from "@utils/common";
import { sortTokenPaths } from "@utils/sort-utils";
import { useReferral } from "@hooks/common/use-referral";
import { AddLiquidityRequest } from "@repositories/pool/request/add-liquidity-request";
import { CreatePoolRequest } from "@repositories/pool/request/create-pool-request";
import {
  makeCreatePoolMessageWithApproves,
  makePositionMintMessageWithApproves,
} from "@repositories/pool/pool.message";
import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";

interface Props {
  compareToken: TokenModel | null;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  isReverted?: boolean;
}

export const usePool = ({ compareToken, tokenA, tokenB, isReverted = false }: Props) => {
  const { getNextReferralAddress } = useReferral();

  const { account, walletClient } = useWallet();
  const { poolRepository, transactionService } = useGnoswapContext();
  const { pools, updatePools, isFetchedPools, loading } = usePoolData();
  const { data: createPoolFee } = useGetPoolCreationFee();

  const { estimateNetworkFee } = useNetworkFee(null);

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

  const buildAdenaWalletCreatePoolAction = async (
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

  const buildSocialWalletCreatePoolAction = async (
    rpcProvider: GnoProvider,
    request: CreatePoolRequest,
    transactionService: ReturnType<typeof useGnoswapContext>["transactionService"],
    estimateNetworkFee: ReturnType<typeof useNetworkFee>["estimateNetworkFee"],
    poolRepository: ReturnType<typeof useGnoswapContext>["poolRepository"],
  ) => {
    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const createPoolMessages = await makeCreatePoolMessageWithApproves(request, getAllowance);
    const mintMessages = await makePositionMintMessageWithApproves(request, getAllowance);
    const txMessages = [...createPoolMessages, ...mintMessages];

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: CreatePoolRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: currentGasInfo?.gasUsed.toString(),
    };

    return poolRepository.createPool(requestWithGasInfo).catch(e => {
      console.error(e);
      return null;
    });
  };

  const createPool = useCallback(
    async ({
      rpcProvider,
      tokenAAmount,
      tokenBAmount,
      swapFeeTier,
      startPrice,
      minTick,
      maxTick,
      slippage,
      withStaking,
    }: {
      rpcProvider: GnoProvider | null;
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      startPrice: string;
      minTick: number;
      maxTick: number;
      slippage: number;
      withStaking?: boolean;
    }) => {
      if (!tokenA || !tokenB || !account || createPoolFee === undefined) {
        return null;
      }
      const currentTokenData = getCurrentTokenPairAmount(tokenAAmount, tokenBAmount);
      if (!currentTokenData) {
        return null;
      }

      const walletType = walletClient?.getWalletType();
      const currentReferralAddress = getNextReferralAddress();

      const request: CreatePoolRequest = {
        tokenA: currentTokenData.tokenA,
        tokenB: currentTokenData.tokenB,
        tokenAAmount: currentTokenData.tokenAAmount,
        tokenBAmount: currentTokenData.tokenBAmount,
        feeTier: swapFeeTier,
        startPrice,
        minTick,
        maxTick,
        slippage,
        caller: account.address,
        withStaking,
        createPoolFee,
        referrerAddress: currentReferralAddress,
      };

      if (walletType === "SOCIAL_WALLET" && rpcProvider) {
        return buildSocialWalletCreatePoolAction(
          rpcProvider,
          request,
          transactionService,
          estimateNetworkFee,
          poolRepository,
        );
      }

      return buildAdenaWalletCreatePoolAction(request, poolRepository);
    },
    [
      tokenA,
      tokenB,
      account,
      getCurrentTokenPairAmount,
      poolRepository,
      getNextReferralAddress,
      transactionService,
      estimateNetworkFee,
      walletClient,
      createPoolFee,
    ],
  );

  const buildAdenaWalletAddLiquidityAction = async (
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

  const buildSocialWalletAddLiquidityAction = async (
    rpcProvider: GnoProvider,
    request: AddLiquidityRequest,
    transactionService: ReturnType<typeof useGnoswapContext>["transactionService"],
    estimateNetworkFee: ReturnType<typeof useNetworkFee>["estimateNetworkFee"],
    poolRepository: ReturnType<typeof useGnoswapContext>["poolRepository"],
  ) => {
    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const mintMessages = await makePositionMintMessageWithApproves(request, getAllowance);
    const txMessages = [...mintMessages];

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: AddLiquidityRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: currentGasInfo?.gasUsed.toString(),
    };

    return poolRepository.addLiquidity({ ...requestWithGasInfo }).catch(e => {
      console.error(e);
      return null;
    });
  };

  const addLiquidity = useCallback(
    async ({
      rpcProvider,
      tokenAAmount,
      tokenBAmount,
      swapFeeTier,
      minTick,
      maxTick,
      slippage,
      withStaking,
    }: {
      rpcProvider: GnoProvider | null;
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      minTick: number;
      maxTick: number;
      slippage: number;
      withStaking?: boolean;
    }) => {
      if (!tokenA || !tokenB || !account) {
        return null;
      }
      const currentTokenData = getCurrentTokenPairAmount(tokenAAmount, tokenBAmount);
      if (!currentTokenData) {
        return null;
      }

      const walletType = walletClient?.getWalletType();
      const currentReferralAddress = getNextReferralAddress();

      const request: AddLiquidityRequest = {
        tokenA: currentTokenData.tokenA,
        tokenB: currentTokenData.tokenB,
        tokenAAmount: currentTokenData.tokenAAmount,
        tokenBAmount: currentTokenData.tokenBAmount,
        feeTier: swapFeeTier,
        minTick,
        maxTick,
        slippage: Number(slippage),
        caller: account.address,
        withStaking,
        referrerAddress: currentReferralAddress,
      };

      if (walletType === "SOCIAL_WALLET" && rpcProvider) {
        return buildSocialWalletAddLiquidityAction(
          rpcProvider,
          request,
          transactionService,
          estimateNetworkFee,
          poolRepository,
        );
      }

      return buildAdenaWalletAddLiquidityAction(request, poolRepository);
    },
    [
      tokenA,
      tokenB,
      account,
      getCurrentTokenPairAmount,
      poolRepository,
      getNextReferralAddress,
      transactionService,
      estimateNetworkFee,
      walletClient,
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
