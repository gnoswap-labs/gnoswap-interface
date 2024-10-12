import React from "react";

import LaunchpadProjectList from "@views/launchpad/components/launchpad-project-list/LaunchpadProjectList";
import { useGetLaunchpadProjects } from "@query/launchpad/use-get-launchpad-projects";

const LaunchpadProjectListContainer: React.FC = () => {
  const { data: projects } = useGetLaunchpadProjects({ keyword: "" });
  return (
    <LaunchpadProjectList
      projects={projects?.pages.flatMap(item => item.projects) || []}
    />
  );
};

export default LaunchpadProjectListContainer;
