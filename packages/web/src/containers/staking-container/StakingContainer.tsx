import React, { useEffect, useState, useMemo, useCallback } from "react";
import Staking from "@components/pool/staking/Staking";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import useRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetPoolDetailByPath } from "@query/pools";
import { StakingPeriodType } from "@constants/option.constant";
import useUrlParam from "@hooks/common/use-url-param";
import { addressValidationCheck } from "@utils/validation-utils";
import BigNumber from "bignumber.js";
import { encryptId } from "@utils/common";

const DAY_TIME = 24 * 60 * 60 * 1000;

const StakingContainer: React.FC = () => {
  const { account } = useWallet();
  const { breakpoint } = useWindowSize();
  const [mobile, setMobile] = useState(false);
  const { connected: connectedWallet, isSwitchNetwork } = useWallet();
  const { loading: isLoadingPool } = usePoolData();
  const [type, setType] = useState(3);
  const { initializedData } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });
  const router = useRouter();
  const poolPath = (router.query["pool-path"] || "") as string;

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  const { positions: allPositions, loading: isLoadingPosition } =
    usePositionData({
      address,
      poolPath: encryptId(poolPath),
      queryOption: {
        enabled: !!poolPath,
      },
    });

  const { getGnotPath } = useGnotToGnot();

  const { data = null } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const stakedPositions = useMemo(
    () => allPositions.filter(item => item.staked),
    [allPositions],
  );
  const pool = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      tokenA: {
        ...data.tokenA,
        path: getGnotPath(data.tokenA).path,
        name: getGnotPath(data.tokenA).name,
        symbol: getGnotPath(data.tokenA).symbol,
        logoURI: getGnotPath(data.tokenA).logoURI,
      },
      tokenB: {
        ...data.tokenB,
        path: getGnotPath(data.tokenB).path,
        name: getGnotPath(data.tokenB).name,
        symbol: getGnotPath(data.tokenB).symbol,
        logoURI: getGnotPath(data.tokenB).logoURI,
      },
    };
  }, [data, getGnotPath]);

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 931 && window.innerWidth > 375
        ? setMobile(true)
        : setMobile(false);
    }
  };

  const isDisabledButton = useMemo(() => {
    return isSwitchNetwork || !connectedWallet || stakedPositions.length == 0;
  }, [isSwitchNetwork, connectedWallet, stakedPositions]);

  const totalApr = useMemo(() => {
    const apr = BigNumber(pool?.stakingApr || 0).toFormat(0);
    return `${apr}%`;
  }, [pool?.stakingApr]);

  const handleClickStakeRedirect = useCallback(() => {
    router.push(`/earn/pool/${router.query["pool-path"]}/stake`);
  }, [router]);

  const handleClickUnStakeRedirect = useCallback(() => {
    router.push(`/earn/pool/${router.query["pool-path"]}/unstake`);
  }, [router]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const stakingPositionMap = useMemo(() => {
    return stakedPositions.reduce<{
      [key in StakingPeriodType]: PoolPositionModel[];
    }>(
      (accum, current) => {
        const stakedTime = new Date(current.stakedAt).getTime();
        const difference = (new Date().getTime() - stakedTime) / DAY_TIME;
        let periodType: StakingPeriodType = "MAX";
        if (difference < 5) {
          periodType = "5D";
        } else if (difference < 10) {
          periodType = "10D";
        } else if (difference < 30) {
          periodType = "30D";
        }
        accum[periodType].push(current);
        return accum;
      },
      {
        "5D": [],
        "10D": [],
        "30D": [],
        MAX: [],
      },
    );
  }, [stakedPositions]);

  useEffect(() => {
    if (allPositions.length === 0) {
      setType(0);
      return;
    }
    if (stakedPositions.length === 0) {
      setType(1);
      return;
    }
    if (stakingPositionMap["MAX"].length === 0) {
      setType(2);
      return;
    }

    if (stakingPositionMap["MAX"].length !== 0) {
      setType(3);
      return;
    }
    setType(0);
  }, [allPositions.length, stakedPositions.length, stakingPositionMap]);

  return (
    <Staking
      pool={pool}
      totalApr={totalApr}
      stakedPosition={stakedPositions}
      breakpoint={breakpoint}
      mobile={mobile}
      isDisabledButton={isDisabledButton}
      type={type}
      handleClickStakeRedirect={handleClickStakeRedirect}
      handleClickUnStakeRedirect={handleClickUnStakeRedirect}
      loading={isLoadingPool || isLoadingPosition}
      isOtherPosition={
        !!(
          (address && account?.address && address !== account?.address) ||
          !account?.address
        )
      }
    />
  );
};

export default StakingContainer;
