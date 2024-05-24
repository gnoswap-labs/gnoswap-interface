// TODO : remove eslint-disable after work
/* eslint-disable */
import Header from "@components/common/header/Header";
import { useRouter } from "next/router";
import React, { useState, useCallback, useMemo } from "react";
import {
  MATH_NEGATIVE_TYPE,
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
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
import { convertToKMB, convertToMB } from "@utils/stake-position-utils";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { checkPositivePrice, parseJson } from "@utils/common";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetTokenPrices, useGetTokensList } from "@query/token";
import {
  formatUsdNumber3Digits,
  toPriceFormat,
  toUnitFormat,
} from "@utils/number-utils";
import { numberToRate } from "@utils/string-utils";

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
  volume?: string;
  liquidity: number;
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
      logoURI:
        "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    },
    fee: "0.03%",
    isLiquid: true,
    liquidity: 0,
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
      logoURI:
        "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    },
    liquidity: 0,
    fee: "0.03%",
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
      logoURI:
        "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    },
    fee: "0.03%",
    liquidity: 0,
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
      logoURI:
        "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    },
    price: "$12,090.09",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "12.08%",
    },
    fee: "0.03%",
    liquidity: 0,
  },
];

const filterByLiquidityPool = (
  data: Record<string, TokenPriceModel>,
  targetLiquidityPool?: string,
): TokenPriceModel | null => {
  const filteredItem = Object.entries(data).find(
    ([key, value]) => value.mostLiquidityPool === targetLiquidityPool,
  );
  return filteredItem ? filteredItem[1] : null;
};

const HeaderContainer: React.FC = () => {
  const { pathname, push } = useRouter();
  const [sideMenuToggle, setSideMenuToggle] = useState(false);
  const [searchMenuToggle, setSearchMenuToggle] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { breakpoint } = useWindowSize();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const {
    account,
    connected,
    disconnectWallet,
    switchNetwork,
    isSwitchNetwork,
    loadingConnect,
    isLoadingGnotBalance,
    gnotBalance,
  } = useWallet();
  const recentsData = useAtomValue(TokenState.recents);
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();

  const { data: poolList = [] } = useGetPoolList({
    enabled: !!searchMenuToggle,
  });
  const {
    data: { tokens: listTokens = [] } = {},
    isFetched,
    error,
  } = useGetTokensList({ enabled: !!searchMenuToggle });
  const { data: tokenPrices = {} } = useGetTokenPrices({
    enabled: !!searchMenuToggle,
  });
  const recents = useMemo(() => {
    const storageData = parseJson(recentsData ? recentsData : "[]");
    return storageData.map((item: any) => {
      if (!item.isLiquid) {
        const temp: TokenPriceModel = tokenPrices[item?.token?.path] ?? {};
        const isGnot = item?.token?.path === "gnot";
        const tempWuGnot: TokenPriceModel = tokenPrices[wugnotPath] ?? {};
        const transferData = isGnot ? tempWuGnot : temp;
        const dataToday = checkPositivePrice(
          transferData.pricesBefore?.latestPrice,
          transferData.pricesBefore?.priceToday,
        );
        const usdFormat = formatUsdNumber3Digits(transferData.usd);
        const price = toPriceFormat(usdFormat || "0", { usd: true });
        return {
          ...item,
          price: price,
          priceOf1d: {
            status: dataToday.status,
            value:
              dataToday.percent !== "-"
                ? dataToday.percent.replace(/[+-]/g, "")
                : "0.00%",
          },
        };
      } else {
        const item_ = poolList.filter(
          _ =>
            _.tokenA.symbol === item.token.symbol &&
            _.tokenB.symbol === item.tokenB.symbol,
        )?.[0];
        if (!item_) return item;
        const price = toPriceFormat(item_?.tvl || "0", { usd: true });
        return {
          ...item,
          apr: `${
            !item_.apr
              ? "-"
              : Number(item_.apr) > 10
              ? `${item_.apr}% APR`
              : `${Number(item_.apr).toFixed(2)}% APR`
          }`,
          price: price,
        };
      }
    });
  }, [recentsData, poolList, listTokens, tokenPrices]);

  const mostLiquidity = useMemo(() => {
    let temp = poolList;
    if (keyword) {
      temp = poolList.filter(
        (item: PoolModel) =>
          item.tokenA.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.tokenA.symbol.toLowerCase().includes(keyword.toLowerCase()) ||
          item.tokenB.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.tokenB.symbol.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    return temp
      .map((item: PoolModel) => {
        const price = toPriceFormat(item.tvl || "0", { usd: true });
        const aprRate = numberToRate(item.apr);

        return {
          path: "",
          searchType: "popular",
          token: {
            path: item.tokenA.path,
            name: item.tokenA.name,
            symbol: getGnotPath(item.tokenA).symbol,
            logoURI: getGnotPath(item.tokenA).logoURI,
          },
          price: price,
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
          apr: aprRate === "-" ? aprRate : `${aprRate} APR`,
          liquidity: Number(item ? item.tvl : "0"),
        };
      })
      .sort((a, b) => b.liquidity - a.liquidity)
      .slice(0, 3);
  }, [poolList, keyword, tokenPrices, gnot]);

  const popularTokens = useMemo(() => {
    let temp = listTokens;
    if (keyword) {
      temp = listTokens.filter(
        (item: TokenModel) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.symbol.toLowerCase().includes(keyword.toLowerCase()) ||
          item.path.toLowerCase().includes(keyword.toLowerCase()),
      );
    }
    return temp
      .map((item: TokenModel) => {
        const temp: TokenPriceModel = tokenPrices[item.path] ?? {};
        const isGnot = item.path === "gnot";
        const tempWuGnot: TokenPriceModel = tokenPrices[wugnotPath] ?? {};
        const transferData = isGnot ? tempWuGnot : temp;
        const dataToday = checkPositivePrice(
          transferData.pricesBefore?.latestPrice,
          transferData.pricesBefore?.priceToday,
        );
        const usdFormat = formatUsdNumber3Digits(transferData.usd);
        const price = toPriceFormat(usdFormat || "0", { usd: true });

        return {
          path: "",
          searchType: "",
          token: {
            path: item.path,
            name: item.name,
            symbol: item.symbol,
            logoURI: item.logoURI,
          },
          price: price,
          priceOf1d: {
            status: dataToday.status,
            value:
              dataToday.percent !== "-"
                ? dataToday.percent.replace(/[+-]/g, "")
                : "0.00%",
          },
          tokenB: {
            path: "",
            name: "",
            symbol: "",
            logoURI: "",
          },
          fee: "",
          isLiquid: false,
          volume: transferData.volume ?? "0",
          liquidity: 0,
        };
      })
      .sort((a, b) => Number(b.volume) - Number(a.volume))
      .slice(0, keyword ? 6 : 6 - recents.length);
  }, [listTokens, recents.length, keyword, tokenPrices]);

  const { openModal } = useConnectWalletModal();

  const handleESC = () => {
    setKeyword("");
    setSearchMenuToggle(false);
  };
  useEscCloseModal(handleESC);

  const onSideMenuToggle = (value: boolean) => {
    setSideMenuToggle(value);
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
  }, [openModal]);

  const movePage = useCallback((path: string) => {
    push(path);
  }, []);

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
      gnotBalance={gnotBalance}
      isLoadingGnotBalance={isLoadingGnotBalance}
      gnotToken={gnot}
    />
  );
};

export default HeaderContainer;
