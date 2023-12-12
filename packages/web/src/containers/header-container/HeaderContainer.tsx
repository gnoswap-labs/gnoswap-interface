// TODO : remove eslint-disable after work
/* eslint-disable */
import Header from "@components/common/header/Header";
import { useRouter } from "next/router";
import React, { useState, useCallback, useMemo } from "react";
import { MATH_NEGATIVE_TYPE, SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { type TokenInfo } from "@models/token/token-info";
import { useQuery } from "@tanstack/react-query";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtomValue } from "jotai";
import { CommonState, ThemeState, TokenState } from "@states/index";
import { useAtom } from "jotai";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useGetPoolList } from "src/react-query/pools";
import { useGetTokenPrices, useGetTokensList } from "src/react-query/token";
import { PoolModel } from "@models/pool/pool-model";
import { convertLargePrice } from "@utils/stake-position-utils";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { checkPositivePrice, parseJson } from "@utils/common";

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
  tokenB?: TokenInfo;
  isLiquid?: boolean;
  fee: string;
  apr?: string;
}

export const RecentdummyToken: Token[] = [
  {
    path: Math.floor(Math.random() * 50 + 1).toString(),
    searchType: "recent",
    token: {
      path: "gno.land/r/demo/gns",
      name: "GNS",
      symbol: "APR",
      logoURI: "/gnos.svg",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "52.4",
    },
    tokenB: {
      path: "gno.land/r/demo/gns",
      name: "GNOT",
      symbol: "GNOT",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    },
    fee: "0.03%",
    isLiquid: true,
  },
  {
    path: Math.floor(Math.random() * 50 + 1).toString(),
    searchType: "recent",
    token: {
      path: "gno.land/r/demo/gns",
      name: "GNS",
      symbol: "APR",
      logoURI: "/gnos.svg",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "107.4",
    },
    tokenB: {
      path: "gno.land/r/demo/gns",
      name: "GNOT",
      symbol: "GNOT",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    },
    fee: "0.03%"
  },
  {
    path: Math.floor(Math.random() * 50 + 1).toString(),
    searchType: "recent",
    token: {
      path: "gno.land/r/demo/gns",
      name: "GNS",
      symbol: "APR",
      logoURI: "/gnos.svg",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "31.4",
    },
    tokenB: {
      path: "gno.land/r/demo/gns",
      name: "GNOT",
      symbol: "GNOT",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    },
    fee: "0.03%"
  },
];

export const PopulardummyToken: Token[] = [
  {
    path: Math.floor(Math.random() * 50 + 1).toString(),
    searchType: "popular",
    token: {
      path: "gno.land/r/demo/gns",
      name: "Gnoland",
      symbol: "GNOT",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "12.08%",
    },
    fee: "0.03%"
  },
];

async function fetchTokens(
  keyword: string, // eslint-disable-line
): Promise<Token[]> {
  return new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
    const data = [
      ...RecentdummyToken,
      ...PopulardummyToken,
      ...PopulardummyToken,
    ];
    if (!keyword) return Promise.resolve(data);
    return Promise.resolve(data.filter(item => item.token.name === keyword));
  });
}

const getStatus = (value: string) => {
  if (Number(value ?? 0) < 0) {
    return MATH_NEGATIVE_TYPE.NEGATIVE;
  }
  
  return MATH_NEGATIVE_TYPE.POSITIVE;
};

