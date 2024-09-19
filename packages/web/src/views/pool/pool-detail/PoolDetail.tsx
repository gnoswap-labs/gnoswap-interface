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

  const { initializedData, hash } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !isValidAddress(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

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
    if (hash === "staking" && !loading && isFetchedPosition && isStakable) {
      const positionContainerElement = document.getElementById("staking");
      const topPosition = positionContainerElement?.offsetTop;
      if (!topPosition) {
        return;
      }
      window.scrollTo({
        top: topPosition,
      });
      return;
    }

    if (
      address &&
      isFetchedPosition &&
      !loading &&
      poolPath &&
      !jumpFlagRef.current
    ) {
      if (hash && hash !== "staking") {
        const position = positions.find(item => item.id.toString() === hash);
        const isClosedPosition = !position || position?.closed;

        jumpFlagRef.current = true;
        setTimeout(() => {
          if (isClosedPosition) {
            const positionContainerElement =
              document.getElementById("liquidity-wrapper");
            const topPosition = positionContainerElement?.offsetTop;
            if (!topPosition) {
              return;
            }
            window.scrollTo({
              top: topPosition,
            });
          }

          const positionContainerElement = document.getElementById(`${hash}`);
          const topPosition = positionContainerElement?.offsetTop;
          if (!topPosition) {
            return;
          }
          window.scrollTo({
            top: topPosition,
          });
        });
        return;
      }

      jumpFlagRef.current = true;
      setTimeout(() => {
        const positionContainerElement =
          document.getElementById("liquidity-wrapper");
        const topPosition = positionContainerElement?.offsetTop;
        if (!topPosition) {
          return;
        }
        window.scrollTo({
          top: topPosition,
        });
      });
      return;
    }

    if (
      hash &&
      hash !== "staking" &&
      isFetchedPosition &&
      !loading &&
      poolPath &&
      !jumpFlagRef.current
    ) {
      const position = positions.find(item => item.id.toString() === hash);
      const isClosedPosition = !position || position?.closed;

      jumpFlagRef.current = true;
      setTimeout(() => {
        if (isClosedPosition) {
          const positionContainerElement =
            document.getElementById("liquidity-wrapper");
          const topPosition = positionContainerElement?.offsetTop;
          if (!topPosition) {
            return;
          }
          window.scrollTo({
            top: topPosition,
          });
        }

        const positionContainerElement = document.getElementById(`${hash}`);
        const topPosition = positionContainerElement?.offsetTop;
        if (!topPosition) {
          return;
        }
        window.scrollTo({
          top: topPosition,
        });
      });
      return;
    }
  }, [
    isFetchedPosition,
    hash,
    address,
    loading,
    isStakable,
    poolPath,
    positions,
    router,
  ]);

  return (
    <PoolLayout
      header={<HeaderContainer />}
      poolPairInformation={<PoolPairInformationContainer />}
      liquidity={
        <MyLiquidityContainer address={address} isStakable={isStakable} />
      }
      staking={isStakable ? <StakingContainer /> : null}
      footer={<Footer />}
      isStaking={isStakable}
    />
  );
};

export default PoolDetail;
