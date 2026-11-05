import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import useUrlParam from "@hooks/common/use-url-param";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetPoolDetailByPath } from "@query/pools";
import { formatAddress } from "@utils/string-utils";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { isValidAddress } from "@utils/validation-utils";

import { EarnPoolSEOContainer } from "@containers/seo-header-container";
import PoolDetail from "@layouts/pool/pool-detail/PoolDetail";
import Custom404 from "@layouts/custom-404/Custom404";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { useGetPositionById } from "@query/positions/use-get-position-by-id";

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

  return positionId !== null ? <PositionPoolRedirect positionId={positionId} /> : <PoolPage key={router.asPath} />;
}

function PositionPoolRedirect({ positionId }: { positionId: string }) {
  const router = useRouter();
  const isValidId = /^\d+$/.test(positionId);
  const { data: position, isError } = useGetPositionById(positionId, { enabled: isValidId });

  React.useEffect(() => {
    if (!router.isReady || !position) return;

    const query = { ...router.query };
    delete query.positionId;
    void router.replace(
      {
        pathname: router.pathname,
        query: { ...query, poolPath: position.poolPath, addr: position.owner },
        hash: position.lpTokenId,
      },
      undefined,
      { shallow: true, scroll: false },
    );
  }, [router, position]);

  if (!isValidId || isError) {
    return <Custom404 />;
  }

  return <LoadingSpinner />;
}

function PoolPage() {
  const router = useCustomRouter();
  const { account } = useWallet();
  const poolPath = router.getPoolPath();
  const { getGnotPath } = useGnotToGnot();
  const { data } = useGetPoolDetailByPath(poolPath);

  const { initializedData } = useUrlParam<{ addr: string | undefined }>({
    addr: account?.address,
  });

  const address = React.useMemo(() => {
    const address = initializedData?.addr;
    if (!address || !isValidAddress(address)) {
      return undefined;
    }
    return address;
  }, [initializedData]);

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
