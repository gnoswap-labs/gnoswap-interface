// TODO : remove eslint-disable after work
/* eslint-disable */
import Header from "@components/common/header/Header";
import { useRouter } from "next/router";
import React, { useState, useCallback, useEffect } from "react";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { type TokenInfo } from "@models/token/token-info";
import { useQuery } from "@tanstack/react-query";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";

interface NegativeStatusType {
  status: MATH_NEGATIVE_TYPE;
  value: string;
}
export interface Token {
  path: string;
  searchType: string;
  token: TokenInfo;
  price: string;
  priceOf1d: NegativeStatusType;
}

export const RecentdummyToken: Token[] = [
  {
    path: Math.floor(Math.random() * 50 + 1).toString(),
    searchType: "recent",
    token: {
      path: "1",
      name: "Bitcoin",
      symbol: "BTC",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "12.08%",
    },
  },
];

export const PopulardummyToken: Token[] = [
  {
    path: Math.floor(Math.random() * 50 + 1).toString(),
    searchType: "popular",
    token: {
      path: "2",
      name: "Gnoland",
      symbol: "GNOT",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "12.08%",
    },
  },
];

async function fetchTokens(
  keyword: string, // eslint-disable-line
): Promise<Token[]> {
  return new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
    const data = [
      ...RecentdummyToken,
      ...RecentdummyToken,
      ...RecentdummyToken,
      ...PopulardummyToken,
      ...PopulardummyToken,
    ];
    if (!keyword) return Promise.resolve(data);
    return Promise.resolve(data.filter(item => item.token.name === keyword));
  });
}

const HeaderContainer: React.FC = () => {
  const { pathname } = useRouter();
  const [sideMenuToggle, setSideMenuToggle] = useState(false);
  const [searchMenuToggle, setSearchMenuToggle] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { breakpoint } = useWindowSize();
  const { account, connected, initSession, connectAdenaClient } = useWallet();
  const themeKey = useAtomValue(ThemeState.themeKey);

  const {
    isFetched,
    error,
    data: tokens,
  } = useQuery<Token[], Error>({
    queryKey: ["tokens", keyword],
    queryFn: () => fetchTokens(keyword),
  });

  useEffect(() => {
    if (window?.adena) {
      initSession();
    }
  }, []);

  const onSideMenuToggle = () => {
    setSideMenuToggle(prev => !prev);
  };

  const onSearchMenuToggle = () => {
    setSearchMenuToggle(prev => !prev);
  };

  const search = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  useEffect(() => {
    if (searchMenuToggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [searchMenuToggle]);

  return (
    <Header
      account={account}
      connected={connected}
      connectAdenaClient={connectAdenaClient}
      pathname={pathname}
      sideMenuToggle={sideMenuToggle}
      onSideMenuToggle={onSideMenuToggle}
      searchMenuToggle={searchMenuToggle}
      onSearchMenuToggle={onSearchMenuToggle}
      tokens={tokens ?? []}
      isFetched={isFetched}
      error={error}
      search={search}
      keyword={keyword}
      breakpoint={breakpoint}
      themeKey={themeKey}
    />
  );
};

export default HeaderContainer;
