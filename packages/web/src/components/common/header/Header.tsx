import IconSearch from "@components/common/icons/IconSearch";
import NotificationButton from "@components/common/notification-button/NotificationButton";
import WalletConnectorButton from "@components/common/wallet-connector-button/WalletConnectorButton";
import DepositModal from "@components/wallet/deposit-modal/DepositModal";
import { HEADER_NAV } from "@constants/header.constant";
import { Token } from "@containers/header-container/HeaderContainer";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { AccountModel } from "@models/account/account-model";
import { DEVICE_TYPE } from "@styles/media";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import IconDownload from "../icons/IconDownload";
import IconHeaderLogo from "../icons/IconHeaderLogo";
import SearchMenuModal from "../search-menu-modal/SearchMenuModal";
import SubMenuButton from "../sub-menu-button/SubMenuButton";
import {
  BottomNavContainer,
  BottomNavItem,
  BottomNavWrapper,
  DepositButton,
  HeaderContainer,
  HeaderWrapper,
  LeftSection,
  LogoLink,
  Navigation,
  RightSection,
  SearchButton,
  SearchContainer,
} from "./Header.styles";

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
  disconnectWallet: () => void;
  switchNetwork: () => void;
  isSwitchNetwork: boolean;
  loadingConnect: string;
  mostLiquidity: Token[];
  popularTokens: Token[];
  recents: Token[];
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
  disconnectWallet,
  switchNetwork,
  isSwitchNetwork,
  loadingConnect,
  mostLiquidity,
  popularTokens,
  recents,
}) => {
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);

  const changeTokenDeposit = useCallback(() => {
    setIsShowDepositModal(true);
  }, []);

  const closeDeposit = () => {
    setIsShowDepositModal(false);
  };

  const callbackDeposit = (value: boolean) => {
    setIsShowDepositModal(value);
  };

  usePreventScroll(isShowDepositModal);

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
                        className={
                          pathname === item.path ||
                          (item.subPath || []).some(_ => pathname.includes(_))
                            ? "selected"
                            : ""
                        }
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
              {connected && breakpoint !== DEVICE_TYPE.MOBILE && (
                <DepositButton onClick={() => changeTokenDeposit()}>
                  <IconDownload />
                  <span>Deposit</span>
                </DepositButton>
              )}
              <WalletConnectorButton
                account={account}
                connected={connected}
                connectAdenaClient={connectAdenaClient}
                themeKey={themeKey}
                disconnectWallet={disconnectWallet}
                switchNetwork={switchNetwork}
                isSwitchNetwork={isSwitchNetwork}
                loadingConnect={loadingConnect}
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
                  className={
                    pathname === item.path ||
                    (item.subPath || []).some(_ => pathname.includes(_))
                      ? "selected"
                      : ""
                  }
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
            breakpoint={breakpoint}
            mostLiquidity={mostLiquidity}
            popularTokens={popularTokens}
            recents={recents}
            placeholder="Search by Name, Symbol, or Path"
          />
        )}
      </HeaderWrapper>

      {isShowDepositModal && (
        <DepositModal
          breakpoint={breakpoint}
          close={closeDeposit}
          depositInfo={undefined}
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
    </>
  );
};
export default Header;
