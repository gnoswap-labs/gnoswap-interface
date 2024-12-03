import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DeviceSize } from "@styles/media";
import { useGetPoolDetailByPath } from "@query/pools";
import { useLoading } from "@hooks/common/use-loading";
import { makeRouteUrl } from "@utils/page.utils";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { checkGnotPath } from "@utils/common";
import { makeSwapFeeTier } from "@utils/swap-utils";

import SEOHeader from "@components/common/seo-header/seo-header";
import PoolAddLayout from "@views/pool/pool-add/PoolAddLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import AdditionalInfoContainer from "@views/pool/pool-add/containers/additional-info-container/AdditionalInfoContainer";
import PoolAddLiquidityContainer from "@views/pool/pool-add/containers/pool-add-liquidity-container/PoolAddLiquidityContainer";
import EarnAddLiquidityContainer from "@views/pool/pool-add/containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Swap", "AddPosition"])),
    },
  };
}

export default function Page() {
  const router = useCustomRouter();
  const query = router.query;
  const poolPath = router.getPoolPath();
  const { t } = useTranslation();
  const { width } = useWindowSize();

  const { data, isLoading } = useGetPoolDetailByPath(poolPath, { enabled: !!poolPath });

  const { isLoading: isLoadingCommon } = useLoading();
  const { tokens } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const feeTier = query.fee_tier as string;

  const feeStr = useMemo(() => {
    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [feeTier]);

  const useDedicatedPool = useMemo(() => false, []);

  const listBreadcrumb = useMemo(() => {
    const base = [{ title: t("business:pageHeader.earn"), path: "/earn" }];

    if (useDedicatedPool) {
      base.push({
        title:
          width > DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${getGnotPath(data?.tokenB).symbol} (${Number(data?.fee) / 10000}%)`
            : "...",
        path: makeRouteUrl(PAGE_PATH.POOL, {
          [QUERY_PARAMETER.POOL_PATH]: data?.poolPath,
        }),
      });
    }

    base.push({ title: t("business:pageHeader.addPosi"), path: "" });

    return base;
  }, [t, useDedicatedPool, width, getGnotPath, data?.tokenA, data?.tokenB, data?.fee, data?.poolPath]);

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo["/earn/add"], []);

  const title = useMemo(() => {
    const tokenAPath = query.tokenA as string | undefined;
    const tokenBPath = query.tokenB as string | undefined;

    const tokenA = getGnotPath(tokenAPath ? tokens.find(item => item.path === checkGnotPath(tokenAPath)) : undefined);
    const tokenB = getGnotPath(tokenBPath ? tokens.find(item => item.path === checkGnotPath(tokenBPath)) : undefined);

    return seoInfo.title([tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[]);
  }, [feeStr, query.tokenA, query.tokenB, seoInfo, tokens, getGnotPath]);

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
            isLoading={useDedicatedPool ? isLoadingCommon || isLoading : false}
          />
        }
        addLiquidity={useDedicatedPool ? <PoolAddLiquidityContainer /> : <EarnAddLiquidityContainer />}
        additionalInfo={<AdditionalInfoContainer />}
        footer={<Footer />}
      />
    </>
  );
}
