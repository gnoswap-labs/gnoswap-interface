import {
  SortOption,
  TABLE_HEAD,
  TABLE_HEAD_MOBILE,
  type Token,
} from "@containers/token-list-container/TokenListContainer";
import React, { useCallback } from "react";
import TokenInfo from "@components/home/token-info/TokenInfo";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  noDataText,
  TableHeader,
  MobileTableHeader,
  TableWrapper,
} from "./TokenListTable.styles";
import {
  TOKEN_INFO,
  MOBILE_TOKEN_INFO,
  TOKEN_TD_WIDTH,
  MOBILE_TOKEN_TD_WIDTH,
} from "@constants/skeleton.constant";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import { DEVICE_TYPE } from "@styles/media";
import MobileTokenInfo from "../mobile-token-info/MobileTokenInfo";

interface TokenListTableProps {
  tokens: Token[];
  isFetched: boolean;
  isSortOption: (head: TABLE_HEAD) => boolean;
  sortOption?: SortOption;
  sort: (head: TABLE_HEAD) => void;
  breakpoint: DEVICE_TYPE;
}

const TokenListTable: React.FC<TokenListTableProps> = ({
  tokens,
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
    return TABLE_HEAD.INDEX === head || TABLE_HEAD.NAME === head;
  };

  return breakpoint !== DEVICE_TYPE.MOBILE ? (
    <TableWrapper className={tokens.length === 0 ? "hidden-scroll" : ""}>
      <div className="scroll-wrapper">
        <div className="token-list-head">
          {Object.values(TABLE_HEAD).map((head, idx) => (
            <TableHeader
              key={idx}
              className={cx(
                idx >= 7
                  ? "right-padding-12"
                  : idx >= 2
                  ? "right-padding-16"
                  : idx === 1
                  ? "left-padding"
                  : "",
                {
                  left: isAlignLeft(head),
                  sort: isSortOption(head),
                },
              )}
              tdWidth={TOKEN_TD_WIDTH[idx]}
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
        <div className="token-list-body">
          {isFetched && tokens.length === 0 && (
            <div css={noDataText}>No tokens found</div>
          )}
          {isFetched &&
            tokens.length > 0 &&
            tokens.map((item, idx) => (
              <TokenInfo item={item} idx={item.idx + 1} key={idx} />
            ))}
          {!isFetched && <TableSkeleton info={TOKEN_INFO} />}
        </div>
      </div>
    </TableWrapper>
  ) : (
    <TableWrapper>
      <div className="scroll-wrapper">
        <div className="token-list-head">
          {Object.values(TABLE_HEAD_MOBILE).map((head, idx) => (
            <MobileTableHeader
              key={idx}
              className={cx({
                left: isAlignLeft(head),
                sort: isSortOption(head),
              })}
              tdWidth={MOBILE_TOKEN_TD_WIDTH[idx]}
            >
              <span
                className={Object.keys(TABLE_HEAD_MOBILE)[idx].toLowerCase()}
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
        <div className="token-list-body">
          {isFetched && tokens.length === 0 && (
            <div css={noDataText}>No tokens found</div>
          )}
          {isFetched &&
            tokens.length > 0 &&
            tokens.map((item, idx) => (
              <MobileTokenInfo item={item} idx={item.idx + 1} key={idx} />
            ))}
          {!isFetched && <TableSkeleton info={MOBILE_TOKEN_INFO} />}
        </div>
      </div>
    </TableWrapper>
  );
};

export default TokenListTable;
