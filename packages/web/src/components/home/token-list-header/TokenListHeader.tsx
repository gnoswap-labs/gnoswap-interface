import React from "react";
import SearchInput from "@components/common/search-input/SearchInput";
import SelectTab from "@components/common/select-tab/SelectTab";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import { wrapper } from "./TokenListHeader.styles";

interface TokenListHeaderProps {
  tokenType: TOKEN_TYPE;
  changeTokenType: (newType: string) => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
}

const TokenListHeader: React.FC<TokenListHeaderProps> = ({
  tokenType,
  changeTokenType,
  search,
  keyword,
}) => (
  <div css={wrapper}>
    <h2>Tokens</h2>
    <SelectTab
      selectType={tokenType}
      list={Object.values(TOKEN_TYPE)}
      onClick={changeTokenType}
    />
    <SearchInput
      width={300}
      value={keyword}
      onChange={search}
      className="tokens-search"
    />
  </div>
);

export default TokenListHeader;
