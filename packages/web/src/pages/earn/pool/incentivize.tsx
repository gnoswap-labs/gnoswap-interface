import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import PoolAddIncentivizeContainer from "@containers/pool-add-incentivize-container/PoolAddIncentivizeContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import PoolIncentivizeLayout from "@layouts/pool-incentivize-layout/PoolIncentivizeLayout";
import { DEVICE_TYPE } from "@styles/media";
import React, { useMemo } from "react";
import useRouter from "@hooks/common/use-custom-router";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import { useLoading } from "@hooks/common/use-loading";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import SEOHeader from "@components/common/seo-header/seo-header";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { makeRouteUrl } from "@utils/page.utils";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter", "common"])),
    },
  };
}

export default function PoolIncentivize() {
  const { breakpoint } = useWindowSize();
  const router = useRouter();
  const poolPath = router.getPoolPath();
  const { getGnotPath } = useGnotToGnot();

  const { data, isLoading } = useGetPoolDetailByPath(poolPath as string);
  const { isLoading: isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          breakpoint === DEVICE_TYPE.WEB ||
          breakpoint === DEVICE_TYPE.MEDIUM_WEB
            ? `${getGnotPath(data?.tokenA).symbol}/${
                getGnotPath(data?.tokenB).symbol
              } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: makeRouteUrl(PAGE_PATH.POOL, {
          [QUERY_PARAMETER.POOL_PATH]: poolPath,
        }),
      },
      { title: "Incentivize Pool", path: "" },
    ];
  }, [data, breakpoint]);

  const feeStr = useMemo(() => {
    const feeTier = data?.fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [data?.fee]);

  const seoInfo = useMemo(() => SEOInfo["/earn/pool/incentivize"], []);

  const title = useMemo(() => {
    const tokenA = getGnotPath(data?.tokenA);
    const tokenB = getGnotPath(data?.tokenB);

    return seoInfo.title(
      [tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[],
    );
  }, [data?.tokenA, data?.tokenB, feeStr, getGnotPath, seoInfo]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <PoolIncentivizeLayout
        header={<HeaderContainer />}
        breadcrumbs={
          <BreadcrumbsContainer
            listBreadcrumb={listBreadcrumb}
            isLoading={isLoadingCommon || isLoading}
          />
        }
        poolIncentivize={<PoolAddIncentivizeContainer />}
        footer={<Footer />}
      />
    </>
  );
}
