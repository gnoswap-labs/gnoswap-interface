import React, { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { Divider, SelectTokenWrapper, TokenInfoWrapper } from "./SelectToken.styles";
import IconSearch from "@components/common/icons/IconSearch";
import IconClose from "@components/common/icons/IconCancel";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import IconNewTab from "../icons/IconNewTab";
import { DEVICE_TYPE } from "@styles/media";
import { useAtom } from "jotai";
import { TokenState } from "@states/index";
import { ORDER } from "@containers/select-token-container/SelectTokenContainer";

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
  breakpoint: DEVICE_TYPE;
  recents: TokenModel[];
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
  breakpoint,
  recents,
}) => {
  const myElementRef = useRef<HTMLDivElement | null>(null);
  const priceRefs = useRef(tokens.map(() => React.createRef<HTMLSpanElement>()));
  const tokenNameRef = useRef(tokens.map(() => React.createRef<HTMLSpanElement>()));
  const [widthList, setWidthList] = useState<number[]>(tokens.map(() => (0)));
  const [tokenNameWidthList, setTokenNameWidthList] = useState<number[]>(tokens.map(() => (0)));
  const [positionTop, setPositionTop] = useState(0);
  const [, setRecentsData] = useAtom(TokenState.selectRecents);

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
    const current = [...recents, token,].filter((item) => !ORDER.includes(item.symbol));
    const filterData = current.filter((_item, index) => {
      const _value = JSON.stringify(_item);
      return index === current.findIndex(obj => {
        return JSON.stringify(obj) === _value;
      });
    });
    setRecentsData(JSON.stringify(filterData.slice(filterData.length <= 4 ? 0 : 1, filterData.length <= 4 ? 4 : 5)));
    changeToken(token);
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

  useEffect(() => {
    const temp: number[] = [];
    priceRefs.current.forEach((ref) => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        temp.push(width);
      }
    });
    setWidthList(temp);
  }, [priceRefs]);

  useEffect(() => {
    const temp: number[] = [];
    tokenNameRef.current.forEach((ref) => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        temp.push(width);
      }
    });
    setTokenNameWidthList(temp);
  }, [tokenNameRef, keyword, tokens.toString()]);

  const onClickPath = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, path: string) => {
    e.stopPropagation();
    if (path === "gnot") {
      window.open("https://gnoscan.io/", "_blank");
    } else {
      window.open("https://gnoscan.io/tokens/" + path, "_blank");
    }
  }, []);

  const length = useMemo(() => {
    return breakpoint === DEVICE_TYPE.MOBILE ? 10 : 15;
  }, [breakpoint]);

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
          {[...defaultTokens, ...recents].map((token, index) => (
            <div
              className={`token-button ${
                themeKey === "dark" && "border-button-none"
              }`}
              key={index}
              onClick={() => onClickToken(token)}
            >
              {token.logoURI ? <img src={token.logoURI} alt="logo" className="token-logo" /> : <div className="missing-logo">{token.symbol.slice(0,3)}</div>}
              <span>{token.symbol}</span>
            </div>
          ))}
        </div>
      </div>
      <Divider />
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
                <TokenInfoWrapper className="token-info-detail" maxWidth={widthList[index]} tokenNameWidthList={tokenNameWidthList[index]}>
                  <div>
                    <span className="token-name" ref={tokenNameRef.current[index]}>{token.name.length > length ? `${token.name.slice(0, length)}...` : token.name}</span>
                    <div className="token-path" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClickPath(e, token.path)}>
                      <div>{token.path}</div>
                      <IconNewTab />
                    </div>
                  </div>
                  <span className="token-symbol">{token.symbol}</span>
                </TokenInfoWrapper>
              </div>
              <span className="token-balance" ref={priceRefs.current[index]}>{getTokenPrice(token)}</span>
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
