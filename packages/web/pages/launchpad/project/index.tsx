import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import LaunchpadDetail from "@layouts/launchpad/launchpad-detail/LaunchpadDetail";
import { LaunchpadProjectSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Launchpad", "Metatag(title)"])),
    },
  };
}

export default function Page() {
  return (
    <>
      <LaunchpadProjectSEOContainer />
      <LaunchpadDetail />
    </>
  );
}
