import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import PoolAddLayout from "@layouts/pool-add-layout/PoolAddLayout";
import PoolAddLiquidityContainer from "@containers/pool-add-liquidity-container/PoolAddLiquidityContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import OneClickStakingContainer from "@containers/one-click-staking-container/OneClickStakingContainer";
import React, { useMemo } from "react";
import useRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useLoading } from "@hooks/common/use-loading";
import { DeviceSize } from "@styles/media";
import ExchangeRateGraphContainer from "@containers/exchange-rate-graph-container/ExchangeRateGraphContainer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { checkGnotPath } from "@utils/common";
import { useTokenData } from "@hooks/token/use-token-data";
import { SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { makeRouteUrl } from "@utils/page.utils";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter", "common"])),
    },
  };
}

export default function EarnAdd() {
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
      { title: "Earn", path: "/earn" },
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
      { title: "Add Position", path: "" },
    ];
  }, [data, poolPath, width]);

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
        oneStaking={<OneClickStakingContainer />}
        exchangeRateGraph={<ExchangeRateGraphContainer />}
        footer={<Footer />}
      />
    </>
  );
}
