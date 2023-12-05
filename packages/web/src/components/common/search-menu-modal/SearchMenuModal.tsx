// TODO : remove eslint-disable after work
/* eslint-disable */
import { Token } from "@containers/header-container/HeaderContainer";
import React, { useRef } from "react";
import {
  SearchModalBackground,
  SearchContainer,
  SearchWrapper,
  InputStyle,
  ModalContainer,
  Overlay,
} from "./SearchMenuModal.styles";
import IconSearch from "@components/common/icons/IconSearch";
import Badge, { BADGE_TYPE } from "../badge/Badge";
import DoubleLogo from "../double-logo/DoubleLogo";
import IconStar from "../icons/IconStar";
import IconNewTab from "../icons/IconNewTab";
import IconTriangleArrowDownV2 from "../icons/IconTriangleArrowDownV2";
import IconTriangleArrowUpV2 from "../icons/IconTriangleArrowUpV2";
interface SearchMenuModalProps {
  onSearchMenuToggle: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  tokens: Token[];
  isFetched: boolean;
  placeholder?: string;
}

const SearchMenuModal: React.FC<SearchMenuModalProps> = ({
  onSearchMenuToggle,
  search,
  keyword,
  tokens,
  isFetched,
  placeholder = "Search",
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const onClickItem = (symbol: string) => {
    location.href = "/tokens/" + symbol;
  };

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
              {tokens.length === 0 && isFetched && (
                <div className="no-data-found">No data found</div>
              )}
              {(tokens.length !== 0 || !isFetched) && (
                <>
                  <div className="recent-searches">
                    {!keyword ? "Recent Searches" : "Tokens"}
                  </div>
                  {tokens.slice(0,2)
                    .filter(item => item.searchType === "recent")
                    .map((item, idx) => (
                      !item.isLiquid ? (
                      <li
                        key={idx}
                        onClick={() => onClickItem(item.token.symbol)}
                      >
                        <div className="coin-info-wrapper">
                          <img
                            src={item.token.logoURI}
                            alt="token logo"
                            className="token-logo"
                          />
                          <div className="coin-info-detail">
                            <div>
                              <span className="token-name">{item.token.name}</span>
                              <div className="token-path">
                                {item.token.path}
                                <IconNewTab />
                              </div>
                            </div>
                            <span>
                              ETH
                            </span>
                          </div>
                        </div>
                        <div className="coin-infor-value">
                          <span className="token-price">{item.price}</span>
                          {item.priceOf1d.status === "POSITIVE" ? (
                            <span className="positive">
                              <IconTriangleArrowUpV2 />{item.priceOf1d.value}%
                            </span>
                          ) : (
                            <span className="negative">
                              -<IconTriangleArrowDownV2 /> {item.priceOf1d.value}%
                            </span>
                          )}
                        </div>
                      </li>
                      ) : (
                      <li
                        key={idx}
                        onClick={() => onClickItem(item.token.symbol)}
                      >
                        <div className="coin-info">
                          <DoubleLogo
                            size={32}
                            left={item.token.logoURI}
                            right={item?.tokenB?.logoURI || ""}
                          />
                          <span className="token-name">
                            {item.token.name}/{item?.tokenB?.name}
                          </span>
                          <Badge
                            text={"0.3%"}
                            type={BADGE_TYPE.DARK_DEFAULT}
                          />
                        </div>
                        <div className="coin-infor-value">
                          <span className="token-price">
                            $123.25M
                          </span>
                          <div className="token-price-apr">{item.priceOf1d.value}% {item.token.symbol}</div>
                        </div>
                      </li>
                    )
                    ))}
                  <div className="popular-tokens">
                    {!keyword ? "Popular Tokens" : "Pools"}
                  </div>
                  {tokens
                    .filter(item => item.searchType === "popular")
                    .map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => onClickItem(item.token.symbol)}
                      >
                        <div className="coin-info-wrapper">
                          <img
                            src={item.token.logoURI}
                            alt="token logo"
                            className="token-logo"
                          />
                          <div className="coin-info-detail">
                            <div>
                              <span className="token-name">{item.token.name}</span>
                              <div className="token-path">
                                {item.token.path}
                                <IconNewTab />
                              </div>
                            </div>
                            <span>
                              ETH
                            </span>
                          </div>
                        </div>
                        <div className="coin-infor-value">
                          <span className="token-price">{item.price}</span>
                          {item.priceOf1d.status === "POSITIVE" ? (
                            <span className="positive">
                              <IconTriangleArrowUpV2 />{item.priceOf1d.value}%
                            </span>
                          ) : (
                            <span className="negative">
                              -<IconTriangleArrowDownV2 /> {item.priceOf1d.value}%
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  {!keyword && (
                    <>
                      <div className="popular-tokens">Most Liquid Pools</div>
                      {tokens
                        .filter(item => item.searchType === "recent")
                        .map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => onClickItem(item.token.symbol)}
                          >
                            <div className="coin-info">
                              <DoubleLogo
                                size={32}
                                left={item.token.logoURI}
                                right={item?.tokenB?.logoURI || ""}
                              />
                              <span className="token-name">
                                {item.token.name}/{item?.tokenB?.name}
                              </span>
                              <Badge
                                text={"0.3%"}
                                type={BADGE_TYPE.DARK_DEFAULT}
                              />
                            </div>
                            <div className="coin-infor-value">
                              <span className="token-price">
                                $123.25M
                              </span>
                              <div className="token-price-apr">{item.priceOf1d.value}% {item.token.symbol}</div>
                            </div>
                          </li>
                        ))}
                    </>
                  )}
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
