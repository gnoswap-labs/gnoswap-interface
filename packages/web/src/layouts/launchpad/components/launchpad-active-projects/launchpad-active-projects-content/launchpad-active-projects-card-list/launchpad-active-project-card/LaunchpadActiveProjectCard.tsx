import React from "react";

import { LaunchpadProjectModel } from "@models/launchpad";
import { usePrefetchNavigation } from "@hooks/common/use-prefetch-navigation";
import { QUERY_PARAMETER } from "@constants/page.constant";

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
  const { pools, status, projectID, rewardTokenSymbol, rewardTokenLogoURL } = project;

  const { prefetch } = usePrefetchNavigation({
    pageType: "PROJECT",
    params: {
      [QUERY_PARAMETER.PROJECT_PATH]: projectID,
    },
  });

  const FIRST_POOL = pools[0];
  const LAST_POOL = pools[Math.max(pools.length - 1, 0)];

  const handleClick = React.useCallback(() => {
    moveProjectDetail(projectID);
  }, [moveProjectDetail, projectID]);

  const handleMouseEnter = React.useCallback(() => {
    prefetch();
  }, [prefetch]);

  return (
    <ActiveProjectCardWrapper type={status} onClick={handleClick} onMouseEnter={handleMouseEnter}>
      <LaunchpadStatusTimeChip startTime={FIRST_POOL.startTime} endTime={LAST_POOL.endTime} status={project.status} />
      <LaunchpadActiveProjectCardHeader
        name={project.name}
        description={project.description || ""}
        rewardTokenSymbol={rewardTokenSymbol || ""}
        rewardTokenUrl={rewardTokenLogoURL || ""}
      />
      <Divider />
      <LaunchpadActiveProjectCardData pools={(pools as LaunchpadActiveProjectPool[]) || []} />
    </ActiveProjectCardWrapper>
  );
};

export default LaunchpadActiveProjectCard;
