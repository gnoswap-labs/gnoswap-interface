import React from "react";
import { useTranslation } from "react-i18next";
import IconInfo from "../icons/IconInfo";
import Tooltip from "../tooltip/Tooltip";
import {
  SelectPriceRangeSummaryWrapper,
  ToolTipContentWrapper,
} from "./SelectPriceRangeSummary.styles";

export interface SelectPriceRangeSummaryProps {
  depositRatio: string;
  feeBoost: string;
  estimatedApr: string;
}

const SelectPriceRangeSummary: React.FC<SelectPriceRangeSummaryProps> = ({
  depositRatio,
  feeBoost,
  estimatedApr,
}) => {
  const { t } = useTranslation();

  return (
    <SelectPriceRangeSummaryWrapper>
      <div className="row">
        <div className="title-wrapper">
          <span className="title">
            {t("AddPosition:overralInfo.label.depositR")}
          </span>
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>
                {t("AddPosition:overralInfo.tooltip.depositR")}
              </ToolTipContentWrapper>
            }
          >
            <IconInfo />
          </Tooltip>
        </div>
        <span className="value">{depositRatio}</span>
      </div>

      <div className="row">
        <div className="title-wrapper">
          <span className="title">
            {t("AddPosition:overralInfo.label.capitalEffi")}
          </span>
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>
                {t("AddPosition:overralInfo.tooltip.capitalEffi")}
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
          <span className="title">
            {t("AddPosition:overralInfo.label.feeApr")}
          </span>
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>
                {t("AddPosition:overralInfo.tooltip.feeApr")}
              </ToolTipContentWrapper>
            }
          >
            <IconInfo />
          </Tooltip>
        </div>
        <span className="value">{estimatedApr}</span>
      </div>
    </SelectPriceRangeSummaryWrapper>
  );
};

export default SelectPriceRangeSummary;
