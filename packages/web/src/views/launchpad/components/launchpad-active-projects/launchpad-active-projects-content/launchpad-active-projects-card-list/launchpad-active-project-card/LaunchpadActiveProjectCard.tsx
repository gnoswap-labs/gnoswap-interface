import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import { ActiveProjectCardWrapper } from "./LaunchpadActiveProjectCard.styles";
import LaunchpadActiveProjectCardHeader from "./launchpad-active-project-card-header/LaunchpadActiveProjectCardHeader";
import LaunchpadActiveProjectCardTimeChip from "./launchpad-active-project-card-time-chip/LaunchpadActiveProjectCardTimeChip";
import { Divider } from "@components/common/divider/divider";
import LaunchpadActiveProjectCardData from "./launchpad-active-project-card-data/LaunchpadActiveProjectCardData";
import { LaunchpadActiveProjectPool } from "@repositories/launchpad/response/get-launchpad-active-projects-response";

interface LaunchpadActiveProjectCardProps {
  activeProjectDetail: LaunchpadProjectResponse;
}

const LaunchpadActiveProjectCard: React.FC<LaunchpadActiveProjectCardProps> = ({
  activeProjectDetail,
}) => {
  const { pools, status } = activeProjectDetail;
  return (
    <ActiveProjectCardWrapper type={status}>
      <LaunchpadActiveProjectCardTimeChip
        startTime={pools[0].startTime}
        type={activeProjectDetail.status}
      />
      <LaunchpadActiveProjectCardHeader
        name={activeProjectDetail.name}
        description={activeProjectDetail.description || ""}
      />
      <Divider />
      <LaunchpadActiveProjectCardData
        pools={
          (activeProjectDetail.pools as LaunchpadActiveProjectPool[]) || []
        }
      />
    </ActiveProjectCardWrapper>
  );
};

export default LaunchpadActiveProjectCard;
