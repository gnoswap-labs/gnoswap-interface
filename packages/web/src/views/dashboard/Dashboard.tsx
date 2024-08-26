import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";

import DashboardActivitiesContainer from "./containers/dashboard-activities-container/DashboardActivitiesContainer";
import DashboardInfoContainer from "./containers/dashboard-info-container/DashboardInfoContainer";
import TvlChartContainer from "./containers/tvl-chart-container/TvlChartContainer";
import VolumeChartContainer from "./containers/volume-chart-container/VolumeChartContainer";
import DashboardLayout from "./DashboardLayout";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout
      header={<HeaderContainer />}
      tvl={<TvlChartContainer />}
      volume={<VolumeChartContainer />}
      info={<DashboardInfoContainer />}
      activities={<DashboardActivitiesContainer />}
      footer={<Footer />}
    />
  );
};

export default Dashboard;
