import React from "react";
import { useAtom } from "jotai";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useGetLaunchpadProjects } from "@query/launchpad/use-get-launchpad-projects";
import { LaunchpadProjectModel } from "@models/launchpad";

import LaunchpadProjectList from "@views/launchpad/components/launchpad-project-list/LaunchpadProjectList";
import { CommonState } from "@states/index";
import { QUERY_PARAMETER } from "@constants/page.constant";

const LaunchpadProjectListContainer: React.FC = () => {
  const router = useCustomRouter();
  const { moveRewardTokenSwapPage } = router;
  const [breakpoint] = useAtom(CommonState.breakpoint);

  const [keyword, setKeyword] = React.useState("");

  const search = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const { data: projects, isFetched: isFetchedProjects } =
    useGetLaunchpadProjects({ keyword: "" });
  const projectList = projects?.pages.flatMap(item => item.projects) || [];

  const STATUS_PRIORITY = {
    ONGOING: 0,
    UPCOMING: 1,
    ENDED: 2,
    NONE: 3,
  };

  const filterProjectsByKeyword = React.useCallback(
    (projects: LaunchpadProjectModel[], keyword: string) => {
      const lowerCaseKeyword = keyword.toLowerCase();
      return projects.filter(
        project =>
          project.name.toLowerCase().includes(lowerCaseKeyword) ||
          project.rewardTokenSymbol.toLowerCase().includes(lowerCaseKeyword),
      );
    },
    [],
  );

  const sortProjectsByStatus = React.useCallback(
    (a: LaunchpadProjectModel, b: LaunchpadProjectModel) => {
      if (STATUS_PRIORITY[a.status] !== STATUS_PRIORITY[b.status]) {
        return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      }

      const aStartTime = new Date(a.pools[0]?.startTime || 0).getTime();
      const bStartTime = new Date(b.pools[0]?.startTime || 0).getTime();
      return aStartTime - bStartTime;
    },
    [STATUS_PRIORITY],
  );

  const fixedProjects = React.useMemo(() => {
    if (!projectList || projectList.length === 0) return [];

    const filteredProjects = filterProjectsByKeyword(projectList, keyword);
    return filteredProjects.sort(sortProjectsByStatus);
  }, [projectList, keyword, filterProjectsByKeyword, sortProjectsByStatus]);

  const moveProjectDetail = React.useCallback(
    (projectId: string) => {
      router.movePage("PROJECT", { [QUERY_PARAMETER.PROJECT_PATH]: projectId });
    },
    [router],
  );
  return (
    <LaunchpadProjectList
      isFetched={isFetchedProjects}
      breakpoint={breakpoint}
      projects={[...fixedProjects]}
      moveProjectDetail={moveProjectDetail}
      moveRewardTokenSwapPage={moveRewardTokenSwapPage}
      keyword={keyword}
      search={search}
    />
  );
};

export default LaunchpadProjectListContainer;
