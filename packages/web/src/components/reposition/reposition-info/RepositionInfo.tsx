import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useWindowSize } from "@hooks/common/use-window-size";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { formatRate } from "@utils/new-number-utils";
import React from "react";
import {
  RepositionInfoWrapper,
  ToolTipContentWrapper,
} from "./RepositionInfo.styles";

export interface RepositionInfoProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  aprFee: number;
  priceRangeSummary: IPriceRange;
}

const RepositionInfo: React.FC<RepositionInfoProps> = ({
  tokenA,
  tokenB,
  aprFee,
  priceRangeSummary,
}) => {
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;
  return (
    <RepositionInfoWrapper>
      <div className="deposit-ratio common-bg">
        <div>
          <div>
            <p className="label">Deposit Ratio</p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The deposit ratio of the two tokens is determined based on the
                  current price and the set price range.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">
            {priceRangeSummary.tokenARatioStr}
            {"% "}
            {isMobile ? (
              <MissingLogo
                symbol={tokenA?.symbol}
                url={tokenA?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `${tokenA?.symbol}`
            )}{" "}
            / {priceRangeSummary.tokenBRatioStr}
            {"% "}
            {isMobile ? (
              <MissingLogo
                symbol={tokenB?.symbol}
                url={tokenB?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `${tokenB?.symbol}`
            )}
          </p>
        </div>
        <div>
          <div>
            <p className="label">Capital Efficiency</p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The multiplier calculated based on the concentration of your
                  range. This indicates how much more rewards you can earn
                  compared to a full range position with the same capital.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">{priceRangeSummary.feeBoost}</p>
        </div>
        <div>
          <div>
            <p className="label">Fee APR</p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The estimated APR from swap fees is calculated based on the
                  selected price range of the position.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">{formatRate(aprFee)}</p>
        </div>
      </div>
    </RepositionInfoWrapper>
  );
};

export default RepositionInfo;
