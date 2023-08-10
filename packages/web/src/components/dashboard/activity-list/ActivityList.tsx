// TODO : remove eslint-disable after work
/* eslint-disable */
import React from "react";
import {
  ACTIVITY_TYPE,
  type Activity,
  TABLE_HEAD,
  SortOption,
} from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import ActivityListHeader from "@components/dashboard/activity-list-header/ActivityListHeader";
import ActivityListTable from "@components/dashboard/activity-list-table/ActivityListTable";
import Pagination from "@components/common/pagination/Pagination";
import { ActivityListWrapper } from "./ActivityList.styles";
import { DeviceSize } from "@styles/media";
interface ActivityItem {
  activities: Activity[];
  isFetched: boolean;
  error: Error | null;
  activityType?: ACTIVITY_TYPE;
  sortOption?: SortOption;
  changeActivityType: (newType: string) => void;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
  isSortOption: (item: TABLE_HEAD) => boolean;
  sort: (item: TABLE_HEAD) => void;
  windowSize: number;
}

const ActivityList: React.FC<ActivityItem> = ({
  activities,
  isFetched,
  error,
  activityType = ACTIVITY_TYPE.ALL,
  sortOption,
  changeActivityType,
  currentPage,
  totalPage,
  movePage,
  isSortOption,
  sort,
  windowSize,
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
        windowSize={windowSize}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
        siblingCount={windowSize > DeviceSize.mobile ? 2 : 1}
      />
    </ActivityListWrapper>
  );
};

export default ActivityList;
