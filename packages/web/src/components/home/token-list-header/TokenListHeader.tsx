import React from "react";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import IconSearch from "@components/common/icons/IconSearch";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import Switch from "@components/common/switch/Switch";
import Tooltip from "@components/common/tooltip/Tooltip";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import { DEVICE_TYPE } from "@styles/media";
import { useTranslation } from "next-i18next";

import { TokenListHeaderwrapper, TokenTitleWrapper, UnverifiedTokensTooltipContent } from "./TokenListHeader.styles";

interface TokenListHeaderProps {
  tokenType: TOKEN_TYPE;
  changeTokenType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  breakpoint: DEVICE_TYPE;
  searchIcon: boolean;
  onTogleSearch: () => void;
  searchRef: React.RefObject<HTMLDivElement>;
  showUnverifiedTokens: boolean;
  toggleShowUnverifiedTokens: () => void;
}

const TokenListHeader: React.FC<TokenListHeaderProps> = ({
  tokenType,
  changeTokenType,
  search,
  keyword,
  breakpoint,
  searchIcon,
  onTogleSearch,
  searchRef,
  showUnverifiedTokens,
  toggleShowUnverifiedTokens,
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
    <TokenListHeaderwrapper>
      <TokenTitleWrapper>
        <h2>{t("Main:tokenList.title")}</h2>
        {breakpoint !== DEVICE_TYPE.MOBILE ? (
          <SelectTab selectType={tokenType} list={Object.values(TOKEN_TYPE)} onClick={changeTokenType} />
        ) : searchIcon ? (
          <div ref={searchRef as unknown as React.RefObject<HTMLDivElement>}>
            <SearchInput
              width={200}
              height={40}
              value={keyword}
              onChange={search}
              className="tokens-search"
              placeholder={t("Main:search")}
            />
          </div>
        ) : (
          <div className="mobile-controls">
            {showUnverifiedTokensSwitch}
            <div className="icon-wrap" onClick={onTogleSearch}>
              <IconSearch className="search-icon" />
            </div>
          </div>
        )}
      </TokenTitleWrapper>
      {breakpoint !== DEVICE_TYPE.MOBILE ? (
        <div className="right-section">
          {showUnverifiedTokensSwitch}
          <SearchInput
            width={300}
            value={keyword}
            onChange={search}
            className="tokens-search"
            placeholder={t("Main:search")}
          />
        </div>
      ) : (
        <SelectTab
          selectType={tokenType}
          list={Object.values(TOKEN_TYPE)}
          onClick={changeTokenType}
          buttonClassName="select-tab-token"
        />
      )}
    </TokenListHeaderwrapper>
  );
};

export default TokenListHeader;
