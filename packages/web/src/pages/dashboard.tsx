import DashboardLayout from "@layouts/dashboard-layout/DashboardLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import TvlChartContainer from "@containers/tvl-chart-container/TvlChartContainer";
import VolumeChartContainer from "@containers/volume-chart-container/VolumeChartContainer";
import DashboardInfoContainer from "@containers/dashboard-info-container/DashboardInfoContainer";
import DashboardActivitiesContainer from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SEOInfo } from "@constants/common.constant";
import { useMemo } from "react";

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
