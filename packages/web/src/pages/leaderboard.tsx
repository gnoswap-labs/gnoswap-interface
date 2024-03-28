import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import LeaderboardLayout from "@layouts/leaderboard-layout/LeaderboardLayout";
import LeaderboardListLayout from "@layouts/leaderboard-list-layout/LeaderboardListLayout";
import LeaderboardSubHeaderContainer from "@containers/leaderboard-subheader-container/LeaderboardSubheaderContainer";

export default function Leaderboard() {
  return (
    <LeaderboardLayout
      header={<HeaderContainer />}
      subheader={<LeaderboardSubHeaderContainer />}
      list={<LeaderboardListLayout />}
      footer={<Footer />}
    />
  );
}
