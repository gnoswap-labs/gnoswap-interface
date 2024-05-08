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

export default function EarnAdd() {
  const [isEarnAdd] = useAtom(EarnState.isOneClick);
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "Add Position", path: "" },
  ];

  const showExchangeRate = useMemo(() => currentPoolPath, [currentPoolPath]);

  return (
    <EarnAddLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      addLiquidity={<EarnAddLiquidityContainer />}
      oneStaking={isEarnAdd ? <OneClickStakingContainer /> : null}
      exchangeRateGraph={showExchangeRate ? <ExchangeRateGraphContainer /> : null}
      footer={<Footer />}
    />
  );
}
