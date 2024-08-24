import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useCallback, useState } from "react";

import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGetDashboardActivities } from "@query/dashboard/use-get-dashboard-activities";
import { ActivityType } from "@repositories/dashboard";

import {
  ACTIVITY_TABLE_HEAD,
  SortOption,
} from "../../components/activity-list/activity-list-table/ActivityListTable";
import ActivityList from "../../components/activity-list/ActivityList";

dayjs.extend(relativeTime);

const DashboardActivitiesContainer: React.FC = () => {
  const [activityType, setActivityType] = useState<ActivityType>(
    ActivityType.ALL,
  );
  const [page, setPage] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>();
  const { breakpoint } = useWindowSize();
  const { isLoading: isLoadingCommon } = useLoading();

  const {
    isFetched,
    error,
    data: activities = [],
  } = useGetDashboardActivities(activityType);

  const changeActivityType = useCallback(
    ({ key: newType }: { display: string; key: string }) => {
      const activityType =
        Object.values(ActivityType).find(type => type === newType) ||
        ActivityType.ALL;
      setActivityType(activityType);
    },
    [],
  );
  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const isSortOption = useCallback((head: ACTIVITY_TABLE_HEAD) => {
    const disableItems = [
      ACTIVITY_TABLE_HEAD.ACTION,
      ACTIVITY_TABLE_HEAD.TOTAL_VALUE,
      ACTIVITY_TABLE_HEAD.TOKEN_AMOUNT1,
      ACTIVITY_TABLE_HEAD.TOKEN_AMOUNT2,
      ACTIVITY_TABLE_HEAD.ACCOUNT,
      ACTIVITY_TABLE_HEAD.TIME,
    ];
    return !disableItems.includes(head);
  }, []);

  const sort = useCallback(
    (item: ACTIVITY_TABLE_HEAD) => {
      const key = item;
      const direction =
        sortOption?.key !== item
          ? "desc"
          : sortOption.direction === "asc"
          ? "desc"
          : "asc";

      setSortOption({
        key,
        direction,
      });
    },
    [sortOption],
  );

  return (
    <ActivityList
      activities={
        activities.filter(
          item => Number(item.tokenAAmount) || Number(item.tokenBAmount),
        ) ?? []
      }
      isFetched={isFetched && !isLoadingCommon}
      error={error}
      activityType={activityType}
      sortOption={sortOption}
      changeActivityType={changeActivityType}
      currentPage={page}
      totalPage={100}
      movePage={movePage}
      isSortOption={isSortOption}
      sort={sort}
      breakpoint={breakpoint}
    />
  );
};

export default DashboardActivitiesContainer;
