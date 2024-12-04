import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";

import HomeLayout from "@views/home/HomeLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import GnoswapBrandContainer from "@containers/gnoswap-brand-container/GnoswapBrandContainer";
import HomeSwapContainer from "@containers/home-swap-container/HomeSwapContainer";
import TrendingCardListContainer from "@containers/trending-card-list-container/TrendingCardListContainer";
import HighestAprsCardListContainer from "@containers/highest-aprs-card-list-container/HighestAprsCardListContainer";
import RecentlyAddedCardListContainer from "@containers/recently-added-card-list-container/RecentlyAddedCardListContainer";
import TokenListContainer from "@containers/token-list-container/TokenListContainer";
import Banner from "@components/home/banner/Banner";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Main"])),
    },
  };
}

export default function Page() {
  const { i18n } = useTranslation(["HeaderFooter", "common", "Main", "business"], {
    bindI18n: "languageChanged loaded",
  });
  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, ["HeaderFooter", "common", "Main", "business"]);
  }, []);

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
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
