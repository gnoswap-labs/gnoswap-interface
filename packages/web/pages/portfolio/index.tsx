import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Portfolio from "@layouts/portfolio/Portfolio";
import { PortfolioSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn", "Wallet", "Metatag(title)"])),
    },
  };
}

export default function Page() {
  return (
    <>
      <PortfolioSEOContainer />
      <Portfolio />
    </>
  );
}
