import OneClickStaking from "@components/stake/one-click-staking/OneClickStaking";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@hooks/wallet/use-wallet";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";

const OneClickStakingContainer: React.FC = () => {
  const router = useRouter();
  const { account } = useWallet();
  const { getPositionsByPoolId } = usePositionData();
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);

  const poolPath = `${router.query?.["pool-path"]}`;

  const stakedPositions = useMemo(() => {
    return positions.filter(position => position.staked);
  }, [positions]);

  const unstakedPositions = useMemo(() => {
    return positions.filter(position => !position.staked);
  }, [positions]);

  const handleClickGotoStaking = useCallback(() => {
    router.push(`/earn/pool/${router.query?.["pool-path"]}/stake`);
  }, [router]);

  useEffect(() => {
    if (account?.address) {
      getPositionsByPoolId(poolPath).then(setPositions);
    }
  }, [account?.address, getPositionsByPoolId, poolPath]);

  return (
    <OneClickStaking
      stakedPositions={stakedPositions}
      unstakedPositions={unstakedPositions}
      handleClickGotoStaking={handleClickGotoStaking}
    />
  );
};
export default OneClickStakingContainer;
