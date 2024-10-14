import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  swapDirectionToGuaranteedType,
  SwapSummaryInfo,
} from "@models/swap/swap-summary-info";
import { toNumberFormat } from "@utils/number-utils";

import { IconWrap, SwapButtonTooltipWrap } from "./SwapButtonTooltip.styles";

interface WalletBalanceDetailInfoProps {
  swapSummaryInfo: SwapSummaryInfo;
}

const SwapButtonTooltip: React.FC<WalletBalanceDetailInfoProps> = ({
  swapSummaryInfo,
}) => {
  const { t } = useTranslation();

  const priceImpactStr = useMemo(() => {
    const priceImpact = swapSummaryInfo.priceImpact;
    return `${priceImpact}%`;
  }, [swapSummaryInfo.priceImpact]);

  const guaranteedTypeStr = useMemo(() => {
    const swapDirection = swapSummaryInfo.swapDirection;
    return t(swapDirectionToGuaranteedType(swapDirection));
  }, [swapSummaryInfo.swapDirection, t]);

  const guaranteedStr = useMemo(() => {
    const { tokenA, tokenB, swapDirection } = swapSummaryInfo;
    const { amount, currency } = swapSummaryInfo.guaranteedAmount;
    const token = swapDirection === "EXACT_IN" ? tokenB : tokenA;
    return `${toNumberFormat(amount || 0, token.decimals)} ${currency}`;
  }, [swapSummaryInfo]);

  const gasFeeStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.gasFee;

    if (Number(swapSummaryInfo.gasFee) < 0.01) return "<$0.01";

    return `${toNumberFormat(amount)} ${currency}`;
  }, [swapSummaryInfo.gasFee]);

  const TooltipFloatingContent = useMemo(() => {
    return (
      <SwapButtonTooltipWrap>
        <div className="tooltip-list">
          <span>{t("Swap:swapInfo.priceImpact")}</span>
          <span>{priceImpactStr}</span>
        </div>
        <div className="tooltip-list">
          <span>{guaranteedTypeStr}</span>
          <span>{guaranteedStr}</span>
        </div>
        <div className="tooltip-list">
          <span>{t("Swap:swapInfo.gasFee")}</span>
          <span>{gasFeeStr}</span>
        </div>
      </SwapButtonTooltipWrap>
    );
  }, [gasFeeStr, guaranteedStr, guaranteedTypeStr, priceImpactStr, t]);

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconWrap>
        <IconInfo className="icon-info" />
      </IconWrap>
    </Tooltip>
  );
};
export default SwapButtonTooltip;
