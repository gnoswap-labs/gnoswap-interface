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
  isFetched: boolean;
  isLoading: boolean;
  isMobile: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  currentIndex: number;

  onScroll: () => void;
  onClickLoadMore: () => void;
  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadActiveProjects: React.FC<LaunchpadActiveProjectsProps> = ({
  activeProjectList,
  showLoadMore,
  loadMore,
  activeProjectListLength,
  isFetched,
  isLoading,
  isMobile,
  scrollRef,
  onScroll,
  onClickLoadMore,
  moveProjectDetail,
  currentIndex,
}) => {
  return (
    <LaunchpadActiveProjectsWrapper>
      <LaunchpadActiveProjectsHeader count={activeProjectListLength} />
      <LaunchpadActiveProjectsContent
        activeProjectList={activeProjectList || []}
        showLoadMore={showLoadMore}
        loadMore={loadMore}
        isFetched={isFetched}
        isLoading={isLoading}
        isMobile={isMobile}
        scrollRef={scrollRef}
        currentIndex={currentIndex}
        onScroll={onScroll}
        onClickLoadMore={onClickLoadMore}
        moveProjectDetail={moveProjectDetail}
      />
    </LaunchpadActiveProjectsWrapper>
  );
};

export default LaunchpadActiveProjects;
