// TODO : remove eslint-disable after work
/* eslint-disable */
import AssetList from "@components/wallet/asset-list/AssetList";
import DepositModal from "@components/wallet/deposit-modal/DepositModal";
import WithDrawModal from "@components/wallet/withdraw-modal/WithDrawModal";
import useClickOutside from "@hooks/common/use-click-outside";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useGetTokensList } from "@query/token";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ValuesType } from "utility-types";

export interface AssetSortOption {
  key: ASSET_HEAD;
  direction: "asc" | "desc";
}

export const ASSET_HEAD = {
  ASSET: "Asset",
  CHAIN: "Chain",
  BALANCE: "Balance",
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdraw",
} as const;
export type ASSET_HEAD = ValuesType<typeof ASSET_HEAD>;

export interface Asset extends TokenModel {
  // id: string;
  // logoUri: string;
  // type: ASSET_TYPE;
  // name: string;
  // symbol: string;
  // chain: string;
  balance?: number | string | null;
}

export const ASSET_TYPE = {
  NATIVE: "native",
  GRC20: "grc20",
} as const;

export type ASSET_TYPE = ValuesType<typeof ASSET_TYPE>;

export const ASSET_FILTER_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;

export type ASSET_FILTER_TYPE = ValuesType<typeof ASSET_FILTER_TYPE>;

export const dummyAssetList: Asset[] = [
  {
    type: "grc20",
    chainId: "dev",
    createdAt: "2023-12-12 23:45:12",
    name: "Bar",
    path: "gno.land/r/bar",
    decimals: 6,
    symbol: "BAR",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceId: "gno.land/r/bar",
    description: "this_is_desc_section",
    websiteURL: "https://website~~~~",
  },
  {
    type: "grc20",
    chainId: "dev",
    createdAt: "2023-12-12 23:45:12",
    name: "Bar",
    path: "gno.land/r/bar",
    decimals: 6,
    symbol: "BAR",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceId: "gno.land/r/bar",
    description: "this_is_desc_section",
    websiteURL: "https://website~~~~",
  },
];

function filterZeroBalance(asset: Asset) {
  const balance = BigNumber(asset?.balance ?? 0);
  return balance.isGreaterThan(0);
}

function filterType(asset: Asset, type: ASSET_FILTER_TYPE) {
  if (type === "All") return true;
  return asset.type.toUpperCase() === type.toUpperCase();
}

function filterKeyword(asset: Asset, keyword: string) {
  const searchKeyword = keyword.trim().toLowerCase();
  if (searchKeyword === "") return true;
  return (
    asset.name.toLowerCase().includes(searchKeyword) ||
    asset.symbol.toLowerCase().includes(searchKeyword) ||
    asset.path.toLowerCase().includes(searchKeyword)
  );
}

const DEPOSIT_INFO: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "ATOM",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  decimals: 4,
  symbol: "ATOM",
  logoURI: "/atom.svg",
  type: "grc20",
  priceId: "gno.land/r/gns",
};

const INIT_GNOT = {
  type: "native",
  chainId: "dev.gnoswap",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gnoland",
  path: "gnot",
  decimals: 6,
  symbol: "GNOT",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  priceId: "gnot",
  description:
    "Gno.land is a platform to write smart contracts in Gnolang (Gno). Using an interpreted version of the general-purpose programming language Golang (Go), developers can write smart contracts and other blockchain apps without having to learn a language that’s exclusive to a single ecosystem. Web2 developers can easily contribute to web3 and start building a more transparent, accountable world.\n\nThe Gno transaction token, GNOT, and the contributor memberships power the platform, which runs on a variation of Proof of Stake. Proof of Contribution rewards contributors from technical and non-technical backgrounds, fairly and for life with GNOT. This consensus mechanism also achieves higher security with fewer validators, optimizing resources for a greener, more sustainable, and enduring blockchain ecosystem.\n\nAny blockchain using Gnolang achieves succinctness, composability, expressivity, and completeness not found in any other smart contract platform. By observing a minimal structure, the design can endure over time and challenge the regime of information censorship we’re living in today.",
  websiteURL: "https://gno.land/",
  displayPath: "Native",
  wrappedPath: "gno.land/r/demo/wugnot",
  balance: "0",
} as const;

