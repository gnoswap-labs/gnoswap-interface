import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import SEOHeader from "@components/common/seo-header/seo-header";
import Launchpad from "@layouts/launchpad/Launchpad";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Launchpad", "Earn"])),
    },
  };
}

export default function Page() {
  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo["/launchpad"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <Launchpad />
    </>
  );
}
