import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ValuesType } from "utility-types";
import ActivityList from "@components/dashboard/activity-list/ActivityList";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import {
  OnchainActivityData,
  OnchainActivityResponse,
} from "@repositories/dashboard/response/onchain-response";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import { prettyNumber, prettyNumberFloatInteger } from "@utils/number-utils";
import { useLoading } from "@hooks/common/use-loading";
dayjs.extend(relativeTime);

export interface Activity {
  action: string;
  totalValue: string;
  tokenAmountOne: string;
  tokenAmountTwo: string;
  account: string;
  time: string;
  explorerUrl: string;
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

// const SORT_PARAMS: { [key in TABLE_HEAD]: string } = {
//   Action: "action",
//   "Total Value": "total_value",
//   "Token amount": "token_amount",
//   "Token amount ": "token_amount ",
//   Account: "Account",
//   Time: "Time",
// };

export const dummyTokenList: Activity[] = [
  {
    action: "Add GNOT and GNS",
    totalValue: "$12,090",
    tokenAmountOne: "100 ATOM",
    tokenAmountTwo: "19 GNS",
    account: "g129kua...ndsu12",
    time: "less than a minute ago",
    explorerUrl:
      "https://gnoscan.io/transactions/details?txhash=hNaBGE2oDb15Q08y68wpycjwwGaCcXcU2jnrRRfuUo0%3D",
  },
];

// async function fetchActivities(
//   type: ACTIVITY_TYPE, // eslint-disable-line
//   page: number, // eslint-disable-line
//   sortKey?: string, // eslint-disable-line
//   direction?: string, // eslint-disable-line
// ): Promise<Activity[]> {
//   return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
//     Promise.resolve([
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//       ...dummyTokenList,
//     ]),
//   );
// }

const replaceToken = (symbol: string) => {
  if (symbol === "WGNOT") return "GNOT";
  return symbol;
};

const DashboardActivitiesContainer: React.FC = () => {
  const [activityType, setActivityType] = useState<ACTIVITY_TYPE>(
    ACTIVITY_TYPE.ALL,
  );
  const { dashboardRepository } = useGnoswapContext();
  const [page, setPage] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>();
  const { breakpoint } = useWindowSize();
  const { isLoadingCommon } = useLoading();

  const {
    isFetched,
    error,
    data: activities,
  } = useQuery<OnchainActivityResponse, Error>({
    queryKey: [
      "activities",
      activityType,
      page,
      sortOption?.key,
      sortOption?.direction,
    ],
    queryFn: () =>
      dashboardRepository.getDashboardOnchainActivity({ type: activityType }),
      refetchInterval: 60 * 1000,
  });

  const changeActivityType = useCallback((newType: string) => {
    const activityType =
      Object.values(ACTIVITY_TYPE).find(type => type === newType) ||
      ACTIVITY_TYPE["ALL"];
    setActivityType(activityType);
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

  const capitalizeFirstLetter = (input: string) => {
    const str = input.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatActivity = (res: OnchainActivityData): Activity => {
    const explorerUrl = `https://gnoscan.io/transactions/details?txhash=${res.txHash}`;
    return {
      action: `${capitalizeFirstLetter(res.actionType)} ${replaceToken(
        res.token0.symbol,
      )} ${res.actionType === "SWAP" ? "for" : "and"} ${replaceToken(res.token1.symbol)}`,
      totalValue: `$${prettyNumber(res.totalUsdValue)}`,
      tokenAmountOne: `${prettyNumberFloatInteger(res.token0Amount, true)} ${replaceToken(
        res.token0.symbol,
      )}`,
      tokenAmountTwo: `${prettyNumberFloatInteger(res.token1Amount, true)} ${replaceToken(
        res.token1.symbol,
      )}`,
      account: res.account,
      time: res.time,
      explorerUrl,
    };
  };

  return (
    <ActivityList
      activities={(activities ?? []).slice(0, 30).map(x => formatActivity(x))}
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
