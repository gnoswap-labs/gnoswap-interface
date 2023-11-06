// TODO : remove eslint-disable after work
/* eslint-disable */
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { ValuesType } from "utility-types";
import { useQuery } from "@tanstack/react-query";
import AssetList from "@components/wallet/asset-list/AssetList";
import BigNumber from "bignumber.js";
import { useWindowSize } from "@hooks/common/use-window-size";
import useClickOutside from "@hooks/common/use-click-outside";
import DepositModal from "@components/wallet/deposit-modal/DepositModal";
import WithDrawModal from "@components/wallet/withdraw-modal/WithDrawModal";
import { TokenModel } from "@models/token/token-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";

interface AssetListResponse {
  hasNext: boolean;
  currentPage: number;
  assets: Asset[];
}

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

const SORT_PARAMS: { [key in ASSET_HEAD]: string } = {
  Asset: "asset",
  Chain: "chain",
  Balance: "balance",
  Deposit: "deposit",
  Withdraw: "withdraw",
};

export interface Asset {
  id: string;
  logoUri: string;
  type: ASSET_TYPE;
  name: string;
  symbol: string;
  chain: string;
  balance: string;
}

export const ASSET_TYPE = {
  NATIVE: "NATIVE",
  GRC20: "GRC20",
} as const;

export type ASSET_TYPE = ValuesType<typeof ASSET_TYPE>;

export const ASSET_FILTER_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;

export type ASSET_FILTER_TYPE = ValuesType<typeof ASSET_FILTER_TYPE>;

export const dummyAssetList: Asset[] = [
  {
    id: "BTC",
    logoUri:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    type: ASSET_TYPE.NATIVE,
    name: "Bitcoin",
    symbol: "BTC",
    chain: "Gnoland",
    balance: "0.1",
  },
  {
    id: "GNOS",
    logoUri:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xB98d4C97425d9908E66E53A6fDf673ACcA0BE986/logo.png",
    type: ASSET_TYPE.GRC20,
    name: "Gnoswap",
    symbol: "GNOS",
    chain: "Gnoland",
    balance: "0.000000",
  },
];

async function fetchAssets(
  address: string,
  sortKey?: string, // eslint-disable-line
  direction?: string, // eslint-disable-line
): Promise<Asset[]> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    Promise.resolve([
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
      ...dummyAssetList,
    ]),
  );
}

function filterZeroBalance(asset: Asset) {
  const balance = BigNumber(asset.balance);
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
    asset.chain.toLowerCase().includes(searchKeyword) ||
    asset.symbol.toLowerCase().includes(searchKeyword)
  );
}

const DEPOSIT_TO = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "Cosmos",
  logoURI:
    "/cosmos.svg",
  priceId: "gno.land/r/gnos",
};

const DEPOSIT_FROM = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "Gnoland",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  priceId: "gno.land/r/gnos",
};
const DEPOSIT_INFO = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "ATOM",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "ATOM",
  logoURI:
    "/atom.svg",
  priceId: "gno.land/r/gnos",
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
  const [depositInfo, setDepositInfo] = useState(DEPOSIT_INFO);
  const [withdrawInfo, setWithDrawInfo] = useState(DEPOSIT_INFO);

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

  const {
    isFetched,
    error,
    data: assets,
  } = useQuery<Asset[], Error>({
    queryKey: ["assets", address, sortOption?.key, sortOption?.direction],
    queryFn: () =>
      fetchAssets(
        address,
        sortOption && SORT_PARAMS[sortOption.key],
        sortOption?.direction,
      ),
  });

  useEffect(() => {
    if (assets && assets.length > 0) {
      const COLLAPSED_LENGTH = 15;
      const filteredAssets = assets
        .filter(
          asset => invisibleZeroBalance === false || filterZeroBalance(asset),
        )
        .filter(asset => filterType(asset, assetType))
        .filter(asset => filterKeyword(asset, keyword));
      const hasLoader = filteredAssets.length > COLLAPSED_LENGTH;
      const resultFilteredAssets = extended
        ? filteredAssets
        : filteredAssets.slice(
            0,
            Math.min(filteredAssets.length, COLLAPSED_LENGTH),
          );

      setHasLoader(hasLoader);
      setFilteredAsset(resultFilteredAssets);
    }
  }, [assets, assetType, invisibleZeroBalance, extended, keyword]);

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
      setDepositInfo({
        chainId: "dev",
        createdAt: "2023-10-10T08:48:46+09:00",
        name: "Gnoswap",
        address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
        path: "gno.land/r/gnos",
        decimals: 4,
        symbol: asset.symbol,
        logoURI: asset.logoUri,
        priceId: "gno.land/r/gnos",
      });
      // console.debug("deposit", `address: ${address}`, `assetId: ${assetId}`);
      if (!address) return;
    },
    [address, connected],
  );

  const withdraw = useCallback(
    (asset: Asset) => {
      if (!connected) return;
      setIsShowWithDrawModal(true);
      setWithDrawInfo({
        chainId: "dev",
        createdAt: "2023-10-10T08:48:46+09:00",
        name: "Gnoswap",
        address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
        path: "gno.land/r/gnos",
        decimals: 4,
        symbol: asset.symbol,
        logoURI: asset.logoUri,
        priceId: "gno.land/r/gnos",
      });
      // console.debug("withdraw", `address: ${address}`, `assetId: ${assetId}`);
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
    setIsShowDepositModal(false)
  }

  const closeWithdraw = () => {
    setIsShowWithDrawModal(false)
  }

  const callbackDeposit = (value: boolean) => {
    setIsShowDepositModal(value);
  }

  const callbackWithdraw = (value: boolean) => {
    setIsShowWithDrawModal(value);
  }

  usePreventScroll(isShowDepositModal || isShowWithdrawModal);


  return (
    <>
      <AssetList
        assets={filteredAssets}
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
          fromToken={DEPOSIT_TO}
          toToken={DEPOSIT_FROM}
          connected={connected}
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
      {isShowWithdrawModal && (
        <WithDrawModal
          breakpoint={breakpoint}
          close={closeWithdraw}
          withdrawInfo={withdrawInfo}
          fromToken={DEPOSIT_FROM}
          toToken={DEPOSIT_TO}
          connected={connected}
          changeToken={changeTokenWithdraw}
          callback={callbackWithdraw}
        />
      )}
    </>
  );
};

export default AssetListContainer;
