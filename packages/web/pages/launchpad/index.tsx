import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Launchpad from "@layouts/launchpad/Launchpad";
import { LaunchpadSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Launchpad", "Earn"])),
    },
  };
}

export default function Page() {
  return (
    <>
      <LaunchpadSEOContainer />
      <Launchpad />
    </>
  );
}
