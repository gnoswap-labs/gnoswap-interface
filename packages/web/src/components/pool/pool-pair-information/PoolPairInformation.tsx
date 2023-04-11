import React from "react";
import PoolPairInfoContent from "@components/pool/pool-pair-info-content/PoolPairInfoContent";
import PoolPairInfoHeader from "@components/pool/pool-pair-info-header/PoolPairInfoHeader";
import { wrapper } from "./PoolPairInformation.styles";

interface PoolPairInformationProps {
  info: any;
}

const PoolPairInformation: React.FC<PoolPairInformationProps> = ({ info }) => {
  return (
    <div css={wrapper}>
      <PoolPairInfoHeader info={info.poolInfo} />
      <PoolPairInfoContent content={info} />
    </div>
  );
};

export default PoolPairInformation;
