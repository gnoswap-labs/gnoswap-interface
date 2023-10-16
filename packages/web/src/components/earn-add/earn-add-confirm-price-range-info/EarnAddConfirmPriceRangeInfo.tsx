import React from "react";
import { EarnAddConfirmPriceRangeInfoSection, EarnAddConfirmPriceRangeInfoWrapper } from "./EarnAddConfirmPriceRangeInfo.styles";

export interface EarnAddConfirmPriceRangeInfoProps {
  currentPrice: string;
  minPrice: string;
  minPriceLable: string;
  maxPrice: string;
  maxPriceLable: string;
  feeBoost: string;
  estimatedAPR: string;
}

const EarnAddConfirmPriceRangeInfo: React.FC<EarnAddConfirmPriceRangeInfoProps> = ({
  currentPrice,
  minPrice,
  minPriceLable,
  maxPrice,
  maxPriceLable,
  feeBoost,
  estimatedAPR,
}) => {
  return (
    <EarnAddConfirmPriceRangeInfoWrapper>
      <p>Price Range</p>

      <div className="price-range-wrapper">
        <EarnAddConfirmPriceRangeInfoSection className="range-section">
          <span>Min Price</span>
          <span className="amount">{minPrice}</span>
          <span className="label">{minPriceLable}</span>
        </EarnAddConfirmPriceRangeInfoSection>
        <EarnAddConfirmPriceRangeInfoSection className="range-section">
          <span>Max Price</span>
          <span className="amount">{maxPrice}</span>
          <span className="label">{maxPriceLable}</span>
        </EarnAddConfirmPriceRangeInfoSection>
      </div>

      <EarnAddConfirmPriceRangeInfoSection>
        <div className="row">
          <span className="key">Current Price:</span>
          <span className="value">{currentPrice}</span>
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