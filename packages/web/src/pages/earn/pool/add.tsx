import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Footer from "@components/common/footer/Footer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import ExchangeRateGraphContainer from "@containers/exchange-rate-graph-container/ExchangeRateGraphContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolAddLiquidityContainer from "@containers/pool-add-liquidity-container/PoolAddLiquidityContainer";
import QuickPoolInfoContainer from "@containers/quick-pool-info-container/QuickPoolInfoContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import PoolAddLayout from "@layouts/pool-add-layout/PoolAddLayout";
import { useGetPoolDetailByPath } from "@query/pools";
import { DeviceSize } from "@styles/media";
import { checkGnotPath } from "@utils/common";
import { makeRouteUrl } from "@utils/page.utils";
import { makeSwapFeeTier } from "@utils/swap-utils";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...DEFAULT_I18N_NS,
        "AddPosition",
      ])),
    },
  };
}

export default function EarnAdd() {
  const { t } = useTranslation();

  const { width } = useWindowSize();
  const router = useRouter();
  const poolPath = router.getPoolPath();
  const { data, isLoading } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
    refetchInterval: 10_000,
  });
  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();
  const { tokens } = useTokenData();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: t("business:pageHeader.earn"), path: "/earn" },
      {
        title:
          width > DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${
                getGnotPath(data?.tokenB).symbol
              } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: makeRouteUrl(PAGE_PATH.POOL, {
          [QUERY_PARAMETER.POOL_PATH]: poolPath,
        }),
      },
      { title: t("business:pageHeader.addPosi"), path: "" },
    ];
  }, [data, poolPath, width, t]);

  const feeStr = useMemo(() => {
    const feeTier = data?.fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [data?.fee]);

  const seoInfo = useMemo(() => SEOInfo["/earn/pool/add"], []);

  const title = useMemo(() => {
    const tokenAPath = data?.tokenA.path;
    const tokenBPath = data?.tokenB.path;

    const tokenA = getGnotPath(
      tokenAPath
        ? tokens.find(item => item.path === checkGnotPath(tokenAPath))
        : undefined,
    );
    const tokenB = getGnotPath(
      tokenBPath
        ? tokens.find(item => item.path === checkGnotPath(tokenBPath))
        : undefined,
    );

    return seoInfo.title(
      [tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[],
    );
  }, [
    data?.tokenA.path,
    data?.tokenB.path,
    feeStr,
    getGnotPath,
    seoInfo,
    tokens,
  ]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <PoolAddLayout
        header={<HeaderContainer />}
        breadcrumbs={
          <BreadcrumbsContainer
            listBreadcrumb={listBreadcrumb}
            isLoading={isLoadingCommon || isLoading}
          />
        }
        addLiquidity={<PoolAddLiquidityContainer />}
        quickPoolInfo={<QuickPoolInfoContainer />}
        exchangeRateGraph={<ExchangeRateGraphContainer />}
        footer={<Footer />}
      />
    </>
  );
}
