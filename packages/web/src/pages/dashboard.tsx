import DashbordLayout from "@layouts/dashboard-layout/DashboardLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import TvlChartContainer from "@containers/tvl-chart-container/TvlChartContainer";
import VolumeChartContainer from "@containers/volume-chart-container/VolumeChartContainer";
import DashboardInfoContainer from "@containers/dashboard-info-container/DashboardInfoContainer";
import DashboardActivitiesContainer from "@containers/dashboard-activities-container/DashboardActivitiesContainer";

export default function Dashboard() {
  return (
    <DashbordLayout
      header={<HeaderContainer />}
      tvl={<TvlChartContainer />}
      volume={<VolumeChartContainer />}
      info={<DashboardInfoContainer />}
      activities={<DashboardActivitiesContainer />}
      footer={<Footer />}
    />
  );
}
