import { useMemo } from "react";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ThemeState } from "@states/index";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";

import SEOHeader from "@components/common/seo-header/seo-header";
import Custom500Layout from "@layouts/custom-500/Custom500Layout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import IconGnoswap404 from "@components/common/icons/IconGnoswap404";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const goBackClick = () => router.back();
  const themeKey = useAtomValue(ThemeState.themeKey);

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo["/500"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <Custom500Layout
        header={<HeaderContainer />}
        icon404={<IconGnoswap404 themeKey={themeKey} className="icon-404" />}
        goBackClick={goBackClick}
        footer={<Footer />}
        themeKey={themeKey}
      />
    </>
  );
}
