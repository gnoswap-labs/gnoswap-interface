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
          left={info.tokenPair.token0.tokenLogo}
          right={info.tokenPair.token1.tokenLogo}
        />
        <h3>
          {info.tokenPair.token0.symbol}/{info.tokenPair.token1.symbol}
        </h3>
      </div>
      <div className="badge-wrap">
        <div className="badge">{info.feeRate}</div>
        <div className="badge">{info.incentivized}</div>
      </div>
    </PoolInfoHeaderWrapper>
  );
};

export default PoolPairInfoHeader;
