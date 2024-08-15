import Footer from "@components/common/footer/Footer";
import SEOHeader from "@components/common/seo-header/seo-header";
import Banner from "@components/home/banner/Banner";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import GnoswapBrandContainer from "@containers/gnoswap-brand-container/GnoswapBrandContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import HighestAprsCardListContainer from "@containers/highest-aprs-card-list-container/HighestAprsCardListContainer";
import HomeSwapContainer from "@containers/home-swap-container/HomeSwapContainer";
import RecentlyAddedCardListContainer from "@containers/recently-added-card-list-container/RecentlyAddedCardListContainer";
import TokenListContainer from "@containers/token-list-container/TokenListContainer";
import TrendingCardListContainer from "@containers/trending-card-list-container/TrendingCardListContainer";
import HomeLayout from "@layouts/home-layout/HomeLayout";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Main"])),
    },
  };
}

export default function Home() {
  const { i18n } = useTranslation(
    ["HeaderFooter", "common", "Main", "business"],
    {
      bindI18n: "languageChanged loaded",
    },
  );
  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, [
      "HeaderFooter",
      "common",
      "Main",
      "business",
    ]);
  }, []);

  const seoInfo = useMemo(() => SEOInfo["/"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
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