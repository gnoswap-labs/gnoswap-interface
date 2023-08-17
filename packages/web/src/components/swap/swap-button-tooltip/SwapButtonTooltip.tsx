import React from "react";
import { SwapButtonTooltipWrap } from "./SwapButtonTooltip.styles";
import { SwapGasInfo } from "@containers/swap-container/SwapContainer";
import Tooltip from "@components/common/tooltip/Tooltip";

interface WalletBalanceDetailInfoProps {
  swapGasInfo: SwapGasInfo;
  children: React.ReactNode;
}

const SwapButtonTooltip: React.FC<WalletBalanceDetailInfoProps> = ({
  swapGasInfo,
  children,
}) => {
  const TooltipFloatingContent = (
    <SwapButtonTooltipWrap>
      <div className="tooltip-list">
        <span>Price Impact</span>
        <span>{swapGasInfo.gasFee}</span>
      </div>
      <div className="tooltip-list">
        <span>Min. Received</span>
        <span>{swapGasInfo.minReceived}</span>
      </div>
      <div className="tooltip-list">
        <span>Gas Fee</span>
        <span>{swapGasInfo.gasFee}</span>
      </div>
    </SwapButtonTooltipWrap>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      {children}
    </Tooltip>
  );
};
export default SwapButtonTooltip;
