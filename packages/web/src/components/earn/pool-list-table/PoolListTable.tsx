import React, { useCallback } from "react";
import {
  PoolSortOption,
  TABLE_HEAD,
} from "@containers/pool-list-container/PoolListContainer";
import PoolInfo from "@components/earn/pool-info/PoolInfo";
import { noDataText, TableColumn, TableWrapper } from "./PoolListTable.styles";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import { POOL_INFO, POOL_TD_WIDTH } from "@constants/skeleton.constant";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { PoolListInfo } from "@models/pool/info/pool-list-info";

interface PoolListTableProps {
  pools: PoolListInfo[];
  isFetched: boolean;
  sortOption: PoolSortOption | undefined;
  sort: (head: TABLE_HEAD) => void;
  isSortOption: (head: TABLE_HEAD) => boolean;
  routeItem: (id: string) => void;
}

const PoolListTable: React.FC<PoolListTableProps> = ({
  pools,
  isFetched,
  sortOption,
  sort,
  isSortOption,
  routeItem,
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
    return TABLE_HEAD.POOL_NAME === head;
  };

  return (
    <TableWrapper>
      <div className="pool-list-head">
        {Object.values(TABLE_HEAD).map((head, idx) => (
          <TableColumn
            key={idx}
            className={cx({
              left: isAlignLeft(head),
              sort: isSortOption(head),
            })}
            tdWidth={POOL_TD_WIDTH[idx]}
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
          </TableColumn>
        ))}
      </div>
      <div className="pool-list-body">
        {isFetched && pools.length === 0 && (
          <div css={noDataText}>No pools found</div>
        )}
        {isFetched &&
          pools.length > 0 &&
          pools.map((pool, idx) => (
            <PoolInfo pool={pool} key={idx} routeItem={routeItem} />
          ))}
        {!isFetched && <TableSkeleton info={POOL_INFO} />}
      </div>
    </TableWrapper>
  );
};

export default PoolListTable;
