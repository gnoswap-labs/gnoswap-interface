import {
  type TOKEN_TYPE,
  type Token,
} from "@containers/token-list-container/TokenListContainer";
import React from "react";
import TokenListHeader from "@components/home/token-list-header/TokenListHeader";
import TokenListTable from "@components/home/token-list-table/TokenListTable";
import Pagination from "@components/common/pagination/Pagination";

interface TokenListProps {
  tokens: Token[] | undefined;
  isLoading: boolean;
  error: Error | null;
  tokenType: TOKEN_TYPE;
  changeTokenType: (newTokenType: TOKEN_TYPE) => void;
  search: (keyword: string) => void;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
}

const TokenList: React.FC<TokenListProps> = ({
  tokens,
  isLoading,
  error,
  tokenType,
  changeTokenType,
  search,
  currentPage,
  totalPage,
  movePage,
}) => {
  return (
    <div>
      <TokenListHeader
        tokenType={tokenType}
        changeTokenType={changeTokenType}
        search={search}
      />
      <TokenListTable tokens={tokens} />
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={movePage}
      />
    </div>
  );
};

export default TokenList;
