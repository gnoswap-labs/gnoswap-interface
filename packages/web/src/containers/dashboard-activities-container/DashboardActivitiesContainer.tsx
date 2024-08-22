import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ValuesType } from "utility-types";

import ActivityList from "@components/dashboard/activity-list/ActivityList";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { ActivityData } from "@repositories/activity/responses/activity-responses";
import { DexEvent } from "@repositories/common";
import {
  formatOtherPrice,
  formatPoolPairAmount,
} from "@utils/new-number-utils";
import { useGetDashboardActivities } from "@query/dashboard/use-get-dashboard-activities";

dayjs.extend(relativeTime);

export interface Activity {
  action: ReactNode;
  totalValue: string;
  tokenAmountOne: string;
  tokenAmountTwo: string;
  account: string;
  time: string;
  explorerUrl: string;
}

export interface SortOption {
  key: ACTIVITY_TABLE_HEAD;
  direction: "asc" | "desc";
}

export const ACTIVITY_TABLE_HEAD = {
  ACTION: "Dashboard:onchainActi.col.action",
  TOTAL_VALUE: "Dashboard:onchainActi.col.totalVal",
  TOKEN_AMOUNT1: "Dashboard:onchainActi.col.tokenAmt",
  TOKEN_AMOUNT2: "Dashboard:onchainActi.col.tokenAmt",
  ACCOUNT: "Dashboard:onchainActi.col.acc",
  TIME: "Dashboard:onchainActi.col.time",
} as const;
export type ACTIVITY_TABLE_HEAD = ValuesType<typeof ACTIVITY_TABLE_HEAD>;

export const ACTIVITY_TYPE = {
  ALL: "All",
  SWAPS: "Swaps",
  ADDS: "Adds",
  REMOVES: "Removes",
  STAKES: "Stakes",
  UNSTAKE: "Unstakes",
  CLAIM: "Claims",
} as const;

export const ACTIVITY_SWITCH_DATA = [
  { key: ACTIVITY_TYPE.ALL, display: "Dashboard:onchainActi.switch.all" },
  { key: ACTIVITY_TYPE.SWAPS, display: "Dashboard:onchainActi.switch.swap" },
  { key: ACTIVITY_TYPE.ADDS, display: "Dashboard:onchainActi.switch.add" },
  {
    key: ACTIVITY_TYPE.REMOVES,
    display: "Dashboard:onchainActi.switch.remove",
  },
  { key: ACTIVITY_TYPE.STAKES, display: "Dashboard:onchainActi.switch.stake" },
  {
    key: ACTIVITY_TYPE.UNSTAKE,
    display: "Dashboard:onchainActi.switch.unstake",
  },
  {
    key: ACTIVITY_TYPE.CLAIM,
    display: "Dashboard:onchainActi.switch.claim",
  },
];

export type ACTIVITY_TYPE = ValuesType<typeof ACTIVITY_TYPE>;

const replaceToken = (symbol: string) => {
  if (symbol === "wugnot" || symbol === "WGNOT") return "GNOT";
  return symbol;
};

const DashboardActivitiesContainer: React.FC = () => {
  const { t } = useTranslation();
  const [activityType, setActivityType] = useState<ACTIVITY_TYPE>(
    ACTIVITY_TYPE.ALL,
  );
  const { getTxUrl } = useGnoscanUrl();
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
        Object.values(ACTIVITY_TYPE).find(type => type === newType) ||
        ACTIVITY_TYPE["ALL"];
      setActivityType(activityType);
    },
    [],
  );
  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const isSortOption = useCallback((head: ACTIVITY_TABLE_HEAD) => {
    const disableItems = [
      "Action",
      "Total Value",
      "Token amount",
      "Token amount",
      "Account",
      "Time",
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

  const formatActivity = (res: ActivityData): Activity => {
    const explorerUrl = getTxUrl(res?.txHash);
    const tokenASymbol = res.tokenA.symbol;
    const tokenBSymbol = res.tokenB.symbol;
    const shouldShowTokenAAmount =
      res.actionType !== DexEvent.CLAIM ||
      (!!res.tokenAAmount && !!Number(res.tokenAAmount));
    const shouldShowTokenBAmount =
      res.actionType !== DexEvent.CLAIM ||
      (!!res.tokenBAmount && !!Number(res.tokenBAmount));

    const actionText = (() => {
      const action = (() => {
        switch (res.actionType) {
          case DexEvent.SWAP:
            return t("business:onchainActi.action.swap");
          case DexEvent.ADD:
            return t("business:onchainActi.action.add");
          case DexEvent.REMOVE:
            return t("business:onchainActi.action.remove");
          case DexEvent.DECREASE:
            return t("business:onchainActi.action.decrease");
          case DexEvent.INCREASE:
            return t("business:onchainActi.action.increase");
          case DexEvent.REPOSITION:
            return t("business:onchainActi.action.reposition");
          case DexEvent.CLAIM:
            return t("business:onchainActi.action.claimFees");
          case DexEvent.ADD_INCENTIVE:
            return t("business:onchainActi.action.incentivize");
          case DexEvent.STAKE:
            return t("business:onchainActi.action.stake");
          case DexEvent.UNSTAKE:
            return t("business:onchainActi.action.unstake");
          case DexEvent.CLAIM_STAKING:
            return t("business:onchainActi.action.claimRewards");
        }
      })();

      const tokenAText =
        shouldShowTokenAAmount && tokenASymbol
          ? " " + replaceToken(tokenASymbol)
          : "";
      const tokenBText =
        shouldShowTokenBAmount && tokenBSymbol
          ? " " + replaceToken(tokenBSymbol)
          : "";

      const relatedTokens = res.usedTokens || 0;

      let conjunction = "";
      if (relatedTokens === 2 && tokenAText && tokenBText) {
        conjunction = ` ${
          res.actionType === DexEvent.SWAP
            ? t("common:conjunction.for")
            : t("common:conjunction.and")
        }`;
      } else if (relatedTokens > 2) {
        conjunction = ", ";
      }

      const tail = relatedTokens > 2 && ", ...";

      return (
        <span>
          {action}
          <span className="symbol-text">{tokenAText}</span>
          {conjunction}
          <span className="symbol-text">{tokenBText}</span>
          {tail}
        </span>
      );
    })();

    const tokenAAmount =
      tokenASymbol && shouldShowTokenAAmount
        ? `${formatPoolPairAmount(res.tokenAAmount, {
            decimals: res.tokenA.decimals,
          })} ${replaceToken(res.tokenA.symbol)}`
        : "-";

    const tokenBAmount =
      tokenBSymbol && shouldShowTokenBAmount
        ? `${formatPoolPairAmount(res.tokenBAmount, {
            decimals: res.tokenB.decimals,
          })} ${replaceToken(res.tokenB.symbol)}`
        : "-";

    return {
      action: actionText,
      totalValue: formatOtherPrice(res.totalUsd, {
        isKMB: false,
      }),
      tokenAmountOne: tokenAAmount,
      tokenAmountTwo: tokenBAmount,
      account: res.account,
      time: res.time,
      explorerUrl,
    };
  };

  return (
    <ActivityList
      activities={(
        activities.filter(
          item => Number(item.tokenAAmount) || Number(item.tokenBAmount),
        ) ?? []
      ).map(formatActivity)}
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
