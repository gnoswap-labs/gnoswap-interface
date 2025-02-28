import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";

import LeaderboardSubHeaderContainer from "./containers/leaderboard-subheader-container/LeaderboardSubheaderContainer";
import LeaderboardBannerContainer from "./containers/leaderboard-banner-container/LeaderboardBannerContainer";
import LeaderboardList from "./leaderboard-list/LeaderboardList";
import LeaderboardLayout from "./LeaderboardLayout";

const Leaderboard: React.FC = () => {
  return (
    <LeaderboardLayout
      header={<HeaderContainer />}
      subheader={<LeaderboardSubHeaderContainer />}
      banner={<LeaderboardBannerContainer />}
      list={<LeaderboardList />}
      footer={<Footer />}
    />
  );
};

export default Leaderboard;
