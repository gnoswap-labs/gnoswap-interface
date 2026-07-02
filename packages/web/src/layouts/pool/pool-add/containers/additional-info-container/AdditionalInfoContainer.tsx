import { useAtom } from "jotai";
import React, { useCallback, useMemo } from "react";

import { PAGE_PATH_TYPE } from "@constants/page.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { initialDetailPool } from "@models/pool/pool-detail-model";
import { isNativeToken } from "@models/token/token-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { EarnState } from "@states/index";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { checkGnotPath } from "@utils/common";

import AdditionalInfo from "../../components/additional-info/AdditionalInfo";
import { usePoolAddSearchParams } from "@hooks/pool/data/use-pool-add-serach-param";
import { usePool } from "@hooks/pool/data/use-pool";
import { useWindowSize } from "@hooks/common/use-window-size";

const DEFAULT_POSITION_LIMIT = 20;

const parseTokenPairFromPoolPath = (poolPath: string | null): string[] | null => {
  if (!poolPath) {
    return null;
  }

  const [tokenAPath, tokenBPath] = poolPath.split(":");
  if (!tokenAPath || !tokenBPath) {
    return null;
  }

  return [tokenAPath, tokenBPath];
};

const AdditionalInfoContainer: React.FC = () => {
  const router = useCustomRouter();
  const { breakpoint } = useWindowSize();
  const { account, connected } = useWallet();
  const [compareToken] = useAtom(EarnState.currentCompareToken);
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(EarnState.poolInfoQuery);
  const { poolPath, tokenPair } = usePoolAddSearchParams();
  const { tokens } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const currentPoolTokenPair = useMemo(() => parseTokenPairFromPoolPath(currentPoolPath), [currentPoolPath]);
  const activePoolPath = currentPoolTokenPair ? currentPoolPath : poolPath;
  const activeTokenPair = useMemo(() => {
    return currentPoolTokenPair ?? (tokenPair[0] && tokenPair[1] ? [tokenPair[0], tokenPair[1]] : []);
  }, [currentPoolTokenPair, tokenPair]);

  const tokenA = useMemo(() => {
    const token = tokens.find(item => item.path === checkGnotPath(activeTokenPair[0]));
    return token ? { ...token, ...getGnotPath(token) } : null;
  }, [activeTokenPair, getGnotPath, tokens]);

  const tokenB = useMemo(() => {
    const token = tokens.find(item => item.path === checkGnotPath(activeTokenPair[1]));
    return token ? { ...token, ...getGnotPath(token) } : null;
  }, [activeTokenPair, getGnotPath, tokens]);

  const { pools, fetching: isFetchingFeetierOfLiquidityMap } = usePool({ tokenA, tokenB, compareToken });

  const shouldFetchPool = useMemo(() => {
    return pools.some(pool => pool.poolPath === activePoolPath);
  }, [activePoolPath, pools]);

  const { totalPositionCount, loading: isLoadingTotalPositionCount } = usePositionData({
    isClosed: false,
    poolPath: activePoolPath || "",
    withClosed: false,
    limit: 1,
    queryOption: {
      enabled: !!activePoolPath,
    },
  });

  const positionLimit = useMemo(() => {
    if (!totalPositionCount) {
      return DEFAULT_POSITION_LIMIT;
    }

    return totalPositionCount;
  }, [totalPositionCount]);

  const { positions, loading: isLoadingPosition } = usePositionData({
    isClosed: false,
    poolPath: activePoolPath || "",
    withClosed: false,
    limit: positionLimit,
    queryOption: {
      enabled: !!activePoolPath,
    },
  });

  const { data = initialDetailPool, isLoading: isLoadingPoolInfo } = useGetPoolDetailByPath(activePoolPath, {
    enabled: !!activePoolPath && shouldFetchPool,
  });

  const handleClickGotoStaking = useCallback(
    (type: PAGE_PATH_TYPE) => {
      if (activePoolPath) {
        router.movePageWithPoolPath(type, activePoolPath);
      }
    },
    [activePoolPath, router],
  );

  const stakedPositions = useMemo(() => {
    if (!activePoolPath || !account || !connected) return [];
    return positions.filter(position => position.poolPath === activePoolPath && position.staked);
  }, [activePoolPath, account, connected, positions]);

  const unstakedPositions = useMemo(() => {
    if (!activePoolPath || !account || !connected) return [];
    return positions.filter(position => position.poolPath === activePoolPath && !position.staked);
  }, [activePoolPath, account, connected, positions]);

  const isReversed = useMemo(() => {
    return (
      activeTokenPair?.findIndex(path => {
        if (compareToken) {
          return isNativeToken(compareToken) || compareToken.path === "ugnot"
            ? compareToken.wrappedPath === path
            : compareToken.path === path;
        }
        return false;
      }) === 1
    );
  }, [activeTokenPair, compareToken]);

  return (
    <AdditionalInfo
      breakpoint={breakpoint}
      tokenPair={activeTokenPair}
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      handleClickGotoStaking={handleClickGotoStaking}
      pool={data}
      poolPath={activePoolPath}
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
