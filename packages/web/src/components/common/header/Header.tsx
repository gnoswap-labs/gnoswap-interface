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
  SearchContainer,
  SearchButton,
  BottomNavWrapper,
  BottomNavContainer,
  BottomNavItem,
} from "./Header.styles";
import NotificationButton from "@components/common/notification-button/NotificationButton";
import { HEADER_NAV } from "@constants/header.constant";
import WalletConnectorButton from "@components/common/wallet-connector-button/WalletConnectorButton";
import { Token } from "@containers/header-container/HeaderContainer";
import { DEVICE_TYPE } from "@styles/media";
import SubMenuButton from "../sub-menu-button/SubMenuButton";
import SearchMenuModal from "../search-menu-modal/SearchMenuModal";
import { AccountModel } from "@models/account/account-model";

interface HeaderProps {
  pathname?: string;
  sideMenuToggle: boolean;
  onSideMenuToggle: () => void;
  searchMenuToggle: boolean;
  onSearchMenuToggle: () => void;
  tokens: Token[];
  isFetched: boolean;
  error: Error | null;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  breakpoint: DEVICE_TYPE;
  account: AccountModel | null;
  connected: boolean;
  connectAdenaClient: () => void;
  themeKey: "dark" | "light";
}

const Header: React.FC<HeaderProps> = ({
  pathname = "/",
  sideMenuToggle,
  onSideMenuToggle,
  searchMenuToggle,
  onSearchMenuToggle,
  tokens,
  isFetched,
  search,
  keyword,
  breakpoint,
  account,
  connected,
  connectAdenaClient,
  themeKey,
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
              {breakpoint !== DEVICE_TYPE.MOBILE && (
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
                  <SubMenuButton
                    sideMenuToggle={sideMenuToggle}
                    onSideMenuToggle={onSideMenuToggle}
                  />
                </>
              )}
            </Navigation>
          </LeftSection>
          <RightSection>
            <SearchContainer>
              <SearchButton onClick={onSearchMenuToggle}>
                <IconSearch className="search-icon" />
              </SearchButton>
              <WalletConnectorButton
                account={account}
                connected={connected}
                connectAdenaClient={connectAdenaClient}
                themeKey={themeKey}
              />
            </SearchContainer>
            <NotificationButton breakpoint={breakpoint} />
          </RightSection>
        </HeaderContainer>
        {breakpoint === DEVICE_TYPE.MOBILE && (
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
              <SubMenuButton
                sideMenuToggle={sideMenuToggle}
                onSideMenuToggle={onSideMenuToggle}
              />
            </BottomNavContainer>
          </BottomNavWrapper>
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
