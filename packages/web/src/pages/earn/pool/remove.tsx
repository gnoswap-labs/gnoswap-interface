import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import RemoveLiquidityContainer from "@containers/remove-liquidity-container/RemoveLiquidityContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import PoolRemoveLayout from "@layouts/pool-remove-layout/PoolRemoveLayout";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";

export default function Earn() {
  const { breakpoint } = useWindowSize();

  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: breakpoint === DEVICE_TYPE.WEB ? "GNS/GNOT (0.3%)" : "...", path: "/earn/pool/bar_foo_100" },
    { title: "Remove Position", path: "" },
  ];
  return (
    <PoolRemoveLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      removeLiquidity={<RemoveLiquidityContainer />}
      footer={<Footer />}
    />
  );
}
