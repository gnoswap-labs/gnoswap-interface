import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import StakePositionContainer from "@containers/stake-position-container/StakePositionContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import StakePositionLayout from "@layouts/stake-position-layout/StakePositionLayout";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";

export default function Earn() {
  const { breakpoint } = useWindowSize();

  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: breakpoint === DEVICE_TYPE.WEB ? "GNS/GNOT (0.3%)" : "...", path: "/earn/pool/bar_foo_100" },
    { title: "Stake Position", path: "" },
  ];
  return (
    <StakePositionLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      stakeLiquidity={<StakePositionContainer />}
      footer={<Footer />}
    />
  );
}
