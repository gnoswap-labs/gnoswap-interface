import Footer from "@components/common/footer/Footer";
import GnoswapBrandContainer from "@containers/gnoswap-brand-container/GnoswapBrandContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import HighestAprsCardListContainer from "@containers/highest-aprs-card-list-container/HighestAprsCardListContainer";
import HomeSwapContainer from "@containers/home-swap-container/HomeSwapContainer";
import RecentlyAddedCardListContainer from "@containers/recently-added-card-list-container/RecentlyAddedCardListContainer";
import TokenListContainer from "@containers/token-list-container/TokenListContainer";
import TrendingCardListContainer from "@containers/trending-card-list-container/TrendingCardListContainer";
import HomeLayout from "@layouts/home-layout/HomeLayout";

export default function Home() {
  return (
    <HomeLayout
      header={<HeaderContainer />}
      brand={<GnoswapBrandContainer />}
      swap={<HomeSwapContainer />}
      trending={<TrendingCardListContainer />}
      highest={<HighestAprsCardListContainer />}
      recently={<RecentlyAddedCardListContainer />}
      tokenList={<TokenListContainer />}
      footer={<Footer />}
    />
  );
}
