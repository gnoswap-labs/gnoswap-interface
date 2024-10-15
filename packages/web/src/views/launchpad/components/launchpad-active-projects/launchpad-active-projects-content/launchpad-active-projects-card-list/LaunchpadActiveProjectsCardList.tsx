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
}

const LaunchpadActiveProjectsCardList: React.FC<
  LaunchpadActiveProjectsCardListProps
> = ({ activeProjectList, showLoadMore, loadMore, onClickLoadMore }) => {
  return (
    <ActiveProjectsCardListWrapper>
      <ActiveProjectsGridWrapper>
        {activeProjectList && activeProjectList.length > 0 && (
          <>
            {activeProjectList.map(
              (activeProjectDetail: LaunchpadProjectResponse) => {
                return (
                  <LaunchpadActiveProjectCard
                    key={activeProjectDetail.id}
                    activeProjectDetail={activeProjectDetail}
                  />
                );
              },
            )}
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
