import React from "react";

import { LaunchpadProjectModel } from "@models/launchpad";
import LaunchpadProjectListHeader from "./launchpad-project-list-header/LaucnhpadProjectListHeader";
import LaunchpadProjectListTable from "./launchpad-project-list-table/LaunchpadProjectListTable";
import { ProjectListWrapper } from "./LaunchpadProjectList.styles";
import { DEVICE_TYPE } from "@styles/media";
import { LaunchpadProjectSortOption, TABLE_HEAD } from "./types";
import { rawToDisplayAmount } from "@utils/number-utils";
import { GNS_TOKEN } from "@common/values/token-constant";

interface LaunchpadProjectListProps {
  breakpoint: DEVICE_TYPE;
  projects: LaunchpadProjectModel[];
  isFetched: boolean;
  isViewSearchIcon: boolean;
  keyword: string;
  searchRef: React.RefObject<HTMLDivElement>;

  moveProjectDetail: (projectID: string) => void;
  moveRewardTokenSwapPage: (path: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSearch: () => void;
  fetchMore: () => void;

  sortOption: LaunchpadProjectSortOption | null;
  handleSort: (column: TABLE_HEAD) => void;
}

const LaunchpadProjectList: React.FC<LaunchpadProjectListProps> = ({
  breakpoint,
  projects,
  isFetched,
  keyword,
  isViewSearchIcon,
  moveProjectDetail,
  moveRewardTokenSwapPage,
  search,
  onToggleSearch,
  fetchMore,
  searchRef,
  sortOption,
  handleSort,
}) => {
  const displayProjectList: LaunchpadProjectModel[] = React.useMemo(() => {
    return projects.map(project => {
      return {
        ...project,
        pools: project.pools.map(pool => {
          return {
            ...pool,
            allocation: rawToDisplayAmount(pool.allocation, project.rewardTokenDecimals),
            depositAmount: rawToDisplayAmount(pool.depositAmount, GNS_TOKEN.decimals),
          };
        }),
      };
    });
  }, [projects]);

  return (
    <ProjectListWrapper>
      <LaunchpadProjectListHeader
        keyword={keyword}
        search={search}
        breakpoint={breakpoint}
        isViewSearchIcon={isViewSearchIcon}
        onToggleSearch={onToggleSearch}
        searchRef={searchRef}
      />
      <LaunchpadProjectListTable
        breakpoint={breakpoint}
        projects={displayProjectList}
        isFetched={isFetched}
        moveProjectDetail={moveProjectDetail}
        moveRewardTokenSwapPage={moveRewardTokenSwapPage}
        fetchMore={fetchMore}
        sortOption={sortOption}
        handleSort={handleSort}
      />
    </ProjectListWrapper>
  );
};

export default LaunchpadProjectList;
