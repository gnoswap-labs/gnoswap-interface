import {
  SortOption,
  TABLE_HEAD,
  type Token,
} from "@containers/token-list-container/TokenListContainer";
import React, { useCallback } from "react";
import TokenInfo from "@components/home/token-info/TokenInfo";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import { noDataText, TableHeader, TableWrapper } from "./TokenListTable.styles";
import { TOKEN_INFO, TOKEN_TD_WIDTH } from "@constants/skeleton.constant";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";

interface TokenListTableProps {
  tokens: Token[];
  isFetched: boolean;
  isSortOption: (head: TABLE_HEAD) => boolean;
  sortOption?: SortOption;
  sort: (head: TABLE_HEAD) => void;
}

const TokenListTable: React.FC<TokenListTableProps> = ({
  tokens,
  sortOption,
  isSortOption,
  sort,
  isFetched,
}) => {

  const isAscendingOption = useCallback((head: TABLE_HEAD) => {
    return sortOption?.key === head && sortOption.direction === "asc";
  }, [sortOption]);

  const isDescendingOption = useCallback((head: TABLE_HEAD) => {
    return sortOption?.key === head && sortOption.direction === "desc";
  }, [sortOption]);

  const onClickTableHead = (head: TABLE_HEAD) => {
    if (!isSortOption(head)) {
      return;
    }
    sort(head);
  };

  const isAlignLeft = (head: TABLE_HEAD) => {
    return TABLE_HEAD.INDEX === head || TABLE_HEAD.NAME === head;
  };

  return (
    <TableWrapper>
      <div className="scroll-wrapper">
        <div className="token-list-head">
          {Object.values(TABLE_HEAD).map((head, idx) => (
            <TableHeader
              key={idx}
              className={cx({ left: isAlignLeft(head), sort: isSortOption(head) })}
              tdWidth={TOKEN_TD_WIDTH[idx]}
            >
              <span className={Object.keys(TABLE_HEAD)[idx].toLowerCase()} onClick={() => onClickTableHead(head)}>
                {isAscendingOption(head) && <IconTriangleArrowUp className="icon asc" />}
                {isDescendingOption(head) && <IconTriangleArrowDown className="icon desc" />}
                {head}
              </span>
            </TableHeader>
          ))}
        </div>
        <div className="token-list-body">
          {isFetched && tokens.length === 0 && (
            <div css={noDataText}>No tokens found</div>
          )}
          {isFetched &&
            tokens.length > 0 &&
            tokens.map((item, idx) => (
              <TokenInfo item={item} idx={idx + 1} key={idx} />
            ))}
          {!isFetched && <TableSkeleton info={TOKEN_INFO} />}
        </div>
      </div>
    </TableWrapper>
  );
};

export default TokenListTable;
