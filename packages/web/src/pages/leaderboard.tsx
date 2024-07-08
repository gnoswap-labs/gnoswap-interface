import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import LeaderboardLayout from "@layouts/leaderboard-layout/LeaderboardLayout";
import LeaderboardListLayout from "@layouts/leaderboard-list-layout/LeaderboardListLayout";
import LeaderboardSubHeaderContainer from "@containers/leaderboard-subheader-container/LeaderboardSubheaderContainer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { useMemo } from "react";
import { SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter"])),
    },
  };
}

export default function Leaderboard() {
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
        subheader={<LeaderboardSubHeaderContainer />}
        list={<LeaderboardListLayout />}
        footer={<Footer />}
      />
    </>
  );
}
