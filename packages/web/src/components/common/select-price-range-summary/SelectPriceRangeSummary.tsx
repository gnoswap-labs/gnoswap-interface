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
            {t("business:positionPriceRangeInfo.depositR.label")}
          </span>
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>
                {t("business:positionPriceRangeInfo.depositR.desc")}
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
            {t("business:positionPriceRangeInfo.capEff.label")}
          </span>
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>
                {t("business:positionPriceRangeInfo.capEff.desc")}
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
            {t("business:positionPriceRangeInfo.feeApr.label")}
          </span>
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>
                {t("business:positionPriceRangeInfo.feeApr.tooltip")}
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
