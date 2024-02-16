import React, { useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import PoolLayout from "@layouts/pool-layout/PoolLayout";
import StakingContainer from "@containers/staking-container/StakingContainer";
import PoolPairInformationContainer from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import MyLiquidityContainer from "@containers/my-liquidity-container/MyLiquidityContainer";
import { useRouter } from "next/router";
import { useGetPoolDetailByPath } from "@query/pools";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }:{ locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter", "Main"])),
    }
  };
}

export default function Pool() {
  const router = useRouter();
  const poolPath = router.query["pool-path"] || "";
  const { data = null } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });
  
  const isStaking = useMemo(() => {
    if (data?.incentivizedType === "INCENTIVIZED") {
      return true;
    }
    if (data?.incentivizedType === "EXTERNAL_INCENTIVIZED") {
      return true;
    }
    return false;
  }, [data?.incentivizedType]);

  return (
    <PoolLayout
      header={<HeaderContainer />}
      poolPairInformation={<PoolPairInformationContainer />}
      liquidity={<MyLiquidityContainer />}
      staking={isStaking ? <StakingContainer /> : null}
      footer={<Footer />}
      isStaking={isStaking}
    />
  );
}
