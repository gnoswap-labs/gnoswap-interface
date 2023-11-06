import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { poolInfoProps } from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import React from "react";
import { PoolInfoHeaderWrapper } from "./PoolPairInfoHeader.styles";

interface PoolPairInfoHeaderProps {
  info: poolInfoProps;
}

const PoolPairInfoHeader: React.FC<PoolPairInfoHeaderProps> = ({ info }) => {
  return (
    <PoolInfoHeaderWrapper>
      <div className="left-wrap">
        <DoubleLogo
          left={info.tokenPair.tokenA.logoURI}
          right={info.tokenPair.tokenB.logoURI}
        />
        <h3>
          {info.tokenPair.tokenA.symbol}/{info.tokenPair.tokenB.symbol}
        </h3>
      </div>
      <div className="badge-wrap">
        <div className="badge">{info.feeRate}%</div>
        <div className="badge">
          {info.incentivized}
          <DoubleLogo
            left={info.tokenPair.tokenA.logoURI}
            right={info.tokenPair.tokenB.logoURI}
          />
        </div>
      </div>
    </PoolInfoHeaderWrapper>
  );
};

export default PoolPairInfoHeader;
