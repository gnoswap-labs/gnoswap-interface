import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolIncentivizeContainer from "@containers/pool-incentivize-container/PoolIncentivizeContainer";
import PoolIncentivizeLayout from "@layouts/pool-incentivize-layout/PoolIncentivizeLayout";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import React, { useMemo } from "react";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter"])),
    },
  };
}

export default function PoolIncentivize() {
  const [currentPool] = useAtom(EarnState.pool);
  const { getGnotPath } = useGnotToGnot();

  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "Incentivize Pool", path: "" },
  ];

  const feeStr = useMemo(() => {
    const feeTier = currentPool?.fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [currentPool?.fee]);

  const seoInfo = useMemo(() => SEOInfo["/earn/incentivize"], []);

  const title = useMemo(() => {
    const tokenA = getGnotPath(currentPool?.tokenA);
    const tokenB = getGnotPath(currentPool?.tokenB);

    return seoInfo.title(
      [tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[],
    );
  }, [currentPool?.tokenA, currentPool?.tokenB, feeStr, getGnotPath, seoInfo]);
  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <PoolIncentivizeLayout
        header={<HeaderContainer />}
        breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
        poolIncentivize={<PoolIncentivizeContainer />}
        footer={<Footer />}
      />
    </>
  );
}
