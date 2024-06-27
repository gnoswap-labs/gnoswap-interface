import Footer from "@components/common/footer/Footer";
import SEOHeader from "@components/common/seo-header/seo-header";
import Banner from "@components/home/banner/Banner";
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
    <>
      <SEOHeader
        title="The One-stop Gnoland DeFi Platform | Gnoswap"
        pageDescription="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders."
        ogDescription="Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity."
      />
      <HomeLayout
        header={<HeaderContainer />}
        brand={<GnoswapBrandContainer />}
        swap={<HomeSwapContainer />}
        trending={<TrendingCardListContainer />}
        highest={<HighestAprsCardListContainer />}
        recently={<RecentlyAddedCardListContainer />}
        tokenList={<TokenListContainer />}
        banner={<Banner />}
        footer={<Footer />}
      />
    </>
  );
}
