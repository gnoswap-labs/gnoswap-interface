import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectsCardList from "./launchpad-active-projects-card-list/LaunchpadActiveProjectsCardList";
import LaunchpadActiveProjectNoData from "./launchpad-active-project-no-data/LaunchpadActiveProjectNoData";

export interface LaunchpadActiveProjectsContentProps {
  activeProjectList: LaunchpadProjectResponse[];
  showLoadMore: boolean;
  loadMore: boolean;
  isFetched: boolean;
  isLoading: boolean;
  isMobile: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  currentIndex: number;

  onScroll: () => void;
  onClickLoadMore: () => void;
  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadActiveProjectsContent: React.FC<LaunchpadActiveProjectsContentProps> = ({
  activeProjectList,
  showLoadMore,
  loadMore,
  isFetched,
  isLoading,
  isMobile,
  currentIndex,
  scrollRef,
  onScroll,
  onClickLoadMore,
  moveProjectDetail,
}) => {
  if (isFetched && activeProjectList.length === 0) {
    return <LaunchpadActiveProjectNoData />;
  }
  return (
    <LaunchpadActiveProjectsCardList
      activeProjectList={activeProjectList}
      showLoadMore={showLoadMore}
      loadMore={loadMore}
      isFetched={isFetched}
      isLoading={isLoading}
      isMobile={isMobile}
      currentIndex={currentIndex}
      scrollRef={scrollRef}
      onScroll={onScroll}
      onClickLoadMore={onClickLoadMore}
      moveProjectDetail={moveProjectDetail}
    />
  );
};

export default LaunchpadActiveProjectsContent;
