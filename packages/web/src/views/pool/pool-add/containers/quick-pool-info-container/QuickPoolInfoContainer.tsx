import { useAtom } from "jotai";
import React, { useCallback, useMemo } from "react";

import QuickPoolInfo from "@components/stake/quick-pool-info/QuickPoolInfo";
import { PAGE_PATH_TYPE } from "@constants/page.constant";
import { initialPool } from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { EarnState } from "@states/index";
import { checkGnotPath } from "@utils/common";

const QuickPoolInfoContainer: React.FC = () => {
  const router = useCustomRouter();
  const { account, connected } = useWallet();
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(
    EarnState.poolInfoQuery,
  );
  const { pools } = usePoolData();

  const poolPathParam = router.query.poolPath as string;
  const tokenAPath =
    (router.query.tokenA as string) || window.history.state?.tokenA;
  const tokenBPath =
    (router.query.tokenB as string) || window.history.state?.tokenB;
  const feeTier =
    (router.query.fee_tier as string) || window.history.state?.fee_tier;

  const poolPath = useMemo(() => {
    if (poolPathParam) return poolPathParam;

    if (!tokenAPath || !tokenBPath || !feeTier) return null;

    const tokenPair = [
      checkGnotPath(tokenAPath),
      checkGnotPath(tokenBPath),
    ].sort();

    return [...tokenPair, feeTier].join(":");
  }, [poolPathParam, tokenAPath, tokenBPath, feeTier]);

  const shouldFetchPool = useMemo(() => {
    return pools.some(pool => pool.poolPath === poolPath);
  }, [poolPath, pools]);

  const { positions, loading: isLoadingPosition } = usePositionData({
    isClosed: false,
    poolPath: poolPath || "",
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const {
    data = initialPool as PoolDetailModel,
    isLoading: isLoadingPoolInfo,
  } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath && shouldFetchPool,
  });


  const stakedPositions = useMemo(() => {
    if (!poolPath || !account || !connected) return [];
    return positions.filter(position => position.staked);
  }, [poolPath, account, connected, positions]);

  const unstakedPositions = useMemo(() => {
    if (!poolPath || !account || !connected) return [];
    return positions.filter(position => !position.staked);
  }, [poolPath, account, connected, positions]);

  const handleClickGotoStaking = useCallback(
    (type: PAGE_PATH_TYPE) => {
      if (poolPath) {
        router.movePageWithPoolPath(type, poolPath);
        return;
      }
    },
    [poolPath],
  );

  return (
    <QuickPoolInfo
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      handleClickGotoStaking={handleClickGotoStaking}
      pool={data}
      isLoadingPool={
        isLoadingRPCPoolInfo || isLoadingPoolInfo || isLoadingPosition
      }
    />
  );
};
export default QuickPoolInfoContainer;
