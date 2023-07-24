import React, { useCallback } from "react";
import {
  SortOption,
  TABLE_HEAD,
  type Activity,
} from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import ActivityInfo from "@components/dashboard/activity-info/ActivityInfo";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  noDataText,
  TableHeader,
  TableWrapper,
} from "./ActivityListTable.styles";
import { ACTIVITY_INFO, ACTIVITY_TD_WIDTH } from "@constants/skeleton.constant";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";

interface ActivityListTableProps {
  activities: Activity[];
  isFetched: boolean;
  isSortOption: (head: TABLE_HEAD) => boolean;
  sortOption?: SortOption;
  sort: (head: TABLE_HEAD) => void;
}

const ActivityListTable: React.FC<ActivityListTableProps> = ({
  activities,
  sortOption,
  isSortOption,
  sort,
  isFetched,
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

  return (
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
          {!isFetched && <TableSkeleton info={ACTIVITY_INFO} />}
        </div>
      </div>
    </TableWrapper>
  );
};

export default ActivityListTable;
