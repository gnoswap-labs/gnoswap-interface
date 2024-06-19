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


  const poolInfoText = useMemo(
    () => `${getGnotPath(currentPool?.tokenA).symbol}/${getGnotPath(currentPool?.tokenB)?.symbol} (${feeStr || "0"})`,
    [
      currentPool?.tokenA,
      currentPool?.tokenB,
      feeStr,
      getGnotPath
    ]
  );

  const title = useMemo(() => {
    if (currentPool) return `Incentivize ${poolInfoText}`;

    return "Incentivize Gnoswap Pools";
  }, [currentPool, poolInfoText]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription="Add incentives to pools for liquidity providers to bootstrap liquidity. "
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
