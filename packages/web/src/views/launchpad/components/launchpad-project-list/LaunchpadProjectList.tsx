import React from "react";

import { LaunchpadProjectModel } from "@models/launchpad";
import LaunchpadProjectListHeader from "./launchpad-project-list-header/LaucnhpadProjectListHeader";
import LaunchpadProjectListTable from "./launchpad-project-list-table/LaunchpadProjectListTable";
import { ProjectListWrapper } from "./LaunchpadProjectList.styles";
import { DEVICE_TYPE } from "@styles/media";

interface LaunchpadProjectListProps {
  breakpoint: DEVICE_TYPE;
  projects: LaunchpadProjectModel[];
}

const LaunchpadProjectList: React.FC<LaunchpadProjectListProps> = ({
  breakpoint,
  projects,
}) => {
  return (
    <ProjectListWrapper>
      <LaunchpadProjectListHeader />
      <LaunchpadProjectListTable breakpoint={breakpoint} projects={projects} />
    </ProjectListWrapper>
  );
};

export default LaunchpadProjectList;
