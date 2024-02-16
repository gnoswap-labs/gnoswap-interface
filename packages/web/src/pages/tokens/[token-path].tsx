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
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }: { locale: string}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter", "Main"]))
    }
  };
}
export default function Token() {
  return (
    <TokenLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer />}
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
