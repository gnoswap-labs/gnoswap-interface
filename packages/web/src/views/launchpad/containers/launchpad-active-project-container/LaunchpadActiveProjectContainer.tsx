import React from "react";

import LaunchpadActiveProjects from "@views/launchpad/components/launchpad-active-projects/LaunchpadActiveProjects";

import { useGetLaunchpadActiveProjects } from "@query/launchpad/use-get-launchpad-active-projects";

/**
 * @yjin
 * The interface will be modified to reflect real data.
 */
// interface LaunchpadActiveProjectContainerProps {}

const LaunchpadActiveProjectContainer: React.FC = () => {
  const { data: activeProjectList } = useGetLaunchpadActiveProjects();
  return (
    <LaunchpadActiveProjects activeProjectList={activeProjectList || []} />
  );
};

export default LaunchpadActiveProjectContainer;
