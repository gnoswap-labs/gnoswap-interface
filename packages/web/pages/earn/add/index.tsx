import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import useRouter from "@hooks/common/use-custom-router";
import { DEFAULT_I18N_NS } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { checkGnotPath } from "@utils/common";
import { makeSwapFeeTier } from "@utils/swap-utils";

import PoolAdd from "@layouts/pool/pool-add/PoolAdd";
import { EarnAddSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Swap", "AddPosition"])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const query = router.query;

  const { tokens } = useTokenData();
  const { getGnotPath } = useGnotToGnot();

  const feeTier = query.fee_tier as string;

  const feeStr = useMemo(() => {
    if (!feeTier) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(feeTier)]?.rateStr;
  }, [feeTier]);

  const titleParams = useMemo(() => {
    const tokenAPath = query.tokenA as string | undefined;
    const tokenBPath = query.tokenB as string | undefined;

    const tokenA = getGnotPath(tokenAPath ? tokens.find(item => item.path === checkGnotPath(tokenAPath)) : undefined);
    const tokenB = getGnotPath(tokenBPath ? tokens.find(item => item.path === checkGnotPath(tokenBPath)) : undefined);

    if (tokenA?.symbol && tokenB?.symbol && feeStr) {
      return [tokenA.symbol, tokenB.symbol, feeStr];
    }
  }, [feeStr, query.tokenA, query.tokenB, tokens, getGnotPath]);

  return (
    <>
      <EarnAddSEOContainer titleParams={titleParams} />
      <PoolAdd useDedicatedPool={false} />
    </>
  );
}
