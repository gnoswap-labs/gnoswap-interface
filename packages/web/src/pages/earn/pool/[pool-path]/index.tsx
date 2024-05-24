import React, { useEffect, useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import StakingContainer from "@containers/staking-container/StakingContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";
import { useRouter } from "next/router";
import { useGetPoolDetailByPath } from "@query/pools";
import useUrlParam from "@hooks/common/use-url-param";
import { useWallet } from "@hooks/wallet/use-wallet";
import { addressValidationCheck } from "@utils/validation-utils";
import { usePositionData } from "@hooks/common/use-position-data";
import { useLoading } from "@hooks/common/use-loading";

export default function Pool() {
  const router = useRouter();
  const { account } = useWallet();
  const poolPath = router.query["pool-path"] || "";
  const { data = null } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const { isLoadingCommon } = useLoading();

  const { initializedData, hash } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  const { isFetchedPosition, loading, getPositionsByPoolId, positions } =
    usePositionData(address);

  const isStaking = useMemo(() => {
    if (data?.incentiveType === "INCENTIVIZED") {
      return true;
    }
    const temp = getPositionsByPoolId(poolPath as string);
    const stakedPositions = temp.filter(position => position.staked);
    if (stakedPositions.length > 0) {
      return true;
    }
    if (data?.incentiveType === "EXTERNAL") {
      return true;
    }
    return false;
  }, [data?.incentiveType]);

  useEffect(() => {
    if (
      hash === "staking" &&
      isFetchedPosition &&
      !loading &&
      !isLoadingCommon
    ) {
      const positionContainerElement = document.getElementById("staking");
      const topPosition = positionContainerElement?.offsetTop;
      if (!topPosition) {
        return;
      }
      window.scrollTo({
        top: topPosition,
      });
    }
  }, [hash, isFetchedPosition, isLoadingCommon, loading, positions]);

  useEffect(() => {
    if (
      hash === "staking" &&
      !loading &&
      isFetchedPosition &&
      positions.length === 0
    ) {
      const positionContainerElement = document.getElementById("staking");
      const topPosition = positionContainerElement?.offsetTop;
      if (!topPosition) {
        return;
      }
      window.scrollTo({
        top: topPosition,
      });
    } else if (address && isFetchedPosition && !loading) {
      if (hash) {
        const positionContainerElement = document.getElementById(`${hash}`);
        const topPosition =
          positionContainerElement?.getBoundingClientRect().top;
        if (!topPosition) {
          return;
        }
        window.scrollTo({
          top: topPosition,
        });
      } else {
        const positionContainerElement =
          document.getElementById("liquidity-wrapper");
        const topPosition =
          positionContainerElement?.getBoundingClientRect().top;
        if (!topPosition) {
          return;
        }
        window.scrollTo({
          top: topPosition,
        });
      }
    }
  }, [isFetchedPosition, hash, address, loading]);

  return (
    <PoolLayout
      header={<HeaderContainer />}
      poolPairInformation={<PoolPairInformationContainer />}
      liquidity={<MyLiquidityContainer address={address} />}
      staking={isStaking ? <StakingContainer /> : null}
      footer={<Footer />}
      isStaking={isStaking}
    />
  );
}
