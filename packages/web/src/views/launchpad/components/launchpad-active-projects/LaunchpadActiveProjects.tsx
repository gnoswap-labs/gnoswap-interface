import React from "react";

import { LaunchpadActiveProjectsWrapper } from "./LaunchpadActiveProjects.styles";
import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectsHeader from "./launchpad-active-projects-header/LaunchpadActiveProjectsHeader";
import LaunchpadActiveProjectsContent from "./launchpad-active-projects-content/LaunchpadActiveProjectsContent";

export interface LaunchpadActiveProjectsProps {
  activeProjectList: LaunchpadProjectResponse[];
  showLoadMore: boolean;
  loadMore: boolean;
  activeProjectListLength: number;

  onClickLoadMore: () => void;
  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadActiveProjects: React.FC<LaunchpadActiveProjectsProps> = ({
  activeProjectList,
  showLoadMore,
  loadMore,
  activeProjectListLength,
  onClickLoadMore,
  moveProjectDetail,
}) => {
  return (
    <LaunchpadActiveProjectsWrapper>
      <LaunchpadActiveProjectsHeader count={activeProjectListLength || "-"} />
      <LaunchpadActiveProjectsContent
        activeProjectList={activeProjectList || []}
        showLoadMore={showLoadMore}
        loadMore={loadMore}
        onClickLoadMore={onClickLoadMore}
        moveProjectDetail={moveProjectDetail}
      />
    </LaunchpadActiveProjectsWrapper>
  );
};

export default LaunchpadActiveProjects;
