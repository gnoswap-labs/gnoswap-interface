import { useAtom } from "jotai";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import * as SwapState from "@states/swap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import SwapLayout from "@views/swap/SwapLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import SwapContainer from "@views/swap/containers/swap-container/SwapContainer";
import SwapLiquidityContainer from "@views/swap/containers/swap-liquidity-container/SwapLiquidityContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Swap"])),
    },
  };
}

export default function Page() {
  const [swapInfo] = useAtom(SwapState.swap);

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo["/swap"], []);

  const title = useMemo(
    () => seoInfo.title([swapInfo.tokenA?.symbol, swapInfo.tokenB?.symbol].filter(item => item) as string[]),
    [seoInfo, swapInfo.tokenA?.symbol, swapInfo.tokenB?.symbol],
  );

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <SwapLayout
        header={<HeaderContainer />}
        swap={<SwapContainer />}
        liquidity={<SwapLiquidityContainer />}
        footer={<Footer />}
      />
    </>
  );
}
