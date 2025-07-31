import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Governance from "@layouts/governance/Governance";
import { GovernanceSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Governance", "Wallet"])),
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
