import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ValuesType } from "utility-types";

import IconSearch from "@components/common/icons/IconSearch";
import IconArrowDown from "@components/common/icons/IconArrowDown";
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
  connected: boolean;
  invisibleZeroBalance: boolean;
  showUnverifiedTokens: boolean;
  keyword: string;
  changeAssetType: (newType: string) => void;
  toggleInvisibleZeroBalance: () => void;
  toggleShowUnverifiedTokens: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  breakpoint: DEVICE_TYPE;
  searchIcon: boolean;
  onTogleSearch: () => void;
  searchRef: React.RefObject<HTMLDivElement>;
}

const AssetListHeader: React.FC<AssetListHeaderProps> = ({
  assetType,
  connected,
  invisibleZeroBalance,
  showUnverifiedTokens,
  keyword,
  changeAssetType,
  toggleInvisibleZeroBalance,
  toggleShowUnverifiedTokens,
  search,
  breakpoint,
  searchIcon,
  onTogleSearch,
  searchRef,
}) => {
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const renderFilters = () => (
    <div
      className="filters-wrapper"
      onMouseEnter={() => setIsFiltersOpen(true)}
      onMouseLeave={() => setIsFiltersOpen(false)}
    >
      <button type="button" className="filters-trigger" aria-haspopup="dialog" aria-expanded={isFiltersOpen}>
        {t("Wallet:assets.filters", { defaultValue: "Filters" })}
        <IconArrowDown className="filters-arrow" />
      </button>
      {isFiltersOpen && (
        <div
          className="filters-dropdown"
          role="dialog"
          aria-label={t("Wallet:assets.filters", { defaultValue: "Filters" })}
        >
          <Switch
            id="show-unverified-tokens"
            checked={showUnverifiedTokens}
            onChange={toggleShowUnverifiedTokens}
            hasLabel={true}
            labelText={t("Wallet:assets.showUnverifiedTokens", { defaultValue: "Show unverified tokens" })}
          />
          {connected && (
            <Switch
              id="hide-zero-balances"
              checked={invisibleZeroBalance}
              onChange={toggleInvisibleZeroBalance}
              hasLabel={true}
              labelText={t("Wallet:assets.hideZeroAmt")}
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <AssetListHeaderWrapper>
      <div className="title-container">
        <h2>{t("Wallet:assets.title")}</h2>
        {breakpoint !== DEVICE_TYPE.MOBILE ? (
          <SelectTab selectType={assetType} list={Object.values(ASSET_FILTER_TYPE)} onClick={changeAssetType} />
        ) : (
          <div className="mobile-title-container">
            {searchIcon ? (
              <div ref={searchRef as unknown as React.RefObject<HTMLDivElement>}>
                <SearchInput width={200} height={40} value={keyword} onChange={search} className="tokens-search" />
              </div>
            ) : (
              <>
                {renderFilters()}
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
          {renderFilters()}
          <SearchInput width={300} value={keyword} onChange={search} className="assets-search" />
        </div>
      ) : (
        <SelectTab selectType={assetType} list={Object.values(ASSET_FILTER_TYPE)} onClick={changeAssetType} />
      )}
    </AssetListHeaderWrapper>
  );
};

export default AssetListHeader;
