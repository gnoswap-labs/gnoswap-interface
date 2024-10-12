import React from "react";

import { LaunchpadProjectModel } from "@models/launchpad";
import LaunchpadProjectListHeader from "./launchpad-project-list-header/LaucnhpadProjectListHeader";
import LaunchpadProjectListTable from "./launchpad-project-list-table/LaunchpadProjectListTable";
import { ProjectListWrapper } from "./LaunchpadProjectList.styles";

interface LaunchpadProjectListProps {
  projects: LaunchpadProjectModel[];
}

const LaunchpadProjectList: React.FC<LaunchpadProjectListProps> = ({
  projects,
}) => {
  return (
    <ProjectListWrapper>
      <LaunchpadProjectListHeader />
      <LaunchpadProjectListTable projects={projects} />
    </ProjectListWrapper>
  );
};

export default LaunchpadProjectList;
