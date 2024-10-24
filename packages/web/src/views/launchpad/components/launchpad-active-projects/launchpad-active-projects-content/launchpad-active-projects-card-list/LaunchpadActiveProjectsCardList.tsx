import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectCard from "./launchpad-active-project-card/LaunchpadActiveProjectCard";
import {
  ActiveProjectsCardListWrapper,
  ActiveProjectsGridWrapper,
} from "./LaunchpadActiveProjectsCardList.styles";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface LaunchpadActiveProjectsCardListProps {
  activeProjectList: LaunchpadProjectResponse[];
  showLoadMore: boolean;
  loadMore: boolean;
  isFetched: boolean;
  isLoading: boolean;

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
  onClickLoadMore,
  moveProjectDetail,
}) => {
  const hasData = !isLoading && activeProjectList.length > 0;
  const showLoading = !isFetched && isLoading;

  return (
    <ActiveProjectsCardListWrapper>
      <ActiveProjectsGridWrapper>
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
    </ActiveProjectsCardListWrapper>
  );
};

export default LaunchpadActiveProjectsCardList;
