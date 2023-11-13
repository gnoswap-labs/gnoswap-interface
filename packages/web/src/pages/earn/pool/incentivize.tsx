import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolIncentivizeContainer from "@containers/pool-incentivize-container/PoolIncentivizeContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import PoolIncentivizeLayout from "@layouts/pool-incentivize-layout/PoolIncentivizeLayout";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";

export default function PoolIncentivize() {
  const { breakpoint } = useWindowSize();

  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: breakpoint === DEVICE_TYPE.WEB ? "GNS/GNOT (0.3%)" : "...", path: "/earn/pool/bar_foo_100" },
    { title: "Incentivize Pool", path: "" },
  ];

  return (
    <PoolIncentivizeLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
      poolIncentivize={<PoolIncentivizeContainer />}
      footer={<Footer />}
    />
  );
}
