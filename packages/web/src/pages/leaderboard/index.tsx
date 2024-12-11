import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";

import LeaderboardLayout from "@layouts/leaderboard-layout/LeaderboardLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import LeaderboardSubheaderContainer from "@layouts/leaderboard-layout/containers/leaderboard-subheader-container/LeaderboardSubheaderContainer";
import LeaderboardList from "@layouts/leaderboard-layout/leaderboard-list/LeaderboardList";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS])),
    },
  };
}

export default function Page() {
  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo["/leaderboard"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <LeaderboardLayout
        header={<HeaderContainer />}
        subheader={<LeaderboardSubheaderContainer />}
        list={<LeaderboardList />}
        footer={<Footer />}
      />
    </>
  );
}
