import IconClose from "@components/common/icons/IconCancel";
import IconSearch from "@components/common/icons/IconSearch";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { TokenModel } from "@models/token/token-model";
import { getSwapExtensionByOriginPath } from "@resources/swap-extension";
import { TokenState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import { removeDuplicatesByWrappedPath } from "@utils/common";
import { formatTokenModelPath, formatTokenPath } from "@utils/token-utils";
import { keepVerified } from "@utils/token-verification-filter";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import IconNewTab from "../icons/IconNewTab";
import MissingLogo from "../missing-logo/MissingLogo";
import ShowUnverifiedTokensSwitch from "../show-unverified-tokens-switch/ShowUnverifiedTokensSwitch";
import { Divider, SelectTokenWrapper, TokenInfoWrapper } from "./SelectToken.styles";

const MAX_TOKEN_CHIPS = 4;

export interface SelectTokenProps {
  keyword: string;
  defaultTokens: TokenModel[];
  tokens: TokenModel[];
  tokenPrices: { [key in string]: string | number | null };
  changeKeyword: (keyword: string) => void;
  changeToken: (token: TokenModel) => void;
  close: () => void;
  themeKey: "dark" | "light";
  breakpoint: DEVICE_TYPE;
  recents: TokenModel[];
  isSwitchNetwork: boolean;
  showUnverified: boolean;
  toggleShowUnverified: () => void;
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
  breakpoint,
  recents = [],
  isSwitchNetwork,
  showUnverified,
  toggleShowUnverified,
}) => {
  const { t } = useTranslation();

  const myElementRef = useRef<HTMLDivElement | null>(null);
  const priceRefs = useRef<React.RefObject<HTMLSpanElement>[]>([]);
  const tokenNameRef = useRef<React.RefObject<HTMLSpanElement>[]>([]);
  // Keep one ref per row, since the list grows when unverified tokens are shown.
  priceRefs.current = tokens.map((_, index) => priceRefs.current[index] ?? React.createRef<HTMLSpanElement>());
  tokenNameRef.current = tokens.map((_, index) => tokenNameRef.current[index] ?? React.createRef<HTMLSpanElement>());
  const [widthList, setWidthList] = useState<number[]>(tokens.map(() => 0));
  const [tokenNameWidthList, setTokenNameWidthList] = useState<number[]>(tokens.map(() => 0));
  const [, setRecentsData] = useAtom(TokenState.selectRecents);
  const { getGnoscanUrl, getRealmUrl, getTokenUrl } = useGnoscanUrl();

  const getTokenPrice = useCallback(
    (token: TokenModel) => {
      const balance = BigNumber(tokenPrices[token.path] ?? "");
      if (balance.isNaN() || balance.isLessThanOrEqualTo(0) || isSwitchNetwork) {
        return "-";
      }

      return balance.toFormat();
    },
    [tokenPrices, isSwitchNetwork],
  );
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const onClickToken = useCallback(
    (token: TokenModel) => {
      const nextRecents = [token, ...recents.filter(item => item.path !== token.path)].slice(0, MAX_TOKEN_CHIPS);
      setRecentsData(JSON.stringify(nextRecents));
      changeToken(token);
    },
    [changeToken, recents, setRecentsData],
  );

  const onChangeSearchKeyword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchKeyword = event.target.value;
      changeKeyword(searchKeyword);
    },
    [changeKeyword],
  );

  useEffect(() => {
    const temp: number[] = [];
    priceRefs.current.forEach(ref => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        temp.push(width);
      }
    });
    setWidthList(temp);
  }, [priceRefs, tokens]);

  useEffect(() => {
    const temp: number[] = [];
    tokenNameRef.current.forEach(ref => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        temp.push(width);
      }
    });
    setTokenNameWidthList(temp);
  }, [tokenNameRef, keyword, tokens]);

  const onClickPath = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, token: TokenModel) => {
      e.stopPropagation();
      if (token.path === "ugnot") {
        window.open(getGnoscanUrl(), "_blank");
      } else if (getSwapExtensionByOriginPath(token.path)) {
        window.open(getRealmUrl(token.path), "_blank");
      } else {
        window.open(getTokenUrl(token.path), "_blank");
      }
    },
    [getGnoscanUrl, getRealmUrl, getTokenUrl],
  );

  const length = useMemo(() => {
    return breakpoint === DEVICE_TYPE.MOBILE ? 10 : 15;
  }, [breakpoint]);

  // recents stays unfiltered so hidden tokens are not dropped from storage on the next selection.
  const getTokensRecent = removeDuplicatesByWrappedPath([...keepVerified(recents, showUnverified), ...defaultTokens]).slice(
    0,
    MAX_TOKEN_CHIPS,
  );

  return (
    <SelectTokenWrapper ref={myElementRef}>
      <div className="content">
        <div className="header">
          <span>{t("common:selectPairBtn.modal.title")}</span>
          <div className="header-actions">
            <ShowUnverifiedTokensSwitch checked={showUnverified} onChange={toggleShowUnverified} />
            <div className="close-wrap" onClick={onClickClose}>
              <IconClose className="close-icon" />
            </div>
          </div>
        </div>
        <div className="search-wrap">
          <input
            className="search-input"
            placeholder={t("common:selectPairBtn.modal.searchInputPlaceholder")}
            value={keyword}
            onChange={onChangeSearchKeyword}
            autoComplete={"off"}
            spellCheck={"false"}
          />
          <IconSearch className="search-icon" />
        </div>
        <div className="token-select">
          {getTokensRecent.map((token, index) => (
            <div
              className={`token-button ${themeKey === "dark" && "border-button-none"}`}
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
              <span>{token.displaySymbol}</span>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className={`token-list-wrapper ${tokens.length === 0 ? "token-list-wrapper-auto-height" : ""}`}>
        {tokens.length > 0 &&
          tokens.map((token, index) => {
            const displayTokenPath = getSwapExtensionByOriginPath(token.path)
              ? formatTokenPath(token.path, false)
              : formatTokenModelPath(token);
            return (
              <div className="list" key={index} onClick={() => onClickToken(token)}>
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
                      <span className="token-name" ref={tokenNameRef.current[index]}>
                        {token.name.length > length ? `${token.name.slice(0, length)}...` : token.name}
                      </span>
                      <div
                        className="token-path"
                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClickPath(e, token)}
                      >
                        <div>{displayTokenPath}</div>
                        <IconNewTab />
                      </div>
                    </div>
                    <span className="token-symbol">{token.displaySymbol}</span>
                  </TokenInfoWrapper>
                </div>
                <span className="token-balance" ref={priceRefs.current[index]}>
                  {getTokenPrice(token)}
                </span>
              </div>
            );
          })}
        {tokens.length === 0 && <div className="no-data-found">{t("common:selectPairBtn.modal.noData")}</div>}
      </div>
    </SelectTokenWrapper>
  );
};

export default SelectToken;
