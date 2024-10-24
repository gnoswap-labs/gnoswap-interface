import React from "react";
import { css } from "@emotion/react";

import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";

interface LaunchpadProjectSummaryTooltipProps {
  floatingContent: React.ReactNode | string;
}

const LaunchpadTooltip = ({
  floatingContent,
}: LaunchpadProjectSummaryTooltipProps) => {
  return (
    <Tooltip
      FloatingContent={<div css={tooltipContent}>{floatingContent}</div>}
      placement="top"
    >
      <IconInfo size={16} fill={"#596782"} />
    </Tooltip>
  );
};

const tooltipContent = css`
  font-size: 14px;
`;

export default LaunchpadTooltip;
