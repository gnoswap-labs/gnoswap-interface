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

  moveProjectDetail: (poolId: string) => void;
}

const LaunchpadProjectList: React.FC<LaunchpadProjectListProps> = ({
  breakpoint,
  projects,
  isFetched,
  moveProjectDetail,
}) => {
  return (
    <ProjectListWrapper>
      <LaunchpadProjectListHeader />
      <LaunchpadProjectListTable
        breakpoint={breakpoint}
        projects={projects}
        isFetched={isFetched}
        moveProjectDetail={moveProjectDetail}
      />
    </ProjectListWrapper>
  );
};

export default LaunchpadProjectList;
