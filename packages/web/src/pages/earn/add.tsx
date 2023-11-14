import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import EarnAddLayout from "@layouts/earn-add-layout/EarnAddLayout";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import EarnAddLiquidityContainer from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import OneClickStakingContainer from "@containers/one-click-staking/OneClickStakingContainer";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";

export default function EarnAdd() {
  const [isEarnAdd] = useAtom(EarnState.isOneClick);
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "Create Position", path: "" },
  ];

  return (
    <EarnAddLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      addLiquidity={<EarnAddLiquidityContainer />}
      oneStaking={isEarnAdd ? <OneClickStakingContainer /> : null}
      footer={<Footer />}
    />
  );
}
