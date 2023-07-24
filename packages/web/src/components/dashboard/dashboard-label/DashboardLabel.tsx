import React from "react";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { WalletBalanceDetailInfoTooltipContent } from "./DashboardLabel.styles";

interface WalletBalanceDetailInfoProps {
  tooltip: string;
}

const DashboardLabel: React.FC<WalletBalanceDetailInfoProps> = ({
  tooltip,
}) => {
  const TooltipFloatingContent = (
    <WalletBalanceDetailInfoTooltipContent>
      {tooltip}
    </WalletBalanceDetailInfoTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo />
    </Tooltip>
  );
};
export default DashboardLabel;
