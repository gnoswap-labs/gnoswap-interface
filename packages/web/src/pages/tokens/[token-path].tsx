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
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { encryptId } from "@utils/common";
import { API_URL } from "@constants/environment.constant";
import { ITokenResponse } from "@repositories/token";
import { HTTP_5XX_ERROR } from "@constants/common.constant";

export const getServerSideProps: GetServerSideProps<{ token?: ITokenResponse }> = (async (context) => {
  const tokenPath = (context.query["token-path"] ?? "") as string;

  if (!tokenPath) {
    return { notFound: true };
  }

  const res = await fetch(API_URL + "/token-metas/" + encodeURIComponent(encryptId(tokenPath)));

  if (HTTP_5XX_ERROR.includes(res.status)) {
    return {
      redirect: {
        destination: "/500",
        permanent: false
      }
    };
  }

  if (res.status === 404) {
    return { notFound: true };
  }

  if (res.status === 200) {
    const token = (await res.json()).data as ITokenResponse;

    return {
      props: {
        token: token
      }
    };
  }

  return {
    props: {}
  };
});

export default function Token({ token: tokenFromServer }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isLoading } = useLoading();
  const router = useRouter();
  const path = router.query["token-path"] as string;
  const { data: token = tokenFromServer } = useGetTokenByPath(path, {
    enabled: !!path,
    refetchInterval: 1000 * 10,
    initialData: tokenFromServer
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
