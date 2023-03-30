import SwapLayout from "@layouts/swap-layout/SwapLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import SwapContainer from "@containers/swap-container/SwapContainer";
import Footer from "@components/common/footer/Footer";

export default function Swap() {
  return (
    <SwapLayout
      header={<HeaderContainer />}
      swap={<SwapContainer />}
      footer={<Footer />}
    />
  );
}
