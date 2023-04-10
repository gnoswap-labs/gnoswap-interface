import React from "react";
import PoolPairInfoContent from "@components/pool/pool-pair-info-content/PoolPairInfoContent";
import PoolPairInfoHeader from "@components/pool/pool-pair-info-header/PoolPairInfoHeader";
import PoolPairInformation from "@components/pool/pool-pair-information/PoolPairInformation";

export const poolPairInit = {};

export const headerInit = {};

const PoolPairInformationContainer = () => {
  return (
    <PoolPairInformation
      header={<PoolPairInfoHeader info={headerInit} />}
      content={<PoolPairInfoContent content={poolPairInit} />}
    />
  );
};

export default PoolPairInformationContainer;
