import React from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import Switch from "@components/common/switch/Switch";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import { TokenListHeaderwrapper, TokenTitleWrapper } from "./TokenListHeader.styles";
import IconSearch from "@components/common/icons/IconSearch";
import { DEVICE_TYPE } from "@styles/media";
import { useTranslation } from "next-i18next";

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
            <Switch
              id="show-unverified-tokens"
              checked={showUnverifiedTokens}
              onChange={toggleShowUnverifiedTokens}
              hasLabel={true}
              labelText={t("Main:tokenList.showUnverifiedTokens")}
            />
            <div className="icon-wrap" onClick={onTogleSearch}>
              <IconSearch className="search-icon" />
            </div>
          </div>
        )}
      </TokenTitleWrapper>
      {breakpoint !== DEVICE_TYPE.MOBILE ? (
        <div className="right-section">
          <Switch
            id="show-unverified-tokens"
            checked={showUnverifiedTokens}
            onChange={toggleShowUnverifiedTokens}
            hasLabel={true}
            labelText={t("Main:tokenList.showUnverifiedTokens")}
          />
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
