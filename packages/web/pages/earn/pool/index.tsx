import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { PoolDetailPositionContext, usePoolDetailRoute } from "@hooks/pool/ui/use-pool-detail-route";
import { useGetPoolDetailByPath } from "@query/pools";
import { formatAddress } from "@utils/string-utils";
import { makeSwapFeeTier } from "@utils/swap-utils";

import { EarnPoolSEOContainer } from "@containers/seo-header-container";
import PoolDetail from "@layouts/pool/pool-detail/PoolDetail";
import Custom404 from "@layouts/custom-404/Custom404";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { useGetPositionById } from "@query/positions/use-get-position-by-id";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn", "Pool"])),
    },
  };
}

export default function Page() {
  const router = useCustomRouter();
  const positionId = router.getPositionId();

  return positionId !== null ? (
    <PositionPoolPage key={positionId} positionId={positionId} />
  ) : (
    <PoolPage key={router.asPath} />
  );
}

function PositionPoolPage({ positionId }: { positionId: string }) {
  const isValidId = /^\d+$/.test(positionId);
  const { data: position, isError } = useGetPositionById(positionId, { enabled: isValidId });

  if (!isValidId || isError) {
    return <Custom404 />;
  }

  if (!position) {
    return <LoadingSpinner />;
  }

  return (
    <PoolDetailPositionContext.Provider value={position}>
      <PoolPage />
    </PoolDetailPositionContext.Provider>
  );
}

function PoolPage() {
  const { poolPath, address } = usePoolDetailRoute();
  const { getGnotPath } = useGnotToGnot();
  const { data } = useGetPoolDetailByPath(poolPath);

  const feeStr = React.useMemo(() => {
    if (!data?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(data.fee)]?.rateStr;
  }, [data?.fee]);

  const seoInfo = React.useMemo(() => SEOInfo[address ? "/earn/pool?address" : "/earn/pool"], [address]);

  const title = React.useMemo(() => {
    const tokenA = getGnotPath(data?.tokenA);
    const tokenB = getGnotPath(data?.tokenB);

    return seoInfo.title(
      [address ? formatAddress(address) : undefined, tokenA?.symbol, tokenB?.symbol, feeStr].filter(
        item => item,
      ) as string[],
    );
  }, [getGnotPath, data?.tokenA, data?.tokenB, seoInfo, address, feeStr]);

  return (
    <>
      <EarnPoolSEOContainer customTitle={title} address={address} />
      <PoolDetail />
    </>
  );
}
