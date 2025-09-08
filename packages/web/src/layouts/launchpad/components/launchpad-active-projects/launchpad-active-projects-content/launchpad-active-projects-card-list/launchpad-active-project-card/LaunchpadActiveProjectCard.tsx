import React from "react";

import { LaunchpadProjectModel } from "@models/launchpad";

import { ActiveProjectCardWrapper } from "./LaunchpadActiveProjectCard.styles";
import LaunchpadActiveProjectCardHeader from "./launchpad-active-project-card-header/LaunchpadActiveProjectCardHeader";
import { Divider } from "@components/common/divider/divider";
import LaunchpadActiveProjectCardData from "./launchpad-active-project-card-data/LaunchpadActiveProjectCardData";
import { LaunchpadActiveProjectPool } from "@repositories/launchpad/response/get-launchpad-active-projects-response";
import LaunchpadStatusTimeChip from "@layouts/launchpad/launchpad-detail/components/common/launchpad-status-time-chip/LaunchpadStatusTimeChip";

interface LaunchpadActiveProjectCardProps {
  project: LaunchpadProjectModel;

  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadActiveProjectCard: React.FC<LaunchpadActiveProjectCardProps> = ({ project, moveProjectDetail }) => {
  const { pools, status, projectId, rewardTokenSymbol, rewardTokenLogoUrl } = project;

  const FIRST_POOL = pools[0];
  const LAST_POOL = pools[Math.max(pools.length - 1, 0)];

  return (
    <ActiveProjectCardWrapper type={status} onClick={() => moveProjectDetail(projectId)}>
      <LaunchpadStatusTimeChip startTime={FIRST_POOL.startTime} endTime={LAST_POOL.endTime} status={project.status} />
      <LaunchpadActiveProjectCardHeader
        name={project.name}
        description={project.description || ""}
        rewardTokenSymbol={rewardTokenSymbol || ""}
        rewardTokenUrl={rewardTokenLogoUrl || ""}
      />
      <Divider />
      <LaunchpadActiveProjectCardData pools={(pools as LaunchpadActiveProjectPool[]) || []} />
    </ActiveProjectCardWrapper>
  );
};

export default LaunchpadActiveProjectCard;
