import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import SEOHeader from "@components/common/seo-header/seo-header";
import LaunchpadDetail from "@layouts/launchpad/launchpad-detail/LaunchpadDetail";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Launchpad"])),
    },
  };
}

export default function Page() {
  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = React.useMemo(() => SEOInfo["/launchpad"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <LaunchpadDetail />
    </>
  );
}
