import React, { useEffect } from "react";

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
  useEffect(() => {
    console.log(activeProjectDetail, "detail");
  }, []);
  return (
    <ActiveProjectCardWrapper>
      <LaunchpadActiveProjectCardTimeChip type={activeProjectDetail.status} />
      <LaunchpadActiveProjectCardHeader
        projectId={activeProjectDetail.projectId}
        name={activeProjectDetail.name}
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
