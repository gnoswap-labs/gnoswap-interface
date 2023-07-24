import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ValuesType } from "utility-types";
import ActivityList from "@components/dashboard/activity-list/ActivityList";

export interface Activity {
  action: string;
  totalValue: string;
  tokenAmountOne: string;
  tokenAmountTwo: string;
  account: string;
  time: string;
}

export interface SortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
}

export const TABLE_HEAD = {
  ACTION: "Action",
  TOTAL_VALUE: "Total Value",
  TOKEN_AMOUNT1: "Token amount",
  TOKEN_AMOUNT2: "Token amount ",
  ACCOUNT: "Account",
  TIME: "Time",
} as const;
export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export const ACTIVITY_TYPE = {
  ALL: "All",
  SWAPS: "Swaps",
  ADDS: "Adds",
  REMOVES: "Removes",
  STAKES: "Stakes",
  UNSTAKE: "Unstakes",
} as const;
export type ACTIVITY_TYPE = ValuesType<typeof ACTIVITY_TYPE>;

const SORT_PARAMS: { [key in TABLE_HEAD]: string } = {
  Action: "action",
  "Total Value": "total_value",
  "Token amount": "token_amount",
  "Token amount ": "token_amount ",
  Account: "Account",
  Time: "Time",
};

export const dummyTokenList: Activity[] = [
  {
    action: "IBC Deposit ATOM",
    totalValue: "$12,090",
    tokenAmountOne: "100 ATOM",
    tokenAmountTwo: "19 GNOS",
    account: "g129kua...ndsu12",
    time: "less than a minute ago",
  },
];

async function fetchActivities(
  type: ACTIVITY_TYPE, // eslint-disable-line
  page: number, // eslint-disable-line
  sortKey?: string, // eslint-disable-line
  direction?: string, // eslint-disable-line
): Promise<Activity[]> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    Promise.resolve([
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
      ...dummyTokenList,
    ]),
  );
}

const DashboardActivitiesContainer: React.FC = () => {
  const [activityType, setActivityType] = useState<ACTIVITY_TYPE>(
    ACTIVITY_TYPE.ALL,
  );
  const [page, setPage] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>();

  const {
    isFetched,
    error,
    data: activities,
  } = useQuery<Activity[], Error>({
    queryKey: [
      "activities",
      activityType,
      page,
      sortOption?.key,
      sortOption?.direction,
    ],
    queryFn: () =>
      fetchActivities(
        activityType,
        page,
        sortOption && SORT_PARAMS[sortOption.key],
        sortOption?.direction,
      ),
  });

  const changeActivityType = useCallback((newType: string) => {
    switch (newType) {
      case ACTIVITY_TYPE.ALL:
        setActivityType(ACTIVITY_TYPE.ALL);
        break;
      case ACTIVITY_TYPE.SWAPS:
        setActivityType(ACTIVITY_TYPE.SWAPS);
        break;
      case ACTIVITY_TYPE.ADDS:
        setActivityType(ACTIVITY_TYPE.ADDS);
        break;
      case ACTIVITY_TYPE.REMOVES:
        setActivityType(ACTIVITY_TYPE.REMOVES);
        break;
      case ACTIVITY_TYPE.STAKES:
        setActivityType(ACTIVITY_TYPE.STAKES);
        break;
      case ACTIVITY_TYPE.UNSTAKE:
        setActivityType(ACTIVITY_TYPE.UNSTAKE);
        break;
      default:
        setActivityType(ACTIVITY_TYPE.ALL);
    }
  }, []);

  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const isSortOption = useCallback((head: TABLE_HEAD) => {
    const disableItems = [
      "Action",
      "Total Value",
      "Token amount",
      "Token amount ",
      "Account",
      "Time",
    ];
    return !disableItems.includes(head);
  }, []);

  const sort = useCallback(
    (item: TABLE_HEAD) => {
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
      activities={activities ?? []}
      isFetched={isFetched}
      error={error}
      activityType={activityType}
      sortOption={sortOption}
      changeActivityType={changeActivityType}
      currentPage={page}
      totalPage={100}
      movePage={movePage}
      isSortOption={isSortOption}
      sort={sort}
    />
  );
};

export default DashboardActivitiesContainer;
