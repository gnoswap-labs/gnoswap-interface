import React, { useCallback } from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import { ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";
import { AssetListHeaderWrapper } from "./AssetListHeader.styles";

interface AssetListHeaderProps {
  assetType: ASSET_FILTER_TYPE;
  invisibleZeroBalance: boolean;
  keyword: string;
  changeAssetType: (AssetType: ASSET_FILTER_TYPE) => void;
  toggleInvisibleZeroBalance: () => void;
  search: (keyword: string) => void;
}

const AssetListHeader: React.FC<AssetListHeaderProps> = ({
  assetType,
  invisibleZeroBalance,
  keyword,
  changeAssetType,
  toggleInvisibleZeroBalance,
  search,
}) => {
  const onSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    search(event.target.value);
  }, [search]);

  const onClickAll = useCallback(() => {
    changeAssetType(ASSET_FILTER_TYPE.ALL);
  }, [changeAssetType]);

  const onClickNative = useCallback(() => {
    changeAssetType(ASSET_FILTER_TYPE.NATIVE);
  }, [changeAssetType]);

  const onClickGRC20 = useCallback(() => {
    changeAssetType(ASSET_FILTER_TYPE.GRC20);
  }, [changeAssetType]);

  return (
    <AssetListHeaderWrapper>
      <h5 className="title">Assets</h5>

      {/* TODO: Working with ButtonGroup Components */}
      <div className="filter-wrapper">
        <button
          onClick={onClickAll}
          disabled={assetType === ASSET_FILTER_TYPE.ALL}
          style={{
            border:
              assetType === ASSET_FILTER_TYPE.ALL
                ? "1px solid red"
                : "none",
          }}
        >
          ALL
        </button>
        <button
          onClick={onClickNative}
          disabled={assetType === ASSET_FILTER_TYPE.NATIVE}
          style={{
            border:
              assetType === ASSET_FILTER_TYPE.NATIVE
                ? "1px solid red"
                : "none",
          }}
        >
          Native
        </button>
        <button
          onClick={onClickGRC20}
          disabled={assetType === ASSET_FILTER_TYPE.GRC20}
          style={{
            border:
              assetType === ASSET_FILTER_TYPE.GRC20
                ? "1px solid red"
                : "none",
          }}
        >
          GRC20
        </button>
      </div>

      {/* TODO: Working with Toggle Component */}
      <button
        onClick={toggleInvisibleZeroBalance}
        disabled={assetType === ASSET_FILTER_TYPE.GRC20}
        style={{
          border:
            invisibleZeroBalance
              ? "1px solid green"
              : "1px solid red",
        }}
      >
        Hide zero balances {invisibleZeroBalance ? "ON" : "OFF"}
      </button>

      <div className="search-wrapper">
        <SearchInput
          width={300}
          value={keyword}
          onChange={onSearch}
        />
      </div>
    </AssetListHeaderWrapper>
  );
};

export default AssetListHeader;
