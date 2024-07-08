import React, { useMemo } from "react";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import EarnAddLayout from "@layouts/earn-add-layout/EarnAddLayout";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import EarnAddLiquidityContainer from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import OneClickStakingContainer from "@containers/one-click-staking-container/OneClickStakingContainer";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import ExchangeRateGraphContainer from "@containers/exchange-rate-graph-container/ExchangeRateGraphContainer";
import useRouter from "@hooks/common/use-custom-router";
import SEOHeader from "@components/common/seo-header/seo-header";
import { checkGnotPath } from "@utils/common";
import { useTokenData } from "@hooks/token/use-token-data";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["HeaderFooter"])),
    },
  };
}

export default function EarnAdd() {
  const router = useRouter();
  const query = router.query;
  const [isEarnAdd] = useAtom(EarnState.isEarnAdd);
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);
  const listBreadcrumb = [
    { title: "Earn", path: "/earn" },
    { title: "Add Position", path: "" },
  ];
  const { tokens } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const showExchangeRate = useMemo(
    () => query.tokenA && query.tokenB && !!currentPoolPath,
    [currentPoolPath, query.tokenA, query.tokenB],
  );

  const feeStr = useMemo(() => {
    const feeTier = router.query?.["fee_tier"] as string | undefined;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [router.query]);

  const seoInfo = useMemo(() => SEOInfo["/earn/add"], []);

  const title = useMemo(() => {
    const tokenAPath = router.query?.["tokenA"] as string | undefined;
    const tokenBPath = router.query?.["tokenB"] as string | undefined;

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
  }, [feeStr, router.query, seoInfo, tokens, getGnotPath]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <EarnAddLayout
        header={<HeaderContainer />}
        breadcrumbs={<BreadcrumbsContainer listBreadcrumb={listBreadcrumb} />}
        addLiquidity={<EarnAddLiquidityContainer />}
        oneStaking={isEarnAdd ? <OneClickStakingContainer /> : null}
        exchangeRateGraph={
          showExchangeRate ? <ExchangeRateGraphContainer /> : null
        }
        footer={<Footer />}
      />
    </>
  );
}
