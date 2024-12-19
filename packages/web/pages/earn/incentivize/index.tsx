import { useMemo } from "react";
import { useAtom } from "jotai";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { EarnState } from "@states/index";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { makeSwapFeeTier } from "@utils/swap-utils";

import PoolIncentivize from "@layouts/pool/pool-incentivize/PoolIncentivize";
import { EarnIncentivizeSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "IncentivizePool"])),
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

    return seoInfo.title([tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[]);
  }, [currentPool?.tokenA, currentPool?.tokenB, feeStr, getGnotPath, seoInfo]);

  return (
    <>
      <EarnIncentivizeSEOContainer customTitle={title} />
      <PoolIncentivize />
    </>
  );
}
