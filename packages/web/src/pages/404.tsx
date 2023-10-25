import React from "react";
import IconGnoswap404 from "@components/common/icons/IconGnoswap404";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import Custom404Layout from "@layouts/custom-404/Custom404Layout";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";

export default function Custom404() {
  const router = useRouter();
  const goBackClick = () => router.back();
  const themeKey = useAtomValue(ThemeState.themeKey);

  return (
    <Custom404Layout
      header={<HeaderContainer />}
      icon404={<IconGnoswap404 className="icon-404"/>}
      goBackClick={goBackClick}
      footer={<Footer />}
      themeKey={themeKey}
    />
  );
}
