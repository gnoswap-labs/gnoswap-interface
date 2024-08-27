import { css, Global, type Theme } from "@emotion/react";
import React from "react";

import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

import {
  GovernanceDetailInfoTooltipContent,
  GovernanceDetailInfoWrapper
} from "./GovernanceDetailInfo.styles";

export interface GovernanceDetailData {
  totalXGnosIssued: string;
  communityPool: string;
  passedProposals: string;
  activeProposals: string;
}

interface GovernanceDetailInfoProps {
  title: string;
  value?: string;
  tooltip?: string;
  currency?: string;
  isLoading?: boolean;
}

const ToolTipGlobalStyle = () => {
  return (
    <Global
      styles={(theme: Theme) => css`
        .governance-summary-tooltip {
          svg {
            fill: ${theme.color.background02};
          }
          div {
            color: ${theme.color.text02};
            background-color: ${theme.color.background02};
          }
        }
      `}
    />
  );
};

const GovernanceDetailInfo: React.FC<GovernanceDetailInfoProps> = ({
  title,
  value,
  tooltip,
  currency,
  isLoading,
}) => {
  return (
    <GovernanceDetailInfoWrapper>
      <div className="title-wrapper">
        <span className="title">{title}</span>
        {tooltip !== undefined && (
          <GovernanceDetailInfoTooltip tooltip={tooltip} />
        )}
      </div>
      {isLoading ? (
        <div className="value-wrapper-skeleton">
          <span css={pulseSkeletonStyle({ w: "100%" })} />
        </div>
      ) : (
        <div className="value-wrapper">
          <span className="value">{value}</span>
          {currency && <span className="currency">{currency}</span>}
        </div>
      )}
      <ToolTipGlobalStyle />
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
    <Tooltip
      placement="top"
      FloatingContent={TooltipFloatingContent}
      floatClassName="governance-summary-tooltip"
    >
      <IconInfo />
    </Tooltip>
  );
};

export default GovernanceDetailInfo;
