import Footer from "@components/common/footer/Footer";
import TokenChartContainer from "@containers/token-chart-container/TokenChartContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer, { BreadcrumbTypes } from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import TokenLayout from "@layouts/token-layout/TokenLayout";
import TokenInfoContentContainer from "@containers/token-info-content-container/TokenInfoContentContainer";
import TokenDescriptionContainer from "@containers/token-description-container/TokenDescriptionContainer";
import TokenSwapContainer from "@containers/token-swap-container/TokenSwapContainer";
import BestPoolsContainer from "@containers/best-pools-container/BestPoolsContainer";
import TrendingCryptoCardListContainer from "@containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";
import TrendingCryptos from "@components/token/trending-cryptos/TrendingCryptos";
import GainerAndLoserContainer from "@containers/gainer-and-loser-container/GainerAndLoserContainer";
import { useLoading } from "@hooks/common/use-loading";
import { useGetTokenByPath } from "@query/token";
import { useMemo } from "react";
import { useRouter } from "next/router";

export default function Token() {
  const { isLoading } = useLoading();
  const router = useRouter();
  const path = router.query["token-path"] as string;
  const { data: token } = useGetTokenByPath(path, {
    enabled: !!path,
    refetchInterval: 1000 * 10,
  });

  const steps = useMemo(() => {
    return [
      {
        title: "Main",
        path: "/",
      },
      {
        title: `${token?.symbol || ""}`,
        path: "",
        options: {
          type: "TOKEN_SYMBOL" as BreadcrumbTypes,
          token: token
        }
      },
    ];
  }, [token]);

  return (
    <TokenLayout
      header={<HeaderContainer />}
      breadcrumbs={<BreadcrumbsContainer listBreadcrumb={steps} isLoading={isLoading} w="102px" />}
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
