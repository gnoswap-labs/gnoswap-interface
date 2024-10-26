import React from "react";

import { PROJECT_STATUS_TYPE } from "@common/values";
import { getStatusText } from "@utils/launchpad-get-status-text";

import { StatusTimeChipWrapper } from "./LaunchpadStatusTimeChip.styled";
import IconTimer from "@components/common/icons/IconTimer";

interface LaunchpadStatusTimeChipProps {
  startTime?: string;
  endTime?: string;
  status: PROJECT_STATUS_TYPE;
}

const LaunchpadStatusTimeChip = ({
  startTime,
  endTime,
  status,
}: LaunchpadStatusTimeChipProps) => {
  return (
    <StatusTimeChipWrapper type={status}>
      <IconTimer type={status} />
      <div>{getStatusText(status, startTime, endTime)}</div>
    </StatusTimeChipWrapper>
  );
};

export default LaunchpadStatusTimeChip;
