import { type Token } from "@containers/token-list-container/TokenListContainer";
import { css } from "@emotion/react";
import React from "react";
import TokenInfo from "@components/home/token-info/TokenInfo";

interface PoolListTableProps {
  pools: Token[] | undefined;
}

const PoolListTable: React.FC<PoolListTableProps> = ({ pools }) => {
  return (
    <div
      css={css`
        border: 1px solid green;
      `}
    >
      {pools === undefined && <div>loading...</div>}
      {pools !== undefined &&
        pools.map(pool => <TokenInfo {...pool} key={pool.id} />)}
    </div>
  );
};

export default PoolListTable;
