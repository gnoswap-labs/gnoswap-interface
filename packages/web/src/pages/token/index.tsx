import Footer from "@components/common/footer/Footer";
import TokenChartContainer from "@containers/token-chart-container/TokenChartContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer, {
  BreadcrumbTypes,
} from "@containers/breadcrumbs-container/BreadcrumbsContainer";
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
import SEOHeader from "@components/common/seo-header/seo-header";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { SEOInfo } from "@constants/common.constant";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { formatPrice } from "@utils/new-number-utils";
import useCustomRouter from "@hooks/common/use-custom-router";
import { TokenError } from "@common/errors/token";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "HeaderFooter",
        "common",
        "business",
        "Swap",
        "TokenDetails",
      ])),
    },
  };
}

export default function Token() {
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const { isLoading } = useLoading();
  const { t } = useTranslation();

  const { data: token } = useGetTokenByPath(path, {
    onError: (err: any) => {
      if (err?.["response"]?.["status"] === 404) {
        router.push("/");
      }
      if (err instanceof TokenError) {
        router.push("/");
      }
    },
  });
  const { data: { usd: currentPrice } = {} } = useGetTokenPricesByPath(
    path === "gnot" ? WRAPPED_GNOT_PATH : (path as string),
    { enabled: !!path },
  );
  const { getGnotPath } = useGnotToGnot();

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

  const price = useMemo(() => {
    if (currentPrice) {
      return formatPrice(currentPrice);
    }

    return null;
  }, [currentPrice]);

  const wrappedToken = useMemo(() => getGnotPath(token), [getGnotPath, token]);

  const seoInfo = useMemo(() => SEOInfo["/token"], []);

  const title = useMemo(() => {
    return seoInfo.title([
      currentPrice ? price : undefined,
      token ? wrappedToken.name : undefined,
      token ? wrappedToken.symbol : undefined,
    ]);
  }, [
    currentPrice,
    price,
    seoInfo,
    token,
    wrappedToken.name,
    wrappedToken.symbol,
  ]);

  const ogTitle = useMemo(
    () =>
      seoInfo.ogTitle?.(
        [
          token ? wrappedToken?.name : undefined,
          token ? wrappedToken?.symbol : undefined,
        ].filter(item => item),
      ),
    [seoInfo, token, wrappedToken?.name, wrappedToken?.symbol],
  );
  const desc = useMemo(
    () =>
      seoInfo.desc?.(
        [token ? wrappedToken?.symbol : undefined].filter(item => item),
      ),
    [seoInfo, token, wrappedToken?.symbol],
  );

  return (
    <>
      <SEOHeader
        title={title}
        ogTitle={ogTitle}
        pageDescription={desc}
        ogDescription={seoInfo.ogDesc?.()}
      />
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
    </>
  );
}
