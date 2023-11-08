import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import StakePositionContainer from "@containers/stake-position-container/StakePositionContainer";
import StakePositionLayout from "@layouts/stake-position-layout/StakePositionLayout";
import React from "react";

export default function Earn() {
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
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
