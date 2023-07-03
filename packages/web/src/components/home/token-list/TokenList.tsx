// TODO : remove eslint-disable after work
/* eslint-disable */
import React from "react";
import {
  TOKEN_TYPE,
  type Token,
  TABLE_HEAD,
} from "@containers/token-list-container/TokenListContainer";
import TokenListHeader from "@components/home/token-list-header/TokenListHeader";
import Pagination from "@components/common/pagination/Pagination";
import { wrapper } from "./TokenList.styles";
import TokenListTable from "@components/home/token-list-table/TokenListTable";

interface TokenItem {
  tokens: Token[];
  isFetched: boolean;
  error: Error | null;
  tokenType?: TOKEN_TYPE;
  changeTokenType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
}

const TokenList: React.FC<TokenItem> = ({
  tokens,
  isFetched,
  error,
  tokenType = TOKEN_TYPE.ALL,
  changeTokenType,
  search,
  keyword,
  currentPage,
  totalPage,
  movePage,
}) => {
  const onClickTableHead = (item: TABLE_HEAD) => {
    // TODO: Sorting pools list
  };

  return (
    <div css={wrapper}>
      <TokenListHeader
        tokenType={tokenType}
        changeTokenType={changeTokenType}
        search={search}
        keyword={keyword}
      />
      <TokenListTable
        tokens={tokens}
        isFetched={isFetched}
        onClickTableHead={onClickTableHead}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
      />
    </div>
  );
};

export default TokenList;
