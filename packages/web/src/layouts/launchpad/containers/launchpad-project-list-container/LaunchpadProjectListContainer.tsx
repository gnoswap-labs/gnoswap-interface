import React from "react";
import { useAtom } from "jotai";

import useCustomRouter from "@hooks/common/use-custom-router";
import useDebounce from "@hooks/common/use-debounce";
import { useGetLaunchpadProjects } from "@query/launchpad/use-get-launchpad-projects";
import { LaunchpadProjectModel } from "@models/launchpad";

import LaunchpadProjectList from "@layouts/launchpad/components/launchpad-project-list/LaunchpadProjectList";
import { CommonState } from "@states/index";
import { QUERY_PARAMETER } from "@constants/page.constant";
import useClickOutside from "@hooks/common/use-click-outside";
import {
  LaunchpadProjectSortOption,
  SortDirection,
  TABLE_HEAD,
} from "@layouts/launchpad/components/launchpad-project-list/types";

const LaunchpadProjectListContainer: React.FC = () => {
  const router = useCustomRouter();
  const { moveRewardTokenSwapPage } = router;
  const [breakpoint] = useAtom(CommonState.breakpoint);

  const [sortOption, setSortOption] = React.useState<LaunchpadProjectSortOption | null>(null);

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

  const sortValueTransform = (value: string): number => {
    if (value == "0") return 0;

    if (!value || value === "-") return -Infinity;

    const numericValue = value.replace(/[$,]/g, "");
    const number = Number(numericValue);

    return isNaN(number) ? -Infinity : number;
  };

  const getSortFunction = React.useCallback(
    (key: TABLE_HEAD, direction: SortDirection) => {
      return (a: LaunchpadProjectModel, b: LaunchpadProjectModel) => {
        const multiplier = direction === SortDirection.ASC ? 1 : -1;

        try {
          switch (key) {
            case TABLE_HEAD.PROJECT: {
              return multiplier * (a.name || "").localeCompare(b.name || "");
            }
            case TABLE_HEAD.STATUS: {
              return multiplier * (a.status || "").localeCompare(b.status || "");
            }
            case TABLE_HEAD.APR: {
              const aPools = Array.isArray(a.pools) ? a.pools : [];
              const bPools = Array.isArray(b.pools) ? b.pools : [];

              const aMaxApr = Math.max(...aPools.map(pool => sortValueTransform(String(pool?.apr || 0))));
              const bMaxApr = Math.max(...bPools.map(pool => sortValueTransform(String(pool?.apr || 0))));
              return multiplier * (aMaxApr - bMaxApr);
            }
            case TABLE_HEAD.PARTICIPANTS: {
              const aPools = Array.isArray(a.pools) ? a.pools : [];
              const bPools = Array.isArray(b.pools) ? b.pools : [];

              const aParticipants = aPools.reduce(
                (sum, pool) => sum + sortValueTransform(String(pool?.participant || 0)),
                0,
              );
              const bParticipants = bPools.reduce(
                (sum, pool) => sum + sortValueTransform(String(pool?.participant || 0)),
                0,
              );
              return multiplier * (aParticipants - bParticipants);
            }
            case TABLE_HEAD.TOTAL_ALLOCATION: {
              const aPools = Array.isArray(a.pools) ? a.pools : [];
              const bPools = Array.isArray(b.pools) ? b.pools : [];

              const aAllocation = aPools.reduce(
                (sum, pool) => sum + sortValueTransform(String(pool?.allocation || 0)),
                0,
              );
              const bAllocation = bPools.reduce(
                (sum, pool) => sum + sortValueTransform(String(pool?.allocation || 0)),
                0,
              );
              return multiplier * (aAllocation - bAllocation);
            }
            case TABLE_HEAD.TOTAL_DEPOSIT: {
              const aPools = Array.isArray(a.pools) ? a.pools : [];
              const bPools = Array.isArray(b.pools) ? b.pools : [];

              const aDeposit = aPools.reduce(
                (sum, pool) => sum + sortValueTransform(String(pool?.depositAmount || 0)),
                0,
              );
              const bDeposit = bPools.reduce(
                (sum, pool) => sum + sortValueTransform(String(pool?.depositAmount || 0)),
                0,
              );
              return multiplier * (aDeposit - bDeposit);
            }
            default:
              return 0;
          }
        } catch (error) {
          console.error("Error during sort:", error);
          return 0;
        }
      };
    },
    [sortValueTransform],
  );

  const handleSort = React.useCallback((column: TABLE_HEAD) => {
    setSortOption(prevOption => {
      if (prevOption && prevOption.key === column) {
        const newDirection = prevOption.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
        return { key: column, direction: newDirection };
      }

      return { key: column, direction: SortDirection.DESC };
    });
  }, []);

  const fixedProjects = React.useMemo(() => {
    if (!projectList || projectList.length === 0) return [];

    let filteredProjects = filterProjectsByKeyword(projectList, keyword);

    if (sortOption) {
      filteredProjects = [...filteredProjects].sort(getSortFunction(sortOption.key, sortOption.direction));
    }
    return filteredProjects;
  }, [projectList, keyword, filterProjectsByKeyword, sortOption, getSortFunction]);

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
      sortOption={sortOption}
      handleSort={handleSort}
    />
  );
};

export default LaunchpadProjectListContainer;
