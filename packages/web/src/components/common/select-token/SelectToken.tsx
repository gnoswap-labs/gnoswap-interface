import React, { useCallback } from "react";
import { SelectTokenWrapper } from "./SelectToken.styles";
import { TokenInfo } from "@models/token/token-info";
import IconSearch from "@components/common/icons/IconSearch";
import IconClose from "@components/common/icons/IconCancel";

export interface SelectTokenProps {
  keyword: string;
  defaultTokens: TokenInfo[];
  tokens: TokenInfo[];
  tokenPrices: {
    path: string;
    price: string;
  }[];
  changeKeyword: (keyword: string) => void;
  changeToken: (token: TokenInfo) => void;
  close: () => void;
}

const SelectToken: React.FC<SelectTokenProps> = ({
  keyword,
  defaultTokens,
  tokens,
  tokenPrices,
  changeKeyword,
  changeToken,
  close,
}) => {

  const getTokenPrice = useCallback((token: TokenInfo) => {
    const tokenPrice = tokenPrices.find(item => item.path === token.path);
    if (!tokenPrice) {
      return "-";
    }
    return tokenPrice.price;
  }, [tokenPrices]);

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const onClickToken = useCallback((token: TokenInfo) => {
    changeToken(token);
    close();
  }, [changeToken, close]);

  const onChangeSearchKeyword = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const searchKeyword = event.target.value;
    changeKeyword(searchKeyword);
  }, [changeKeyword]);

  return (
    <SelectTokenWrapper>
      <div className="content">
        <div className="header">
          <span>Select a token</span>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="search-wrap">
          <input
            className="search-input"
            placeholder={"Search name or paste address"}
            value={keyword}
            onChange={onChangeSearchKeyword}
          />
          <IconSearch className="search-icon" />
        </div>
        <div className="token-select">
          {defaultTokens.map((token, index) => (
            <div
              className="token-button"
              key={index}
              onClick={() => onClickToken(token)}
            >
              <img src={token.logoURI} alt="logo" className="token-logo" />
              <span>{token.symbol}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="token-list-wrapper">
        {tokens.map((token, index) => (
          <div
            className="list"
            key={index}
            onClick={() => onClickToken(token)}
          >
            <div className="token-info">
              <img src={token.logoURI} alt="logo" className="token-logo" />
              <span className="token-name">{token.name}</span>
              <span className="token-symbol">{token.symbol}</span>
            </div>
            <span className="token-balance">{getTokenPrice(token)}</span>
          </div>
        ))}
      </div>
    </SelectTokenWrapper>
  );
};

export default SelectToken;