import React from "react";
import { useTranslation } from "react-i18next";
import { ValuesType } from "utility-types";

import IconSearch from "@components/common/icons/IconSearch";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import Switch from "@components/common/switch/Switch";
import { DEVICE_TYPE } from "@styles/media";

import { AssetListHeaderWrapper } from "./AssetListHeader.styles";

export const ASSET_FILTER_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;

export type ASSET_FILTER_TYPE = ValuesType<typeof ASSET_FILTER_TYPE>;

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
  const { t } = useTranslation();

  return (
    <AssetListHeaderWrapper>
      <div className="title-container">
        <h2>{t("Wallet:assets.title")}</h2>
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
                labelText={t("Wallet:assets.hideZeroAmt")}
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
                  labelText={t("Wallet:assets.hideZeroAmt")}
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
            labelText={t("Wallet:assets.hideZeroAmt")}
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
