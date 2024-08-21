import { useAtom } from "jotai";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import PoolIncentivize from "@views/pool/pool-incentivize/PoolIncentivize";
import { EarnState } from "@states/index";
import { makeSwapFeeTier } from "@utils/swap-utils";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...DEFAULT_I18N_NS,
        "IncentivizePool",
      ])),
    },
  };
}

export default function Page() {
  const [currentPool] = useAtom(EarnState.pool);
  const { getGnotPath } = useGnotToGnot();

  const feeStr = useMemo(() => {
    const feeTier = currentPool?.fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [currentPool?.fee]);

  const seoInfo = useMemo(() => SEOInfo["/earn/incentivize"], []);

  const title = useMemo(() => {
    const tokenA = getGnotPath(currentPool?.tokenA);
    const tokenB = getGnotPath(currentPool?.tokenB);

    return seoInfo.title(
      [tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[],
    );
  }, [currentPool?.tokenA, currentPool?.tokenB, feeStr, getGnotPath, seoInfo]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <PoolIncentivize />
    </>
  );
}
