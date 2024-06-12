import React, { useCallback } from "react";
import {
  SortOption,
  TABLE_HEAD,
  type Activity,
} from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import ActivityInfo, {
  MobileActivityInfo,
} from "@components/dashboard/activity-info/ActivityInfo";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  noDataText,
  TableHeader,
  TableWrapper,
  MobileTableHeader,
} from "./ActivityListTable.styles";
import {
  ACTIVITY_INFO,
  ACTIVITY_TD_WIDTH,
  MOBILE_ACTIVITY_INFO,
  MOBILE_ACTIVITY_TD_WIDTH,
} from "@constants/skeleton.constant";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import { DEVICE_TYPE } from "@styles/media";

interface ActivityListTableProps {
  activities: Activity[];
  isFetched: boolean;
  isSortOption: (head: TABLE_HEAD) => boolean;
  sortOption?: SortOption;
  sort: (head: TABLE_HEAD) => void;
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
  const isAscendingOption = useCallback(
    (head: TABLE_HEAD) => {
      return sortOption?.key === head && sortOption.direction === "asc";
    },
    [sortOption],
  );

  const isDescendingOption = useCallback(
    (head: TABLE_HEAD) => {
      return sortOption?.key === head && sortOption.direction === "desc";
    },
    [sortOption],
  );

  const onClickTableHead = (head: TABLE_HEAD) => {
    if (!isSortOption(head)) {
      return;
    }
    sort(head);
  };

  const isAlignLeft = (head: TABLE_HEAD) => {
    return TABLE_HEAD.ACTION === head;
  };

  return breakpoint !== DEVICE_TYPE.MOBILE ? (
    <TableWrapper>
      <div className="scroll-wrapper">
        <div className="activity-list-head">
          {Object.values(TABLE_HEAD).map((head, idx) => (
            <TableHeader
              key={idx}
              className={cx({
                left: isAlignLeft(head),
                sort: isSortOption(head),
              })}
              tdWidth={ACTIVITY_TD_WIDTH[idx]}
            >
              <span
                className={Object.keys(TABLE_HEAD)[idx].toLowerCase()}
                onClick={() => onClickTableHead(head)}
              >
                {isAscendingOption(head) && (
                  <IconTriangleArrowUp className="icon asc" />
                )}
                {isDescendingOption(head) && (
                  <IconTriangleArrowDown className="icon desc" />
                )}
                {head}
              </span>
            </TableHeader>
          ))}
        </div>
        <div className="activity-list-body">
          {isFetched && activities.length === 0 && (
            <div css={noDataText}>No tokens found</div>
          )}
          {isFetched &&
            activities.length > 0 &&
            activities.map((item, idx) => (
              <ActivityInfo item={item} idx={idx + 1} key={idx} />
            ))}
          {!isFetched && <TableSkeleton info={ACTIVITY_INFO} className="activity-table" />}
        </div>
      </div>
    </TableWrapper>
  ) : (
    <TableWrapper>
      <div className="scroll-wrapper">
        <div className="activity-list-head">
          {Object.values(TABLE_HEAD).map((head, idx) => (
            <MobileTableHeader
              key={idx}
              className={cx({
                left: isAlignLeft(head),
                sort: isSortOption(head),
              })}
              tdWidth={MOBILE_ACTIVITY_TD_WIDTH[idx]}
            >
              <span
                className={Object.keys(TABLE_HEAD)[idx].toLowerCase()}
                onClick={() => onClickTableHead(head)}
              >
                {isAscendingOption(head) && (
                  <IconTriangleArrowUp className="icon asc" />
                )}
                {isDescendingOption(head) && (
                  <IconTriangleArrowDown className="icon desc" />
                )}
                {head}
              </span>
            </MobileTableHeader>
          ))}
        </div>
        <div className="activity-list-body">
          {isFetched && activities.length === 0 && (
            <div css={noDataText}>No tokens found</div>
          )}
          {isFetched &&
            activities.length > 0 &&
            activities.map((item, idx) => (
              <MobileActivityInfo item={item} idx={idx + 1} key={idx} />
            ))}
          {!isFetched && <TableSkeleton info={MOBILE_ACTIVITY_INFO} className="activity-table" />}
        </div>
      </div>
    </TableWrapper>
  );
};

export default ActivityListTable;
