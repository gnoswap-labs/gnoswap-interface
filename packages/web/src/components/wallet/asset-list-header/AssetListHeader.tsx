import React from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import { ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";
import { AssetListHeaderWrapper } from "./AssetListHeader.styles";
import SelectTab from "@components/common/select-tab/SelectTab";
import Switch from "@components/common/switch/Switch";
import IconSearch from "@components/common/icons/IconSearch";
import { DeviceSize } from "@styles/media";

interface AssetListHeaderProps {
  assetType: ASSET_FILTER_TYPE;
  invisibleZeroBalance: boolean;
  keyword: string;
  changeAssetType: (newType: string) => void;
  toggleInvisibleZeroBalance: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  windowSize: number;
}

const AssetListHeader: React.FC<AssetListHeaderProps> = ({
  assetType,
  invisibleZeroBalance,
  keyword,
  changeAssetType,
  toggleInvisibleZeroBalance,
  search,
  windowSize,
}) => (
  <AssetListHeaderWrapper>
    <div className="title-container">
      <h2>Assets</h2>
      {windowSize > DeviceSize.mobile ? (
        <SelectTab
          selectType={assetType}
          list={Object.values(ASSET_FILTER_TYPE)}
          onClick={changeAssetType}
        />
      ) : (
        <div className="mobile-title-container">
          <Switch
            checked={invisibleZeroBalance}
            onChange={toggleInvisibleZeroBalance}
            hasLabel={true}
            disabled={assetType === ASSET_FILTER_TYPE.GRC20}
          />
          <div className="icon-wrap" onClick={() => {}}>
            <IconSearch className="search-icon" />
          </div>
        </div>
      )}
    </div>
    {windowSize > DeviceSize.mobile ? (
      <div className="right-section">
        <Switch
          checked={invisibleZeroBalance}
          onChange={toggleInvisibleZeroBalance}
          hasLabel={true}
          disabled={assetType === ASSET_FILTER_TYPE.GRC20}
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

export default AssetListHeader;
