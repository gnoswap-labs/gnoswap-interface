import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";

import DashboardLayout from "@views/dashboard/DashboardLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import TvlChartContainer from "@views/dashboard/containers/tvl-chart-container/TvlChartContainer";
import VolumeChartContainer from "@views/dashboard/containers/volume-chart-container/VolumeChartContainer";
import DashboardInfoContainer from "@views/dashboard/containers/dashboard-info-container/DashboardInfoContainer";
import DashboardActivitiesContainer from "@views/dashboard/containers/dashboard-activities-container/DashboardActivitiesContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Dashboard"])),
    },
  };
}

export default function Page() {
  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
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
