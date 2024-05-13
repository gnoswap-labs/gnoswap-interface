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
import { useRouter } from "next/router";

export default function EarnAdd() {
  const query = useRouter().query;
  const [isEarnAdd] = useAtom(EarnState.isOneClick);
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "Add Position", path: "" },
  ];

  const showExchangeRate = useMemo(() => query.tokenA && query.tokenB, [query.tokenA, query.tokenB]);

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
