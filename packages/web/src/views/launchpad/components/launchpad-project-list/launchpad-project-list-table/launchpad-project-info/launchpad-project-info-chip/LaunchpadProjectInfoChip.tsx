import React from "react";

import { PROJECT_STATUS_TYPE } from "@common/values";

import { ChipWrapper } from "./LaunchpadProjectInfoChip.styles";
import { capitalize } from "@utils/string-utils";
import IconTimer from "@components/common/icons/IconTimer";

interface LaunchpadProjectInfoChipProps {
  type: PROJECT_STATUS_TYPE;
}

const LaunchpadProjectInfoChip: React.FC<LaunchpadProjectInfoChipProps> = ({
  type,
}) => {
  return (
    <ChipWrapper type={type}>
      <IconTimer type={type} />
      {capitalize(type)}
    </ChipWrapper>
  );
};

export default LaunchpadProjectInfoChip;
