import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Custom404 from "@layouts/custom-404/Custom404";
import { Error404SEOContainer } from "@containers/seo-header-container";

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
      <Error404SEOContainer />
      <Custom404 />
    </>
  );
}
