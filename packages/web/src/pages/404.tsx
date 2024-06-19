import React from "react";
import IconGnoswap404 from "@components/common/icons/IconGnoswap404";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import Custom404Layout from "@layouts/custom-404/Custom404Layout";
import useRouter from "@hooks/common/use-custom-router";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import SEOHeader from "@components/common/seo-header/seo-header";

export default function Custom404() {
  const router = useRouter();
  const goBackClick = () => router.back();
  const themeKey = useAtomValue(ThemeState.themeKey);

  return (
    <>
      <SEOHeader
        title={"Page Not Found!"}
        pageDescription="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders."
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
