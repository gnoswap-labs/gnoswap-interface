import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import UnStakePositionContainer from "@containers/unstake-position-container/UnStakePositionContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import UnStakePositionLayout from "@layouts/un-stake-position-layout/UnStakePositionLayout";
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
    <UnStakePositionLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      stakeLiquidity={<UnStakePositionContainer />}
      footer={<Footer />}
    />
  );
}
