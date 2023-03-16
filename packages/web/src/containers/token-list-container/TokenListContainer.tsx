import TokenList from "@components/home/token-list/TokenList";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { ValuesType } from "utility-types";

export interface Token {
  id: string;
}

export const TOKEN_TYPE = {
  ALL: "all",
  GRC20: "grc20",
} as const;

export type TOKEN_TYPE = ValuesType<typeof TOKEN_TYPE>;

async function fetchTokens(
  type: TOKEN_TYPE,
  page: number,
  keyword: string,
): Promise<Token[]> {
  console.debug("fetchTokens", type, page, keyword);
  return Promise.resolve([{ id: "BTC" }, { id: "GNOS" }]);
}

const TokenListContainer: React.FC = () => {
  const [tokenType, setTokenType] = useState<TOKEN_TYPE>(TOKEN_TYPE.ALL);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");

  const changeTokenType = useCallback((newTokenType: TOKEN_TYPE) => {
    setTokenType(newTokenType);
  }, []);

  const {
    isLoading,
    error,
    data: tokens,
  } = useQuery<Token[], Error>({
    queryKey: ["tokens", tokenType, page, keyword],
    queryFn: () => fetchTokens(tokenType, page, keyword),
  });

  const search = useCallback((searchKeyword: string) => {
    setKeyword(searchKeyword);
  }, []);

  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <TokenList
      tokens={tokens}
      isLoading={isLoading}
      error={error}
      tokenType={tokenType}
      changeTokenType={changeTokenType}
      search={search}
      currentPage={page}
      totalPage={10}
      movePage={movePage}
    />
  );
};

export default TokenListContainer;
