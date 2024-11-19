import React, { useEffect, useMemo, useRef } from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/common/use-position-data";
import useUrlParam from "@hooks/common/use-url-param";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetPoolDetailByPath } from "@query/pools";
import { isValidAddress } from "@utils/validation-utils";

import MyLiquidityContainer from "./containers/my-liquidity-container/MyLiquidityContainer";
import PoolPairInformationContainer from "./containers/pool-pair-information-container/PoolPairInformationContainer";
import StakingContainer from "./containers/staking-container/StakingContainer";
import PoolLayout from "./PoolLayout";

const PoolDetail: React.FC = () => {
  const router = useCustomRouter();
  const { account } = useWallet();
  const poolPath = router.getPoolPath();
  const jumpFlagRef = useRef(false);
  const { data } = useGetPoolDetailByPath(poolPath);

  const { initializedData, hash } = useUrlParam<{ addr: string | undefined }>({ addr: undefined });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !isValidAddress(address)) {
      return account?.address;
    }
    return address;
  }, [initializedData, account]);

  const { isFetchedPosition, loading, positions } = usePositionData({
    address,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const isStakable = useMemo(() => {
    if (data?.incentiveType === "INCENTIVIZED") {
      return true;
    }
    const stakedPositions = positions.filter(position => position.staked);
    if (stakedPositions.length > 0) {
      return true;
    }
    if (data?.incentiveType === "EXTERNAL") {
      return true;
    }
    return false;
  }, [data?.incentiveType, positions]);

  useEffect(() => {
    if (positions.length === 0) {
      window.scrollTo({ top: 0 });
    }
    if (!loading && isFetchedPosition && hash && !jumpFlagRef.current) {
      jumpFlagRef.current = true;
      setTimeout(() => {
        if (hash === "staking" && isStakable) {
          const element = document.getElementById("staking");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          return;
        }

        const position = positions.find(item => item.id.toString() === hash);
        if (position) {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          const element = document.getElementById("liquidity-wrapper");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 100);
    }
  }, [loading, isFetchedPosition, hash, jumpFlagRef.current]);

  return (
    <PoolLayout
      header={<HeaderContainer />}
      poolPairInformation={<PoolPairInformationContainer />}
      liquidity={<MyLiquidityContainer address={address} isStakable={isStakable} />}
      staking={isStakable ? <StakingContainer /> : null}
      footer={<Footer />}
      isStaking={isStakable}
    />
  );
};

export default PoolDetail;
