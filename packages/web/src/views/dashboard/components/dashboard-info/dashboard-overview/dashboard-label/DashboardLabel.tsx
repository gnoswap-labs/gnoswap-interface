import React from "react";

import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";

import { DashboardLabelTooltipContent } from "./DashboardLabel.styles";

interface WalletBalanceDetailInfoProps {
  tooltip: React.ReactNode;
}

const DashboardLabel: React.FC<WalletBalanceDetailInfoProps> = ({
  tooltip,
}) => {
  const TooltipFloatingContent = (
    <DashboardLabelTooltipContent>{tooltip}</DashboardLabelTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo />
    </Tooltip>
  );
};
export default DashboardLabel;
