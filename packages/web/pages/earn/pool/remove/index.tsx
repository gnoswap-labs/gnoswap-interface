import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useGetPoolDetailByPath } from "src/react-query/pools";

import PoolRemove from "@layouts/pool/pool-remove/PoolRemove";
import { EarnPoolRemoveSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "RemovePosition"])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const poolPath = router.getPoolPath();
  const { data } = useGetPoolDetailByPath(poolPath as string);

  const { getGnotPath } = useGnotToGnot();

  const feeStr = useMemo(() => {
    const feeTier = data?.fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [data?.fee]);

  const seoInfo = useMemo(() => SEOInfo["/earn/pool/remove"], []);

  const title = useMemo(() => {
    const tokenA = getGnotPath(data?.tokenA);
    const tokenB = getGnotPath(data?.tokenB);

    return seoInfo.title([tokenA?.symbol, tokenB?.symbol, feeStr].filter(item => item) as string[]);
  }, [data?.tokenA, data?.tokenB, feeStr, getGnotPath, seoInfo]);

  return (
    <>
      <EarnPoolRemoveSEOContainer customTitle={title} />
      <PoolRemove />
    </>
  );
}
