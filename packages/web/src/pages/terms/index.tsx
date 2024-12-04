import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";

import SEOHeader from "@components/common/seo-header/seo-header";
import TermsLayout from "@views/terms/TermsLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS])),
    },
  };
}

export default function Page() {
  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = React.useMemo(() => SEOInfo["/terms"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <TermsLayout header={<HeaderContainer />} footer={<Footer />} />;
    </>
  );
}
