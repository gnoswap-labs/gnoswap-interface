import React from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import { ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";
import { AssetListHeaderWrapper } from "./AssetListHeader.styles";
import SelectTab from "@components/common/select-tab/SelectTab";
import Switch from "@components/common/switch/Switch";
import IconSearch from "@components/common/icons/IconSearch";
import { DEVICE_TYPE } from "@styles/media";

interface AssetListHeaderProps {
  assetType: ASSET_FILTER_TYPE;
  invisibleZeroBalance: boolean;
  keyword: string;
  changeAssetType: (newType: string) => void;
  toggleInvisibleZeroBalance: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  breakpoint: DEVICE_TYPE;
  searchIcon: boolean;
  onTogleSearch: () => void;
  searchRef: React.RefObject<HTMLDivElement>;
}

const AssetListHeader: React.FC<AssetListHeaderProps> = ({
  assetType,
  invisibleZeroBalance,
  keyword,
  changeAssetType,
  toggleInvisibleZeroBalance,
  search,
  breakpoint,
  searchIcon,
  onTogleSearch,
  searchRef,
}) => {
  return (
    <AssetListHeaderWrapper>
      <div className="title-container">
        <h2>Assets</h2>
        {breakpoint !== DEVICE_TYPE.MOBILE ? (
          <SelectTab
            selectType={assetType}
            list={Object.values(ASSET_FILTER_TYPE)}
            onClick={changeAssetType}
          />
        ) : (
          <div className="mobile-title-container">
            {breakpoint !== DEVICE_TYPE.MOBILE && (
              <Switch
                checked={invisibleZeroBalance}
                onChange={toggleInvisibleZeroBalance}
                hasLabel={true}
                labelText={"Hide zero amount"}
              />
            )}
            {searchIcon ? (
              <div
                ref={searchRef as unknown as React.RefObject<HTMLDivElement>}
              >
                <SearchInput
                  width={200}
                  height={40}
                  value={keyword}
                  onChange={search}
                  className="tokens-search"
                />
              </div>
            ) : (
              <>
                <Switch
                  checked={invisibleZeroBalance}
                  onChange={toggleInvisibleZeroBalance}
                  hasLabel={true}
                />
                <div className="icon-wrap" onClick={onTogleSearch}>
                  <IconSearch className="search-icon" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {breakpoint !== DEVICE_TYPE.MOBILE ? (
        <div className="right-section">
          <Switch
            checked={invisibleZeroBalance}
            onChange={toggleInvisibleZeroBalance}
            hasLabel={true}
          />
          <SearchInput
            width={300}
            value={keyword}
            onChange={search}
            className="assets-search"
          />
        </div>
      ) : (
        <SelectTab
          selectType={assetType}
          list={Object.values(ASSET_FILTER_TYPE)}
          onClick={changeAssetType}
        />
      )}
    </AssetListHeaderWrapper>
  );
};

export default AssetListHeader;
