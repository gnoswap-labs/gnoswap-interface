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
            <div className="recent-searches">Recent Searches</div>
            {tokens
              .filter(item => item.searchType === "recent")
              .map((item, idx) => (
                <li key={idx} onClick={() => onClickItem(item.token.symbol)}>
                  <div className="coin-info">
                    <img
                      src={item.token.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                    <span className="token-name">{item.token.name}</span>
                    <span className="token-symbol">{item.token.symbol}</span>
                  </div>
                  <span className="token-price">{item.price}</span>
                  {item.priceOf1d.status === "POSITIVE" ? (
                    <span className="positive">+{item.priceOf1d.value}</span>
                  ) : (
                    <span className="negative">-{item.priceOf1d.value}</span>
                  )}
                </li>
              ))}
            <div className="popular-tokens">Popular Tokens</div>
            {tokens
              .filter(item => item.searchType === "popular")
              .map((item, idx) => (
                <li key={idx} onClick={() => onClickItem(item.token.symbol)}>
                  <div className="coin-info">
                    <img
                      src={item.token.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                    <span className="token-name">{item.token.name}</span>
                    <span className="token-symbol">{item.token.symbol}</span>
                  </div>
                  <span className="token-price">{item.price}</span>
                  {item.priceOf1d.status === "POSITIVE" ? (
                    <span className="positive">+{item.priceOf1d.value}</span>
                  ) : (
                    <span className="negative">-{item.priceOf1d.value}</span>
                  )}
                </li>
              ))}
          </ul>
        </ModalContainer>
      </div>
    </SearchModalBackground>
  );
};

export default SearchMenuModal;
