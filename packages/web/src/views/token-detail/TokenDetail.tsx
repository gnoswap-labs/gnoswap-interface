import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";

import { TokenError } from "@common/errors/token";
import Footer from "@components/common/footer/Footer";
import TrendingCryptos from "@components/token/trending-cryptos/TrendingCryptos";
import BreadcrumbsContainer, {
  BreadcrumbTypes,
} from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import GainerAndLoserContainer from "@containers/gainer-and-loser-container/GainerAndLoserContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import TokenChartContainer from "@containers/token-chart-container/TokenChartContainer";
import TokenDescriptionContainer from "@containers/token-description-container/TokenDescriptionContainer";
import TokenInfoContentContainer from "@containers/token-info-content-container/TokenInfoContentContainer";
import TokenSwapContainer from "@containers/token-swap-container/TokenSwapContainer";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useGetToken } from "@query/token";

import TrendingCryptoCardListContainer from "./containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";
import BestPoolsContainer from "./containers/best-pools-container/BestPoolsContainer";
import TokenLayout from "./TokenLayout";

const TokenDetail: React.FC = () => {
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const { isLoading } = useLoading();
  const { t } = useTranslation();

  const { data: token } = useGetToken(path, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      if (err?.["response"]?.["status"] === 404) {
        router.push("/");
      }
      if (err instanceof TokenError) {
        router.push("/");
      }
    },
  });

  const steps = useMemo(() => {
    return [
      {
        title: t("common:main"),
        path: "/",
      },
      {
        title: `${token?.symbol || ""}`,
        path: "",
        options: {
          type: "TOKEN_SYMBOL" as BreadcrumbTypes,
          token: token,
        },
      },
    ];
  }, [token, t]);

  return (
    <TokenLayout
      header={<HeaderContainer />}
      breadcrumbs={
        <BreadcrumbsContainer
          listBreadcrumb={steps}
          isLoading={isLoading}
          w="102px"
        />
      }
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
};


export default TokenDetail;