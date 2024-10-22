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
  const { moveRewardTokenSwapPage } = router;
  const [breakpoint] = useAtom(CommonState.breakpoint);

  const [keyword, setKeyword] = React.useState("");

  const search = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const { isLoadingLaunchpadProjectList } = useLoading();
  const { data: projects } = useGetLaunchpadProjects({ keyword: "" });
  const projectList = projects?.pages.flatMap(item => item.projects) || [];

  const fixedProjects = React.useMemo(() => {
    if (!projectList || projectList.length === 0) return [];

    return projectList.filter(project => {
      const lowerCaseKeyword = keyword.toLowerCase();

      return (
        project.name.toLowerCase().includes(lowerCaseKeyword) ||
        project.rewardTokenSymbol.toLowerCase().includes(lowerCaseKeyword)
      );
    });
  }, [projects, keyword]);

  // Todo : Search
  // const filteredProjects = React.useMemo(() => {}, [])

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
      projects={[...fixedProjects]}
      moveProjectDetail={moveProjectDetail}
      moveRewardTokenSwapPage={moveRewardTokenSwapPage}
      keyword={keyword}
      search={search}
    />
  );
};

export default LaunchpadProjectListContainer;
