import Footer from "@components/common/footer/Footer";
import Banner from "@components/home/banner/Banner";
import GnoswapBrandContainer from "@containers/gnoswap-brand-container/GnoswapBrandContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import HighestAprsCardListContainer from "@containers/highest-aprs-card-list-container/HighestAprsCardListContainer";
import HomeSwapContainer from "@containers/home-swap-container/HomeSwapContainer";
import RecentlyAddedCardListContainer from "@containers/recently-added-card-list-container/RecentlyAddedCardListContainer";
import TokenListContainer from "@containers/token-list-container/TokenListContainer";
import TrendingCardListContainer from "@containers/trending-card-list-container/TrendingCardListContainer";
import HomeLayout from "@layouts/home-layout/HomeLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter", "Main"]))
    }
  };
}

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
      banner={<Banner />}
      footer={<Footer />}
    />
  );
}
