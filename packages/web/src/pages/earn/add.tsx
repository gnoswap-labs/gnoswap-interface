import React, { useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import EarnAddLayout from "@layouts/earn-add-layout/EarnAddLayout";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import EarnAddLiquidityContainer from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import OneClickStakingContainer from "@containers/one-click-staking-container/OneClickStakingContainer";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import ExchangeRateGraphContainer from "@containers/exchange-rate-graph-container/ExchangeRateGraphContainer";
import useRouter from "@hooks/common/use-custom-router";
import SEOHeader from "@components/common/seo-header/seo-header";
import { checkGnotPath } from "@utils/common";
import { useTokenData } from "@hooks/token/use-token-data";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export default function EarnAdd() {
  const router = useRouter();
  const query = router.query;
  const [isEarnAdd] = useAtom(EarnState.isEarnAdd);
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "Add Position", path: "" },
  ];
  const { tokens } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const showExchangeRate = useMemo(
    () => query.tokenA && query.tokenB && !!currentPoolPath,
    [currentPoolPath, query.tokenA, query.tokenB],
  );

  const feeStr = useMemo(() => {
    const feeTier = router.query?.["fee_tier"] as string | undefined;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [router.query]);

  const title = useMemo(() => {
    const tokenAPath = router.query?.["tokenA"] as string | undefined;
    const tokenBPath = router.query?.["tokenB"] as string | undefined;

    const tokenA = tokenAPath ? tokens.find(item => item.path === checkGnotPath(tokenAPath)) : undefined;
    const tokenB = tokenBPath ? tokens.find(item => item.path === checkGnotPath(tokenBPath)) : undefined;

    if (tokenA && tokenB && feeStr) return `Add Position to ${getGnotPath(tokenA).symbol}/${getGnotPath(tokenB).symbol} (${feeStr || "0"})`;

    return "Add Position to Gnoswap Pools";
  }, [feeStr, getGnotPath, router.query, tokens]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription="Create your own positions and provide liquidity to earn trading fees."
      />
      <EarnAddLayout
        header={<HeaderContainer />}
        breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
        addLiquidity={<EarnAddLiquidityContainer />}
        oneStaking={isEarnAdd ? <OneClickStakingContainer /> : null}
        exchangeRateGraph={
          showExchangeRate ? <ExchangeRateGraphContainer /> : null
        }
        footer={<Footer />}
      />
    </>
  );
}
