import { useMemo } from "react";
import { useAtom } from "jotai";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import SEOHeader from "@components/common/seo-header/seo-header";
import { EarnState } from "@states/index";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@hooks/common/use-window-size";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useTokenData } from "@hooks/token/use-token-data";
import { useLoading } from "@hooks/common/use-loading";
import { DEVICE_TYPE } from "@styles/media";
import { makeRouteUrl } from "@utils/page.utils";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import { checkGnotPath } from "@utils/common";

import PoolIncentivizeLayout from "@layouts/pool/pool-incentivize/PoolIncentivizeLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import PoolAddIncentivizeContainer from "@layouts/pool/pool-incentivize/containers/pool-add-incentivize-container/PoolAddIncentivizeContainer";
import PoolIncentivizeContainer from "@layouts/pool/pool-incentivize/containers/pool-incentivize-container/PoolIncentivizeContainer";
import IncentivizePoolHistoryContainer from "@layouts/pool/pool-incentivize/containers/incentivize-pool-history-container/IncentivizePoolHistoryContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "IncentivizePool"])),
    },
  };
}

export default function Page() {
  const router = useCustomRouter();
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();

  const poolPath = router.getPoolPath() || "::";
  const [tokenAPath, tokenBPath, fee] = poolPath.split(":");
  const { getGnotPath } = useGnotToGnot();
  const { tokens } = useTokenData();

  const { isLoading } = useLoading();

  const [currentPool] = useAtom(EarnState.pool);

  const feeStr = useMemo(() => {
    const feeTier = currentPool?.fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [currentPool?.fee]);

  const hasDedicatedPool = router.asPath.includes("/pool");

  const listBreadcrumb = useMemo(() => {
    const base = [{ title: t("business:pageHeader.earn"), path: "/earn" }];

    if (hasDedicatedPool) {
      const tokenA = getGnotPath(tokenAPath ? tokens.find(item => item.path === checkGnotPath(tokenAPath)) : undefined);
      const tokenB = getGnotPath(tokenBPath ? tokens.find(item => item.path === checkGnotPath(tokenBPath)) : undefined);
      base.push({
        title:
          breakpoint === DEVICE_TYPE.WEB || breakpoint === DEVICE_TYPE.MEDIUM_WEB
            ? `${getGnotPath(tokenA).symbol}/${getGnotPath(tokenB).symbol} (${Number(fee) / 10000}%)`
            : "...",
        path: makeRouteUrl(PAGE_PATH.POOL, {
          [QUERY_PARAMETER.POOL_PATH]: poolPath,
        }),
      });
    }

    base.push({ title: t("business:pageHeader.incentivzePool"), path: "" });

    return base;
  }, [tokenAPath, tokenBPath, breakpoint, hasDedicatedPool]);

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo["/earn/incentivize"], []);

  const title = useMemo(() => {
    const tokenA = getGnotPath(currentPool?.tokenA);
    const tokenB = getGnotPath(currentPool?.tokenB);

    return seoInfo.title([tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[]);
  }, [currentPool?.tokenA, currentPool?.tokenB, feeStr, getGnotPath, seoInfo]);

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
        breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} isLoading={isLoading} />}
        poolIncentivize={hasDedicatedPool ? <PoolAddIncentivizeContainer /> : <PoolIncentivizeContainer />}
        history={<IncentivizePoolHistoryContainer />}
        footer={<Footer />}
      />
    </>
  );
}
