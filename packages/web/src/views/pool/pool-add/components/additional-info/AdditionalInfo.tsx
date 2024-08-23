import React from "react";

import { PAGE_PATH_TYPE } from "@constants/page.constant";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PositionModel } from "@models/position/position-model";

import ExchangeRateGraph from "./exchange-rate-graph/ExchangeRateGraph";
import QuickPoolInfo from "./quick-pool-info/QuickPoolInfo";

import { AdditionalInfoDummy, AdditionalInfoWrapper } from "./AdditonalInfo.styles";

interface AdditionalInfoProps {
  tokenPair: string[];
  stakedPositions: PositionModel[];
  unstakedPositions: PositionModel[];
  handleClickGotoStaking: (type: PAGE_PATH_TYPE) => void;
  pool: PoolDetailModel;
  biggestPool: PoolDetailModel;
  isLoadingPool: boolean;
  isLoadingGraph: boolean;
  isReversed: boolean;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  tokenPair,
  stakedPositions,
  unstakedPositions,
  handleClickGotoStaking,
  pool,
  biggestPool,
  isLoadingPool,
  isLoadingGraph,
  isReversed,
}) => {
  if (!tokenPair || tokenPair.length < 2 || !tokenPair[0] || !tokenPair[1])
    return <AdditionalInfoDummy />;

  const isAnyPoolExist = !!biggestPool.tokenA.path;

  return (
    <AdditionalInfoWrapper>
      <QuickPoolInfo
        tokenPair={tokenPair}
        stakedPositions={stakedPositions}
        unstakedPositions={unstakedPositions}
        handleClickGotoStaking={handleClickGotoStaking}
        pool={pool}
        isLoadingPool={isLoadingPool}
      />
      {isAnyPoolExist && (
        <ExchangeRateGraph
          poolData={biggestPool}
          isLoading={isLoadingGraph}
          isReversed={isReversed}
        />
      )}
    </AdditionalInfoWrapper>
  );
};

export default AdditionalInfo;