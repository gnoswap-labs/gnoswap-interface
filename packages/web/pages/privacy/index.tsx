import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Privacy from "@layouts/privacy/Privacy";
import { PrivacySEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS])),
    },
  };
}

export default function Page() {
  return (
    <>
      <PrivacySEOContainer />
      <Privacy />
    </>
  );
}
