import React from "react";

import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectsCardList from "./launchpad-active-projects-card-list/LaunchpadActiveProjectsCardList";

export interface LaunchpadActiveProjectsContentProps {
  activeProjectList: LaunchpadProjectResponse[];
  showLoadMore: boolean;
  loadMore: boolean;

  onClickLoadMore: () => void;
}

const LaunchpadActiveProjectsContent: React.FC<
  LaunchpadActiveProjectsContentProps
> = ({ activeProjectList, showLoadMore, loadMore, onClickLoadMore }) => {
  return (
    <>
      {activeProjectList.length > 0 ? (
        <LaunchpadActiveProjectsCardList
          activeProjectList={activeProjectList}
          showLoadMore={showLoadMore}
          loadMore={loadMore}
          onClickLoadMore={onClickLoadMore}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default LaunchpadActiveProjectsContent;
