import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import Custom404 from "@layouts/custom-404/Custom404";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS])),
    },
  };
}

export default function Page() {
  const seoInfo = useMemo(() => SEOInfo["/404"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <Custom404 />
    </>
  );
}
