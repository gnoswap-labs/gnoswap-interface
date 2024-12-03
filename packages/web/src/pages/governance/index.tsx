import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import Governance from "@views/governance/Governance";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "Governance",
        "Wallet",
        ...DEFAULT_I18N_NS,
      ])),
    },
  };
}

export default function Page() {
  const seoInfo = SEOInfo["/governance"];

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <Governance />
    </>
  );
}
