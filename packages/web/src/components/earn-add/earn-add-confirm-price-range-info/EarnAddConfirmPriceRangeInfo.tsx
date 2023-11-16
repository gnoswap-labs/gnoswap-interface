import IconInfo from "@components/common/icons/IconInfo";
import IconSwap from "@components/common/icons/IconSwap";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useState, useCallback} from "react";
import {
  EarnAddConfirmPriceRangeInfoSection,
  EarnAddConfirmPriceRangeInfoWrapper,
  ToolTipContentWrapper,
} from "./EarnAddConfirmPriceRangeInfo.styles";

export interface EarnAddConfirmPriceRangeInfoProps {
  currentPrice: string;
  minPrice: string;
  minPriceLable: string;
  maxPrice: string;
  maxPriceLable: string;
  feeBoost: string;
  estimatedAPR: string;
  symbolTokenA: string;
  symbolTokenB: string;
  isShowStaking?: boolean;
}

const EarnAddConfirmPriceRangeInfo: React.FC<
  EarnAddConfirmPriceRangeInfoProps
> = ({
  currentPrice,
  minPrice,
  maxPrice,
  feeBoost,
  estimatedAPR,
  symbolTokenA,
  symbolTokenB,
  isShowStaking,
}) => {
  const [swap, setSwap] = useState(false);

  const onClickSwap = useCallback(() => {
    setSwap(prev => !prev);
  }, []);
  return (
    <EarnAddConfirmPriceRangeInfoWrapper>
      <p>Price Range</p>

      <div className="price-range-wrapper">
        <EarnAddConfirmPriceRangeInfoSection className="range-section">
          <span>Min Price</span>
          <span className="amount">{minPrice}</span>
          <span className="label">
            {symbolTokenA} per {symbolTokenB}
          </span>
        </EarnAddConfirmPriceRangeInfoSection>
        <EarnAddConfirmPriceRangeInfoSection className="range-section">
          <span>Max Price</span>
          <span className="amount">{maxPrice}</span>
          <span className="label">
            {symbolTokenA} per {symbolTokenB}
          </span>
        </EarnAddConfirmPriceRangeInfoSection>
      </div>

      <EarnAddConfirmPriceRangeInfoSection>
        <div className="row">
          <span className="key">Current Price</span>
          <div className="value">
            {Number(swap ? 1 / Number(currentPrice) : currentPrice).toFixed(2)} {swap ? symbolTokenB : symbolTokenA} per {swap ? symbolTokenA : symbolTokenB}{" "}
            <div className="icon-swap" onClick={onClickSwap}>
              <IconSwap />
            </div>
          </div>
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
