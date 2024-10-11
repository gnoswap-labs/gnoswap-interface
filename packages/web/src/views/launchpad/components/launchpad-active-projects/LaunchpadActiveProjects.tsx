import React from "react";

import { LaunchpadActiveProjectsWrapper } from "./LaunchpadActiveProjects.styles";
import { LaunchpadProjectResponse } from "@repositories/launchpad/response";

import LaunchpadActiveProjectsHeader from "./launchpad-active-projects-header/LaunchpadActiveProjectsHeader";
import LaunchpadActiveProjectsContent from "./launchpad-active-projects-content/LaunchpadActiveProjectsContent";

export interface LaunchpadActiveProjectsProps {
  activeProjectList: LaunchpadProjectResponse[];
}

const LaunchpadActiveProjects: React.FC<LaunchpadActiveProjectsProps> = ({
  activeProjectList,
}) => {
  return (
    <LaunchpadActiveProjectsWrapper>
      <LaunchpadActiveProjectsHeader count={activeProjectList.length || 0} />
      <LaunchpadActiveProjectsContent
        activeProjectList={activeProjectList || []}
      />
    </LaunchpadActiveProjectsWrapper>
  );
};

export default LaunchpadActiveProjects;
