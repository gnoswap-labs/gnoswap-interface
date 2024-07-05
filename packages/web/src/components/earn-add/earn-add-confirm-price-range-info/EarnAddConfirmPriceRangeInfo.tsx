import React, { useMemo, useState } from "react";
import IconInfo from "@components/common/icons/IconInfo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import {
  EarnAddConfirmPriceRangeInfoSection,
  EarnAddConfirmPriceRangeInfoWrapper,
  ToolTipContentWrapper,
} from "./EarnAddConfirmPriceRangeInfo.styles";
import { numberToRate } from "@utils/string-utils";
import { EarnAddConfirmAmountInfoProps } from "../earn-add-confirm-amount-info/EarnAddConfirmAmountInfo";
import IconSwap from "@components/common/icons/IconSwap";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

export interface EarnAddConfirmPriceRangeInfoProps
  extends EarnAddConfirmAmountInfoProps {
  currentPrice: string;
  inRange: boolean;
  minPrice: string;
  maxPrice: string;
  priceLabelMax: string;
  priceLabelMin: string;
  feeBoost: string;
  estimatedAPR: string;
  isShowStaking?: boolean;
}

const EarnAddConfirmPriceRangeInfo: React.FC<
  EarnAddConfirmPriceRangeInfoProps
> = ({
  currentPrice,
  inRange,
  minPrice,
  maxPrice,
  priceLabelMax,
  priceLabelMin,
  feeBoost,
  estimatedAPR,
  isShowStaking,
  tokenA,
  tokenB,
}) => {
  const [swap, setSwap] = useState(false);

  const currentPriceStr = useMemo(() => {
    if (!swap) {
      return `1 ${tokenA.info.symbol} = ${formatTokenExchangeRate(
        currentPrice,
        {
          maxSignificantDigits: 6,
          minLimit: 0.000001,
        },
      )} ${tokenB.info.symbol}`;
    }
    return `1 ${tokenB.info.symbol} = ${formatTokenExchangeRate(
      1 / Number(currentPrice),
      {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      },
    )} ${tokenA.info.symbol}`;
  }, [currentPrice, tokenA.info.symbol, tokenB.info.symbol, swap]);

  const rangeStatus = useMemo(() => {
    return inRange ? RANGE_STATUS_OPTION.IN : RANGE_STATUS_OPTION.OUT;
  }, [inRange]);
  return (
    <EarnAddConfirmPriceRangeInfoWrapper>
      <div className="range-title">
        <p>Price Range</p>
        <RangeBadge status={rangeStatus} />
      </div>

      <div className="price-range-wrapper">
        <EarnAddConfirmPriceRangeInfoSection className="range-section">
          <span>Min Price</span>
          <span className="amount">{minPrice}</span>
          <span className="label">{priceLabelMin}</span>
        </EarnAddConfirmPriceRangeInfoSection>
        <EarnAddConfirmPriceRangeInfoSection className="range-section">
          <span>Max Price</span>
          <span className="amount">{maxPrice}</span>
          <span className="label">{priceLabelMax}</span>
        </EarnAddConfirmPriceRangeInfoSection>
      </div>

      <EarnAddConfirmPriceRangeInfoSection>
        <div className="row">
          <span className="key">Current Price:</span>
          <div className="swap-value">
            <span className="value">{currentPriceStr}</span>
            <div onClick={() => setSwap(!swap)}>
              <IconSwap />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="title-wrapper">
            <span className="key">Capital Efficiency</span>
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

          <span className="value">{feeBoost}</span>
        </div>
        <div className="row">
          <div className="title-wrapper">
            <span className="key">Fee APR</span>
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
          <span className="value">{numberToRate(estimatedAPR)}</span>
        </div>
        {isShowStaking && (
          <div className="row">
            <div className="title-wrapper">
              <span className="key">Staking APR</span>
              <Tooltip
                placement="top"
                FloatingContent={
                  <ToolTipContentWrapper>
                    The estimated APR range is calculated by applying a dynamic
                    multiplier to your staked position, based on the staking
                    duration.
                  </ToolTipContentWrapper>
                }
              >
                <IconInfo />
              </Tooltip>
            </div>
            <span className="value">74.24% ~ 124.22%</span>
          </div>
        )}
      </EarnAddConfirmPriceRangeInfoSection>
    </EarnAddConfirmPriceRangeInfoWrapper>
  );
};

export default EarnAddConfirmPriceRangeInfo;
