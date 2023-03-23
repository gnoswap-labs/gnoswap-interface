import React, { useCallback, useEffect, useState } from "react";
import { ValuesType } from "utility-types";
import { useQuery } from "@tanstack/react-query";

import AssetList from "@components/wallet/asset-list/AssetList";
import BigNumber from "bignumber.js";

interface AssetListResponse {
  hasNext: boolean;
  currentPage: number;
  assets: Asset[];
}

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
  NATIVE: "Native",
} as const;

export type ASSET_FILTER_TYPE = ValuesType<typeof ASSET_FILTER_TYPE>;

const defaultAssets = [
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

async function fetchAssets(address: string): Promise<Asset[]> {
  console.debug("fetchAssets", address);
  return new Promise(resolve => setTimeout(resolve, 1000)).then(() =>
    Promise.resolve([
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
      ...defaultAssets,
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

const AssetListContainer: React.FC = () => {
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

  const {
    isLoading,
    error,
    data: assets,
  } = useQuery<Asset[], Error>({
    queryKey: ["assets", address],
    queryFn: () => fetchAssets(address),
  });

  useEffect(() => {
    if (assets && assets.length > 0) {
      const COLLAPSED_LENGTH = 10;

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

  const changeAssetType = useCallback((newAssetType: ASSET_FILTER_TYPE) => {
    setAssetType(newAssetType);
  }, []);

  const toggleInvisibleZeroBalance = useCallback(() => {
    setInvisibleZeroBalance(!invisibleZeroBalance);
  }, [invisibleZeroBalance]);

  const toggleExtended = useCallback(() => {
    setExtened(!extended);
  }, [extended]);

  const search = useCallback((searchKeyword: string) => {
    setKeyword(searchKeyword);
  }, []);

  const deposit = useCallback(
    (assetId: string) => {
      console.debug("deposit", `address: ${address}`, `assetId: ${assetId}`);
      if (!address) return;
    },
    [address],
  );

  const withdraw = useCallback(
    (assetId: string) => {
      console.debug("withdraw", `address: ${address}`, `assetId: ${assetId}`);
      if (!address) return;
    },
    [address],
  );

  return (
    <AssetList
      assets={filteredAssets}
      isLoading={isLoading}
      error={error}
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
    />
  );
};

export default AssetListContainer;
