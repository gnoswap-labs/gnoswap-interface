import { useAtom } from "jotai";
import React, { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cx } from "@emotion/css";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconNewTab from "@components/common/icons/IconNewTab";
import IconSearch from "@components/common/icons/IconSearch";
import IconTriangleArrowDownV2 from "@components/common/icons/IconTriangleArrowDownV2";
import IconTriangleArrowUpV2 from "@components/common/icons/IconTriangleArrowUpV2";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { TokenInfo } from "@models/token/token-info";
import { TokenState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import { useTokenPriceInfo } from "@hooks/token/data/use-token-price-info";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";

import {
  InputStyle,
  ModalContainer,
  Overlay,
  SearchContainer,
  SearchModalBackground,
  SearchWrapper,
  TokenInfoWrapper,
} from "./SearchMenuModal.styles";
import useElementWidth from "@hooks/common/use-element-width";
import useElementWidthList from "@hooks/common/use-element-width-list";
import { formatTokenPath } from "@utils/token-utils";
import PriceWarning from "@components/common/price-warning/PriceWarning";

interface NegativeStatusType {
  status: MATH_NEGATIVE_TYPE;
  value: string;
}
export interface Token {
  path: string;
  searchType: string;
  token: TokenInfo;
  price: string;
  priceOf1d: NegativeStatusType;
  tokenB?: TokenInfo;
  isLiquid?: boolean;
  fee: string;
  apr?: string;
  volume?: string;
  liquidity: number;
  isNative: boolean;
  priceGradeType: TOKEN_PRICE_GRADE_TYPE;
}

interface SearchMenuModalProps {
  onSearchMenuToggle: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  moveTokenPage: (path: string) => void;
  movePoolPage: (path: string) => void;
  keyword: string;
  tokens: Token[];
  isFetched: boolean;
  placeholder?: string;
  breakpoint: DEVICE_TYPE;
  mostLiquidity: Token[];
  popularTokens: Token[];
  recents: Token[];
}

const SearchMenuModal: React.FC<SearchMenuModalProps> = ({
  onSearchMenuToggle,
  search,
  moveTokenPage,
  movePoolPage,
  keyword,
  isFetched,
  placeholder = "Search",
  breakpoint,
  mostLiquidity,
  popularTokens,
  recents,
  tokens,
}) => {
  const { t } = useTranslation();

  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();
  const [, setRecentsData] = useAtom(TokenState.recents);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const popularTokenKey = useMemo(() => popularTokens.map(token => token.path).join(","), [popularTokens]);

  const recentKey = useMemo(() => recents.map(token => token.path).join(","), [recents]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tokenNamePopularRef = useRef(popularTokens.map(() => React.createRef<HTMLSpanElement>()));
  const tokenNameRecentsRef = useRef(recents.map(() => React.createRef<HTMLSpanElement>()));
  const recentPriceRef = useRef(recents.map(() => React.createRef<HTMLDivElement>()));
  const popularPriceRef = useRef(popularTokens.map(() => React.createRef<HTMLDivElement>()));

  const widthListPopular = useElementWidthList(popularTokens, popularPriceRef.current, [popularPriceRef]);
  const widthListRecent = useElementWidthList(recents, recentPriceRef.current, [
    recentPriceRef,
    popularTokenKey,
    keyword,
  ]);
  const tokenNameRecentWidthList = useElementWidthList(recents, tokenNameRecentsRef.current, [
    tokenNameRecentsRef,
    recentKey,
    keyword,
  ]);
  const tokenNamePopularWidthList = useElementWidthList(popularTokens, tokenNamePopularRef.current, [
    tokenNamePopularRef,
    keyword,
    popularTokenKey,
  ]);

  const containerWidth = useElementWidth(containerRef, [
    tokens,
    recents,
    popularPriceRef,
    recentPriceRef,
    popularTokenKey,
    keyword,
    popularTokens,
    tokenNameRecentsRef,
    recentKey,
    tokenNamePopularRef,
    popularTokenKey,
  ]);

  const onClickItem = useCallback(
    (item: Token) => {
      const current = recents.length > 0 ? [item, recents[0]] : [item];

      setRecentsData(
        JSON.stringify(
          current
            .filter(recentToken => tokens.some(token => token.token.path === recentToken.token.path))
            .filter((_item, index) => {
              const _value = JSON.stringify(_item);
              return (
                index ===
                current.findIndex(obj => {
                  return JSON.stringify(obj) === _value;
                })
              );
            }),
        ),
      );
      onSearchMenuToggle();
      if (item.isLiquid) {
        const poolPath = `${item.token.path}:${item?.tokenB?.path}:${
          Number(item.fee.slice(0, item.fee.length - 1)) * 10000
        }`;
        movePoolPage(poolPath);
      } else {
        const tokenPath = item.token.path;
        moveTokenPage(tokenPath);
      }
    },
    [recents, tokens, setRecentsData, onSearchMenuToggle, movePoolPage, moveTokenPage],
  );

  const onClickPath = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, path: string) => {
      e.stopPropagation();
      if (path === "ugnot") {
        window.open(getGnoscanUrl(), "_blank");
      } else {
        window.open(getTokenUrl(path), "_blank");
      }
    },
    [getGnoscanUrl, getTokenUrl],
  );

  const length = useMemo(() => {
    return breakpoint === DEVICE_TYPE.MOBILE ? 15 : 25;
  }, [breakpoint]);

  const getTokenPathDisplay = useCallback(
    (path: string, isNative: boolean) => {
      return formatTokenPath(path, isNative);
    },
    [length],
  );

  return (
    <>
      <SearchModalBackground>
        <div ref={menuRef}>
          <SearchContainer>
            <SearchWrapper>
              <InputStyle
                placeholder={placeholder}
                value={keyword}
                onChange={search}
                autoComplete={"off"}
                spellCheck={"false"}
              />
              <IconSearch className="search-icon" />
            </SearchWrapper>
          </SearchContainer>
          <ModalContainer ref={containerRef}>
            <ul>
              {popularTokens.length === 0 && mostLiquidity.length === 0 && isFetched && (
                <div className="no-data-found">{t("common:noDataFound")}</div>
              )}
              {!keyword && recents.length > 0 && isFetched && (
                <>
                  <div className="recent-searches">
                    {!keyword ? t("Modal:search.recentSearch") : t("Modal:search.tokens")}
                  </div>
                  {recents.map((item, idx) =>
                    !item.isLiquid ? (
                      <li key={item.path} onClick={() => onClickItem(item)}>
                        <div className="coin-info-wrapper">
                          <MissingLogo
                            symbol={item.token.symbol}
                            url={item.token.logoURI}
                            className="token-logo"
                            width={32}
                            mobileWidth={24}
                          />
                          <TokenInfoWrapper
                            className="coin-info-detail"
                            containerWidth={containerWidth}
                            maxWidth={widthListRecent[idx]}
                            tokenNameWidthList={tokenNameRecentWidthList[idx]}
                          >
                            <div>
                              <span className="token-name" ref={tokenNameRecentsRef.current[idx]}>
                                {item.token.name.length > length
                                  ? `${item.token.name.slice(0, length)}...`
                                  : item.token.name}
                              </span>
                              <div
                                className="token-path"
                                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                  onClickPath(e, item.token.path)
                                }
                              >
                                <div className="path">{getTokenPathDisplay(item.token.path, item.isNative)}</div>
                                <IconNewTab />
                              </div>
                            </div>
                            <span>{item.token.symbol}</span>
                          </TokenInfoWrapper>
                        </div>
                        <div className="coin-infor-value" ref={recentPriceRef.current[idx]}>
                          <TokenPriceDisplay token={item} />
                          {item.priceOf1d.status !== "NEGATIVE" ? (
                            <span className="positive">
                              <IconTriangleArrowUpV2 />
                              {item.priceOf1d.value}
                            </span>
                          ) : (
                            <span className="negative">
                              <IconTriangleArrowDownV2 />
                              {item.priceOf1d.value}
                            </span>
                          )}
                        </div>
                      </li>
                    ) : (
                      <li key={item.path} onClick={() => onClickItem(item)}>
                        <div className="coin-info">
                          <DoubleLogo
                            size={breakpoint !== DEVICE_TYPE.MOBILE ? 28 : 21}
                            left={item.token.logoURI}
                            right={item?.tokenB?.logoURI || ""}
                            leftSymbol={item.token.symbol}
                            rightSymbol={item?.tokenB?.symbol}
                          />
                          <span className="token-name">
                            {item.token.symbol}/{item?.tokenB?.symbol}
                          </span>
                          <Badge text={item.fee} type={BADGE_TYPE.DARK_DEFAULT} />
                        </div>
                        <div className="coin-infor-value">
                          <TokenPriceDisplay token={item} />
                          <div className="token-price-apr">{item.apr}</div>
                        </div>
                      </li>
                    ),
                  )}
                </>
              )}
              {popularTokens.length > 0 && (
                <>
                  <div className="popular-tokens">
                    {!keyword ? t("Modal:search.popular") : t("Modal:search.tokens")}
                  </div>
                  {popularTokens.map((item, idx) => (
                    <li key={item.path} onClick={() => onClickItem(item)}>
                      <div className="coin-info-wrapper">
                        <MissingLogo
                          symbol={item.token.symbol}
                          url={item.token.logoURI}
                          className="token-logo"
                          width={32}
                          mobileWidth={24}
                        />
                        <TokenInfoWrapper
                          className="coin-info-detail"
                          containerWidth={containerWidth}
                          maxWidth={widthListPopular[idx]}
                          tokenNameWidthList={tokenNamePopularWidthList[idx]}
                        >
                          <div>
                            <span className="token-name" ref={tokenNamePopularRef.current[idx]}>
                              {item.token.name.length > length
                                ? `${item.token.name.slice(0, length)}...`
                                : item.token.name}
                            </span>
                            <div
                              className="token-path"
                              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                onClickPath(e, item.token.path)
                              }
                            >
                              <div>{getTokenPathDisplay(item.token.path, item.isNative)}</div>
                              <IconNewTab />
                            </div>
                          </div>
                          <span>{item.token.symbol}</span>
                        </TokenInfoWrapper>
                      </div>
                      <div className="coin-infor-value" ref={popularPriceRef.current[idx]}>
                        <TokenPriceDisplay token={item} />
                        {item.priceOf1d.status !== "NEGATIVE" ? (
                          <span className="positive">
                            <IconTriangleArrowUpV2 />
                            {item.priceOf1d.value}
                          </span>
                        ) : (
                          <span className="negative">
                            <IconTriangleArrowDownV2 /> {item.priceOf1d.value}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </>
              )}
              {mostLiquidity.length > 0 && (
                <>
                  <div className="popular-tokens">
                    {!keyword ? t("Modal:search.mostLiquiPools") : t("Modal:search.pools")}
                  </div>
                  {mostLiquidity.map(item => (
                    <li key={item.path} onClick={() => onClickItem(item)}>
                      <div className="coin-info">
                        <DoubleLogo
                          size={breakpoint !== DEVICE_TYPE.MOBILE ? 28 : 21}
                          left={item.token.logoURI}
                          right={item?.tokenB?.logoURI || ""}
                          leftSymbol={item.token.symbol}
                          rightSymbol={item?.tokenB?.symbol}
                        />
                        <span className="token-name">
                          {item.token.symbol}/{item?.tokenB?.symbol}
                        </span>
                        <Badge text={item.fee} type={BADGE_TYPE.DARK_DEFAULT} />
                      </div>
                      <div className="coin-infor-value">
                        <TokenPriceDisplay token={item} />
                        <div className="token-price-apr">{item.apr}</div>
                      </div>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </ModalContainer>
        </div>
      </SearchModalBackground>
      <Overlay onClick={onSearchMenuToggle} />
    </>
  );
};

const TokenPriceDisplay = ({ token }: { token: Token }) => {
  const { price, priceGradeType } = token;
  const { priceStyle, shouldShowPriceWarning } = useTokenPriceInfo({ priceGradeType });

  return (
    <span className={cx("token-price", priceStyle.className)}>
      {price}
      {shouldShowPriceWarning && <PriceWarning type="PRICE" />}
    </span>
  );
};

export default SearchMenuModal;
