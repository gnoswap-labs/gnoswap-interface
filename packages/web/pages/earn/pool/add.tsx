import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import PoolAdd from "@views/pool/pool-add/PoolAdd";
import { checkGnotPath } from "@utils/common";
import { makeSwapFeeTier } from "@utils/swap-utils";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...DEFAULT_I18N_NS,
        "AddPosition",
      ])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const poolPath = router.getPoolPath() || "::";;
  const [tokenAPath, tokenBPath, fee] = poolPath.split(":");
  const { getGnotPath } = useGnotToGnot();
  const { tokens } = useTokenData();

  const feeStr = useMemo(() => {
    const feeTier = fee;

    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [fee]);

  const seoInfo = useMemo(() => SEOInfo["/earn/pool/add"], []);

  const title = useMemo(() => {
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
  }, [tokenAPath, tokenBPath, feeStr, getGnotPath, seoInfo, tokens]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <PoolAdd useDedicatedPool />
    </>
  );
}
