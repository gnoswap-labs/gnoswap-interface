import { useAtom } from "jotai";
import React, { useCallback, useMemo } from "react";

import { PAGE_PATH_TYPE } from "@constants/page.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { initialDetailPool } from "@models/pool/pool-detail-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { EarnState } from "@states/index";

import QuickPoolInfo from "../../components/quick-pool-info/QuickPoolInfo";
import { usePoolAddSearchParams } from "../../hooks/use-pool-add-serach-param";

const QuickPoolInfoContainer: React.FC = () => {
  const router = useCustomRouter();
  const { account, connected } = useWallet();
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(
    EarnState.poolInfoQuery,
  );
  const { pools } = usePoolData();
  const { poolPath } = usePoolAddSearchParams();

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
    data = initialDetailPool,
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
