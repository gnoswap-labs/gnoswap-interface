import React, { useEffect, useState, useMemo, useCallback } from "react";
import Staking from "@components/pool/staking/Staking";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { PoolModel } from "@models/pool/pool-model";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

const StakingContainer: React.FC = () => {
  const { account } = useWallet();
  const { breakpoint } = useWindowSize();
  const [mobile, setMobile] = useState(false);
  const { connected: connectedWallet, isSwitchNetwork } = useWallet();
  const [pool, setPool] = useState<PoolModel | null>(null);
  const { fetchPoolDatils, loading: loadingPool } = usePoolData();
  const { getPositionsByPoolId, loading: loadingPosition } = usePositionData();
  const [type, setType] = useState(3);
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const router = useRouter();
  const { getGnotPath } = useGnotToGnot();


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
    fetchPoolDatils(poolPath).then((e) => {
      if (e) {
        setPool({
          ...e,
          tokenA: {
            ...e.tokenA,
            name: getGnotPath(e.tokenA).name,
            symbol: getGnotPath(e.tokenA).symbol,
            logoURI: getGnotPath(e.tokenA).logoURI,
          },
          tokenB: {
            ...e.tokenB,
            name: getGnotPath(e.tokenB).name,
            symbol: getGnotPath(e.tokenB).symbol,
            logoURI: getGnotPath(e.tokenB).logoURI,
          }
        });
      } else {
        setPool(e);
      }
    });
    if (account?.address) {
      getPositionsByPoolId(poolPath).then(positions => {
        const stakedPositions = positions.filter(position => position.staked);
        setPositions(stakedPositions);
      });
    }
  }, [account?.address, router.query]);

  const isDisabledButton = useMemo(() => {
    return isSwitchNetwork || !connectedWallet;
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
    setType(Math.floor(Math.random() * 4));
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Staking
      totalApr={totalApr}
      positions={positions}
      rewardTokens={rewardTokens}
      breakpoint={breakpoint}
      mobile={mobile}
      isDisabledButton={isDisabledButton}
      type={type}
      handleClickStakeRedirect={handleClickStakeRedirect}
      handleClickUnStakeRedirect={handleClickUnStakeRedirect}
      loading={loadingPool || loadingPosition}
    />
  );
};

export default StakingContainer;
