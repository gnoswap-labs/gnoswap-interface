import React from "react";
import PoolPairInfoContent from "@components/pool/pool-pair-info-content/PoolPairInfoContent";
import PoolPairInfoHeader from "@components/pool/pool-pair-info-header/PoolPairInfoHeader";
import {
  PoolPairInformationWrapper,
  BreadcrumbsWrapper,
} from "./PoolPairInformation.styles";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import {
  pathProps,
  poolPairProps,
} from "@containers/pool-pair-information-container/PoolPairInformationContainer";

interface PoolPairInformationProps {
  info: poolPairProps;
  menu: pathProps;
  onClickPath: (path: string) => void;
}

const PoolPairInformation: React.FC<PoolPairInformationProps> = ({
  info,
  menu,
  onClickPath,
}) => {
  return (
    <PoolPairInformationWrapper>
      <BreadcrumbsWrapper>
        <div className="page-name">Earn</div>
        <div className="location">
          <span onClick={() => onClickPath(menu.path)}>{menu.title}</span>
          <IconStrokeArrowRight className="step-icon" />
          <span className="token">
            {info.poolInfo.tokenPair.tokenA.symbol}/
            {info.poolInfo.tokenPair.tokenB.symbol} ({info.poolInfo.feeRate})%
          </span>
        </div>
      </BreadcrumbsWrapper>
      <div className="token-status">
        <PoolPairInfoHeader info={info.poolInfo} />
        <PoolPairInfoContent content={info} />
      </div>
    </PoolPairInformationWrapper>
  );
};

export default PoolPairInformation;
