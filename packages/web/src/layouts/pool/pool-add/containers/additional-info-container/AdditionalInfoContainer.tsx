import { useAtom } from "jotai";
import React, { useCallback, useMemo } from "react";

import { PAGE_PATH_TYPE } from "@constants/page.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { initialDetailPool } from "@models/pool/pool-detail-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { EarnState } from "@states/index";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { checkGnotPath } from "@utils/common";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";

import AdditionalInfo from "../../components/additional-info/AdditionalInfo";
import { usePoolAddSearchParams } from "@hooks/pool/data/use-pool-add-serach-param";
import { usePool } from "@hooks/pool/data/use-pool";
import { useWindowSize } from "@hooks/common/use-window-size";

const AdditionalInfoContainer: React.FC = () => {
  const router = useCustomRouter();
  const { breakpoint } = useWindowSize();
  const { account, connected } = useWallet();
  const [compareToken] = useAtom(EarnState.currentCompareToken);
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(EarnState.poolInfoQuery);
  const { poolPath, tokenPair } = usePoolAddSearchParams();
  const { tokens } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const tokenA = useMemo(
    () =>
      ({
        ...tokens.find(item => item.path === checkGnotPath(tokenPair[0])),
        ...getGnotPath(tokens.find(item => item.path === checkGnotPath(tokenPair[0]))),
      } as TokenModel),
    [getGnotPath, tokens, tokenPair],
  );

  const tokenB = useMemo(
    () =>
      ({
        ...tokens.find(item => item.path === checkGnotPath(tokenPair[1])),
        ...getGnotPath(tokens.find(item => item.path === checkGnotPath(tokenPair[1]))),
      } as TokenModel),
    [getGnotPath, tokens, tokenPair],
  );

  const { pools, fetching: isFetchingFeetierOfLiquidityMap } = usePool({ tokenA, tokenB, compareToken });

  const shouldFetchPool = useMemo(() => {
    return pools.some(pool => pool.poolPath === poolPath);
  }, [poolPath, pools]);

  const {
    totalPositionCount,
    loading: isLoadingTotalPositionCount,
  } = usePositionData({
    isClosed: false,
    poolPath: poolPath || "",
    limit: 1,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const positionLimit = useMemo(() => {
    if (!totalPositionCount) {
      return 20;
    }

    return totalPositionCount;
  }, [totalPositionCount]);

  const { positions, loading: isLoadingPosition } = usePositionData({
    isClosed: false,
    poolPath: poolPath || "",
    limit: positionLimit,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const { data = initialDetailPool, isLoading: isLoadingPoolInfo } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath && shouldFetchPool,
  });

  const handleClickGotoStaking = useCallback(
    (type: PAGE_PATH_TYPE) => {
      if (poolPath) {
        router.movePageWithPoolPath(type, poolPath);
      }
    },
    [poolPath],
  );

  const stakedPositions = useMemo(() => {
    if (!poolPath || !account || !connected) return [];
    return positions.filter(position => position.poolPath === poolPath && position.staked);
  }, [poolPath, account, connected, positions]);

  const unstakedPositions = useMemo(() => {
    if (!poolPath || !account || !connected) return [];
    return positions.filter(position => position.poolPath === poolPath && !position.staked);
  }, [poolPath, account, connected, positions]);

  const isReversed = useMemo(() => {
    return (
      tokenPair?.findIndex(path => {
        if (compareToken) {
          return isNativeToken(compareToken) || compareToken.path === "ugnot"
            ? compareToken.wrappedPath === path
            : compareToken.path === path;
        }
        return false;
      }) === 1
    );
  }, [compareToken, tokenPair]);

  return (
    <AdditionalInfo
      breakpoint={breakpoint}
      tokenPair={tokenPair}
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      handleClickGotoStaking={handleClickGotoStaking}
      pool={data}
      poolPath={poolPath}
      isLoadingPool={
        isLoadingRPCPoolInfo ||
        isFetchingFeetierOfLiquidityMap ||
        isLoadingPoolInfo ||
        isLoadingPosition ||
        isLoadingTotalPositionCount
      }
      isLoadingGraph={isLoadingPoolInfo}
      isReversed={isReversed}
    />
  );
};
export default AdditionalInfoContainer;
