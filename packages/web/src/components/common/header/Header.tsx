import React from "react";
import IconLogoPrimary from "../icons/IconLogoPrimary";
import Link from "next/link";
import IconSearch from "@components/common/icons/IconSearch";
import {
  HeaderWrapper,
  HeaderContainer,
  LeftSection,
  Navigation,
  RightSection,
  LogoLink,
  ButtonWrapper,
  SearchContainer,
  SearchButton,
} from "./Header.styles";
import NotificationButton from "@components/common/notification-button/NotificationButton";
import { HEADER_NAV } from "@constants/header.constant";
import WalletConnectorButton from "@components/common/wallet-connector-button/WalletConnectorButton";
import HeaderSideMenuModal from "../header-side-menu-modal/HeaderSideMenuModal";
import { Token } from "@containers/header-container/HeaderContainer";
import SearchMenuModal from "../search-menu-modal/SearchMenuModal";

interface HeaderProps {
  pathname?: string;
  isConnected: boolean;
  sideMenuToggle: boolean;
  onSideMenuToggle: () => void;
  searchMenuToggle: boolean;
  onSearchMenuToggle: () => void;
  tokens: Token[];
  isFetched: boolean;
  error: Error | null;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
}

const Header: React.FC<HeaderProps> = ({
  pathname = "/",
  isConnected,
  sideMenuToggle,
  onSideMenuToggle,
  searchMenuToggle,
  onSearchMenuToggle,
  tokens,
  isFetched,
  search,
  keyword,
}) => {
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <LeftSection>
          <Link href="/" passHref legacyBehavior>
            <LogoLink>
              <IconLogoPrimary />
            </LogoLink>
          </Link>
          <Navigation>
            <ul>
              {HEADER_NAV.map(item => (
                <li
                  key={item.title}
                  className={pathname === item.path ? "selected" : ""}
                >
                  <Link href={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>
            <ButtonWrapper
              className={sideMenuToggle ? "selected" : ""}
              onClick={onSideMenuToggle}
            >
              ···
            </ButtonWrapper>
          </Navigation>
        </LeftSection>
        <RightSection>
          <SearchContainer>
            <SearchButton onClick={onSearchMenuToggle}>
              <IconSearch className="search-icon" />
            </SearchButton>
            <WalletConnectorButton isConnected={isConnected} />
          </SearchContainer>
          <NotificationButton />
        </RightSection>
      </HeaderContainer>
      {sideMenuToggle && (
        <HeaderSideMenuModal onSideMenuToggle={onSideMenuToggle} />
      )}
      {searchMenuToggle && (
        <SearchMenuModal
          onSearchMenuToggle={onSearchMenuToggle}
          search={search}
          keyword={keyword}
          tokens={tokens}
          isFetched={isFetched}
        />
      )}
    </HeaderWrapper>
  );
};
export default Header;
