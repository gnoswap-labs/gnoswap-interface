import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { numberToRate } from "@utils/string-utils";
import React from "react";
import {
  IncreaseSelectPositionWrapper,
  ToolTipContentWrapper,
} from "./IncreaseSelectPosition.styles";

export interface IncreaseSelectPositionProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  fee: string;
  maxPriceStr: string;
  minPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
}

const IncreaseSelectPosition: React.FC<IncreaseSelectPositionProps> = ({
  tokenA,
  tokenB,
  fee,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  aprFee,
  priceRangeSummary,
}) => {
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;
  return (
    <IncreaseSelectPositionWrapper>
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
        <RangeBadge status={rangeStatus} />
      </div>
      <div className="min-max-wrapper">
        <div className="min common-bg">
          <p>Min Price</p>
          <p className="value">{minPriceStr}</p>
          <p className="convert-value">
            {isMobile ? (
              <MissingLogo
                symbol={tokenA?.symbol}
                url={tokenA?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `1 ${tokenA?.symbol}`
            )}{" "}
            = {minPriceStr} {tokenB?.symbol}
          </p>
        </div>
        <div className="min common-bg">
          <p>Max Price</p>
          <p className="value">{maxPriceStr}</p>
          <p className="convert-value">
            {isMobile ? (
              <MissingLogo
                symbol={tokenA?.symbol}
                url={tokenA?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `1 ${tokenA?.symbol}`
            )}{" "}
            = {maxPriceStr} {tokenB?.symbol}
          </p>
        </div>
      </div>
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
                  The deposit ratio of the two tokens is determined based on the
                  current price and the set price range.
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
                  The deposit ratio of the two tokens is determined based on the
                  current price and the set price range.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">{numberToRate(aprFee)}</p>
        </div>
      </div>
    </IncreaseSelectPositionWrapper>
  );
};

export default IncreaseSelectPosition;
