import React, { useMemo } from "react";
import useCustomRouter from "@hooks/common/use-custom-router";
import PoolPairInformation from "@components/pool/pool-pair-information/PoolPairInformation";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetBinsByPath, useGetPoolDetailByPath } from "@query/pools";
import { initialPool, PoolDetailModel } from "@models/pool/pool-detail-model";
import { usePositionData } from "@hooks/common/use-position-data";

interface PoolPairInformationContainerProps {
  address?: string | undefined;
}

const PoolPairInformationContainer: React.FC<
  PoolPairInformationContainerProps
> = ({ address }) => {
  const router = useCustomRouter();
  const { getGnotPath } = useGnotToGnot();
  const poolPath = router.getPoolPath();
  const { data = initialPool as PoolDetailModel, isLoading: loading } =
    useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });
  const { loading: loadingPosition } = usePositionData({
    address,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });
  const { data: bins = [], isLoading: isLoadingBins } = useGetBinsByPath(
    poolPath as string,
    40,
    {
      enabled: !!poolPath,
    },
  );

  const onClickPath = (path: string) => {
    router.push(path);
  };

  const pool = useMemo(() => {
    return {
      ...data,
      tokenA: {
        ...data.tokenA,
        path: getGnotPath(data.tokenA).path,
        name: getGnotPath(data.tokenA).name,
        symbol: getGnotPath(data.tokenA).symbol,
        logoURI: getGnotPath(data.tokenA).logoURI,
      },
      tokenB: {
        ...data.tokenB,
        path: getGnotPath(data.tokenB).path,
        name: getGnotPath(data.tokenB).name,
        symbol: getGnotPath(data.tokenB).symbol,
        logoURI: getGnotPath(data.tokenB).logoURI,
      },
    };
  }, [data, bins]);

  const feeStr = useMemo(() => {
    if (!pool?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(pool.fee)].rateStr;
  }, [pool?.fee]);

  return (
    <PoolPairInformation
      pool={pool}
      menu={{
        title: "business:pageHeader.earn",
        path: "/earn",
      }}
      onClickPath={onClickPath}
      feeStr={feeStr}
      loading={loading || loadingPosition}
      loadingBins={loading || loadingPosition || isLoadingBins}
      poolBins={bins}
    />
  );
};

export default PoolPairInformationContainer;
