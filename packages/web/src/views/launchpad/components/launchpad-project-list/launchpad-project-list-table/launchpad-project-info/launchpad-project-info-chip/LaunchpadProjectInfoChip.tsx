import React from "react";

import { PROJECT_STATUS_TYPE } from "@common/values";

import { ChipWrapper } from "./LaunchpadProjectInfoChip.styles";
import IconTimer from "@components/common/icons/IconTimer";
import { useTranslation } from "react-i18next";

interface LaunchpadProjectInfoChipProps {
  type: PROJECT_STATUS_TYPE;
}

const LaunchpadProjectInfoChip: React.FC<LaunchpadProjectInfoChipProps> = ({
  type,
}) => {
  const { t } = useTranslation();

  const getProjectStatus = (type: PROJECT_STATUS_TYPE) => {
    switch (type) {
      case PROJECT_STATUS_TYPE.ONGOING:
        return t("Launchpad:common.ongoing");
      case PROJECT_STATUS_TYPE.UPCOMING:
        return t("Launchpad:common.upcoming");
      case PROJECT_STATUS_TYPE.ENDED:
        return t("Launchpad:common.ended");
    }
  };

  return (
    <ChipWrapper type={type}>
      <IconTimer type={type} />
      {getProjectStatus(type)}
    </ChipWrapper>
  );
};

export default LaunchpadProjectInfoChip;
