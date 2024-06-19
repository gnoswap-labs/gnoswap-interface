import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import LeaderboardLayout from "@layouts/leaderboard-layout/LeaderboardLayout";
import LeaderboardListLayout from "@layouts/leaderboard-list-layout/LeaderboardListLayout";
import LeaderboardSubHeaderContainer from "@containers/leaderboard-subheader-container/LeaderboardSubheaderContainer";
import SEOHeader from "@components/common/seo-header/seo-header";

export default function Leaderboard() {
  return (
    <>
      <SEOHeader
        title={"Leaderboard | Gnoswap"}
        pageDescription="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders."
      />
      <LeaderboardLayout
        header={<HeaderContainer />}
        subheader={<LeaderboardSubHeaderContainer />}
        list={<LeaderboardListLayout />}
        footer={<Footer />}
      />
    </>
  );
}
