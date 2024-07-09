import React, { useMemo } from "react";
import IconGnoswap404 from "@components/common/icons/IconGnoswap404";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import Custom404Layout from "@layouts/custom-404/Custom404Layout";
import useRouter from "@hooks/common/use-custom-router";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SEOInfo } from "@constants/common.constant";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// export async function getStaticProps({ locale }: { locale: string }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ["HeaderFooter"])),
//     },
//   };
// }

export default function Custom404() {
  const router = useRouter();
  const goBackClick = () => router.back();
  const themeKey = useAtomValue(ThemeState.themeKey);

  const seoInfo = useMemo(() => SEOInfo["/404"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <Custom404Layout
        header={<HeaderContainer />}
        icon404={<IconGnoswap404 themeKey={themeKey} className="icon-404" />}
        goBackClick={goBackClick}
        footer={<Footer />}
        themeKey={themeKey}
      />
    </>
  );
}
