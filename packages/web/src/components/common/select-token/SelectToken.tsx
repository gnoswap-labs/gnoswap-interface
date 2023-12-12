import React, { useCallback, useRef, useEffect, useState } from "react";
import { SelectTokenWrapper } from "./SelectToken.styles";
import IconSearch from "@components/common/icons/IconSearch";
import IconClose from "@components/common/icons/IconCancel";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
export interface SelectTokenProps {
  keyword: string;
  defaultTokens: TokenModel[];
  tokens: TokenModel[];
  tokenPrices: { [key in string]: number | null };
  changeKeyword: (keyword: string) => void;
  changeToken: (token: TokenModel) => void;
  close: () => void;
  themeKey: "dark" | "light";
  modalRef?: React.RefObject<HTMLDivElement>;
}

const SelectToken: React.FC<SelectTokenProps> = ({
  keyword,
  defaultTokens,
  tokens,
  tokenPrices,
  changeKeyword,
  changeToken,
  close,
  themeKey,
  modalRef,
}) => {
  const myElementRef = useRef<HTMLDivElement | null>(null);
  const [positionTop, setPositionTop] = useState(0);

  const getTokenPrice = useCallback((token: TokenModel) => {
    const tokenPrice = tokenPrices[token.priceId];
    if (tokenPrice === null || Number.isNaN(tokenPrice)) {
      return "-";
    }
    return BigNumber(tokenPrice).toFormat();
  }, [tokenPrices]);

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const onClickToken = useCallback((token: TokenModel) => {
    changeToken(token);
    close();
  }, [changeToken, close]);

  const onChangeSearchKeyword = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const searchKeyword = event.target.value;
    changeKeyword(searchKeyword);
  }, [changeKeyword]);

  useEffect(() => {
    const getPositionTop = () => {
      const element = myElementRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const temp = Math.max(positionTop, rect.top);
        if (modalRef && modalRef.current) {
          modalRef.current.style.top = `${temp}px`;
          modalRef.current.style.transform = "translate(-50%, 0)";
        }
        setPositionTop(temp);

      }
    };
    getPositionTop();
  }, [positionTop]);

  return (
    <SelectTokenWrapper ref={myElementRef}>
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
            placeholder="Search by Name, Symbol, or Path"
            value={keyword}
            onChange={onChangeSearchKeyword}
          />
          <IconSearch className="search-icon" />
        </div>
        <div className="token-select">
          {defaultTokens.map((token, index) => (
            <div
              className={`token-button ${themeKey === "dark" && "border-button-none"
                }`}
              key={index}
              onClick={() => onClickToken(token)}
            >
              <img src={token.logoURI} alt="logo" className="token-logo" />
              <span>{token.symbol}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`token-list-wrapper ${tokens.length === 0 ? "token-list-wrapper-auto-height" : ""
          }`}
      >
        {tokens.length > 0 &&
          tokens.map((token, index) => (
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
        {tokens.length === 0 && (
          <div className="no-data-found">No data found</div>
        )}
      </div>
    </SelectTokenWrapper>
  );
};

export default SelectToken;
