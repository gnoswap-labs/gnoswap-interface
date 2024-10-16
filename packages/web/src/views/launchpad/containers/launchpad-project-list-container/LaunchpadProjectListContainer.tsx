import React from "react";
import { useAtom } from "jotai";

import { useLoading } from "@hooks/common/use-loading";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGetLaunchpadProjects } from "@query/launchpad/use-get-launchpad-projects";

import LaunchpadProjectList from "@views/launchpad/components/launchpad-project-list/LaunchpadProjectList";
import { CommonState } from "@states/index";
import { QUERY_PARAMETER } from "@constants/page.constant";

const LaunchpadProjectListContainer: React.FC = () => {
  const router = useCustomRouter();
  const [breakpoint] = useAtom(CommonState.breakpoint);

  const { isLoadingLaunchpadProjectList } = useLoading();
  const { data: projects } = useGetLaunchpadProjects({ keyword: "" });

  const moveProjectDetail = React.useCallback(
    (projectId: string) => {
      router.movePage("PROJECT", { [QUERY_PARAMETER.PROJECT_PATH]: projectId });
    },
    [router],
  );
  return (
    <LaunchpadProjectList
      isFetched={!isLoadingLaunchpadProjectList}
      breakpoint={breakpoint}
      projects={projects?.pages.flatMap(item => item.projects) || []}
      moveProjectDetail={moveProjectDetail}
    />
  );
};

export default LaunchpadProjectListContainer;
