import React, { useCallback, useEffect, useMemo, useState } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import useUrlParam from "@hooks/common/use-url-param";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/data/use-pool-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useGetPoolDetailByPath, useGetPoolStakingListByPoolPath } from "@query/pools";
import { formatRate } from "@utils/new-number-utils";
import { isValidAddress } from "@utils/validation-utils";

import Staking from "../../components/staking/Staking";
import { buildStakingTiers, getStakingTierKey } from "../../components/staking/staking-content/staking-tier";
import { PoolConverter } from "@services/converters/pool";

interface StakingContainerProps {
  hasPoolStaking: boolean;
  onOpenVideoGuide: (type: "STAKING") => void;
}

const StakingContainer: React.FC<StakingContainerProps> = ({ hasPoolStaking, onOpenVideoGuide }) => {
  const { account } = useWallet();
  const { breakpoint } = useWindowSize();
  const [mobile, setMobile] = useState(false);
  const { connected: connectedWallet, isSwitchNetwork } = useWallet();
  const { loading: isLoadingPool } = usePoolData();
  const [type, setType] = useState(3);
  const { initializedData } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !isValidAddress(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  const { positions: allPositions, loading: isLoadingPosition } = usePositionData({
    address,
    poolPath,
    withClosed: false,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const { data: poolStakings = [] } = useGetPoolStakingListByPoolPath(poolPath || "", {
    enabled: !!poolPath,
  });

  const convertedPoolStakings = useMemo(() => {
    return PoolConverter.convertPoolStakingModel(poolStakings);
  }, [poolStakings]);

  const { getGnotPath } = useGnotToGnot();

  const { data = null } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const stakedPositions = useMemo(() => allPositions.filter(item => item.staked), [allPositions]);
  const pool = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      tokenA: {
        ...data.tokenA,
        path: getGnotPath(data.tokenA).path,
        name: getGnotPath(data.tokenA).name,
        symbol: getGnotPath(data.tokenA).symbol,
        displaySymbol: getGnotPath(data.tokenA).displaySymbol,
        logoURI: getGnotPath(data.tokenA).logoURI,
      },
      tokenB: {
        ...data.tokenB,
        path: getGnotPath(data.tokenB).path,
        name: getGnotPath(data.tokenB).name,
        symbol: getGnotPath(data.tokenB).symbol,
        displaySymbol: getGnotPath(data.tokenB).displaySymbol,
        logoURI: getGnotPath(data.tokenB).logoURI,
      },
    };
  }, [data, getGnotPath]);

  const stakingTiers = useMemo(() => buildStakingTiers(pool), [pool]);

  const handleResize = () => {
    if (typeof window !== "undefined") {
      const windowInnerWidth = window.innerWidth;
      // FIXME: Manage with meaningful static variables
      const isMobile = windowInnerWidth < 931;
      setMobile(isMobile);
    }
  };

  const isDisabledButton = useMemo(() => {
    return isSwitchNetwork || !connectedWallet || stakedPositions.length == 0;
  }, [isSwitchNetwork, connectedWallet, stakedPositions]);

  const totalApr = useMemo(() => {
    return formatRate(pool?.stakingApr, { decimals: 0 });
  }, [pool?.stakingApr]);

  const handleClickStakeRedirect = useCallback(() => {
    router.movePageWithPoolPath("POOL_STAKE", router.getPoolPath() || "");
  }, [router]);

  const handleClickUnStakeRedirect = useCallback(() => {
    router.movePageWithPoolPath("POOL_UNSTAKE", router.getPoolPath() || "");
  }, [router]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const stakingPositionMap = useMemo(() => {
    const initialMap = stakingTiers.reduce<Record<string, PoolPositionModel[]>>((accum, tier) => {
      accum[tier.key] = [];
      return accum;
    }, {});

    return stakedPositions.reduce<Record<string, PoolPositionModel[]>>(
      (accum, current) => {
        const tierKey = getStakingTierKey(stakingTiers, current.stakedAt);
        accum[tierKey]?.push(current);
        return accum;
      },
      initialMap,
    );
  }, [stakedPositions, stakingTiers]);

  const hasMaxTierPosition = useMemo(() => {
    const maxTier = stakingTiers.find(tier => tier.kind === "max");
    return maxTier ? (stakingPositionMap[maxTier.key] ?? []).length > 0 : false;
  }, [stakingPositionMap, stakingTiers]);

  useEffect(() => {
    if (allPositions.length === 0) {
      setType(0);
      return;
    }
    if (stakedPositions.length === 0) {
      setType(1);
      return;
    }
    if (!hasMaxTierPosition) {
      setType(2);
      return;
    }

    if (hasMaxTierPosition) {
      setType(3);
      return;
    }
    setType(0);
  }, [allPositions.length, hasMaxTierPosition, stakedPositions.length]);

  return (
    <Staking
      pool={pool}
      totalApr={totalApr}
      stakedPosition={stakedPositions}
      poolStakings={convertedPoolStakings}
      breakpoint={breakpoint}
      mobile={mobile}
      isDisabledButton={isDisabledButton}
      type={type}
      handleClickStakeRedirect={handleClickStakeRedirect}
      handleClickUnStakeRedirect={handleClickUnStakeRedirect}
      loading={isLoadingPool || isLoadingPosition}
      isOtherPosition={!!((address && account?.address && address !== account?.address) || !account?.address)}
      hasPoolStaking={hasPoolStaking}
      onOpenVideoGuide={onOpenVideoGuide}
    />
  );
};

export default StakingContainer;
