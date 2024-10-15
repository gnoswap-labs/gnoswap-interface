import React from "react";
import { useAtom } from "jotai";

import { useLoading } from "@hooks/common/use-loading";

import LaunchpadProjectList from "@views/launchpad/components/launchpad-project-list/LaunchpadProjectList";
import { useGetLaunchpadProjects } from "@query/launchpad/use-get-launchpad-projects";
import { CommonState } from "@states/index";

const LaunchpadProjectListContainer: React.FC = () => {
  const [breakpoint] = useAtom(CommonState.breakpoint);

  const { isLoadingLaunchpadProjectList } = useLoading();
  const { data: projects } = useGetLaunchpadProjects({ keyword: "" });
  return (
    <LaunchpadProjectList
      isFetched={!isLoadingLaunchpadProjectList}
      breakpoint={breakpoint}
      projects={projects?.pages.flatMap(item => item.projects) || []}
    />
  );
};

export default LaunchpadProjectListContainer;
