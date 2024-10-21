import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import { ActiveProjectCardWrapper } from "./LaunchpadActiveProjectCard.styles";
import LaunchpadActiveProjectCardHeader from "./launchpad-active-project-card-header/LaunchpadActiveProjectCardHeader";
import LaunchpadActiveProjectCardTimeChip from "./launchpad-active-project-card-time-chip/LaunchpadActiveProjectCardTimeChip";
import { Divider } from "@components/common/divider/divider";
import LaunchpadActiveProjectCardData from "./launchpad-active-project-card-data/LaunchpadActiveProjectCardData";
import { LaunchpadActiveProjectPool } from "@repositories/launchpad/response/get-launchpad-active-projects-response";

interface LaunchpadActiveProjectCardProps {
  project: LaunchpadProjectResponse;

  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadActiveProjectCard: React.FC<LaunchpadActiveProjectCardProps> = ({
  project,
  moveProjectDetail,
}) => {
  const { pools, status, projectId, rewardTokenSymbol, rewardTokenLogoUrl } =
    project;
  return (
    <ActiveProjectCardWrapper
      type={status}
      onClick={() => moveProjectDetail(projectId)}
    >
      <LaunchpadActiveProjectCardTimeChip
        startTime={pools[0].startTime}
        endTime={pools[0].endTime}
        type={project.status}
      />
      <LaunchpadActiveProjectCardHeader
        name={project.name}
        description={project.description || ""}
        rewardTokenSymbol={rewardTokenSymbol || ""}
        rewardTokenUrl={rewardTokenLogoUrl || ""}
      />
      <Divider />
      <LaunchpadActiveProjectCardData
        pools={(pools as LaunchpadActiveProjectPool[]) || []}
      />
    </ActiveProjectCardWrapper>
  );
};

export default LaunchpadActiveProjectCard;
