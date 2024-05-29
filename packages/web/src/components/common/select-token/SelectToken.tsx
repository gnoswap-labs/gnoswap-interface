import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  Divider,
  SelectTokenWrapper,
  TokenInfoWrapper,
} from "./SelectToken.styles";
import IconSearch from "@components/common/icons/IconSearch";
import IconClose from "@components/common/icons/IconCancel";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import IconNewTab from "../icons/IconNewTab";
import { DEVICE_TYPE } from "@styles/media";
import { useAtom } from "jotai";
import { TokenState } from "@states/index";
import { ORDER } from "@containers/select-token-container/SelectTokenContainer";
import MissingLogo from "../missing-logo/MissingLogo";
import { makeId, removeDuplicatesByWrappedPath } from "@utils/common";

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
  isSwitchNetwork: boolean;
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
  recents = [],
  isSwitchNetwork,
}) => {
  const myElementRef = useRef<HTMLDivElement | null>(null);
  const priceRefs = useRef(
    tokens.map(() => React.createRef<HTMLSpanElement>()),
  );
  const tokenNameRef = useRef(
    tokens.map(() => React.createRef<HTMLSpanElement>()),
  );
  const [widthList, setWidthList] = useState<number[]>(tokens.map(() => 0));
  const [tokenNameWidthList, setTokenNameWidthList] = useState<number[]>(
    tokens.map(() => 0),
  );
  const [positionTop, setPositionTop] = useState(0);
  const [, setRecentsData] = useAtom(TokenState.selectRecents);

  const getTokenPrice = useCallback(
    (token: TokenModel) => {
      const tokenPrice = tokenPrices[token.path];
      if (!tokenPrice || tokenPrice === null || Number.isNaN(tokenPrice) || isSwitchNetwork) {
        return "-";
      }
      return BigNumber(tokenPrice).toFormat();
    },
    [tokenPrices, isSwitchNetwork],
  );
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const onClickToken = useCallback(
    (token: TokenModel) => {
      const current = [...recents, token].filter(
        item => !ORDER.includes(item.symbol),
      );
      const filterData = current.filter((_item, index) => {
        const _value = JSON.stringify(_item);
        return (
          index ===
          current.findIndex(obj => {
            return JSON.stringify(obj) === _value;
          })
        );
      });
      setRecentsData(
        JSON.stringify(
          filterData.slice(
            filterData.length <= 4 ? 0 : 1,
            filterData.length <= 4 ? 4 : 5,
          ),
        ),
      );
      changeToken(token);
    },
    [changeToken, close],
  );

  const onChangeSearchKeyword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchKeyword = event.target.value;
      changeKeyword(searchKeyword);
    },
    [changeKeyword],
  );

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
    priceRefs.current.forEach(ref => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        temp.push(width);
      }
    });
    setWidthList(temp);
  }, [priceRefs]);

  useEffect(() => {
    const temp: number[] = [];
    tokenNameRef.current.forEach(ref => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        temp.push(width);
      }
    });
    setTokenNameWidthList(temp);
  }, [tokenNameRef, keyword, tokens.toString()]);

  const onClickPath = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, path: string) => {
      e.stopPropagation();
      if (path === "gnot") {
        window.open("https://gnoscan.io/", "_blank");
      } else {
        window.open("https://gnoscan.io/tokens/" + makeId(path), "_blank");
      }
    },
    [],
  );

  const length = useMemo(() => {
    return breakpoint === DEVICE_TYPE.MOBILE ? 10 : 15;
  }, [breakpoint]);

  const getTokensRecent = removeDuplicatesByWrappedPath([
    ...defaultTokens,
    ...recents,
  ]);

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
          {getTokensRecent.map((token, index) => (
            <div
              className={`token-button ${themeKey === "dark" && "border-button-none"
                }`}
              key={index}
              onClick={() => onClickToken(token)}
            >
              <MissingLogo
                symbol={token.symbol}
                url={token.logoURI}
                className="token-logo"
                width={24}
                mobileWidth={24}
              />
              <span>{token.symbol}</span>
            </div>
          ))}
        </div>
      </div>
      <Divider />
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
                <MissingLogo
                  symbol={token.symbol}
                  url={token.logoURI}
                  className="token-logo"
                  width={32}
                  mobileWidth={32}
                />
                <TokenInfoWrapper
                  className="token-info-detail"
                  maxWidth={widthList[index]}
                  tokenNameWidthList={tokenNameWidthList[index]}
                >
                  <div>
                    <span
                      className="token-name"
                      ref={tokenNameRef.current[index]}
                    >
                      {token.name.length > length
                        ? `${token.name.slice(0, length)}...`
                        : token.name}
                    </span>
                    <div
                      className="token-path"
                      onClick={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                      ) => onClickPath(e, token.path)}
                    >
                      <div>{isNativeToken(token) ? "Native Coin" : token.path}</div>
                      <IconNewTab />
                    </div>
                  </div>
                  <span className="token-symbol">{token.symbol}</span>
                </TokenInfoWrapper>
              </div>
              <span className="token-balance" ref={priceRefs.current[index]}>
                {getTokenPrice(token)}
              </span>
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
