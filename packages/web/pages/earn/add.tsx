import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { checkGnotPath } from "@utils/common";
import { makeSwapFeeTier } from "@utils/swap-utils";
import PoolAdd from "@views/pool/pool-add/PoolAdd";

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

export default function Page() {
  const router = useRouter();
  const query = router.query;

  const { tokens } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const feeTier =
    (router.query.fee_tier as string) || window.history.state?.fee_tier;

  const feeStr = useMemo(() => {
    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [feeTier]);

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
      <PoolAdd useDedicatedPool={false} />
    </>
  );
}
