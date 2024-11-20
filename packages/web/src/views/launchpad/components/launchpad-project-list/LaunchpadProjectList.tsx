import React from "react";

import { LaunchpadProjectModel } from "@models/launchpad";
import LaunchpadProjectListHeader from "./launchpad-project-list-header/LaucnhpadProjectListHeader";
import LaunchpadProjectListTable from "./launchpad-project-list-table/LaunchpadProjectListTable";
import { ProjectListWrapper } from "./LaunchpadProjectList.styles";
import { DEVICE_TYPE } from "@styles/media";

interface LaunchpadProjectListProps {
  breakpoint: DEVICE_TYPE;
  projects: LaunchpadProjectModel[];
  isFetched: boolean;
  isViewSearchIcon: boolean;
  keyword: string;
  searchRef: React.RefObject<HTMLDivElement>;

  moveProjectDetail: (poolId: string) => void;
  moveRewardTokenSwapPage: (path: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSearch: () => void;
  fetchMore: () => void;
}

const LaunchpadProjectList: React.FC<LaunchpadProjectListProps> = ({
  breakpoint,
  projects,
  isFetched,
  keyword,
  isViewSearchIcon,
  moveProjectDetail,
  moveRewardTokenSwapPage,
  search,
  onToggleSearch,
  fetchMore,
  searchRef,
}) => {
  return (
    <ProjectListWrapper>
      <LaunchpadProjectListHeader
        keyword={keyword}
        search={search}
        breakpoint={breakpoint}
        isViewSearchIcon={isViewSearchIcon}
        onToggleSearch={onToggleSearch}
        searchRef={searchRef}
      />
      <LaunchpadProjectListTable
        breakpoint={breakpoint}
        projects={projects}
        isFetched={isFetched}
        moveProjectDetail={moveProjectDetail}
        moveRewardTokenSwapPage={moveRewardTokenSwapPage}
        fetchMore={fetchMore}
      />
    </ProjectListWrapper>
  );
};

export default LaunchpadProjectList;
