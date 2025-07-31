import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Dashboard from "@layouts/dashboard/Dashboard";
import { ExploreSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Dashboard"])),
    },
  };
}

export default function Page() {
  return (
    <>
      <ExploreSEOContainer />
      <Dashboard />
    </>
  );
}
