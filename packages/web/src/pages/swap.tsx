import SwapLayout from "@layouts/swap-layout/SwapLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import SwapContainer from "@containers/swap-container/SwapContainer";
import Footer from "@components/common/footer/Footer";
import SwapLiquidityContainer from "@containers/swap-liquidity-container/SwapLiquidityContainer";
import { useRouter } from "next/router";

export default function Swap() {
  const router = useRouter();
  console.log("🚀 ~ Swap ~ router:", router.basePath);
  console.log("🚀 ~ Swap ~ router:", router.asPath);
  console.log("🚀 ~ Swap ~ router:", router.pathname);

  return (
    <SwapLayout
      header={<HeaderContainer />}
      swap={<SwapContainer />}
      liquidity={<SwapLiquidityContainer />}
      footer={<Footer />}
    />
  );
}
