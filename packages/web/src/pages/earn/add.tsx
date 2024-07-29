import { useAtom } from "jotai";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Footer from "@components/common/footer/Footer";
import SEOHeader from "@components/common/seo-header/seo-header";
import { SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import EarnAddLiquidityContainer from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import ExchangeRateGraphContainer from "@containers/exchange-rate-graph-container/ExchangeRateGraphContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import OneClickStakingContainer from "@containers/one-click-staking-container/OneClickStakingContainer";
import useRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import EarnAddLayout from "@layouts/earn-add-layout/EarnAddLayout";
import { EarnState } from "@states/index";
import { checkGnotPath } from "@utils/common";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...DEFAULT_I18N_NS,
        "Swap",
        "AddPosition",
      ])),
    },
  };
}

export default function EarnAdd() {
  const { query } = useRouter();
  const { t } = useTranslation();

  const [isEarnAdd] = useAtom(EarnState.isEarnAdd);
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);
  const listBreadcrumb = [
    { title: t("business:pageHeader.earn"), path: "/earn" },
    { title: t("business:pageHeader.addPosi"), path: "" },
  ];
  const { tokens } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const showExchangeRate = useMemo(
    () => query.tokenA && query.tokenB && !!currentPoolPath,
    [currentPoolPath, query.tokenA, query.tokenB],
  );

  const feeStr = useMemo(() => {
    const feeTier = query.fee_tier as string | undefined;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [query.fee_tier]);

  const seoInfo = useMemo(() => SEOInfo["/earn/add"], []);

  const title = useMemo(() => {
    const tokenAPath = query.tokenA as string | undefined;
    const tokenBPath = query.tokenB as string | undefined;

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
  }, [feeStr, query.tokenA, query.tokenB, seoInfo, tokens, getGnotPath]);

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
