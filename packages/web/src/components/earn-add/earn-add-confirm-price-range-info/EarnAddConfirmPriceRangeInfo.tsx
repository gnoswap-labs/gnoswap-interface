import IconSwap from "@components/common/icons/IconSwap";
import React from "react";
import {
  EarnAddConfirmPriceRangeInfoSection,
  EarnAddConfirmPriceRangeInfoWrapper,
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
}) => {
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
          <span className="key">Current Price:</span>
          <div className="value">
            {Number(currentPrice).toFixed(2)} {symbolTokenA} per {symbolTokenB}{" "}
            <IconSwap />
          </div>
        </div>
        <div className="row">
          <span className="key">Fee Boost:</span>
          <span className="value">{feeBoost}</span>
        </div>
        <div className="row">
          <span className="key">Estimated APR:</span>
          <span className="value">{estimatedAPR}</span>
        </div>
      </EarnAddConfirmPriceRangeInfoSection>
    </EarnAddConfirmPriceRangeInfoWrapper>
  );
};

export default EarnAddConfirmPriceRangeInfo;
