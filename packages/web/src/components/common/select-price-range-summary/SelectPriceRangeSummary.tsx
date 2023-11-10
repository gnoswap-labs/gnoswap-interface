import React from "react";
import IconInfo from "../icons/IconInfo";
import Tooltip from "../tooltip/Tooltip";
import { SelectPriceRangeSummaryWrapper, ToolTipContentWrapper } from "./SelectPriceRangeSummary.styles";

export interface SelectPriceRangeSummaryProps {
  depositRatio: string;
  feeBoost: string;
  estimatedApr: string;
}

const ModalContent = <ToolTipContentWrapper>
  An indication of how much more swap fees you can get for your selected price range compared to a full-range position.
</ToolTipContentWrapper>;

const SelectPriceRangeSummary: React.FC<SelectPriceRangeSummaryProps> = ({
  depositRatio,
  feeBoost,
  estimatedApr,
}) => {
  return (
    <SelectPriceRangeSummaryWrapper>
      <div className="row">
        <span className="title">Deposit Ratio</span>
        <span className="value">{depositRatio}</span>
      </div>

      <div className="row">
        <div className="title-wrapper">
          <span className="title">Fee Boost</span>
          <Tooltip placement="top" FloatingContent={ModalContent}>
            <IconInfo />
          </Tooltip>
        </div>
        <span className="value">{feeBoost}</span>
      </div>

      <div className="row">
        <span className="title">Estimated APR</span>
        <span className="value">{estimatedApr}</span>
      </div>
    </SelectPriceRangeSummaryWrapper>
  );
};

export default SelectPriceRangeSummary;