// TODO : remove eslint-disable after work
/* eslint-disable */
import Header from "@components/common/header/Header";
import { useRouter } from "next/router";
import React, { useState, useCallback, useMemo } from "react";
import { MATH_NEGATIVE_TYPE, SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { type TokenInfo } from "@models/token/token-info";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtomValue } from "jotai";
import { ThemeState, TokenState } from "@states/index";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useGetPoolList } from "src/react-query/pools";
import { PoolModel } from "@models/pool/pool-model";
import { convertToMB } from "@utils/stake-position-utils";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { checkPositivePrice, parseJson } from "@utils/common";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetTokenPrices, useGetTokensList } from "@query/token";

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
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
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
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
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
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
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
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "12.08%",
    },
    fee: "0.03%"
  },
];

const filterByLiquidityPool = (data: Record<string, TokenPriceModel>, targetLiquidityPool?: string): TokenPriceModel | null => {
  const filteredItem = Object.entries(data).find(([key, value]) => value.mostLiquidityPool === targetLiquidityPool);
  return filteredItem ? filteredItem[1] : null;
};

const HeaderContainer: React.FC = () => {
  const { pathname, push } = useRouter();
  const [sideMenuToggle, setSideMenuToggle] = useState(false);
  const [searchMenuToggle, setSearchMenuToggle] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { breakpoint } = useWindowSize();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { account, connected, disconnectWallet, switchNetwork, isSwitchNetwork, loadingConnect } = useWallet();
  const recentsData = useAtomValue(TokenState.recents);
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();

  const { data: poolList = [] } = useGetPoolList({ enabled: !!searchMenuToggle });
  const { data: { tokens: listTokens = [] } = {}, isFetched, error } = useGetTokensList({ enabled: !!searchMenuToggle });
  const { data: tokenPrices = {} } = useGetTokenPrices({ enabled: !!searchMenuToggle });

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
      const filteredItem: TokenPriceModel | null = filterByLiquidityPool(tokenPrices, item.poolPath);

      return {
        path: "",
        searchType: "popular",
        token: {
          path: item.tokenA.path,
          name: item.tokenA.name,
          symbol: getGnotPath(item.tokenA).symbol,
          logoURI: getGnotPath(item.tokenA).logoURI,
        },
        price: `$${convertToMB(filteredItem ? filteredItem.liquidity : "0")}`,
        priceOf1d: {
          status: MATH_NEGATIVE_TYPE.NEGATIVE,
          value: "",
        },
        tokenB: {
          path: item.tokenB.path,
          name: item.tokenB.name,
          symbol: getGnotPath(item.tokenB).symbol,
          logoURI: getGnotPath(item.tokenB).logoURI,
        },
        fee: SwapFeeTierInfoMap[`FEE_${item.fee}` as SwapFeeTierType].rateStr,
        isLiquid: true,
        apr: `${!item.apr ? "-" : Number(item.apr) > 10 ? `${item.apr}% APR` : `${Number(item.apr).toFixed(2)}% APR`}`,
      };
    });
  }, [poolList, keyword, tokenPrices, gnot]);

  const popularTokens = useMemo(() => {
    let temp = listTokens;
    if (keyword) {
      temp = listTokens.filter((item: TokenModel) => (item.name.toLowerCase()).includes(keyword.toLowerCase())
        || (item.symbol.toLowerCase()).includes(keyword.toLowerCase())
        || (item.path.toLowerCase()).includes(keyword.toLowerCase())
      );
    }
    return temp.slice(0, keyword ? 6 : 6 - recents.length).map((item: TokenModel) => {
      const temp: TokenPriceModel = tokenPrices[item.path] ?? {};
      const isGnot = item.path === "gnot";
      const tempWuGnot: TokenPriceModel = tokenPrices[wugnotPath] ?? {};
      const transferData = isGnot ? tempWuGnot : temp;
      const dataToday = checkPositivePrice((transferData.pricesBefore?.latestPrice), (transferData.pricesBefore?.priceToday));
      return {
        path: "",
        searchType: "",
        token: {
          path: item.path,
          name: item.name,
          symbol: item.symbol,
          logoURI: item.logoURI,
        },
        price: `$${convertToMB(transferData.usd || "0", 6)}`,
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
  }, [listTokens, recents.length, keyword, tokenPrices]);

  const { openModal } = useConnectWalletModal();

  const handleESC = () => {
    setKeyword("");
    setSearchMenuToggle(false);
  }
  useEscCloseModal(handleESC);

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

  const movePage = useCallback((path: string) => {
    push(path);
  }, [])

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
      movePage={movePage}
    />
  );
};

export default HeaderContainer;