import OneClickStaking from "@components/stake/one-click-staking/OneClickStaking";
import React, { useCallback, useMemo } from "react";
import useRouter from "@hooks/common/use-custom-router";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { checkGnotPath, encryptId, makeId } from "@utils/common";
import { initialPool } from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePoolData } from "@hooks/pool/use-pool-data";

const OneClickStakingContainer: React.FC = () => {
  const router = useRouter();
  const { account, connected } = useWallet();
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(EarnState.poolInfoQuery);
  const poolId =
    router.query?.["pool-path"] === undefined
      ? null
      : `${router.query?.["pool-path"]}`;

  const tokenPair = useMemo(() => {
    const tokenAPath = router.query?.["tokenA"] as string;
    const tokenBPath = router.query?.["tokenB"] as string;

    if (!tokenAPath || !tokenBPath) {
      return null;
    }

    return [checkGnotPath(tokenAPath), checkGnotPath(tokenBPath)].sort();
  }, [router.query]);
  const { pools } = usePoolData();



  const poolPath = useMemo(() => {
    const feeTier = router.query?.["fee_tier"] as string;

    if (!tokenPair || !feeTier) return null;

    return [...tokenPair, feeTier].join(":");
  }, [router.query, tokenPair]);

  const shouldFetchPool = useMemo(() => {
    return pools.some(pool => pool.poolPath === (poolId || poolPath));
  }, [poolId, poolPath, pools]);

  const { positions, loading: isLoadingPosition } = usePositionData({
    isClosed: false,
    poolPath: encryptId(poolId ?? poolPath ?? ""),
    queryOption: {
      // TODO: remove debug code
      enabled: (!!poolId || !!poolPath)
    }
  });

  const {
    data = initialPool as PoolDetailModel,
    isLoading: isLoadingPoolInfo,
  } = useGetPoolDetailByPath((poolPath || poolId) as string, { enabled: (!!poolPath || !!poolId) && shouldFetchPool });

  const stakedPositions = useMemo(() => {
    if (!poolPath || !account || !connected) return [];
    return positions.filter(position => position.staked);
  }, [poolPath, account, connected, positions]);

  const unstakedPositions = useMemo(() => {
    if (!poolPath || !account || !connected) return [];
    return positions.filter(position => !position.staked);
  }, [poolPath, account, connected, positions]);

  const handleClickGotoStaking = useCallback(() => {
    if (poolId) {
      router.push(`/earn/pool/${poolId}/stake`);
      return;
    }
    if (poolPath) {
      const poolId = makeId(poolPath);
      router.push(`/earn/pool/${poolId}/stake`);
    }
  }, [poolId, poolPath, router]);


  return (
    <OneClickStaking
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
export default OneClickStakingContainer;
