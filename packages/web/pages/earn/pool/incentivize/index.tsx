import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useGetPoolDetailByPath } from "src/react-query/pools";

import { EarnPoolIncentivizeSEOContainer } from "@containers/seo-header-container";
import PoolIncentivize from "@layouts/pool/pool-incentivize/PoolIncentivize";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "IncentivizePool"])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const poolPath = router.getPoolPath();
  const { getGnotPath } = useGnotToGnot();

  const { data } = useGetPoolDetailByPath(poolPath as string);

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

    return seoInfo.title([tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[]);
  }, [data?.tokenA, data?.tokenB, feeStr, getGnotPath, seoInfo]);

  return (
    <>
      <EarnPoolIncentivizeSEOContainer customTitle={title} />
      <PoolIncentivize />
    </>
  );
}
