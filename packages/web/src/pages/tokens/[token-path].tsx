import Footer from "@components/common/footer/Footer";
import TokenChartContainer from "@containers/token-chart-container/TokenChartContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import TokenBreadcrumbsContainer from "@containers/token-breadcrumbs-container/TokenBreadcrumbsContainer";
import TokenLayout from "@layouts/token-layout/TokenLayout";
import TokenInfoContainer from "@containers/token-info-container/TokenInfoContainer";
import TokenDescriptionContainer from "@containers/token-description-container/TokenDescriptionContainer";
import TokenSwapContainer from "@containers/token-swap-container/TokenSwapContainer";
import BestPoolsContainer from "@containers/best-pools-container/BestPoolsContainer";
import TrendingCryptoCardListContainer from "@containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";
import GainerAndLoserCardListContainer from "@containers/gainer-and-loser-card-list-container/GainerAndLoserCardListContainer";

export default function Token() {
  return (
    <TokenLayout
      header={<HeaderContainer />}
      breadcrumbs={<TokenBreadcrumbsContainer />}
      chart={<TokenChartContainer />}
      info={<TokenInfoContainer />}
      description={<TokenDescriptionContainer />}
      swap={<TokenSwapContainer />}
      bestPools={<BestPoolsContainer />}
      trending={<TrendingCryptoCardListContainer />}
      gainersAndLosers={<GainerAndLoserCardListContainer />}
      footer={<Footer />}
    />
  );
}
