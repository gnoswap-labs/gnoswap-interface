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
import { useGetTokenByPath, useGetTokenPricesByPath } from "@query/token";
import { useMemo } from "react";
import { useRouter } from "next/router";
import SEOHeader from "@components/common/seo-header/seo-header";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { toPriceFormat } from "@utils/number-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export default function Token() {
  const { isLoading } = useLoading();
  const router = useRouter();
  const path = router.query["token-path"] as string;
  const { data: token } = useGetTokenByPath(path, {
    enabled: !!path,
    refetchInterval: 1000 * 10,
    onError: (err: any) => {
      if (err["response"]["status"] === 404) {
        router.push("/404");
      }
    }
  });
  const {
    data: {
      usd: currentPrice = "0",
    } = {},
  } = useGetTokenPricesByPath(path === "gnot" ? WRAPPED_GNOT_PATH : (path as string), { enabled: !!path });
  const { getGnotPath } = useGnotToGnot();

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

  const price = useMemo(() => toPriceFormat(
    currentPrice, {
    usd: true,
    isRounding: false,
    fixedLessThan1Decimal: 3,
  }), [currentPrice]);

  const wrappedToken = useMemo(() => getGnotPath(token), [getGnotPath, token]);

  return (
    <>
      <SEOHeader
        title={`${price} | ${wrappedToken?.name}(${wrappedToken?.symbol})`}
        pageDescription={`Buy or Sell ${wrappedToken.symbol} on Gnoswap.`}
      />
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
    </>
  );
}
