import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Leaderboard from "@layouts/leaderboard-layout/Leaderboard";
import { LeaderboardSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Leaderboard"])),
    },
  };
}

export default function Page() {
  return (
    <>
      <LeaderboardSEOContainer />
      <Leaderboard />
    </>
  );
}
