import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolIncentivizeContainer from "@containers/pool-incentivize-container/PoolIncentivizeContainer";
import PoolIncentivizeLayout from "@layouts/pool-incentivize-layout/PoolIncentivizeLayout";
import React from "react";

export default function PoolIncentivize() {
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "Incentivize Pool", path: "" },
  ];

  return (
    <PoolIncentivizeLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb}/>}
      poolIncentivize={<PoolIncentivizeContainer />}
      footer={<Footer />}
    />
  );
}
