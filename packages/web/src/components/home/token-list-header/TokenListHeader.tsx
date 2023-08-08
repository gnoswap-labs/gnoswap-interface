import React from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import {
  TokenListHeaderwrapper,
  TokenTitleWrapper,
} from "./TokenListHeader.styles";
import IconSearch from "@components/common/icons/IconSearch";
import { DeviceSize } from "@styles/media";

interface TokenListHeaderProps {
  tokenType: TOKEN_TYPE;
  changeTokenType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  windowSize: number;
  searchIcon: boolean;
  onTogleSearch: () => void;
}

const TokenListHeader: React.FC<TokenListHeaderProps> = ({
  tokenType,
  changeTokenType,
  search,
  keyword,
  windowSize,
  searchIcon,
  onTogleSearch,
}) => (
  <TokenListHeaderwrapper>
    <TokenTitleWrapper>
      <h2>Tokens</h2>
      {windowSize > DeviceSize.mobile ? (
        <SelectTab
          selectType={tokenType}
          list={Object.values(TOKEN_TYPE)}
          onClick={changeTokenType}
        />
      ) : searchIcon ? (
        <SearchInput
          width={200}
          height={40}
          value={keyword}
          onChange={search}
          className="tokens-search"
        />
      ) : (
        <div className="icon-wrap" onClick={onTogleSearch}>
          <IconSearch className="search-icon" />
        </div>
      )}
    </TokenTitleWrapper>
    {windowSize > DeviceSize.mobile ? (
      <SearchInput
        width={300}
        value={keyword}
        onChange={search}
        className="tokens-search"
      />
    ) : (
      <SelectTab
        selectType={tokenType}
        list={Object.values(TOKEN_TYPE)}
        onClick={changeTokenType}
      />
    )}
  </TokenListHeaderwrapper>
);

export default TokenListHeader;
