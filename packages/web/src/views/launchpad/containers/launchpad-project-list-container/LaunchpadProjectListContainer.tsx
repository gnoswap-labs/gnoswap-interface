import React from "react";
import { useAtom } from "jotai";

import useCustomRouter from "@hooks/common/use-custom-router";
import useDebounce from "@hooks/common/use-debounce";
import { useGetLaunchpadProjects } from "@query/launchpad/use-get-launchpad-projects";
import { LaunchpadProjectModel } from "@models/launchpad";

import LaunchpadProjectList from "@views/launchpad/components/launchpad-project-list/LaunchpadProjectList";
import { CommonState } from "@states/index";
import { QUERY_PARAMETER } from "@constants/page.constant";
import useClickOutside from "@hooks/common/use-click-outside";

const LaunchpadProjectListContainer: React.FC = () => {
  const router = useCustomRouter();
  const { moveRewardTokenSwapPage } = router;
  const [breakpoint] = useAtom(CommonState.breakpoint);

  const [keyword, setKeyword] = React.useState("");
  const debounceKeyword = useDebounce(keyword, 500);
  const [isViewSearchIcon, setIsViewSearchIcon] = React.useState(false);
  const [componentRef, isClickOutside, setIsInside] = useClickOutside();

  const search = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const {
    data: projects,
    isFetched: isFetchedProjects,
    hasNextPage,
    fetchNextPage,
  } = useGetLaunchpadProjects({ keyword: debounceKeyword });
  const projectList = React.useMemo(() => {
    if (projects && projects.pages) {
      return projects.pages.flatMap(item => item.projects);
    }
    return [];
  }, [projects]);

  const filterProjectsByKeyword = React.useCallback((projects: LaunchpadProjectModel[], keyword: string) => {
    const lowerCaseKeyword = keyword.toLowerCase();
    return projects.filter(
      project =>
        project.name.toLowerCase().includes(lowerCaseKeyword) ||
        project.rewardTokenSymbol.toLowerCase().includes(lowerCaseKeyword),
    );
  }, []);

  const fixedProjects = React.useMemo(() => {
    if (!projectList || projectList.length === 0) return [];

    const filteredProjects = filterProjectsByKeyword(projectList, keyword);
    return filteredProjects;
  }, [projectList, keyword, filterProjectsByKeyword]);

  const moveProjectDetail = React.useCallback(
    (projectId: string) => {
      router.movePage("PROJECT", { [QUERY_PARAMETER.PROJECT_PATH]: projectId });
    },
    [router],
  );

  const onToggleSearch = React.useCallback(() => {
    setIsViewSearchIcon(prev => !prev);
    setIsInside(true);
  }, [setIsInside]);

  React.useEffect(() => {
    if (!keyword) {
      if (isClickOutside) {
        setIsViewSearchIcon(false);
      }
    }
  }, [isClickOutside, keyword]);

  const fetchNextItems = React.useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  return (
    <LaunchpadProjectList
      isFetched={isFetchedProjects}
      breakpoint={breakpoint}
      projects={[...fixedProjects]}
      moveProjectDetail={moveProjectDetail}
      moveRewardTokenSwapPage={moveRewardTokenSwapPage}
      keyword={keyword}
      search={search}
      isViewSearchIcon={isViewSearchIcon}
      searchRef={componentRef}
      onToggleSearch={onToggleSearch}
      fetchMore={fetchNextItems}
    />
  );
};

export default LaunchpadProjectListContainer;
