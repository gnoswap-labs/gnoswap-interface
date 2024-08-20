import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import Home from "@views/home/Home";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Main"])),
    },
  };
}

export default function Page() {
  const { i18n } = useTranslation(
    ["HeaderFooter", "common", "Main", "business"],
    {
      bindI18n: "languageChanged loaded",
    },
  );
  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, [
      "HeaderFooter",
      "common",
      "Main",
      "business",
    ]);
  }, []);

  const seoInfo = useMemo(() => SEOInfo["/"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <Home />
    </>
  );
}
