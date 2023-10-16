import React from "react";
import IconInfo from "../icons/IconInfo";
import Tooltip from "../tooltip/Tooltip";
import { SelectPriceRangeSummaryWrapper } from "./SelectPriceRangeSummary.styles";

export interface SelectPriceRangeSummaryProps {
  depositRatio: string;
  feeBoost: string;
  estimatedApr: string;
}

const ModalContent = <>
  An indication of how much more swap<br />fees you can get for your selected price<br />range compared to a full-range position.
</>;

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
          <Tooltip placement="top" FloatingContent={<div>{ModalContent}</div>}>
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