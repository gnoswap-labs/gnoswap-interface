import React, { useMemo } from "react";
import { IconWrap, SwapButtonTooltipWrap } from "./SwapButtonTooltip.styles";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import { SwapSummaryInfo, swapDirectionToGuaranteedType } from "@models/swap/swap-summary-info";
import { toNumberFormat } from "@utils/number-utils";

interface WalletBalanceDetailInfoProps {
  swapSummaryInfo: SwapSummaryInfo;
}

const SwapButtonTooltip: React.FC<WalletBalanceDetailInfoProps> = ({
  swapSummaryInfo,
}) => {
  const priceImpactStr = useMemo(() => {
    const priceImpact = swapSummaryInfo.priceImpact;
    return `${priceImpact}%`;
  }, [swapSummaryInfo.priceImpact]);

  const guaranteedTypeStr = useMemo(() => {
    const swapDirection = swapSummaryInfo.swapDirection;
    return swapDirectionToGuaranteedType(swapDirection);
  }, [swapSummaryInfo.swapDirection]);

  const guaranteedStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.guaranteedAmount;
    return `${toNumberFormat(amount || 0)} ${currency}`;
  }, [swapSummaryInfo.guaranteedAmount]);

  const gasFeeStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.gasFee;
    return `${toNumberFormat(amount)} ${currency}`;
  }, [swapSummaryInfo.gasFee]);

  const TooltipFloatingContent = useMemo(() => {
    return (
      <SwapButtonTooltipWrap>
        <div className="tooltip-list">
          <span>Price Impact</span>
          <span>{priceImpactStr}</span>
        </div>
        <div className="tooltip-list">
          <span>{guaranteedTypeStr}</span>
          <span>{guaranteedStr}</span>
        </div>
        <div className="tooltip-list">
          <span>Gas Fee</span>
          <span>{gasFeeStr}</span>
        </div>
      </SwapButtonTooltipWrap>
    );
  }, [gasFeeStr, guaranteedStr, guaranteedTypeStr, priceImpactStr]);

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconWrap>
        <IconInfo className="icon-info" />
      </IconWrap>
    </Tooltip>
  );
};
export default SwapButtonTooltip;
