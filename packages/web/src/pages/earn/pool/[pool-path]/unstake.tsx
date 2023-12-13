import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import UnstakeLiquidityContainer from "@containers/unstake-position-container/UnstakePositionContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import UnstakeLiquidityLayout from "@layouts/unstake-liquidity-layout/UnstakeLiquidityLayout";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";

export default function Earn() {
  const { breakpoint } = useWindowSize();

  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: breakpoint === DEVICE_TYPE.WEB ? "GNS/GNOT (0.3%)" : "...", path: "/earn/pool/bar_foo_100" },
    { title: "Unstake Position", path: "" },
  ];
  return (
    <UnstakeLiquidityLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      unstakeLiquidity={<UnstakeLiquidityContainer />}
      footer={<Footer />}
    />
  );
}
