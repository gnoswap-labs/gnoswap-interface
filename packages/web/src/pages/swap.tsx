import SwapLayout from "@layouts/swap-layout/SwapLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import SwapContainer from "@containers/swap-container/SwapContainer";
import Footer from "@components/common/footer/Footer";
import SwapLiquidityContainer from "@containers/swap-liquidity-container/SwapLiquidityContainer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { useAtom } from "jotai";
import * as SwapState from "@states/swap";
import { useMemo } from "react";

export default function Swap() {
  const [swapInfo] = useAtom(SwapState.swap);

  const title = useMemo(() => {

    if (swapInfo.tokenA && swapInfo.tokenB) {
      return `Swap ${swapInfo.tokenA.symbol} to ${swapInfo.tokenB.symbol} | Gnoswap`;
    }

    if (swapInfo.tokenA) {
      return `Swap ${swapInfo.tokenA.symbol} | Gnoswap`;
    }

    return "Swap | Gnoswap";
  }, [swapInfo.tokenA, swapInfo.tokenB]);

  const ogTitle = useMemo(() => {
    return "Gnoland(GNOT) | Gnoswap";
  }, []);

  return (
    <>
      <SEOHeader
        title={title}
        ogTitle={ogTitle}
        pageDescription="The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders."
        ogDescription="Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity."
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
