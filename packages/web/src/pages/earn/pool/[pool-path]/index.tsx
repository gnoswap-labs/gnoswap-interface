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
import { usePoolData } from "@hooks/pool/use-pool-data";
import { addressValidationCheck } from "@utils/validation-utils";

export default function Pool() {
  const router = useRouter();
  const { account } = useWallet();
  usePoolData();
  const poolPath = router.query["pool-path"] || "";
  const { data = null } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });
  const { initializedData, hash } = useUrlParam<{ addr: string | undefined }>({ addr: account?.address });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !addressValidationCheck(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  const isScrollMove = useMemo(() => {
    return Boolean(address) && Boolean(hash);
  }, [address, hash]);

  const isStaking = useMemo(() => {
    if (data?.incentivizedType === "INCENTIVIZED") {
      return true;
    }
    if (data?.incentivizedType === "EXTERNAL_INCENTIVIZED") {
      return true;
    }
    return false;
  }, [data?.incentivizedType]);

  const { isLoading: loading } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });

  useEffect(() => {
    if (isScrollMove && !loading) {
      const positionContainerElement = document.getElementById(`position-${hash}`);
      const topPosition = positionContainerElement?.getBoundingClientRect().top;
      if (!topPosition) {
        return;
      }
      window.scrollTo({
        top: topPosition,
        behavior: "smooth"
      });
    }
  }, [isScrollMove, loading]);

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
