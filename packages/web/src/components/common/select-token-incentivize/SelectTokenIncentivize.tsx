import React, { useCallback } from "react";
import { SelectTokenIncentivizeWrapper } from "./SelectTokenIncentivize.styles";
import IconClose from "@components/common/icons/IconCancel";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
export interface SelectTokenIncentivizeProps {
  keyword: string;
  defaultTokens: TokenModel[];
  tokens: TokenModel[];
  tokenPrices: { [key in string]: number | null };
  changeKeyword: (keyword: string) => void;
  changeToken: (token: TokenModel) => void;
  close: () => void;
  themeKey: "dark" | "light";
}

const SelectTokenIncentivize: React.FC<SelectTokenIncentivizeProps> = ({
  tokens,
  tokenPrices,
  changeToken,
  close,
}) => {
  const getTokenPrice = useCallback((token: TokenModel) => {
    const tokenPrice = tokenPrices[token.priceId];
    if (!tokenPrice || tokenPrice === null || Number.isNaN(tokenPrice)) {
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

  return (
    <SelectTokenIncentivizeWrapper>
      <div className="content">
        <div className="header">
          <span>Select a token</span>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
      </div>
      <div
        className={`token-list-wrapper ${
          tokens.length === 0 ? "token-list-wrapper-auto-height" : ""
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
                {token.logoURI ? <img src={token.logoURI} alt="logo" className="token-logo" /> : <div className="missing-logo">{token.symbol.slice(0,3)}</div>}
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
    </SelectTokenIncentivizeWrapper>
  );
};

export default SelectTokenIncentivize;
