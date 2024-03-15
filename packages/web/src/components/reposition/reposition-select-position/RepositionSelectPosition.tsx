import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import { RepositionSelectPositionWrapper } from "./RepositionSelectPosition.styles";

export interface RepositionSelectPositionProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  fee: string;
  maxPriceStr: string;
  minPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
}

const RepositionSelectPosition: React.FC<RepositionSelectPositionProps> = ({
  tokenA,
  tokenB,
  fee,
}) => {
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;
  return (
    <RepositionSelectPositionWrapper>
      <h5>1. Select Position</h5>
      <div className="select-position common-bg">
        <div className="pool-select-wrapper">
          <DoubleLogo
            left={tokenA?.logoURI}
            right={tokenB?.logoURI}
            size={24}
            leftSymbol={tokenB?.symbol}
            rightSymbol={tokenB?.symbol}
          />
          {isMobile ? "" : `${tokenA?.symbol}/${tokenB?.symbol}`}
          <Badge text={fee} type={BADGE_TYPE.DARK_DEFAULT} />
        </div>
        <p>$145,541.02</p>
      </div>
    </RepositionSelectPositionWrapper>
  );
};

export default RepositionSelectPosition;
