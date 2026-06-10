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
import { resolvePoolAddInfo } from "./AdditionalInfoContainer.utils";

const DEFAULT_POSITION_LIMIT = 20;

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
  const activePoolAddInfo = useMemo(
    () => resolvePoolAddInfo({ poolPath, tokenPair, currentPoolPath }),
    [currentPoolPath, poolPath, tokenPair],
  );

  const tokenA = useMemo(
    () =>
      ({
        ...tokens.find(item => item.path === checkGnotPath(activePoolAddInfo.tokenPair[0])),
        ...getGnotPath(tokens.find(item => item.path === checkGnotPath(activePoolAddInfo.tokenPair[0]))),
      } as TokenModel),
    [activePoolAddInfo.tokenPair, getGnotPath, tokens],
  );

  const tokenB = useMemo(
    () =>
      ({
        ...tokens.find(item => item.path === checkGnotPath(activePoolAddInfo.tokenPair[1])),
        ...getGnotPath(tokens.find(item => item.path === checkGnotPath(activePoolAddInfo.tokenPair[1]))),
      } as TokenModel),
    [activePoolAddInfo.tokenPair, getGnotPath, tokens],
  );

  const { pools, fetching: isFetchingFeetierOfLiquidityMap } = usePool({ tokenA, tokenB, compareToken });

  const shouldFetchPool = useMemo(() => {
    return pools.some(pool => pool.poolPath === activePoolAddInfo.poolPath);
  }, [activePoolAddInfo.poolPath, pools]);

  const {
    totalPositionCount,
    loading: isLoadingTotalPositionCount,
  } = usePositionData({
    isClosed: false,
    poolPath: activePoolAddInfo.poolPath || "",
    limit: 1,
    queryOption: {
      enabled: !!activePoolAddInfo.poolPath,
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
    poolPath: activePoolAddInfo.poolPath || "",
    limit: positionLimit,
    queryOption: {
      enabled: !!activePoolAddInfo.poolPath,
    },
  });

  const { data = initialDetailPool, isLoading: isLoadingPoolInfo } = useGetPoolDetailByPath(activePoolAddInfo.poolPath, {
    enabled: !!activePoolAddInfo.poolPath && shouldFetchPool,
  });

  const handleClickGotoStaking = useCallback(
    (type: PAGE_PATH_TYPE) => {
      if (activePoolAddInfo.poolPath) {
        router.movePageWithPoolPath(type, activePoolAddInfo.poolPath);
      }
    },
    [activePoolAddInfo.poolPath, router],
  );

  const stakedPositions = useMemo(() => {
    if (!activePoolAddInfo.poolPath || !account || !connected) return [];
    return positions.filter(position => position.poolPath === activePoolAddInfo.poolPath && position.staked);
  }, [activePoolAddInfo.poolPath, account, connected, positions]);

  const unstakedPositions = useMemo(() => {
    if (!activePoolAddInfo.poolPath || !account || !connected) return [];
    return positions.filter(position => position.poolPath === activePoolAddInfo.poolPath && !position.staked);
  }, [activePoolAddInfo.poolPath, account, connected, positions]);

  const isReversed = useMemo(() => {
    return (
      activePoolAddInfo.tokenPair?.findIndex(path => {
        if (compareToken) {
          return isNativeToken(compareToken) || compareToken.path === "ugnot"
            ? compareToken.wrappedPath === path
            : compareToken.path === path;
        }
        return false;
      }) === 1
    );
  }, [activePoolAddInfo.tokenPair, compareToken]);

  return (
    <AdditionalInfo
      breakpoint={breakpoint}
      tokenPair={activePoolAddInfo.tokenPair}
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      handleClickGotoStaking={handleClickGotoStaking}
      pool={data}
      poolPath={activePoolAddInfo.poolPath}
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
