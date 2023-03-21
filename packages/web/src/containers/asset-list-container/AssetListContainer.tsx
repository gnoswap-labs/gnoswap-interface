import React, { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ValuesType } from "utility-types";

import AssetList from "@components/wallet/asset-list/AssetList";

export interface Asset {
  id: string;
  type: ASSET_TYPE;
  name: string;
  symbol: string;
  chain: string;
  balance: number;
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

async function fetchAssets(
  filterType: ASSET_FILTER_TYPE,
  invisibleEmptyAsset: boolean,
  page: number,
  keyword: string,
): Promise<Asset[]> {
  console.debug("fetchAssets", filterType, page, keyword);
  return Promise.resolve([
    {
      id: "BTC",
      type: ASSET_TYPE.NATIVE,
      name: "Bitcoin",
      symbol: "BTC",
      chain: "Gnoland",
      balance: 0
    },
    {
      id: "GNOS",
      type: ASSET_TYPE.GRC20,
      name: "Gnoswap",
      symbol: "GNOS",
      chain: "Gnoland",
      balance: 0
    }
  ]).then(assets => assets.filter(asset => {
    if (invisibleEmptyAsset && asset.balance <= 0) {
      return false;
    }
    if (ASSET_FILTER_TYPE.ALL) {
      return true;
    }
    return asset.symbol.toLowerCase() === filterType.toLowerCase();
  }));
}

const AssetListContainer: React.FC = () => {
  const [assetFilterType, setAssetFilterType] = useState<ASSET_FILTER_TYPE>(ASSET_FILTER_TYPE.ALL);
  const [invisibleEmptyAsset, setInvisibleEmptyAsset] = useState(false);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");

  const changeAssetFilterType = useCallback((newAssetFilterType: ASSET_FILTER_TYPE) => {
    setAssetFilterType(newAssetFilterType);
  }, []);

  const toggleInvisibleEmptyAsset = useCallback(() => {
    setInvisibleEmptyAsset(!invisibleEmptyAsset);
  }, [invisibleEmptyAsset]);

  const {
    isLoading,
    error,
    data: assets,
  } = useQuery<Asset[], Error>({
    queryKey: ["assets", assetFilterType, page, keyword],
    queryFn: () => fetchAssets(assetFilterType, invisibleEmptyAsset, page, keyword),
  });

  const search = useCallback((searchKeyword: string) => {
    setKeyword(searchKeyword);
  }, []);

  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <AssetList
      assets={assets}
      isLoading={isLoading}
      error={error}
      assetFilterType={assetFilterType}
      changeAssetFilterType={changeAssetFilterType}
      invisibleEmptyAsset={invisibleEmptyAsset}
      toggleInvisibleEmptyAsset={toggleInvisibleEmptyAsset}
      search={search}
      currentPage={page}
      totalPage={10}
      movePage={movePage}
    />
  );
};

export default AssetListContainer;
