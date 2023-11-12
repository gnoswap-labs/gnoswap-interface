import React from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import PoolAddLayout from "@layouts/pool-add-layout/PoolAddLayout";
import PoolAddLiquidityContainer from "@containers/pool-add-liquidity-container/PoolAddLiquidityContainer";

export default function EarnAdd() {
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "GNS/GNOT (0.3%)", path: "/earn/pool/bar_foo_100" },
    { title: "Create Position", path: "" },
  ];
  return (
    <PoolAddLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      addLiquidity={<PoolAddLiquidityContainer />}
      footer={<Footer />}
    />
  );
}
