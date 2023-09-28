import React from "react";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  GovernanceDetailInfoTooltipContent,
  GovernanceDetailInfoWrapper,
} from "./GovernanceDetailInfo.styles";

interface GovernanceDetailInfoProps {
  title: string;
  value: string;
  tooltip?: string;
  currency?: string;
}

const GovernanceDetailInfo: React.FC<GovernanceDetailInfoProps> = ({
  title,
  value,
  tooltip,
  currency,
}) => {
  return (
    <GovernanceDetailInfoWrapper>
      <div className="title-wrapper">
        <span className="title">{title}</span>
        {tooltip !== undefined && (
          <GovernanceDetailInfoTooltip tooltip={tooltip} />
        )}
      </div>
      <div className="value-wrapper">
        <span className="value">{value}</span>
        {currency && <span className="currency">{currency}</span>}
      </div>
    </GovernanceDetailInfoWrapper>
  );
};

export const GovernanceDetailInfoTooltip: React.FC<{ tooltip: string }> = ({
  tooltip,
}) => {
  const TooltipFloatingContent = (
    <GovernanceDetailInfoTooltipContent>
      {tooltip}
    </GovernanceDetailInfoTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo />
    </Tooltip>
  );
};

export default GovernanceDetailInfo;
