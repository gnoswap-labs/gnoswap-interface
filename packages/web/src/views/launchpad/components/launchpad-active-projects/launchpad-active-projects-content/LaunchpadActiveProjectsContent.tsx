import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectsCardList from "./launchpad-active-projects-card-list/LaunchpadActiveProjectsCardList";

export interface LaunchpadActiveProjectsContentProps {
  activeProjectList: LaunchpadProjectResponse[];
  showLoadMore: boolean;
  loadMore: boolean;
  isFetched: boolean;
  isLoading: boolean;

  onClickLoadMore: () => void;
  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadActiveProjectsContent: React.FC<
  LaunchpadActiveProjectsContentProps
> = ({
  activeProjectList,
  showLoadMore,
  loadMore,
  isFetched,
  isLoading,
  onClickLoadMore,
  moveProjectDetail,
}) => {
  return (
    <LaunchpadActiveProjectsCardList
      activeProjectList={activeProjectList}
      showLoadMore={showLoadMore}
      loadMore={loadMore}
      isFetched={isFetched}
      isLoading={isLoading}
      onClickLoadMore={onClickLoadMore}
      moveProjectDetail={moveProjectDetail}
    />
  );
};

export default LaunchpadActiveProjectsContent;
