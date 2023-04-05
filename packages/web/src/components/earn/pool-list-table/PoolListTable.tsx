import React from "react";
import {
  Pool,
  TABLE_HEAD,
} from "@containers/pool-list-container/PoolListContainer";
import PoolInfo from "@components/earn/pool-info/PoolInfo";
import { noDataText, TableColumn, TableWrapper } from "./PoolListTable.styles";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import { POOL_INFO, POOL_TD_WIDTH } from "@constants/skeleton.constant";
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
            tdWidth={POOL_TD_WIDTH[idx]}
          >
            <span>{head}</span>
          </TableColumn>
        ))}
      </div>
      <div className="pool-list-body">
        {isFetched && pools.length === 0 && (
          <div css={noDataText}>No pools found</div>
        )}
        {isFetched &&
          pools.length > 0 &&
          pools.map((pool, idx) => <PoolInfo pool={pool} key={idx} />)}
        {!isFetched && <TableSkeleton info={POOL_INFO} />}
      </div>
    </TableWrapper>
  );
};

export default PoolListTable;
