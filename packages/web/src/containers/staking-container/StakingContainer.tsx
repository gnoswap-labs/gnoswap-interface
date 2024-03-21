import React, { useEffect, useState, useMemo, useCallback } from "react";
import Staking from "@components/pool/staking/Staking";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetPoolDetailByPath } from "@query/pools";
import { useLoading } from "@hooks/common/use-loading";
import { StakingPeriodType } from "@constants/option.constant";
import useUrlParam from "@hooks/common/use-url-param";
import { addressValidationCheck } from "@utils/validation-utils";
const DAY_TIME = 24 * 60 * 60 * 1000;

const StakingContainer: React.FC = () => {
  const { account } = useWallet();
  const { breakpoint } = useWindowSize();
  const [mobile, setMobile] = useState(false);
  const { connected: connectedWallet, isSwitchNetwork } = useWallet();
  const { loading: loadingPool } = usePoolData();
  const [type, setType] = useState(3);
  const { initializedData } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });

  const [allPosition, setAllPosition] = useState<PoolPositionModel[]>([]);
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const router = useRouter();
  const { getGnotPath } = useGnotToGnot();
  const poolPath = router.query["pool-path"] || "";
  const { data = null } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });
  const { isLoadingCommon } = useLoading();

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);
  const { getPositionsByPoolId, loading: loadingPosition } = usePositionData(address);

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
  }, [data]);

  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 931 && window.innerWidth > 375
        ? setMobile(true)
        : setMobile(false);
    }
  };

  useEffect(() => {
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    if (account?.address || address) {
      const temp = getPositionsByPoolId(poolPath);
      const stakedPositions = temp.filter(position => position.staked);
      setPositions(stakedPositions);
      setAllPosition(temp);
    }
  }, [account?.address, router.query, getPositionsByPoolId, address]);

  const isDisabledButton = useMemo(() => {
    return isSwitchNetwork || !connectedWallet || positions.length == 0;
  }, [isSwitchNetwork, connectedWallet, positions]);

  const totalApr = useMemo(() => {
    return "-";
  }, []);

  const rewardTokens = useMemo(() => {
    const tokenPair: TokenModel[] = [];
    if (pool) {
      tokenPair.push(pool.tokenA);
      tokenPair.push(pool.tokenB);
    }
    const rewardTokenMap = positions
      .flatMap(position => position.rewards)
      .reduce<{ [key in string]: TokenModel }>((accum, current) => {
        if (
          tokenPair.findIndex(
            token => token.priceId === current.token.priceId,
          ) > -1
        ) {
          accum[current.token.priceId] = current.token;
        }
        return accum;
      }, {});
    const extraTokens = Object.values(rewardTokenMap);
    return [...tokenPair, ...extraTokens];
  }, [pool, positions]);

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
    return positions.reduce<{ [key in StakingPeriodType]: PoolPositionModel[] }>((accum, current) => {
      const stakedTime = Number(current.stakedAt) * 1000;
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
    }, {
      "5D": [],
      "10D": [],
      "30D": [],
      "MAX": [],
    });
  }, [positions]);

  useEffect(() => {
    if (allPosition.length === 0) {
      setType(0);
      return;
    }
    if (positions.length === 0) {
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
    
  }, [allPosition.length, positions.length, stakingPositionMap["MAX"].length]);

  return (
    <Staking
      pool={pool}
      totalApr={totalApr}
      positions={positions}
      rewardTokens={rewardTokens}
      breakpoint={breakpoint}
      mobile={mobile}
      isDisabledButton={isDisabledButton}
      type={type}
      handleClickStakeRedirect={handleClickStakeRedirect}
      handleClickUnStakeRedirect={handleClickUnStakeRedirect}
      loading={loadingPool || loadingPosition || isLoadingCommon}
    />
  );
};

export default StakingContainer;
