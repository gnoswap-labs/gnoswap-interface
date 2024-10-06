import React from "react";

import { LaunchpadActiveProjectsWrapper } from "./LaunchpadActiveProjects.styles";

import LaunchpadActiveProjectsHeader from "./launchpad-active-projects-header/LaunchpadActiveProjectsHeader";
import LaunchpadActiveProjectsContent from "./launchpad-active-projects-content/LaunchpadActiveProjectsContent";

/**
 * @yjin
 * The interface will be modified to reflect real data.
 */
// export interface LaunchpadActiveProjectsProps {}

const LaunchpadActiveProjects: React.FC = () => {
  return (
    <LaunchpadActiveProjectsWrapper>
      <LaunchpadActiveProjectsHeader />
      <LaunchpadActiveProjectsContent />
    </LaunchpadActiveProjectsWrapper>
  );
};

export default LaunchpadActiveProjects;
