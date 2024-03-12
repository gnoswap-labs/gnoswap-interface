import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import LeaderboardLayout from "@layouts/leaderboard-layout/LeaderboardLayout";
import LeaderboardListContainer from "@containers/leaderboard-list-container/LeaderboardListContainer";

export default function Leaderboard() {
  return (
    <LeaderboardLayout
      header={<HeaderContainer />}
      list={<LeaderboardListContainer />}
      footer={<Footer />}
    />
  );
}
