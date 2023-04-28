import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolIncentivizeContainer from "@containers/pool-incentivize-container/PoolIncentivizeContainer";
import PoolIncentivizeLayout from "@layouts/pool-incentivize-layout/PoolIncentivizeLayout";
import React from "react";

export default function PoolIncentivize() {
  return (
    <PoolIncentivizeLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer />}
      poolIncentivize={<PoolIncentivizeContainer />}
      footer={<Footer />}
    />
  );
}
