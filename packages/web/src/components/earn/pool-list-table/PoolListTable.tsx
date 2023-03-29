import React from "react";
import {
  Pool,
  TABLE_HEAD,
  TD_WIDTH,
} from "@containers/pool-list-container/PoolListContainer";
import PoolInfo from "@components/earn/pool-info/PoolInfo";
import { noDataText, TableColumn, TableWrapper } from "./PoolListTable.styles";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
interface PoolListTableProps {
  pools: Pool[];
  isFetched: boolean;
  onClickTableHead: (head: TABLE_HEAD) => void;
}

const PoolListTable: React.FC<PoolListTableProps> = ({
  pools,
  onClickTableHead,
  isFetched,
}) => {
  return (
    <TableWrapper>
      <div className="pool-list-head">
        {Object.values(TABLE_HEAD).map((head, idx) => (
          <TableColumn
            key={idx}
            className={cx([0].includes(idx) && "left")}
            onClick={() => onClickTableHead(head)}
            tdWidth={TD_WIDTH[idx]}
          >
            <span>{head}</span>
          </TableColumn>
        ))}
      </div>
      <div className="pool-list-body">
        {isFetched && !Boolean(pools.length) && (
          <div css={noDataText}>No pools found</div>
        )}
        {isFetched &&
          Boolean(pools.length) &&
          pools.map((pool, idx) => (
            <PoolInfo pool={pool} key={idx} tdWidth={TD_WIDTH[idx]} />
          ))}
        {!isFetched && <TableSkeleton />}
      </div>
    </TableWrapper>
  );
};

export default PoolListTable;
