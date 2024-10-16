import { useAtom } from "jotai";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

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

import { STATIC_TEXT } from "@common/values";
import {
  InputStyle,
  ModalContainer,
  Overlay,
  SearchContainer,
  SearchModalBackground,
  SearchWrapper,
  TokenInfoWrapper,
} from "./SearchMenuModal.styles";

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
}) => {
  const { t } = useTranslation();

  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();

  const [, setRecentsData] = useAtom(TokenState.recents);
  const [widthListPopular, setWidthListPopular] = useState<number[]>(
    popularTokens.map(() => 0),
  );
  const [widthListRecent, setWidthListRecent] = useState<number[]>(
    recents.map(() => 0),
  );
  const [tokenNameRecentWidthList, setTokenNameRecentWidthList] = useState<
    number[]
  >(recents.map(() => 0));
  const [tokenNamePopularWidthList, setTokenNamePopularWidthList] = useState<
    number[]
  >(popularTokens.map(() => 0));

  const tokenNamePopularRef = useRef(
    popularTokens.map(() => React.createRef<HTMLSpanElement>()),
  );
  const tokenNameRecentsRef = useRef(
    recents.map(() => React.createRef<HTMLSpanElement>()),
  );
  const recentPriceRef = useRef(
    recents.map(() => React.createRef<HTMLDivElement>()),
  );
  const popularPriceRef = useRef(
    popularTokens.map(() => React.createRef<HTMLDivElement>()),
  );

  const menuRef = useRef<HTMLDivElement | null>(null);

  const popularTokenKey = useMemo(
    () => popularTokens.map(token => token.path).join(","),
    [popularTokens],
  );

  const recentKey = useMemo(
    () => recents.map(token => token.path).join(","),
    [recents],
  );

  const onClickItem = (item: Token) => {
    const current = recents.length > 0 ? [item, recents[0]] : [item];

    setRecentsData(
      JSON.stringify(
        current.filter((_item, index) => {
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
  };

  const onClickPath = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, path: string) => {
      e.stopPropagation();
      if (path === "gnot") {
        window.open(getGnoscanUrl(), "_blank");
      } else {
        window.open(getTokenUrl(path), "_blank");
      }
    },
    [getGnoscanUrl, getTokenUrl],
  );

  useEffect(() => {
    const widthValues: number[] = [];
    popularPriceRef.current.forEach(ref => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        widthValues.push(width);
      }
    });
    setWidthListPopular(widthValues);
  }, [popularPriceRef]);

  useEffect(() => {
    const widthValues: number[] = [];
    recentPriceRef.current.forEach(ref => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        widthValues.push(width);
      }
    });
    setWidthListRecent(widthValues);
  }, [recentPriceRef, popularTokenKey, keyword]);

  useEffect(() => {
    const widthValues: number[] = [];
    tokenNameRecentsRef.current.forEach(ref => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        widthValues.push(width);
      }
    });
    setTokenNameRecentWidthList(widthValues);
  }, [tokenNameRecentsRef, recentKey, keyword]);

  useEffect(() => {
    const temp: number[] = [];
    tokenNamePopularRef.current.forEach(ref => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        temp.push(width);
      }
    });
    setTokenNamePopularWidthList(temp);
  }, [tokenNamePopularRef, keyword, popularTokenKey]);

  const length = useMemo(() => {
    return breakpoint === DEVICE_TYPE.MOBILE ? 15 : 25;
  }, [breakpoint]);

  const getTokenPathDisplay = useCallback(
    (path: string, isNative?: boolean) => {
      const path_ = path;

      if (isNative) return STATIC_TEXT.NATIVE_COIN;

      const tokenPathArr = path_?.split("/") ?? [];

      if (tokenPathArr?.length <= 0) return path_;

      const replacedPath = path_.replace("gno.land", "");

      if (replacedPath.length >= length) {
        return (
          "..." +
          replacedPath.slice(
            replacedPath.length - length,
            replacedPath.length - 1,
          )
        );
      }

      return path_.replace("gno.land", "...");
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
              />
              <IconSearch className="search-icon" />
            </SearchWrapper>
          </SearchContainer>
          <ModalContainer>
            <ul>
              {popularTokens.length === 0 &&
                mostLiquidity.length === 0 &&
                isFetched && (
                  <div className="no-data-found">{t("common:noDataFound")}</div>
                )}
              {!keyword && recents.length > 0 && isFetched && (
                <>
                  <div className="recent-searches">
                    {!keyword
                      ? t("Modal:search.recentSearch")
                      : t("Modal:search.tokens")}
                  </div>
                  {recents.map((item, idx) =>
                    !item.isLiquid ? (
                      <li key={idx} onClick={() => onClickItem(item)}>
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
                            maxWidth={widthListRecent[idx]}
                            tokenNameWidthList={tokenNameRecentWidthList[idx]}
                          >
                            <div>
                              <span
                                className="token-name"
                                ref={tokenNameRecentsRef.current[idx]}
                              >
                                {item.token.name.length > length
                                  ? `${item.token.name.slice(0, length)}...`
                                  : item.token.name}
                              </span>
                              <div
                                className="token-path"
                                onClick={(
                                  e: React.MouseEvent<
                                    HTMLDivElement,
                                    MouseEvent
                                  >,
                                ) => onClickPath(e, item.token.path)}
                              >
                                <div>
                                  {getTokenPathDisplay(
                                    item.token.path,
                                    item.isNative,
                                  )}
                                </div>
                                <IconNewTab />
                              </div>
                            </div>
                            <span>{item.token.symbol}</span>
                          </TokenInfoWrapper>
                        </div>
                        <div
                          className="coin-infor-value"
                          ref={recentPriceRef.current[idx]}
                        >
                          <span className="token-price">{item.price}</span>
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
                      <li key={idx} onClick={() => onClickItem(item)}>
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
                          <Badge
                            text={item.fee}
                            type={BADGE_TYPE.DARK_DEFAULT}
                          />
                        </div>
                        <div className="coin-infor-value">
                          <span className="token-price">{item.price}</span>
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
                    {!keyword
                      ? t("Modal:search.popular")
                      : t("Modal:search.tokens")}
                  </div>
                  {popularTokens.map((item, idx) => (
                    <li key={idx} onClick={() => onClickItem(item)}>
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
                          maxWidth={widthListPopular[idx]}
                          tokenNameWidthList={tokenNamePopularWidthList[idx]}
                        >
                          <div>
                            <span
                              className="token-name"
                              ref={tokenNamePopularRef.current[idx]}
                            >
                              {item.token.name.length > length
                                ? `${item.token.name.slice(0, length)}...`
                                : item.token.name}
                            </span>
                            <div
                              className="token-path"
                              onClick={(
                                e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                              ) => onClickPath(e, item.token.path)}
                            >
                              <div>
                                {getTokenPathDisplay(
                                  item.token.path,
                                  item.isNative,
                                )}
                              </div>
                              <IconNewTab />
                            </div>
                          </div>
                          <span>{item.token.symbol}</span>
                        </TokenInfoWrapper>
                      </div>
                      <div
                        className="coin-infor-value"
                        ref={popularPriceRef.current[idx]}
                      >
                        <span className="token-price">{item.price}</span>
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
                    {!keyword
                      ? t("Modal:search.mostLiquiPools")
                      : t("Modal:search.pools")}
                  </div>
                  {mostLiquidity.map((item, idx) => (
                    <li key={idx} onClick={() => onClickItem(item)}>
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
                        <span className="token-price">{item.price}</span>
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

export default SearchMenuModal;
