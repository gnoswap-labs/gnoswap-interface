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
  keyword: string;

  moveProjectDetail: (poolId: string) => void;
  moveRewardTokenSwapPage: (path: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LaunchpadProjectList: React.FC<LaunchpadProjectListProps> = ({
  breakpoint,
  projects,
  isFetched,
  keyword,
  moveProjectDetail,
  moveRewardTokenSwapPage,
  search,
}) => {
  return (
    <ProjectListWrapper>
      <LaunchpadProjectListHeader keyword={keyword} search={search} />
      <LaunchpadProjectListTable
        breakpoint={breakpoint}
        projects={projects}
        isFetched={isFetched}
        moveProjectDetail={moveProjectDetail}
        moveRewardTokenSwapPage={moveRewardTokenSwapPage}
      />
    </ProjectListWrapper>
  );
};

export default LaunchpadProjectList;
