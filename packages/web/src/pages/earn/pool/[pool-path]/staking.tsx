import React, { useEffect, useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import StakingContainer from "@containers/staking-container/StakingContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "@query/pools";
import useUrlParam from "@hooks/common/use-url-param";
import { useWallet } from "@hooks/wallet/use-wallet";
import { addressValidationCheck } from "@utils/validation-utils";
import { usePositionData } from "@hooks/common/use-position-data";
import { useLoading } from "@hooks/common/use-loading";
import { getServerSideProps } from "./index";

export { getServerSideProps };

export default function Pool() {
  const router = useRouter();
  const { account } = useWallet();
  const poolPath = router.query["pool-path"] || "";
  const { data = null } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const { initializedData } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });
  const { isLoading } = useLoading();

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  const { loading, isFetchedPosition } = usePositionData({ address });

  const isStaking = useMemo(() => {
    if (data?.incentiveType === "INCENTIVIZED") {
      return true;
    }
    if (data?.incentiveType === "EXTERNAL") {
      return true;
    }
    return false;
  }, [data?.incentiveType]);

  useEffect(() => {
    if (!loading && isFetchedPosition && !isLoading) {
      const positionContainerElement = document.getElementById("staking");
      const topPosition = positionContainerElement?.offsetTop;
      if (!topPosition) {
        return;
      }
      window.scrollTo({
        top: topPosition,
      });
    }
  }, [loading, isFetchedPosition, isLoading]);

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