const HeaderContainer: React.FC = () => {
  const { pathname } = useRouter();
  const [sideMenuToggle, setSideMenuToggle] = useState(false);
  const [searchMenuToggle, setSearchMenuToggle] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { breakpoint } = useWindowSize();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { account, connected, disconnectWallet, switchNetwork, isSwitchNetwork, loadingConnect } = useWallet();
  const recentsData = useAtomValue(TokenState.recents);
  

  const { data: poolList = [] } = useGetPoolList({ enabled: !!searchMenuToggle });
  const { data: { tokens: listTokens = []  } = {} } = useGetTokensList({ enabled: !!searchMenuToggle });
  const { data: { prices = [] } = {} } = useGetTokenPrices({ enabled: !!searchMenuToggle });
  
  const recents = useMemo(() => {
    return parseJson(recentsData ? recentsData : "[]");
  }, [recentsData]);

  const mostLiquidity = useMemo(() => {
    let temp = poolList;
    if (keyword) {
      temp = poolList.filter((item: PoolModel) => (item.tokenA.name.toLowerCase()).includes(keyword.toLowerCase()) || (item.tokenA.symbol.toLowerCase()).includes(keyword.toLowerCase())
      || (item.tokenB.name.toLowerCase()).includes(keyword.toLowerCase()) || (item.tokenB.symbol.toLowerCase()).includes(keyword.toLowerCase())
      );
    }
    return temp.slice(0, 3).map((item: PoolModel) => {
      const priceItem: TokenPriceModel = prices.filter((price: TokenPriceModel) => price.mostLiquidityPool === item.poolPath)?.[0] ?? {};
      
      return {
        path: "",
        searchType: "popular",
        token: {
          path: item.tokenA.path,
          name: item.tokenA.name,
          symbol: item.tokenA.symbol,
          logoURI: item.tokenA.logoURI,
        },
        price: `$${convertLargePrice(priceItem.liquidity || "0")}`,
        priceOf1d: {
          status: MATH_NEGATIVE_TYPE.NEGATIVE,
          value: "",
        },
        tokenB: {
          path: item.tokenB.path,
          name: item.tokenB.name,
          symbol: item.tokenB.symbol,
          logoURI: item.tokenB.logoURI,
        },
        fee: SwapFeeTierInfoMap[`FEE_${item.fee}` as SwapFeeTierType].rateStr,
        isLiquid: true,
        apr: `${item.apr || 0}`,
      };
    });
  }, [poolList, keyword, prices]);
  
  const popularTokens = useMemo(() => {
    let temp = listTokens;
    if (keyword) {
      temp = listTokens.filter((item: TokenModel) => (item.name.toLowerCase()).includes(keyword.toLowerCase()) 
      || (item.symbol.toLowerCase()).includes(keyword.toLowerCase())
      || (item.path.toLowerCase()).includes(keyword.toLowerCase())
      );
    }
    return temp.slice(0, keyword ? 6 : 6 - recents.length).map((item: TokenModel) => {
      const temp: TokenPriceModel = prices.filter((price: TokenPriceModel) => price.path === item.path)?.[0] ?? {};
      const dataToday = checkPositivePrice((temp.pricesBefore?.latestPrice), (temp.pricesBefore?.priceToday));

      return {
        path: "",
        searchType: "",
        token: {
          path: item.path,
          name: item.name,
          symbol: item.symbol,
          logoURI: item.logoURI,
        },
        price: `$${convertLargePrice(temp.usd || "0", 6)}`,
        priceOf1d: {
          status: dataToday.status,
          value: dataToday.percent !== "-" ? dataToday.percent.replace(/[+-]/g, "") : "0.00%",
        },
        tokenB: {
          path: "",
          name: "",
          symbol: "",
          logoURI: "",
        },
        fee: "",
        isLiquid: false,
      };
    });
  }, [listTokens, recents.length, keyword]);
  
  const { openModal } = useConnectWalletModal();

  const handleESC = () => {
    setKeyword("");
    setSearchMenuToggle(false);
  }
  useEscCloseModal(handleESC);

  const {
    isFetched,
    error,
    data: tokens,
  } = useQuery<Token[], Error>({
    queryKey: ["tokens", keyword],
    queryFn: () => fetchTokens(keyword),
  });

  const onSideMenuToggle = () => {
    setSideMenuToggle(prev => !prev);
  };

  const onSearchMenuToggle = () => {
    setKeyword("");
    setSearchMenuToggle(prev => !prev);
  };

  const search = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  usePreventScroll(searchMenuToggle);

  const handleConnectWallet = useCallback(() => {
    openModal();
  }, [openModal])

  return (
    <Header
      account={account}
      connected={connected}
      connectAdenaClient={handleConnectWallet}
      disconnectWallet={disconnectWallet}
      pathname={pathname}
      sideMenuToggle={sideMenuToggle}
      onSideMenuToggle={onSideMenuToggle}
      searchMenuToggle={searchMenuToggle}
      onSearchMenuToggle={onSearchMenuToggle}
      tokens={[]}
      isFetched={isFetched}
      error={error}
      search={search}
      keyword={keyword}
      breakpoint={breakpoint}
      themeKey={themeKey}
      switchNetwork={switchNetwork}
      isSwitchNetwork={isSwitchNetwork}
      loadingConnect={loadingConnect}
      mostLiquidity={mostLiquidity}
      popularTokens={popularTokens}
      recents={recents}
    />
  );
};

export default HeaderContainer;
