import { cx } from "@emotion/css";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ValuesType } from "utility-types";

import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  ACTIVITY_INFO,
  MOBILE_ACTIVITY_INFO,
} from "@constants/skeleton.constant";
import { DEVICE_TYPE } from "@styles/media";
import { ActivityData } from "@repositories/activity/responses/activity-responses";

import ActivityInfo, { MobileActivityInfo } from "./activity-info/ActivityInfo";

import {
  MobileTableHeader,
  noDataText,
  TableHeader,
  TableWrapper,
} from "./ActivityListTable.styles";

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

interface ActivityListTableProps {
  activities: ActivityData[];
  isFetched: boolean;
  isSortOption: (head: ACTIVITY_TABLE_HEAD) => boolean;
  sortOption?: SortOption;
  sort: (head: ACTIVITY_TABLE_HEAD) => void;
  breakpoint: DEVICE_TYPE;
}

const ActivityListTable: React.FC<ActivityListTableProps> = ({
  activities,
  sortOption,
  isSortOption,
  sort,
  isFetched,
  breakpoint,
}) => {
  const { t } = useTranslation();

  const isAscendingOption = useCallback(
    (head: ACTIVITY_TABLE_HEAD) => {
      return sortOption?.key === head && sortOption.direction === "asc";
    },
    [sortOption],
  );

  const isDescendingOption = useCallback(
    (head: ACTIVITY_TABLE_HEAD) => {
      return sortOption?.key === head && sortOption.direction === "desc";
    },
    [sortOption],
  );

  const onClickTableHead = (head: ACTIVITY_TABLE_HEAD) => {
    if (!isSortOption(head)) {
      return;
    }
    sort(head);
  };

  const isAlignLeft = (head: ACTIVITY_TABLE_HEAD) => {
    return ACTIVITY_TABLE_HEAD.ACTION === head;
  };

  return breakpoint !== DEVICE_TYPE.MOBILE ? (
    <TableWrapper>
      <div className="scroll-wrapper">
        <div className="activity-list-head">
          {Object.values(ACTIVITY_TABLE_HEAD).map((head, idx) => (
            <TableHeader
              key={idx}
              className={cx({
                left: isAlignLeft(head),
                sort: isSortOption(head),
              })}
              tdWidth={ACTIVITY_INFO.list[idx].width}
            >
              <span
                className={Object.keys(ACTIVITY_TABLE_HEAD)[idx].toLowerCase()}
                onClick={() => onClickTableHead(head)}
              >
                {isAscendingOption(head) && (
                  <IconTriangleArrowUp className="icon asc" />
                )}
                {isDescendingOption(head) && (
                  <IconTriangleArrowDown className="icon desc" />
                )}
                {t(head)}
              </span>
            </TableHeader>
          ))}
        </div>
        <div className="activity-list-body">
          {isFetched && activities.length === 0 && (
            <div css={noDataText}>{t("Dashboard:onchainActi.data.empty")}</div>
          )}
          {isFetched &&
            activities.length > 0 &&
            activities.map((item, idx) => (
              <ActivityInfo item={item} idx={idx + 1} key={idx} />
            ))}
          {!isFetched && (
            <TableSkeleton info={ACTIVITY_INFO} className="activity-table" />
          )}
        </div>
      </div>
    </TableWrapper>
  ) : (
    <TableWrapper>
      <div className="scroll-wrapper">
        <div className="activity-list-head">
          {Object.values(ACTIVITY_TABLE_HEAD).map((head, idx) => (
            <MobileTableHeader
              key={idx}
              className={cx({
                left: isAlignLeft(head),
                sort: isSortOption(head),
              })}
              tdWidth={MOBILE_ACTIVITY_INFO.list[idx].width}
            >
              <span
                className={Object.keys(ACTIVITY_TABLE_HEAD)[idx].toLowerCase()}
                onClick={() => onClickTableHead(head)}
              >
                {isAscendingOption(head) && (
                  <IconTriangleArrowUp className="icon asc" />
                )}
                {isDescendingOption(head) && (
                  <IconTriangleArrowDown className="icon desc" />
                )}
                {t(head)}
              </span>
            </MobileTableHeader>
          ))}
        </div>
        <div className="activity-list-body">
          {isFetched && activities.length === 0 && (
            <div css={noDataText}>{t("Dashboard:onchainActi.data.empty")}</div>
          )}
          {isFetched &&
            activities.length > 0 &&
            activities.map((item, idx) => (
              <MobileActivityInfo item={item} idx={idx + 1} key={idx} />
            ))}
          {!isFetched && (
            <TableSkeleton
              info={MOBILE_ACTIVITY_INFO}
              className="activity-table"
            />
          )}
        </div>
      </div>
    </TableWrapper>
  );
};

export default ActivityListTable;
