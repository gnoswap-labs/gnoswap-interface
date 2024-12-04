import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

import { TokenError } from "@common/errors/token";
import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useLoading } from "@hooks/common/use-loading";

import { useGetToken, useGetTokenPrices } from "@query/token";
import { formatPrice } from "@utils/new-number-utils";
import TokenLayout from "@views/token-detail/TokenLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer, { BreadcrumbTypes } from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import TokenChartContainer from "@views/token-detail/containers/token-chart-container/TokenChartContainer";
import TokenInfoContentContainer from "@views/token-detail/containers/token-info-content-container/TokenInfoContentContainer";
import TokenDescriptionContainer from "@views/token-detail/containers/token-description-container/TokenDescriptionContainer";
import TokenSwapContainer from "@views/token-detail/containers/token-swap-container/TokenSwapContainer";
import BestPoolsContainer from "@views/token-detail/containers/best-pools-container/BestPoolsContainer";
import TrendingCryptos from "@views/token-detail/components/trending-cryptos/TrendingCryptos";
import TrendingCryptoCardListContainer from "@views/token-detail/containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";
import GainerAndLoserContainer from "@views/token-detail/containers/gainer-and-loser-container/GainerAndLoserContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Swap", "TokenDetails"])),
    },
  };
}

export default function Page() {
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
  const { data: { usd: currentPrice } = {} } = useGetTokenPrices(
    path === "gnot" ? WRAPPED_GNOT_PATH : (path as string),
    { enabled: !!path },
  );
  const { getGnotPath } = useGnotToGnot();

  const wrappedToken = useMemo(() => {
    if (!token) {
      return null;
    }
    return getGnotPath(token);
  }, [getGnotPath, token]);

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

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo["/token"], []);

  const title = useMemo(() => {
    return seoInfo.title([
      currentPrice ? formatPrice(currentPrice) : undefined,
      token ? wrappedToken?.name : undefined,
      token ? wrappedToken?.symbol : undefined,
    ]);
  }, [currentPrice, seoInfo, token, wrappedToken?.name, wrappedToken?.symbol]);

  const ogTitle = useMemo(
    () =>
      seoInfo.ogTitle?.(
        [token ? wrappedToken?.name : undefined, token ? wrappedToken?.symbol : undefined].filter(item => item),
      ),
    [seoInfo, token, wrappedToken?.name, wrappedToken?.symbol],
  );
  const desc = useMemo(
    () => seoInfo.desc?.([token ? wrappedToken?.symbol : undefined].filter(item => item)),
    [seoInfo, token, wrappedToken?.symbol],
  );

  return (
    <>
      <SEOHeader title={title} ogTitle={ogTitle} pageDescription={desc} ogDescription={seoInfo.ogDesc?.()} />
      <TokenLayout
        header={<HeaderContainer />}
        breadcrumbs={<BreadcrumbsContainer listBreadcrumb={steps} isLoading={isLoading} w="102px" />}
        chart={<TokenChartContainer />}
        info={<TokenInfoContentContainer />}
        description={<TokenDescriptionContainer />}
        swap={<TokenSwapContainer />}
        bestPools={<BestPoolsContainer />}
        trending={<TrendingCryptos cardList={<TrendingCryptoCardListContainer />} />}
        gainersAndLosers={<GainerAndLoserContainer />}
        footer={<Footer />}
      />
    </>
  );
}
