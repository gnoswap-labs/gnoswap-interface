import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import LeaderboardLayout from "@layouts/leaderboard-layout/LeaderboardLayout";
import LeaderboardListContainer from "@containers/leaderboard-list-container/LeaderboardListContainer";
import LeaderboardSubHeaderContainer from "@containers/leaderboard-subheader-container/LeaderboardSubheaderContainer";

export default function Leaderboard() {
  return (
    <LeaderboardLayout
      header={<HeaderContainer />}
      subheader={<LeaderboardSubHeaderContainer />}
      list={<LeaderboardListContainer />}
      footer={<Footer />}
    />
  );
}
