import React from "react";

import { ActiveProjectCardWrapper } from "./LaunchpadActiveProjectCard.styles";
import LaunchpadActiveProjectCardHeader from "./launchpad-active-project-card-header/LaunchpadActiveProjectCardHeader";
import LaunchpadActiveProjectCardTimeChip, {
  PROJECT_STATUS_TYPE,
} from "./launchpad-active-project-card-time-chip/LaunchpadActiveProjectCardTimeChip";
import { Divider } from "@components/common/divider/divider";
import LaunchpadActiveProjectCardData from "./launchpad-active-project-card-data/LaunchpadActiveProjectCardData";

/**
 * @yjin
 * The interface will be modified to reflect real data.
 */
// interface LaunchpadActiveProjectCardProps {}

const LaunchpadActiveProjectCard: React.FC = () => {
  return (
    <ActiveProjectCardWrapper>
      <LaunchpadActiveProjectCardTimeChip type={PROJECT_STATUS_TYPE.UPCOMING} />
      <LaunchpadActiveProjectCardHeader />
      <Divider />
      <LaunchpadActiveProjectCardData />
    </ActiveProjectCardWrapper>
  );
};

export default LaunchpadActiveProjectCard;
