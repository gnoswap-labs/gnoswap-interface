import React from "react";
import IconHeaderLogo from "../icons/IconHeaderLogo";
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
  BottomNavWrapper,
  BottomNavContainer,
  BottomNavItem,
} from "./Header.styles";
import NotificationButton from "@components/common/notification-button/NotificationButton";
import { HEADER_NAV } from "@constants/header.constant";
import WalletConnectorButton from "@components/common/wallet-connector-button/WalletConnectorButton";
import HeaderSideMenuModal from "../header-side-menu-modal/HeaderSideMenuModal";
import { Token } from "@containers/header-container/HeaderContainer";
import SearchMenuModal from "../search-menu-modal/SearchMenuModal";
import { DeviceSize } from "@styles/media";

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
  windowSize: Number;
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
  windowSize,
}) => {
  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <LeftSection>
            <Link href="/" passHref legacyBehavior>
              <LogoLink>
                <IconHeaderLogo className="header-main-logo" />
              </LogoLink>
            </Link>
            <Navigation>
              {windowSize > DeviceSize.mobile && (
                <>
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
                </>
              )}
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
        {windowSize <= DeviceSize.mobile && (
          <BottomNavWrapper>
            <BottomNavContainer>
              {HEADER_NAV.map(item => (
                <BottomNavItem
                  key={item.title}
                  className={pathname === item.path ? "selected" : ""}
                >
                  <Link href={item.path}>{item.title}</Link>
                </BottomNavItem>
              ))}

              <ButtonWrapper
                className={sideMenuToggle ? "selected" : ""}
                onClick={onSideMenuToggle}
              >
                ···
              </ButtonWrapper>
            </BottomNavContainer>
          </BottomNavWrapper>
        )}
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
    </>
  );
};
export default Header;
