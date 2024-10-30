import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectCard from "./launchpad-active-project-card/LaunchpadActiveProjectCard";
import {
  ActiveProjectsCardListWrapper,
  ActiveProjectsGridWrapper,
  BlankProjectCard,
} from "./LaunchpadActiveProjectsCardList.styles";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface LaunchpadActiveProjectsCardListProps {
  activeProjectList: LaunchpadProjectResponse[];
  showLoadMore: boolean;
  loadMore: boolean;
  isFetched: boolean;
  isLoading: boolean;
  isMobile: boolean;
  currentIndex: number;
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;

  onClickLoadMore: () => void;
  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadActiveProjectsCardList: React.FC<
  LaunchpadActiveProjectsCardListProps
> = ({
  activeProjectList,
  showLoadMore,
  loadMore,
  isFetched,
  isLoading,
  isMobile,
  scrollRef,
  currentIndex,
  onScroll,
  onClickLoadMore,
  moveProjectDetail,
}) => {
  const hasData = !isLoading && activeProjectList.length > 0;
  const showLoading = !isFetched && isLoading;

  return (
    <ActiveProjectsCardListWrapper>
      <ActiveProjectsGridWrapper ref={scrollRef} onScroll={onScroll}>
        {hasData &&
          activeProjectList.map((project: LaunchpadProjectResponse) => {
            return (
              <LaunchpadActiveProjectCard
                key={project.id}
                project={project}
                moveProjectDetail={moveProjectDetail}
              />
            );
          })}
        {isFetched &&
          !isLoading &&
          activeProjectList.length > 0 &&
          activeProjectList.length < 4 &&
          Array(4 - activeProjectList.length)
            .fill(1)
            .map((_, idx) => <BlankProjectCard key={idx} />)}
        {showLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className="card-skeleton"
              css={pulseSkeletonStyle({ w: "100%", h: "100%", tone: "600" })}
            />
          ))}
      </ActiveProjectsGridWrapper>
      {showLoadMore && (
        <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />
      )}
      {isMobile &&
        isFetched &&
        activeProjectList.length !== 0 &&
        !isLoading && (
          <div className="box-indicator">
            <span className="current-page">{currentIndex}</span>
            <span>/</span>
            <span>{activeProjectList.length}</span>
          </div>
        )}
    </ActiveProjectsCardListWrapper>
  );
};

export default LaunchpadActiveProjectsCardList;
