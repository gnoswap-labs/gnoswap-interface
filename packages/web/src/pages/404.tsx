import React from "react";
import IconGnoswap404 from "@components/common/icons/IconGnoswap404";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import Custom404Layout from "@layouts/custom-404/Custom404Layout";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  const goBackClick = () => router.back();

  return (
    <Custom404Layout
      header={<HeaderContainer />}
      icon404={<IconGnoswap404 />}
      goBackClick={goBackClick}
      footer={<Footer />}
    />
  );
}
