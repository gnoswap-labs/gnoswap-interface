import React, { useMemo } from "react";
import PoolPairInfoContent from "@components/pool/pool-pair-info-content/PoolPairInfoContent";
import PoolPairInfoHeader from "@components/pool/pool-pair-info-header/PoolPairInfoHeader";
import {
  PoolPairInformationWrapper,
  BreadcrumbsWrapper,
} from "./PoolPairInformation.styles";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import {
  pathProps,
} from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import { PoolDetailModel } from "@models/pool/pool-detail-model";

interface PoolPairInformationProps {
  pool: PoolDetailModel;
  menu: pathProps;
  feeStr: string | null;
  onClickPath: (path: string) => void;
}

const PoolPairInformation: React.FC<PoolPairInformationProps> = ({
  pool,
  menu,
  feeStr,
  onClickPath,
}) => {
  const tokenInfo = useMemo(() => {
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol} (${feeStr || "0"})`;
  }, [feeStr, pool.tokenA.symbol, pool.tokenB.symbol]);

  return (
    <PoolPairInformationWrapper>
      <BreadcrumbsWrapper>
        <div className="page-name">Earn</div>
        <div className="location">
          <span onClick={() => onClickPath(menu.path)}>{menu.title}</span>
          <IconStrokeArrowRight className="step-icon" />
          <span className="token">
            {tokenInfo}
          </span>
        </div>
      </BreadcrumbsWrapper>
      <div className="token-status">
        <PoolPairInfoHeader
          tokenA={pool.tokenA}
          tokenB={pool.tokenB}
          incentivizedType={pool.incentivizedType}
          rewardTokens={pool.rewardTokens}
          feeStr={feeStr || ""}
        />
        <PoolPairInfoContent pool={pool} />
      </div>
    </PoolPairInformationWrapper>
  );
};

export default PoolPairInformation;
