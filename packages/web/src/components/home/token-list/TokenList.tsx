// TODO : remove eslint-disable after work
/* eslint-disable */
import React from "react";
import {
  TOKEN_TYPE,
  type Token,
  TABLE_HEAD,
  SortOption,
} from "@containers/token-list-container/TokenListContainer";
import TokenListHeader from "@components/home/token-list-header/TokenListHeader";
import Pagination from "@components/common/pagination/Pagination";
import { wrapper } from "./TokenList.styles";
import TokenListTable from "@components/home/token-list-table/TokenListTable";
import { DEVICE_TYPE } from "@styles/media";

interface TokenItem {
  tokens: Token[];
  isFetched: boolean;
  error: Error | null;
  tokenType?: TOKEN_TYPE;
  sortOption?: SortOption;
  changeTokenType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
  isSortOption: (item: TABLE_HEAD) => boolean;
  sort: (item: TABLE_HEAD) => void;
  breakpoint: DEVICE_TYPE;
  searchIcon: boolean;
  onTogleSearch: () => void;
}

const TokenList: React.FC<TokenItem> = ({
  tokens,
  isFetched,
  error,
  tokenType = TOKEN_TYPE.ALL,
  sortOption,
  changeTokenType,
  search,
  keyword,
  currentPage,
  totalPage,
  movePage,
  isSortOption,
  sort,
  breakpoint,
  searchIcon,
  onTogleSearch,
}) => {
  return (
    <div css={wrapper}>
      <TokenListHeader
        tokenType={tokenType}
        changeTokenType={changeTokenType}
        search={search}
        keyword={keyword}
        breakpoint={breakpoint}
        searchIcon={searchIcon}
        onTogleSearch={onTogleSearch}
      />
      <TokenListTable
        tokens={tokens}
        isFetched={isFetched}
        sortOption={sortOption}
        isSortOption={isSortOption}
        sort={sort}
        breakpoint={breakpoint}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
        siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
      />
    </div>
  );
};

export default TokenList;