const INIT_GNS = {
  type: "grc20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-16T17:27:10Z",
  name: "Gnoswap",
  path: "gno.land/r/demo/gns",
  decimals: 6,
  symbol: "GNS",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  priceId: "gno.land/r/demo/gns",
  description: "GNS is a GRC20 token issued solely for testing purposes.",
  websiteURL: "https://beta.gnoswap.io",
  displayPath: "gno.land/r/demo/gns",
  wrappedPath: "gno.land/r/demo/gns",
  balance: "0",
} as const;

interface SortedProps extends TokenModel {
  balance: string;
  price?: string;
}

const customSortAll = (a: SortedProps, b: SortedProps): number => {
  if (a.symbol === "GNOT" && b.symbol !== "GNOT") {
    return -1;
  } else if (a.symbol !== "GNOT" && b.symbol === "GNOT") {
    return 1;
  } else if (a.symbol === "GNS" && b.symbol !== "GNS") {
    return -1;
  } else if (a.symbol !== "GNS" && b.symbol === "GNS") {
    return 1;
  } else {
    const priceA = parseFloat((a?.price ?? "").replace(/,/g, ""));
    const priceB = parseFloat((b?.price ?? "").replace(/,/g, ""));

    if (!isNaN(priceA) && !isNaN(priceB) && priceA > priceB) {
      return -1;
    } else if (!isNaN(priceA) || !isNaN(priceB)) {
      return 1;
    } else {
      const numberRegex = /\d+/;
      const numberA = numberRegex.test(a.name);
      const numberB = numberRegex.test(b.name);
      if (numberA > numberB) {
        return -1;
      } else if (numberA > numberB) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  }
};

const AssetListContainer: React.FC = () => {
  const { connected } = useWallet();

  const [address, setAddress] = useState("");
  const [assetType, setAssetType] = useState<ASSET_FILTER_TYPE>(
    ASSET_FILTER_TYPE.ALL,
  );
  const [invisibleZeroBalance, setInvisibleZeroBalance] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [hasNext, setHasNext] = useState(false);
  const [extended, setExtened] = useState(false);
  const [filteredAssets, setFilteredAsset] = useState<Asset[]>([]);
  const [hasLoader, setHasLoader] = useState(false);
  const [sortOption, setTokenSortOption] = useState<AssetSortOption>();
  const { breakpoint } = useWindowSize();
  const [searchIcon, setSearchIcon] = useState(false);
  const [componentRef, isClickOutside, setIsInside] = useClickOutside();
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const [isShowWithdrawModal, setIsShowWithDrawModal] = useState(false);
  const [depositInfo, setDepositInfo] = useState<TokenModel>(DEPOSIT_INFO);
  const [withdrawInfo, setWithDrawInfo] = useState<TokenModel>(DEPOSIT_INFO);

  const changeTokenDeposit = useCallback((token: TokenModel) => {
    setDepositInfo(token);
    setIsShowDepositModal(true);
  }, []);

  const changeTokenWithdraw = useCallback((token: TokenModel) => {
    setWithDrawInfo(token);
    setIsShowWithDrawModal(true);
  }, []);

  const onTogleSearch = () => {
    setSearchIcon(prev => !prev);
    setIsInside(true);
  };

  useEffect(() => {
    if (!keyword) {
      if (isClickOutside) {
        setSearchIcon(false);
      }
    }
  }, [isClickOutside, keyword]);

  const { isFetched } = useGetTokensList();
  const { tokens, displayBalanceMap, balances, updateTokens, tokenPrices } =
    useTokenData();

  useEffect(() => {
    updateTokens();
  }, [connected]);

  useEffect(() => {
    if (!tokens) return;

    if (tokens?.length === 0) {
      setTokenSortOption({
        key: "Asset",
        direction: "asc",
      });
    } else {
      setTokenSortOption(undefined);
    }
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    const COLLAPSED_LENGTH = 15;

    const temp: SortedProps[] = tokens
      .map(item => {
        const tokenPrice = balances[item.priceId];
        if (!tokenPrice || tokenPrice === null || Number.isNaN(tokenPrice)) {
          return {
            price: "-",
            balance: "0",
            ...item,
          };
        }
        return {
          ...item,
          price: BigNumber(tokenPrice)
            .multipliedBy(tokenPrices[item?.path]?.usd || "0")
            .toFormat(),
          balance: BigNumber(displayBalanceMap[item.path] ?? 0).toString(),
        };
      })
      .filter(
        asset => invisibleZeroBalance === false || filterZeroBalance(asset),
      );

    let sortedData = temp.sort(customSortAll);

    if (sortOption?.key === "Asset") {
      sortedData = sortedData.sort((x, y) => {
        return sortOption?.direction === "asc"
          ? x.name.localeCompare(y.name)
          : y.name.localeCompare(x.name);
      });
    }

    if (sortOption?.key === "Balance") {
      sortedData = sortedData.sort((x, y) => {
        if (
          x.balance === undefined ||
          y.balance === undefined ||
          x.balance === null ||
          y.balance === null
        )
          return 0;

        return sortOption?.direction === "desc"
          ? Number(y.balance) - Number(x.balance)
          : Number(x.balance) - Number(y.balance);
      });
    }

    sortedData = sortedData
      .filter(asset => filterType(asset, assetType))
      .filter(asset => filterKeyword(asset, keyword));

    const hasLoader = sortedData.length > COLLAPSED_LENGTH;
    const resultFilteredAssets = extended
      ? sortedData
      : sortedData.slice(0, Math.min(sortedData.length, COLLAPSED_LENGTH));
    setHasLoader(hasLoader);

    return resultFilteredAssets;
  }, [
    tokens,
    sortOption?.key,
    sortOption?.direction,
    extended,
    balances,
    tokenPrices,
    displayBalanceMap,
    invisibleZeroBalance,
    assetType,
    keyword,
  ]);

  const changeAssetType = useCallback((newType: string) => {
    switch (newType) {
      case ASSET_FILTER_TYPE.ALL:
        setAssetType(ASSET_FILTER_TYPE.ALL);
        break;
      case ASSET_FILTER_TYPE.GRC20:
        setAssetType(ASSET_FILTER_TYPE.GRC20);
        break;
      default:
        setAssetType(ASSET_FILTER_TYPE.ALL);
    }
  }, []);

  const toggleInvisibleZeroBalance = useCallback(() => {
    setInvisibleZeroBalance(!invisibleZeroBalance);
  }, [invisibleZeroBalance]);

  const toggleExtended = useCallback(() => {
    setExtened(!extended);
  }, [extended]);

  const search = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const deposit = useCallback(
    (asset: Asset) => {
      if (!connected) return;
      setIsShowDepositModal(true);
      setDepositInfo(asset);
      if (!address) return;
    },
    [address, connected],
  );

  const withdraw = useCallback(
    (asset: Asset) => {
      if (!connected) return;
      setIsShowWithDrawModal(true);
      setWithDrawInfo(asset);
      if (!address) return;
    },
    [address, connected],
  );

  const sort = useCallback(
    (item: ASSET_HEAD) => {
      const key = item;
      const direction =
        sortOption?.key !== item
          ? "desc"
          : sortOption.direction === "asc"
          ? "desc"
          : "asc";

      setTokenSortOption({
        key,
        direction,
      });
    },
    [sortOption],
  );

  const isSortOption = useCallback((head: ASSET_HEAD) => {
    const disableItems = ["Deposit", "Withdraw"];
    return !disableItems.includes(head);
  }, []);

  const closeDeposit = () => {
    setIsShowDepositModal(false);
  };

  const closeWithdraw = () => {
    setIsShowWithDrawModal(false);
  };

  const callbackDeposit = (value: boolean) => {
    setIsShowDepositModal(value);
  };

  const callbackWithdraw = (value: boolean) => {
    setIsShowWithDrawModal(value);
  };

  usePreventScroll(isShowDepositModal || isShowWithdrawModal);

  return (
    <>
      <AssetList
        assets={filteredTokens}
        isFetched={isFetched}
        assetType={assetType}
        invisibleZeroBalance={invisibleZeroBalance}
        keyword={keyword}
        extended={extended}
        hasLoader={hasLoader}
        changeAssetType={changeAssetType}
        search={search}
        toggleInvisibleZeroBalance={toggleInvisibleZeroBalance}
        toggleExtended={toggleExtended}
        deposit={deposit}
        withdraw={withdraw}
        sortOption={sortOption}
        sort={sort}
        isSortOption={isSortOption}
        breakpoint={breakpoint}
        searchIcon={searchIcon}
        onTogleSearch={onTogleSearch}
        searchRef={componentRef}
      />
      {isShowDepositModal && (
        <DepositModal
          breakpoint={breakpoint}
          close={closeDeposit}
          depositInfo={depositInfo}
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
      {isShowWithdrawModal && (
        <WithDrawModal
          breakpoint={breakpoint}
          close={closeWithdraw}
          withdrawInfo={withdrawInfo}
          connected={connected}
          changeToken={changeTokenWithdraw}
          callback={callbackWithdraw}
        />
      )}
    </>
  );
};

export default AssetListContainer;
