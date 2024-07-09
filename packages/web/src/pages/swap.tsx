import SwapLayout from "@layouts/swap-layout/SwapLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import SwapContainer from "@containers/swap-container/SwapContainer";
import Footer from "@components/common/footer/Footer";
import SwapLiquidityContainer from "@containers/swap-liquidity-container/SwapLiquidityContainer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { useAtom } from "jotai";
import * as SwapState from "@states/swap";
import { useMemo } from "react";
import { SEOInfo } from "@constants/common.constant";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// export async function getServerSideProps({ locale }: { locale: string }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ["HeaderFooter"])),
//     },
//   };
// }

export default function Swap() {
  const [swapInfo] = useAtom(SwapState.swap);

  const seoInfo = useMemo(() => SEOInfo["/swap"], []);

  const title = useMemo(
    () =>
      seoInfo.title(
        [swapInfo.tokenA?.symbol, swapInfo.tokenB?.symbol].filter(
          item => item,
        ) as string[],
      ),
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
