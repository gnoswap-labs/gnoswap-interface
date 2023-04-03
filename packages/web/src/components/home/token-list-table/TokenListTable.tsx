import {
  TABLE_HEAD,
  TD_WIDTH,
  type Token,
} from "@containers/token-list-container/TokenListContainer";
import React from "react";
import TokenInfo from "@components/home/token-info/TokenInfo";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import { noDataText, TableHeader, TableWrapper } from "./TokenListTable.styles";

interface TokenListTableProps {
  tokens: Token[];
  isFetched: boolean;
  onClickTableHead: (head: TABLE_HEAD) => void;
}

const TokenListTable: React.FC<TokenListTableProps> = ({
  tokens,
  onClickTableHead,
  isFetched,
}) => {
  return (
    <TableWrapper>
      <div className="token-list-head">
        {Object.values(TABLE_HEAD).map((head, idx) => (
          <TableHeader
            key={idx}
            className={cx({ left: [0, 1].includes(idx) })}
            onClick={() => onClickTableHead(head)}
            tdWidth={TD_WIDTH[idx]}
          >
            <span className={Object.keys(TABLE_HEAD)[idx].toLowerCase()}>
              {head}
            </span>
          </TableHeader>
        ))}
      </div>
      <div className="token-list-body">
        {isFetched && !Boolean(tokens.length) && (
          <div css={noDataText}>No tokens found</div>
        )}
        {isFetched &&
          Boolean(tokens.length) &&
          tokens.map((item, idx) => (
            <TokenInfo item={item} idx={idx + 1} key={idx} />
          ))}
        {!isFetched && <TableSkeleton />}
      </div>
    </TableWrapper>
  );
};

export default TokenListTable;
