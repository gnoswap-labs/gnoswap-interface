import React from "react";
import { IconWrap, SwapButtonTooltipWrap } from "./SwapButtonTooltip.styles";
import { SwapGasInfo } from "@containers/swap-container/SwapContainer";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";

interface WalletBalanceDetailInfoProps {
  swapGasInfo: SwapGasInfo;
}

const SwapButtonTooltip: React.FC<WalletBalanceDetailInfoProps> = ({
  swapGasInfo,
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
      <IconWrap>
        <IconInfo className="icon-info" />
      </IconWrap>
    </Tooltip>
  );
};
export default SwapButtonTooltip;
