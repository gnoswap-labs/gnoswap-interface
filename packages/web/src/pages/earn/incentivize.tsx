import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolIncentivizeContainer from "@containers/pool-incentivize-container/PoolIncentivizeContainer";
import PoolIncentivizeLayout from "@layouts/pool-incentivize-layout/PoolIncentivizeLayout";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter", "Main"]))
    }
  };
}
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
