import Footer from "@components/common/footer/Footer";
import TokenChartContainer from "@containers/token-chart-container/TokenChartContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import TokenLayout from "@layouts/token-layout/TokenLayout";
import TokenInfoContentContainer from "@containers/token-info-content-container/TokenInfoContentContainer";
import TokenDescriptionContainer from "@containers/token-description-container/TokenDescriptionContainer";
import TokenSwapContainer from "@containers/token-swap-container/TokenSwapContainer";
import BestPoolsContainer from "@containers/best-pools-container/BestPoolsContainer";
import TrendingCryptoCardListContainer from "@containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";
import TrendingCryptos from "@components/token/trending-cryptos/TrendingCryptos";
import GainerAndLoserContainer from "@containers/gainer-and-loser-container/GainerAndLoserContainer";
import { useLoading } from "@hooks/common/use-loading";

export default function Token() {
  const { isLoadingCommon } = useLoading();
  return (
    <TokenLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer isLoading={isLoadingCommon} w="102px"/>}
      chart={<TokenChartContainer />}
      info={<TokenInfoContentContainer />}
      description={<TokenDescriptionContainer />}
      swap={<TokenSwapContainer />}
      bestPools={<BestPoolsContainer />}
      trending={
        <TrendingCryptos cardList={<TrendingCryptoCardListContainer />} />
      }
      gainersAndLosers={<GainerAndLoserContainer />}
      footer={<Footer />}
    />
  );
}
