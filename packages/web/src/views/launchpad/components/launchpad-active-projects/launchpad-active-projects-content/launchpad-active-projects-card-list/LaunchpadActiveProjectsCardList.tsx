import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectCard from "./launchpad-active-project-card/LaunchpadActiveProjectCard";
import {
  ActiveProjectsCardListWrapper,
  ActiveProjectsGridWrapper,
} from "./LaunchpadActiveProjectsCardList.styles";
import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";

interface LaunchpadActiveProjectsCardListProps {
  activeProjectList: LaunchpadProjectResponse[];
  showLoadMore: boolean;
  loadMore: boolean;

  onClickLoadMore: () => void;
  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadActiveProjectsCardList: React.FC<
  LaunchpadActiveProjectsCardListProps
> = ({
  activeProjectList,
  showLoadMore,
  loadMore,
  onClickLoadMore,
  moveProjectDetail,
}) => {
  return (
    <ActiveProjectsCardListWrapper>
      <ActiveProjectsGridWrapper>
        {activeProjectList && activeProjectList.length > 0 && (
          <>
            {activeProjectList.map((project: LaunchpadProjectResponse) => {
              return (
                <LaunchpadActiveProjectCard
                  key={project.id}
                  project={project}
                  moveProjectDetail={moveProjectDetail}
                />
              );
            })}
          </>
        )}
      </ActiveProjectsGridWrapper>
      {showLoadMore && (
        <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />
      )}
    </ActiveProjectsCardListWrapper>
  );
};

export default LaunchpadActiveProjectsCardList;
