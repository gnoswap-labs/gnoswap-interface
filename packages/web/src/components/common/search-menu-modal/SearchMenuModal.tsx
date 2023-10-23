// TODO : remove eslint-disable after work
/* eslint-disable */
import { Token } from "@containers/header-container/HeaderContainer";
import React, { useEffect, useRef } from "react";
import {
  SearchModalBackground,
  SearchContainer,
  SearchWrapper,
  InputStyle,
  ModalContainer,
} from "./SearchMenuModal.styles";
import IconSearch from "@components/common/icons/IconSearch";
import Badge, { BADGE_TYPE } from "../badge/Badge";
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
  console.log(isFetched, "isFetched");

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        onSearchMenuToggle();
      }
    };
    window.addEventListener("click", closeMenu, true);
    return () => {
      window.removeEventListener("click", closeMenu, true);
    };
  }, [menuRef, onSearchMenuToggle]);

  return (
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
                {tokens
                  .filter(item => item.searchType === "recent")
                  .map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => onClickItem(item.token.symbol)}
                    >
                      <div className="coin-info">
                        <img
                          src={item.token.logoURI}
                          alt="token logo"
                          className="token-logo"
                        />
                        <span className="token-name">{item.token.name}</span>
                        <span className="token-symbol">
                          {item.token.symbol}
                        </span>
                      </div>
                      <span className="token-price">{item.price}</span>
                      {item.priceOf1d.status === "POSITIVE" ? (
                        <span className="positive">
                          +{item.priceOf1d.value}
                        </span>
                      ) : (
                        <span className="negative">
                          -{item.priceOf1d.value}
                        </span>
                      )}
                    </li>
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
                      <div className="coin-info">
                        <img
                          src={item.token.logoURI}
                          alt="token logo"
                          className="token-logo"
                        />
                        <span className="token-name">{item.token.name}</span>
                        <span className="token-symbol">
                          {item.token.symbol}
                        </span>
                      </div>
                      <span className="token-price">{item.price}</span>
                      {item.priceOf1d.status === "POSITIVE" ? (
                        <span className="positive">
                          +{item.priceOf1d.value}
                        </span>
                      ) : (
                        <span className="negative">
                          -{item.priceOf1d.value}
                        </span>
                      )}
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
                            <img
                              src={item.token.logoURI}
                              alt="token logo"
                              className="token-logo"
                            />
                            <span className="token-name">
                              {item.token.name}
                            </span>
                            <span className="token-symbol">
                              {item.token.symbol}
                            </span>
                            <Badge
                              text={"0.3%"}
                              type={BADGE_TYPE.DARK_DEFAULT}
                            />
                          </div>
                          <span className="token-price">
                            {item.priceOf1d.value} {item.token.symbol}
                          </span>
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
  );
};

export default SearchMenuModal;
