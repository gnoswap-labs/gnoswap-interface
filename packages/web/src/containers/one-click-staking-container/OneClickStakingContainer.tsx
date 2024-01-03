import OneClickStaking from "@components/stake/one-click-staking/OneClickStaking";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@hooks/wallet/use-wallet";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { makeId } from "@utils/common";

const OneClickStakingContainer: React.FC = () => {
  const router = useRouter();
  const { account } = useWallet();
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);
  const { getPositionsByPoolId, getPositionsByPoolPath } = usePositionData();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);

  const poolId = router.query?.["pool-path"] === undefined ? null : `${router.query?.["pool-path"]}`;
  const poolPath = currentPoolPath;

  const stakedPositions = useMemo(() => {
    return positions.filter(position => position.staked);
  }, [positions]);

  const unstakedPositions = useMemo(() => {
    return positions.filter(position => !position.staked);
  }, [positions]);

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

  useEffect(() => {
    if (!account?.address) {
      return;
    }
    if (poolId) {
      setPositions(getPositionsByPoolId(poolId));
      return;
    }

    if (poolPath) {
      setPositions(getPositionsByPoolPath(poolPath));
    }
  }, [account?.address, poolId, poolPath]);

  return (
    <OneClickStaking
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      handleClickGotoStaking={handleClickGotoStaking}
    />
  );
};
export default OneClickStakingContainer;
