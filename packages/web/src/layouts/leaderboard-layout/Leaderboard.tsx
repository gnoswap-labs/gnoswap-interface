import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import LeaderboardSubHeaderContainer from "@containers/leaderboard-subheader-container/LeaderboardSubheaderContainer";

import LeaderboardList from "./components/leaderboard-list-layout/LeaderboardList";
import LeaderboardLayout from "./LeaderboardLayout";

const Leaderboard: React.FC = () => {
  return (
    <LeaderboardLayout
      header={<HeaderContainer />}
      subheader={<LeaderboardSubHeaderContainer />}
      list={<LeaderboardList />}
      footer={<Footer />}
    />
  );
};

export default Leaderboard;
