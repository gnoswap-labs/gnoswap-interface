import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import { ActiveProjectCardWrapper } from "./LaunchpadActiveProjectCard.styles";
import LaunchpadActiveProjectCardHeader from "./launchpad-active-project-card-header/LaunchpadActiveProjectCardHeader";
import { Divider } from "@components/common/divider/divider";
import LaunchpadActiveProjectCardData from "./launchpad-active-project-card-data/LaunchpadActiveProjectCardData";
import { LaunchpadActiveProjectPool } from "@repositories/launchpad/response/get-launchpad-active-projects-response";
import LaunchpadStatusTimeChip from "@views/launchpad/launchpad-detail/components/common/launchpad-status-time-chip/LaunchpadStatusTimeChip";

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

  const firstPool = pools[0];
  const lastPool = pools[2];

  return (
    <ActiveProjectCardWrapper
      type={status}
      onClick={() => moveProjectDetail(projectId)}
    >
      <LaunchpadStatusTimeChip
        startTime={firstPool.startTime}
        endTime={lastPool.endTime}
        status={project.status}
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
