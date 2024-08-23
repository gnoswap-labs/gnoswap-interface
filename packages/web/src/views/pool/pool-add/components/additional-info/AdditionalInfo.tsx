import React from "react";

import { PAGE_PATH_TYPE } from "@constants/page.constant";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PositionModel } from "@models/position/position-model";

import ExchangeRateGraph from "./exchange-rate-graph/ExchangeRateGraph";
import QuickPoolInfo from "./quick-pool-info/QuickPoolInfo";

import { AdditionalInfoDummy, AdditionalInfoWrapper } from "./AdditonalInfo.styles";

interface AdditionalInfoProps {
  stakedPositions: PositionModel[];
  unstakedPositions: PositionModel[];
  handleClickGotoStaking: (type: PAGE_PATH_TYPE) => void;
  pool: PoolDetailModel;
  isLoadingPool: boolean;
  isReversed: boolean;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  stakedPositions,
  unstakedPositions,
  handleClickGotoStaking,
  pool,
  isLoadingPool,
  isReversed,
}) => {

  if (!pool.tokenA?.path || !pool.tokenB?.path) return <AdditionalInfoDummy />;


  return (
    <AdditionalInfoWrapper>
      <QuickPoolInfo
        stakedPositions={stakedPositions}
        unstakedPositions={unstakedPositions}
        handleClickGotoStaking={handleClickGotoStaking}
        pool={pool}
        isLoadingPool={isLoadingPool}
      />
      <ExchangeRateGraph
        poolData={pool}
        isLoading={isLoadingPool}
        isReversed={isReversed}
      />
    </AdditionalInfoWrapper>
  );
};

export default AdditionalInfo;