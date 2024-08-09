import React from "react";

import ActivityListHeader from "@components/dashboard/activity-list-header/ActivityListHeader";
import ActivityListTable from "@components/dashboard/activity-list-table/ActivityListTable";
import {
  ACTIVITY_TABLE_HEAD,
  ACTIVITY_TYPE,
  SortOption,
  type Activity,
} from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import { DEVICE_TYPE } from "@styles/media";

import { ActivityListWrapper } from "./ActivityList.styles";

interface ActivityItem {
  activities: Activity[];
  isFetched: boolean;
  error: Error | null;
  activityType?: ACTIVITY_TYPE;
  sortOption?: SortOption;
  changeActivityType: ({
    display,
    key,
  }: {
    display: string;
    key: string;
  }) => void;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
  isSortOption: (item: ACTIVITY_TABLE_HEAD) => boolean;
  sort: (item: ACTIVITY_TABLE_HEAD) => void;
  breakpoint: DEVICE_TYPE;
}

const ActivityList: React.FC<ActivityItem> = ({
  activities,
  isFetched,
  activityType = ACTIVITY_TYPE.ALL,
  sortOption,
  changeActivityType,
  isSortOption,
  sort,
  breakpoint,
}) => {
  return (
    <ActivityListWrapper>
      <ActivityListHeader
        activityType={activityType}
        changeActivityType={changeActivityType}
      />
      <ActivityListTable
        activities={activities}
        isFetched={isFetched}
        sortOption={sortOption}
        isSortOption={isSortOption}
        sort={sort}
        breakpoint={breakpoint}
      />
      {/* <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
        siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
      /> */}
    </ActivityListWrapper>
  );
};

export default ActivityList;
