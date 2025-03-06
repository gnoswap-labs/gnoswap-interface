import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Wallet from "@layouts/wallet/Wallet";
import { PortfolioSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn", "Wallet"])),
    },
  };
}

export default function Page() {
  return (
    <>
      <PortfolioSEOContainer />
      <Wallet />
    </>
  );
}
