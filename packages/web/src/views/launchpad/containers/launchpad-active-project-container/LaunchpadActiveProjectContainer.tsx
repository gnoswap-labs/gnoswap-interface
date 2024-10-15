import React from "react";
import { useAtom } from "jotai";

import LaunchpadActiveProjects from "@views/launchpad/components/launchpad-active-projects/LaunchpadActiveProjects";

import { useGetLaunchpadActiveProjects } from "@query/launchpad/use-get-launchpad-active-projects";
import { PROJECT_STATUS_TYPE } from "@common/values";
import { LaunchpadState } from "@states/index";
import useCustomRouter from "@hooks/common/use-custom-router";
import { QUERY_PARAMETER } from "@constants/page.constant";

/**
 * @yjin
 * The interface will be modified to reflect real data.
 */
// interface LaunchpadActiveProjectContainerProps {}

const LaunchpadActiveProjectContainer: React.FC = () => {
  const router = useCustomRouter();

  const [isViewMoreActiveProjects, setIsViewMoreActiveProjects] = useAtom(
    LaunchpadState.isViewMoreActiveProjects,
  );

  const { data: activeProjectList = [] } = useGetLaunchpadActiveProjects();

  const activeProject = React.useMemo(() => {
    return activeProjectList.filter(
      item => item.status !== PROJECT_STATUS_TYPE.ENDED,
    );
  }, [activeProjectList]);

  const upcomingProject = React.useMemo(() => {
    return activeProject.filter(
      item => item.status === PROJECT_STATUS_TYPE.UPCOMING,
    );
  }, [activeProject]);

  const showedProject = React.useMemo(() => {
    return [
      ...upcomingProject,
      ...activeProject.filter(item => !upcomingProject.includes(item)),
    ];
  }, [upcomingProject, activeProject]);

  const dataMapping = React.useMemo(() => {
    if (!isViewMoreActiveProjects) {
      return showedProject.slice(0, 4);
    }
    return showedProject;
  }, [showedProject, isViewMoreActiveProjects]);

  const handleClickLoadMore = React.useCallback(() => {
    setIsViewMoreActiveProjects(prev => !prev);
  }, [isViewMoreActiveProjects]);

  const moveProjectDetail = React.useCallback(
    (projectId: string) => {
      router.movePage("PROJECT", { [QUERY_PARAMETER.PROJECT_PATH]: projectId });
    },
    [router],
  );

  return (
    <LaunchpadActiveProjects
      activeProjectList={dataMapping}
      activeProjectListLength={showedProject.length}
      showLoadMore={showedProject.length > 4}
      loadMore={!isViewMoreActiveProjects}
      onClickLoadMore={handleClickLoadMore}
      moveProjectDetail={moveProjectDetail}
    />
  );
};

export default LaunchpadActiveProjectContainer;
