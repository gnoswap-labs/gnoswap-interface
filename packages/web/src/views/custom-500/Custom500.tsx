import { useAtomValue } from "jotai";
import React from "react";

import Footer from "@components/common/footer/Footer";
import IconGnoswap404 from "@components/common/icons/IconGnoswap404";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import useRouter from "@hooks/common/use-custom-router";
import { ThemeState } from "@states/index";

import Custom500Layout from "./Custom500Layout";

const Custom500: React.FC = () => {
  const router = useRouter();
  const goBackClick = () => router.back();
  const themeKey = useAtomValue(ThemeState.themeKey);

  return (
    <Custom500Layout
      header={<HeaderContainer />}
      icon404={<IconGnoswap404 themeKey={themeKey} className="icon-404" />}
      goBackClick={goBackClick}
      footer={<Footer />}
      themeKey={themeKey}
    />
  );
};

export default Custom500;