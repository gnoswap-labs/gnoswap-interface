import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import Footer from "@components/common/footer/Footer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import DashboardActivitiesContainer from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import DashboardInfoContainer from "@containers/dashboard-info-container/DashboardInfoContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import TvlChartContainer from "@containers/tvl-chart-container/TvlChartContainer";
import VolumeChartContainer from "@containers/volume-chart-container/VolumeChartContainer";
import DashboardLayout from "@layouts/dashboard-layout/DashboardLayout";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...DEFAULT_I18N_NS,
        "Dashboard",
      ])),
    },
  };
}

export default function Dashboard() {
  const seoInfo = useMemo(() => SEOInfo["/dashboard"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <DashboardLayout
        header={<HeaderContainer />}
        tvl={<TvlChartContainer />}
        volume={<VolumeChartContainer />}
        info={<DashboardInfoContainer />}
        activities={<DashboardActivitiesContainer />}
        footer={<Footer />}
      />
    </>
  );
}
