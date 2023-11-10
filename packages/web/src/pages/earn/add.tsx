import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import EarnAddLayout from "@layouts/earn-add-layout/EarnAddLayout";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import EarnAddLiquidityContainer from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";

export default function EarnAdd() {
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "Create Position", path: "" },
  ];
  return (
    <EarnAddLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      addLiquidity={<EarnAddLiquidityContainer />}
      footer={<Footer />}
    />
  );
}
