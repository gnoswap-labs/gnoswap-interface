import React from "react";
import { useAtom } from "jotai";

import { PROJECT_STATUS_TYPE } from "@common/values";
import { LaunchpadState } from "@states/index";
import useCustomRouter from "@hooks/common/use-custom-router";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { useWindowSize } from "@hooks/common/use-window-size";

import LaunchpadActiveProjects from "@views/launchpad/components/launchpad-active-projects/LaunchpadActiveProjects";
import { useGetLaunchpadActiveProjects } from "@query/launchpad/use-get-launchpad-active-projects";

const LaunchpadActiveProjectContainer: React.FC = () => {
  const router = useCustomRouter();
  const { isMobile } = useWindowSize();

  const [isViewMoreActiveProjects, setIsViewMoreActiveProjects] = useAtom(
    LaunchpadState.isViewMoreActiveProjects,
  );
  const [currentIndex, setCurrentIndex] = React.useState(1);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const {
    data: activeProjectList = [],
    isLoading: isLoadingProjects,
    isFetched: isFetchedProjects,
  } = useGetLaunchpadActiveProjects();

  const activeProject = React.useMemo(() => {
    return activeProjectList.filter(
      item => item.status !== PROJECT_STATUS_TYPE.ENDED,
    );
  }, [activeProjectList]);

  const upcomingProject = React.useMemo(() => {
    return activeProject
      .filter(item => item.status === PROJECT_STATUS_TYPE.UPCOMING)
      .sort((a, b) => a.pools[0].startTime.localeCompare(b.pools[0].startTime));
  }, [activeProject]);

  const showedProject = React.useMemo(() => {
    return [
      ...upcomingProject,
      ...activeProject.filter(item => !upcomingProject.includes(item)),
    ];
  }, [upcomingProject, activeProject]);

  const dataMapping = React.useMemo(() => {
    if (!isViewMoreActiveProjects) {
      if (!isMobile) {
        return showedProject.slice(0, 4);
      }
    }
    return showedProject;
  }, [showedProject, isViewMoreActiveProjects, isMobile]);

  const handleClickLoadMore = React.useCallback(() => {
    setIsViewMoreActiveProjects(prev => !prev);
  }, [setIsViewMoreActiveProjects]);

  const moveProjectDetail = React.useCallback(
    (projectId: string) => {
      router.movePage("PROJECT", { [QUERY_PARAMETER.PROJECT_PATH]: projectId });
    },
    [router],
  );

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const currentScrollX = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (currentScrollX >= maxScroll - 1) {
        setCurrentIndex(showedProject.length);
      } else {
        setCurrentIndex(
          Math.min(Math.floor(currentScrollX / 280) + 1, showedProject.length),
        );
      }
    }
  };

  return (
    <LaunchpadActiveProjects
      activeProjectList={dataMapping}
      activeProjectListLength={showedProject.length}
      showLoadMore={showedProject.length > 4}
      loadMore={!isViewMoreActiveProjects}
      onClickLoadMore={handleClickLoadMore}
      moveProjectDetail={moveProjectDetail}
      isFetched={isFetchedProjects}
      isLoading={isLoadingProjects}
      isMobile={isMobile}
      currentIndex={currentIndex}
      scrollRef={scrollRef}
      onScroll={handleScroll}
    />
  );
};

export default LaunchpadActiveProjectContainer;
