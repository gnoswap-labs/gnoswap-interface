import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Governance from "@layouts/governance/Governance";
import { GovernanceSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Governance", "Wallet", ...DEFAULT_I18N_NS])),
    },
  };
}

export default function Page() {
  return (
    <>
      <GovernanceSEOContainer />
      <Governance />
    </>
  );
}
