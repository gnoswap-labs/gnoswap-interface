import React, { useMemo } from "react";
import IconInfo from "@components/common/icons/IconInfo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { EarnAddConfirmPriceRangeInfoSection, EarnAddConfirmPriceRangeInfoWrapper, ToolTipContentWrapper } from "./EarnAddConfirmPriceRangeInfo.styles";
import { numberToFormat } from "@utils/string-utils";

export interface EarnAddConfirmPriceRangeInfoProps {
  currentPrice: string;
  inRange: boolean;
  minPrice: string;
  maxPrice: string;
  priceLabel: string;
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
  priceLabel,
  feeBoost,
  estimatedAPR,
  isShowStaking,
}) => {
    const currentPriceStr = useMemo(() => {
      return `${numberToFormat(currentPrice, 4)} ${priceLabel}`;
    }, [currentPrice, priceLabel]);

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
            <span className="label">{priceLabel}</span>
          </EarnAddConfirmPriceRangeInfoSection>
          <EarnAddConfirmPriceRangeInfoSection className="range-section">
            <span>Max Price</span>
            <span className="amount">{maxPrice}</span>
            <span className="label">{priceLabel}</span>
          </EarnAddConfirmPriceRangeInfoSection>
        </div>

        <EarnAddConfirmPriceRangeInfoSection>
          <div className="row">
            <span className="key">Current Price:</span>
            <span className="value">{currentPriceStr}</span>
          </div>
          <div className="row">
            <div className="title-wrapper">
              <span className="key">Fee Boost</span>
              <Tooltip placement="top" FloatingContent={<ToolTipContentWrapper>An indication of the additional swap fees you can receive for your selected price range compared to a full-range position.</ToolTipContentWrapper>}>
                <IconInfo />
              </Tooltip>
            </div>

            <span className="value">{feeBoost}</span>
          </div>
          <div className="row">
            <div className="title-wrapper">
              <span className="key">Fee APR</span>
              <Tooltip placement="top" FloatingContent={<ToolTipContentWrapper>The estimated APR from swap fees is calculated based on the selected price range of the position.</ToolTipContentWrapper>}>
                <IconInfo />
              </Tooltip>
            </div>
            <span className="value">{estimatedAPR}</span>
          </div>
          {isShowStaking && <div className="row">
            <div className="title-wrapper">
              <span className="key">Staking APR</span>
              <Tooltip placement="top" FloatingContent={<ToolTipContentWrapper>The estimated APR range is calculated by applying a dynamic multiplier to your staked position, based on the staking duration.</ToolTipContentWrapper>}>
                <IconInfo />
              </Tooltip>
            </div>
            <span className="value">74.24% ~ 124.22%</span>
          </div>}
        </EarnAddConfirmPriceRangeInfoSection>
      </EarnAddConfirmPriceRangeInfoWrapper>
    );
  };

export default EarnAddConfirmPriceRangeInfo;
