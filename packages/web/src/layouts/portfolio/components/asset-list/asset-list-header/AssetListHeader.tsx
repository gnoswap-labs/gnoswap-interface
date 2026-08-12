import React from "react";
import { useTranslation } from "react-i18next";
import { ValuesType } from "utility-types";

import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import IconSearch from "@components/common/icons/IconSearch";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import Switch from "@components/common/switch/Switch";
import Tooltip from "@components/common/tooltip/Tooltip";
import { DEVICE_TYPE } from "@styles/media";

import { AssetListHeaderWrapper, UnverifiedTokensTooltipContent } from "./AssetListHeader.styles";

export const ASSET_FILTER_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;

export type ASSET_FILTER_TYPE = ValuesType<typeof ASSET_FILTER_TYPE>;

interface AssetListHeaderProps {
  assetType: ASSET_FILTER_TYPE;
  showUnverifiedTokens: boolean;
  keyword: string;
  changeAssetType: (newType: string) => void;
  toggleShowUnverifiedTokens: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  breakpoint: DEVICE_TYPE;
  searchIcon: boolean;
  onTogleSearch: () => void;
  searchRef: React.RefObject<HTMLDivElement>;
}

const AssetListHeader: React.FC<AssetListHeaderProps> = ({
  assetType,
  showUnverifiedTokens,
  keyword,
  changeAssetType,
  toggleShowUnverifiedTokens,
  search,
  breakpoint,
  searchIcon,
  onTogleSearch,
  searchRef,
}) => {
  const { t } = useTranslation();
  const unverifiedTokensTooltip = (
    <UnverifiedTokensTooltipContent>
      <p>
        {t("Main:tokenList.unverifiedTokensTooltip", {
          defaultValue: "Tokens unregistered on gno.land Token Resources are filtered.",
        })}
      </p>
      <a href="https://github.com/onbloc/gno-token-resource" target="_blank" rel="noreferrer">
        {t("Main:tokenList.verifyToken", { defaultValue: "Verify your token" })}
        <IconNewTab />
      </a>
    </UnverifiedTokensTooltipContent>
  );

  const unverifiedTokensInfo = (
    <Tooltip placement="top" FloatingContent={unverifiedTokensTooltip} className="show-unverified-info">
      <IconInfo size={16} />
    </Tooltip>
  );

  const showUnverifiedTokensSwitch = (
    <Switch
      id="show-unverified-tokens"
      checked={showUnverifiedTokens}
      onChange={toggleShowUnverifiedTokens}
      hasLabel={true}
      labelText={t("Main:tokenList.showUnverifiedTokens")}
      labelExtra={unverifiedTokensInfo}
      labelExtraPosition="before"
    />
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
                {showUnverifiedTokensSwitch}
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
          {showUnverifiedTokensSwitch}
          <SearchInput width={300} value={keyword} onChange={search} className="assets-search" />
        </div>
      ) : (
        <SelectTab selectType={assetType} list={Object.values(ASSET_FILTER_TYPE)} onClick={changeAssetType} />
      )}
    </AssetListHeaderWrapper>
  );
};

export default AssetListHeader;
