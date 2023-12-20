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
import { useGetTokenPrices, useGetTokensList } from "@query/token";
import { PoolModel } from "@models/pool/pool-model";
import { convertLargePrice } from "@utils/stake-position-utils";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { checkPositivePrice, parseJson } from "@utils/common";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

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
  const { pathname, push } = useRouter();
  const [sideMenuToggle, setSideMenuToggle] = useState(false);
  const [searchMenuToggle, setSearchMenuToggle] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [faucetLoading, setFaucetLoading] = useState(false);
  const { breakpoint } = useWindowSize();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { account, connected, disconnectWallet, switchNetwork, isSwitchNetwork, loadingConnect } = useWallet();
  const recentsData = useAtomValue(TokenState.recents);
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();

  const { faucetRepository } = useGnoswapContext();

  const { data: poolList = [] } = useGetPoolList({ enabled: !!searchMenuToggle });
  const { data: { tokens: listTokens = [] } = {} } = useGetTokensList({ enabled: !!searchMenuToggle });
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
          symbol: getGnotPath(item.tokenA).symbol,
          logoURI: getGnotPath(item.tokenA).logoURI,
        },
        price: `$${convertLargePrice(priceItem.liquidity || "0")}`,
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
  }, [poolList, keyword, prices, gnot]);

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
      const isGnot = item.path === "gnot";
      const tempWuGnot: TokenPriceModel = prices.filter((price: TokenPriceModel) => price.path === wugnotPath)?.[0] ?? {};
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
        price: `$${convertLargePrice(transferData.usd || "0", 6)}`,
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
  }, [listTokens, recents.length, keyword, prices]);

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

  const movePage = useCallback((path: string) => {
    push(path);
  }, [])

  const faucet = () => {
    if (!account?.address || faucetLoading) {
      return;
    }
    setFaucetLoading(true);
    faucetRepository.faucetGNOT(account.address)
      .then(() =>
        setTimeout(() => faucetRepository.faucetTokens(account.address)
          .finally(() => setFaucetLoading(false)), 1000))

  };

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
      faucet={faucet}
      faucetLoading={faucetLoading}
    />
  );
};

export default HeaderContainer;