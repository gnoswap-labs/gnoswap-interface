import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import useUrlParam from "@hooks/common/use-url-param";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetPoolDetailByPath } from "@query/pools";
import { formatAddress } from "@utils/string-utils";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { isValidAddress } from "@utils/validation-utils";
import PoolDetail from "@views/pool/pool-detail/PoolDetail";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...DEFAULT_I18N_NS,
        "Earn",
        "Pool",
      ])),
    },
  };
}

export default function Page() {
  const router = useCustomRouter();
  const { account } = useWallet();
  const poolPath = router.getPoolPath();
  const { getGnotPath } = useGnotToGnot();
  const { data } = useGetPoolDetailByPath(poolPath);

  const { initializedData } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });

  const address = useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !isValidAddress(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

  const feeStr = useMemo(() => {
    if (!data?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(data.fee)]?.rateStr;
  }, [data?.fee]);

  const seoInfo = useMemo(
    () => SEOInfo[address ? "/earn/pool?address" : "/earn/pool"],
    [address],
  );

  const title = useMemo(() => {
    const tokenA = getGnotPath(data?.tokenA);
    const tokenB = getGnotPath(data?.tokenB);

    return seoInfo.title(
      [
        address ? formatAddress(address) : undefined,
        tokenA?.symbol,
        tokenB?.symbol,
        feeStr,
      ].filter(item => item) as string[],
    );
  }, [getGnotPath, data?.tokenA, data?.tokenB, seoInfo, address, feeStr]);

  return (
    <>
      <SEOHeader
        title={title}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <PoolDetail />
    </>
  );
}
